from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from inventory.models import StockTransaction
from orders.models import Order, OrderItem
from products.models import Product
from users.models import User

from categories.models import Category


class BaseOrderTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(name='Electronics')
        cls.admin = User.objects.create_user(
            'admin@example.com', 'adminpass123', role=User.Role.ADMIN
        )
        cls.customer = User.objects.create_user(
            'cust@example.com',
            'custpass123',
            role=User.Role.CUSTOMER,
            full_name='Test Customer',
        )
        cls.other = User.objects.create_user('other@example.com', 'otherpass123')
        cls.product = Product.objects.create(
            name='Wireless Mouse',
            sku='WM-001',
            brand='Logi',
            category=cls.category,
            price=Decimal('499.00'),
            stock=20,
        )
        cls.list_url = reverse('order-list')

    def place(self, user, items=None, address='221B Baker Street'):
        self.client.force_authenticate(user)
        payload = {
            'items': (
                items
                if items is not None
                else [{'product_id': self.product.id, 'quantity': 2}]
            ),
            'delivery_address': address,
        }
        return self.client.post(self.list_url, payload, format='json')


class CreateOrderTests(BaseOrderTestCase):
    def test_place_order_creates_order_and_items(self):
        response = self.place(self.customer)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.get(pk=response.data['id'])
        self.assertEqual(order.order_number.startswith('ORD-'), True)
        self.assertEqual(order.status, Order.Status.PENDING)
        # subtotal 998 > 500 -> free delivery
        self.assertEqual(order.subtotal_amount, Decimal('998.00'))
        self.assertEqual(order.delivery_fee, Decimal('0'))
        self.assertEqual(order.total_amount, Decimal('998.00'))
        self.assertEqual(order.items.count(), 1)
        item = order.items.first()
        self.assertEqual(item.unit_price, Decimal('499.00'))
        self.assertEqual(item.product_name, 'Wireless Mouse')

    def test_delivery_fee_applied_for_small_orders(self):
        response = self.place(self.customer, items=[{'product_id': self.product.id, 'quantity': 1}])

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        order = Order.objects.get(pk=response.data['id'])
        self.assertEqual(order.delivery_fee, Decimal('40.00'))
        self.assertEqual(order.total_amount, Decimal('539.00'))

    def test_stock_decremented_and_sale_transaction_logged(self):
        response = self.place(self.customer)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 18)
        tx = StockTransaction.objects.get(reference=Order.objects.get(pk=response.data['id']).order_number)
        self.assertEqual(tx.change, -2)
        self.assertEqual(tx.reason, 'Sale')
        self.assertEqual(tx.resulting_stock, 18)

    def test_insufficient_stock_rejected_atomically(self):
        response = self.place(
            self.customer,
            items=[{'product_id': self.product.id, 'quantity': 999}],
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Order.objects.count(), 0)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 20)

    def test_inactive_product_rejected(self):
        self.product.status = Product.Status.INACTIVE
        self.product.save()

        response = self.place(self.customer)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_empty_items_rejected(self):
        response = self.place(self.customer, items=[])

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_cannot_place_order(self):
        response = self.place(self.admin)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_cannot_place_order(self):
        response = self.client.post(
            self.list_url,
            {'items': [{'product_id': self.product.id, 'quantity': 1}]},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class OrderVisibilityTests(BaseOrderTestCase):
    def test_customer_sees_only_own_orders(self):
        self.place(self.customer)
        self.place(self.other)

        self.client.force_authenticate(self.customer)
        response = self.client.get(self.list_url)

        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['customer_email'], 'cust@example.com')

    def test_admin_sees_all_orders(self):
        self.place(self.customer)
        self.place(self.other)

        self.client.force_authenticate(self.admin)
        response = self.client.get(self.list_url)

        self.assertEqual(response.data['count'], 2)

    def test_customer_cannot_retrieve_others_order(self):
        response = self.place(self.other)
        other_order_id = response.data['id']

        self.client.force_authenticate(self.customer)
        detail = self.client.get(reverse('order-detail', args=[other_order_id]))

        # queryset scoping hides other users' orders entirely
        self.assertEqual(detail.status_code, status.HTTP_404_NOT_FOUND)

    def test_serializer_contract_fields(self):
        response = self.place(self.customer)
        order_id = response.data['id']

        self.client.force_authenticate(self.customer)
        detail = self.client.get(reverse('order-detail', args=[order_id]))

        expected = {
            'id', 'order_number', 'status', 'payment_status', 'customer_name',
            'customer_email', 'total_amount', 'items_count', 'created_at',
            'items', 'delivery_address',
        }
        for field in expected:
            self.assertIn(field, detail.data)
        self.assertIn('product_name', detail.data['items'][0])
        self.assertIn('unit_price', detail.data['items'][0])
        self.assertIn('quantity', detail.data['items'][0])

    def test_status_filter_param(self):
        self.place(self.customer)
        response = self.client.get(self.list_url, {'status': 'Pending'})
        # force_authenticate persisted from .place() call
        self.assertEqual(response.data['count'], 1)


