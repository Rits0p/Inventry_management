from decimal import Decimal

from django.test import TestCase

from categories.models import Category
from inventory.services import (
    LOW_STOCK_THRESHOLD,
    get_low_stock_products,
    record_stock_change,
)
from products.models import Product
from rest_framework.exceptions import ValidationError
from users.models import User


class RecordStockChangeTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.category = Category.objects.create(name='Electronics')
        cls.admin = User.objects.create_user(
            'admin@example.com', 'adminpass123', role=User.Role.ADMIN
        )
        cls.product = Product.objects.create(
            name='Keyboard',
            sku='KB-001',
            category=cls.category,
            price=Decimal('999.00'),
            stock=10,
        )

    def test_positive_change_updates_stock_and_logs(self):
        tx = record_stock_change(self.product, 5, 'Adjustment', 'Manual add', self.admin)

        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 15)
        self.assertEqual(tx.change, 5)
        self.assertEqual(tx.resulting_stock, 15)
        self.assertEqual(tx.created_by, self.admin)

    def test_negative_beyond_stock_rejected_and_not_logged(self):
        with self.assertRaises(ValidationError):
            record_stock_change(self.product, -11, 'Sale')

        from inventory.models import StockTransaction

        self.assertEqual(StockTransaction.objects.count(), 0)

    def test_get_low_stock_products_filters_threshold(self):
        low = Product.objects.create(
            name='Cheap Cable',
            sku='CB-001',
            category=self.category,
            price=Decimal('99.00'),
            stock=LOW_STOCK_THRESHOLD - 1,
        )
        Product.objects.create(
            name='Plenty Stock Item',
            sku='PS-001',
            category=self.category,
            price=Decimal('199.00'),
            stock=50,
        )

        low_qs = list(get_low_stock_products())

        self.assertIn(low, low_qs)
        self.assertEqual(len(low_qs), 2)  # includes the stock-10 product too

    def test_inactive_products_excluded_from_low_stock(self):
        Product.objects.create(
            name='Inactive Low',
            sku='IL-001',
            category=self.category,
            price=Decimal('49.00'),
            stock=1,
            status=Product.Status.INACTIVE,
        )

        skus = [p.sku for p in get_low_stock_products()]

        self.assertNotIn('IL-001', skus)
