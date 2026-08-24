from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from categories.models import Category
from orders.models import Order, OrderItem
from products.models import Product
from users.models import User


class BaseDashboardTestCase(APITestCase):
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
            full_name='Cust Omer',
        )
        cls.other = User.objects.create_user('other@example.com', 'otherpass123')
        cls.admin_url = reverse('dashboard-admin')
        cls.customer_url = reverse('dashboard-customer')

    @staticmethod
    def _place_order(user, product, quantity, status=Order.Status.PENDING):
        order = Order.objects.create(
            user=user,
            subtotal_amount=product.price * quantity,
            delivery_fee=Decimal('0'),
            total_amount=product.price * quantity,
        )
        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            unit_price=product.price,
            quantity=quantity,
        )
        if status != Order.Status.PENDING:
            order.status = status
            order.save(update_fields=['status'])
        return order


class AdminDashboardTests(BaseDashboardTestCase):
    def setUp(self):
        self.client.force_authenticate(self.admin)

    def test_requires_admin(self):
        self.client.force_authenticate(self.customer)
        response = self.client.get(self.admin_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(None)
        anon = self.client.get(self.admin_url)
        self.assertEqual(anon.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_stats_counts_and_revenue_excludes_cancelled(self):
        product = Product.objects.create(
            name='Monitor', sku='MN-001', category=self.category,
            price=Decimal('1000.00'), stock=50,
        )
        self._place_order(self.customer, product, 2, Order.Status.DELIVERED)
        self._place_order(self.customer, product, 1, Order.Status.PENDING)
        cancelled = self._place_order(self.other, product, 4)
        cancelled.status = Order.Status.CANCELLED
        cancelled.save(update_fields=['status'])

        low_stock = Product.objects.create(
            name='Mousepad', sku='MP-001', category=self.category,
            price=Decimal('99.00'), stock=3,
        )

        response = self.client.get(self.admin_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_products'], 2)
        self.assertEqual(response.data['total_orders'], 3)
        # revenue excludes the cancelled order: (2*1000) + (1*1000)
        self.assertEqual(response.data['total_revenue'], Decimal('3000.00'))
        self.assertGreaterEqual(response.data['low_stock_count'], 1)

    def test_recent_orders_shape_and_limit(self):
        product = Product.objects.create(
            name='Webcam', sku='WC-001', category=self.category,
            price=Decimal('1500.00'), stock=10,
        )
        for _ in range(7):
            self._place_order(self.customer, product, 1)

        response = self.client.get(self.admin_url)

        recent = response.data['recent_orders']
        self.assertEqual(len(recent), 5)
        first = recent[0]
        for key in ('order_number', 'customer_name', 'total_amount', 'status', 'created_at'):
            self.assertIn(key, first)
        self.assertEqual(first['items'][0]['product_name'], 'Webcam')
        self.assertEqual(first['customer_name'], 'Cust Omer')


class CustomerDashboardTests(BaseDashboardTestCase):
    def test_requires_customer(self):
        self.client.force_authenticate(self.admin)
        response = self.client.get(self.customer_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_customer_sees_own_stats_only(self):
        product = Product.objects.create(
            name='Headset', sku='HS-001', category=self.category,
            price=Decimal('700.00'), stock=25,
        )
        mine_pending = self._place_order(self.customer, product, 1, Order.Status.PENDING)
        self._place_order(self.customer, product, 2, Order.Status.DELIVERED)
        self._place_order(self.other, product, 5)  # must not count

        self.client.force_authenticate(self.customer)
        response = self.client.get(self.customer_url)

        self.assertEqual(response.data['total_orders'], 2)
        self.assertEqual(response.data['pending_orders'], 1)
        self.assertEqual(response.data['total_spent'], Decimal('2100.00'))
        numbers = {o['order_number'] for o in response.data['recent_orders']}
        self.assertIn(mine_pending.order_number, numbers)
        self.assertNotIn('ORD-FAKE', numbers)

    def test_empty_stats_defaults(self):
        self.client.force_authenticate(self.customer)
        response = self.client.get(self.customer_url)

        self.assertEqual(response.data['total_orders'], 0)
        self.assertEqual(response.data['pending_orders'], 0)
        self.assertEqual(response.data['total_spent'], 0)
        self.assertEqual(response.data['recent_orders'], [])
