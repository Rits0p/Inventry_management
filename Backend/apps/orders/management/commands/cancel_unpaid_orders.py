from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils.timezone import now

from orders.models import Order
from orders.services import cancel_order


class Command(BaseCommand):
    help = 'Cancel orders with pending payment older than a specified number of minutes.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--minutes',
            type=int,
            default=30,
            help='Cancel orders older than this many minutes (default: 30).',
        )

    def handle(self, *args, **options):
        minutes = options['minutes']
        cutoff = now() - timedelta(minutes=minutes)

        unpaid_orders = Order.objects.filter(
            payment_status=Order.PaymentStatus.PENDING,
            status__in=[Order.Status.PENDING],
            created_at__lt=cutoff,
        )

        count = 0
        for order in unpaid_orders:
            try:
                cancel_order(order)
                count += 1
                self.stdout.write(f'Cancelled unpaid order {order.order_number}')
            except Exception as e:
                self.stderr.write(f'Failed to cancel {order.order_number}: {e}')

        self.stdout.write(self.style.SUCCESS(f'Cancelled {count} unpaid order(s).'))
