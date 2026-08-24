from decimal import Decimal

from django.db import transaction
from django.utils.timezone import now

from rest_framework.exceptions import ValidationError

from inventory.services import record_stock_change

from .models import Order, OrderItem

FREE_DELIVERY_THRESHOLD = Decimal('500')
DELIVERY_FEE = Decimal('40')


def _calculate_delivery_fee(subtotal):
    if subtotal > FREE_DELIVERY_THRESHOLD:
        return Decimal('0')
    return DELIVERY_FEE


@transaction.atomic
def create_order(user, items_data, delivery_address=''):
    """
    Validates stock, computes totals and creates an order with items.
    Stock is decremented automatically by the inventory signal when each
    OrderItem is saved; everything happens inside one atomic transaction.
    """
    if not items_data:
        raise ValidationError({'items': 'At least one item is required to place an order.'})

    from products.models import Product

    product_ids = [item['product_id'] for item in items_data]
    products = {
        p.pk: p
        for p in Product.objects.select_for_update().filter(pk__in=product_ids)
    }

    errors = {}
    prepared = []
    subtotal = Decimal('0')
    for item in items_data:
        product = products.get(item['product_id'])
        if product is None:
            errors.setdefault('items', []).append(f'Product {item["product_id"]} does not exist.')
            continue
        if product.status != Product.Status.ACTIVE:
            errors.setdefault('items', []).append(f'"{product.name}" is not available.')
            continue
        if product.stock < item['quantity']:
            errors.setdefault('items', []).append(
                f'Only {product.stock} unit(s) of "{product.name}" left in stock.'
            )
            continue
        line_total = product.price * item['quantity']
        subtotal += line_total
        prepared.append((product, item['quantity'], line_total))

    if errors:
        raise ValidationError(errors)

    delivery_fee = _calculate_delivery_fee(subtotal)
    order = Order.objects.create(
        user=user,
        subtotal_amount=subtotal,
        delivery_fee=delivery_fee,
        total_amount=subtotal + delivery_fee,
        delivery_address=delivery_address,
    )
    for product, quantity, line_total in prepared:
        OrderItem.objects.create(
            order=order,
            product=product,
            product_name=product.name,
            # snapshot the effective selling price at purchase time
            unit_price=product.price,
            quantity=quantity,
        )
    return order


@transaction.atomic
def cancel_order(order):
    """
    Cancels a pending/processing/shipped order and returns reserved stock.
    Delivered orders can no longer be cancelled.
    """
    if order.status == Order.Status.DELIVERED:
        raise ValidationError({'status': 'Delivered orders cannot be cancelled.'})
    if order.status == Order.Status.CANCELLED:
        raise ValidationError({'status': 'Order is already cancelled.'})

    for item in order.items.select_related('product'):
        if item.product_id:
            record_stock_change(
                product=item.product,
                change=item.quantity,
                reason='Restock',
                reference=order.order_number,
                user=order.user,
            )
    order.status = Order.Status.CANCELLED
    order.cancelled_at = now()
    order.save(update_fields=['status', 'cancelled_at', 'updated_at'])
    return order
