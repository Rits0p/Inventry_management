from django.db import transaction

from rest_framework.exceptions import ValidationError

from .models import StockTransaction

LOW_STOCK_THRESHOLD = 10


def log_transaction(product, change, resulting_stock, reason, reference='', user=None):
    return StockTransaction.objects.create(
        product=product,
        change=change,
        resulting_stock=resulting_stock,
        reason=reason,
        reference=reference,
        created_by=user,
    )


@transaction.atomic
def record_stock_change(product, change, reason, reference='', user=None):
    """
    Applies a stock delta to a product inside a row lock and logs a
    StockTransaction. Raises ValidationError if the change would make
    stock negative.
    """
    locked = type(product).objects.select_for_update().get(pk=product.pk)
    new_stock = locked.stock + change
    if new_stock < 0:
        raise ValidationError(
            {'stock': f'Insufficient stock for "{locked.name}"; only {locked.stock} left.'}
        )
    locked.stock = new_stock
    locked.save(update_fields=['stock'])
    return log_transaction(locked, change, new_stock, reason, reference, user)


def get_low_stock_products(threshold=LOW_STOCK_THRESHOLD):
    from products.models import Product

    return Product.objects.filter(stock__lte=threshold, status=Product.Status.ACTIVE)
