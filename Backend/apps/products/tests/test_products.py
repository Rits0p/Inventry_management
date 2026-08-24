from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from categories.models import Category
from products.models import Product
from users.models import User


def make_product(category, sku='SKU-1', **overrides):
    data = {
        'name': 'Test Headphones',
        'sku': sku,
        'brand': 'Sony',
        'category': category,
        'price': Decimal('29990.00'),
        'original_price': Decimal('34990.00'),
        'discount': 14,
        'stock': 10,
    }
    data.update(overrides)
    return Product.objects.create(**data)


class BaseProductTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(name='Electronics')
        cls.admin = User.objects.create_user(
            'admin@example.com', 'adminpass123', role=User.Role.ADMIN
        )
        cls.customer = User.objects.create_user('cust@example.com', 'custpass123')

    def setUp(self):
        self.list_url = reverse('product-list')


class PublicProductListTests(BaseProductTestCase):
    def test_list_returns_only_active_for_anonymous(self):
        active = make_product(self.category, sku='ACT-1')
        make_product(self.category, sku='INA-1', status=Product.Status.INACTIVE)

        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        ids = [item['id'] for item in response.data['results']]
        self.assertIn(active.id, ids)
        self.assertNotIn(2, ids)

    def test_search_filter(self):
        match = make_product(self.category, sku='SRC-1', name='Noise Cancelling Headphones')
        make_product(self.category, sku='SRC-2', name='Running Shoes')

        response = self.client.get(self.list_url, {'search': 'noise'})

        ids = [item['id'] for item in response.data['results']]
        self.assertIn(match.id, ids)
        self.assertEqual(len(ids), 1)

    def test_category_filter_by_name_and_slug(self):
        electronics = make_product(self.category, sku='CAT-1')
        fashion = Category.objects.create(name='Fashion')
        make_product(fashion, sku='CAT-2')

        by_name = self.client.get(self.list_url, {'category': 'Electronics'})
        by_slug = self.client.get(self.list_url, {'category': 'fashion'})

        self.assertEqual(len(by_name.data['results']), 1)
        self.assertEqual(by_name.data['results'][0]['id'], electronics.id)
        self.assertEqual(by_slug.data['results'][0]['sku'], 'CAT-2')

    def test_ordering_by_price_descending(self):
        cheap = make_product(self.category, sku='ORD-1', price=Decimal('100.00'))
        pricey = make_product(self.category, sku='ORD-2', price=Decimal('900.00'))

        response = self.client.get(self.list_url, {'ordering': '-price'})

        ids = [item['id'] for item in response.data['results']]
        self.assertEqual(ids.index(pricey.id) < ids.index(cheap.id), True)

    def test_serializer_shape_matches_frontend_contract(self):
        product = make_product(self.category, sku='SHP-1')
        response = self.client.get(self.list_url)

        item = response.data['results'][0]
        expected_keys = {
            'id', 'name', 'brand', 'price', 'original_price', 'discount',
            'rating', 'reviews', 'badge', 'image', 'stock', 'status',
            'category', 'category_name', 'created_at',
        }
        for key in expected_keys:
            self.assertIn(key, item)
        self.assertEqual(item['category_name'], 'Electronics')
        self.assertEqual(item['reviews'], product.reviews_count)
        self.assertEqual(item['savings'], Decimal('5000.00'))


class ProductPermissionTests(BaseProductTestCase):
    def payload(self, sku='NEW-1'):
        return {
            'name': 'New Product',
            'sku': sku,
            'category': self.category.id,
            'price': '1999.00',
            'stock': 5,
        }

    def test_anonymous_cannot_create(self):
        response = self.client.post(self.list_url, self.payload(), format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_customer_cannot_create(self):
        self.client.force_authenticate(self.customer)
        response = self.client.post(self.list_url, self.payload(), format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create(self):
        self.client.force_authenticate(self.admin)
        response = self.client.post(self.list_url, self.payload(), format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['category_name'], 'Electronics')
        self.assertTrue(Product.objects.filter(sku='NEW-1').exists())

    def test_customer_cannot_delete(self):
        product = make_product(self.category, sku='DEL-1')
        self.client.force_authenticate(self.customer)

        url = reverse('product-detail', args=[product.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class SoftDeleteTests(BaseProductTestCase):
    def test_delete_marks_inactive_and_hides_from_public(self):
        product = make_product(self.category, sku='SOF-1')
        self.client.force_authenticate(self.admin)

        url = reverse('product-detail', args=[product.id])
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        product.refresh_from_db()
        self.assertEqual(product.status, Product.Status.INACTIVE)

        self.client.force_authenticate(user=None)
        public_list = self.client.get(self.list_url)
        self.assertEqual(len(public_list.data['results']), 0)

        self.client.force_authenticate(self.admin)
        admin_detail = self.client.get(url)
        self.assertEqual(admin_detail.status_code, status.HTTP_200_OK)


class AdjustStockTests(BaseProductTestCase):
    def adjust(self, product, payload):
        self.client.force_authenticate(self.admin)
        url = reverse('product-adjust-stock', args=[product.id])
        return self.client.post(url, payload, format='json')

    def test_add_stock(self):
        product = make_product(self.category, sku='ADJ-1', stock=10)

        response = self.adjust(product, {'type': 'add', 'quantity': 5})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(product.stock, 15)

    def test_remove_stock(self):
        product = make_product(self.category, sku='ADJ-2', stock=10)

        response = self.adjust(product, {'type': 'remove', 'quantity': 4})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(product.stock, 6)

    def test_set_stock(self):
        product = make_product(self.category, sku='ADJ-3', stock=10)

        response = self.adjust(product, {'type': 'set', 'quantity': 42})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        product.refresh_from_db()
        self.assertEqual(product.stock, 42)

    def test_remove_more_than_stock_rejected(self):
        product = make_product(self.category, sku='ADJ-4', stock=3)

        response = self.adjust(product, {'type': 'remove', 'quantity': 5})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        product.refresh_from_db()
        self.assertEqual(product.stock, 3)

    def test_customer_cannot_adjust_stock(self):
        product = make_product(self.category, sku='ADJ-5', stock=3)
        self.client.force_authenticate(self.customer)

        url = reverse('product-adjust-stock', args=[product.id])
        response = self.client.post(url, {'type': 'add', 'quantity': 5}, format='json')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_invalid_type_rejected(self):
        product = make_product(self.category, sku='ADJ-6', stock=3)

        response = self.adjust(product, {'type': 'multiply', 'quantity': 2})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProductValidationTests(BaseProductTestCase):
    def test_original_price_below_price_rejected(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            self.list_url,
            {
                'name': 'Bad Pricing',
                'sku': 'VAL-1',
                'category': self.category.id,
                'price': '500.00',
                'original_price': '100.00',
                'stock': 1,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('original_price', response.data)

    def test_negative_price_rejected(self):
        self.client.force_authenticate(self.admin)

        response = self.client.post(
            self.list_url,
            {
                'name': 'Negative Price',
                'sku': 'VAL-2',
                'category': self.category.id,
                'price': '-10.00',
                'stock': 1,
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
