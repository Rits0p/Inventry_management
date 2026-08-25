from django.db import models

from categories.models import Category
from core.validators import (
    validate_non_negative_quantity,
    validate_positive_price,
    validate_rating,
)


class Product(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'Active', 'Active'
        INACTIVE = 'Inactive', 'Inactive'

    name = models.CharField(max_length=200)
    sku = models.CharField(max_length=64, unique=True)
    brand = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='products',
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[validate_positive_price],
    )
    original_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[validate_positive_price],
    )
    discount = models.PositiveSmallIntegerField(default=0)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0,
        validators=[validate_rating],
    )
    reviews_count = models.PositiveIntegerField(default=0)
    highlights = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=list, blank=True)
    badge = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    stock = models.PositiveIntegerField(
        default=0,
        validators=[validate_non_negative_quantity],
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['brand']),
            models.Index(fields=['category', 'status']),
        ]

    def __str__(self):
        return f'{self.name} ({self.sku})'