class CancelOrderTests(BaseOrderTestCase):
    def test_cancel_restores_stock_and_logs_restock(self):
        response = self.place(self.customer)
        order_id = response.data['id']

        self.client.force_authenticate(self.customer)
        cancel_response = self.client.post(reverse('order-cancel', args=[order_id]))

        self.assertEqual(cancel_response.status_code, status.HTTP_200_OK)
        self.assertEqual(cancel_response.data['status'], Order.Status.CANCELLED)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 20)
        restock_tx = StockTransaction.objects.filter(reason='Restock').first()
        self.assertIsNotNone(restock_tx)
        self.assertEqual(restock_tx.change, 2)

    def test_cancelled_order_cannot_be_cancelled_again(self):
        response = self.place(self.customer)
        order_id = response.data['id']

        self.client.force_authenticate(self.customer)
        self.client.post(reverse('order-cancel', args=[order_id]))
        second = self.client.post(reverse('order-cancel', args=[order_id]))

        self.assertEqual(second.status_code, status.HTTP_400_BAD_REQUEST)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 20)  # no double restock

    def test_delivered_order_cannot_be_cancelled(self):
        response = self.place(self.customer)
        order = Order.objects.get(pk=response.data['id'])
        order.status = Order.Status.DELIVERED
        order.save(update_fields=['status'])

        self.client.force_authenticate(self.customer)
        result = self.client.post(reverse('order-cancel', args=[order.id]))

        self.assertEqual(result.status_code, status.HTTP_400_BAD_REQUEST)


class AdminStatusUpdateTests(BaseOrderTestCase):
    def test_admin_updates_status_via_patch(self):
        response = self.place(self.customer)
        order_id = response.data['id']

        self.client.force_authenticate(self.admin)
        patch = self.client.patch(
            reverse('order-detail', args=[order_id]), {'status': 'Shipped'}, format='json'
        )

        self.assertEqual(patch.status_code, status.HTTP_200_OK)
        order = Order.objects.get(pk=order_id)
        self.assertEqual(order.status, Order.Status.SHIPPED)

    def test_admin_patch_to_cancelled_restocks(self):
        response = self.place(self.customer)
        order_id = response.data['id']

        self.client.force_authenticate(self.admin)
        patch = self.client.patch(
            reverse('order-detail', args=[order_id]), {'status': 'Cancelled'}, format='json'
        )

        self.assertEqual(patch.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 20)

    def test_invalid_status_rejected(self):
        response = self.place(self.customer)
        order_id = response.data['id']

        self.client.force_authenticate(self.admin)
        patch = self.client.patch(
            reverse('order-detail', args=[order_id]), {'status': 'Teleported'}, format='json'
        )

        self.assertEqual(patch.status_code, status.HTTP_400_BAD_REQUEST)

    def test_customer_cannot_update_status(self):
        response = self.place(self.customer)
        order_id = response.data['id']

        self.client.force_authenticate(self.customer)
        patch = self.client.patch(
            reverse('order-detail', args=[order_id]), {'status': 'Delivered'}, format='json'
        )

        self.assertEqual(patch.status_code, status.HTTP_403_FORBIDDEN)

    def test_search_by_order_number(self):
        response = self.place(self.customer)
        order_number = response.data['order_number']
        self.place(self.other)  # noise

        self.client.force_authenticate(self.admin)
        search = self.client.get(self.list_url, {'search': order_number})

        self.assertEqual(search.data['count'], 1)
