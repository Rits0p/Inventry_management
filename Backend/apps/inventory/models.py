from django.conf import settings
from django.db import models


class StockTransaction(models.Model):
    class Reason(models.TextChoices):
        SALE = 'Sale', 'Sale'
        RESTOCK = 'Restock', 'Restock'
        ADJUSTMENT = 'Adjustment', 'Adjustment'
        RETURN = 'Return', 'Return'

    product = models.ForeignKey(
        'products.Product',
        on_delete=models.PROTECT,
        related_name='stock_transactions',
    )
    change = models.IntegerField()
    resulting_stock = models.PositiveIntegerField()
    reason = models.CharField(max_length=15, choices=Reason.choices)
    reference = models.CharField(max_length=100, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stock_transactions',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [models.Index(fields=['product', '-created_at'])]

    def __str__(self):
        return f'{self.product.sku} {self.change:+d} ({self.reason})'
