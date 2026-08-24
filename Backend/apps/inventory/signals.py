from django.db.models.signals import post_save
from django.dispatch import receiver

from inventory.services import record_stock_change
from orders.models import OrderItem


@receiver(post_save, sender=OrderItem, dispatch_uid='orderitem_auto_stock_decrease')
def decrease_stock_on_order_item(sender, instance, created, **kwargs):
    if not created:
        return
    if not instance.product_id:
        return
    record_stock_change(
        product=instance.product,
        change=-instance.quantity,
        reason='Sale',
        reference=instance.order.order_number,
        user=instance.order.user,
    )
