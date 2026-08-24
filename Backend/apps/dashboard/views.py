from django.db.models import Sum
from rest_framework.generics import ListAPIView
from rest_framework.response import Response

from core.permissions import IsAdmin, IsCustomer
from inventory.services import LOW_STOCK_THRESHOLD, get_low_stock_products
from orders.models import Order

from .serializers import RecentOrderSerializer

RECENT_ORDER_LIMIT = 5


def _serialize_recent(queryset):
    queryset = queryset.prefetch_related('items')[:RECENT_ORDER_LIMIT]
    return RecentOrderSerializer(queryset, many=True).data


class AdminDashboardView(ListAPIView):
    """Aggregated stats for the admin dashboard. Admin only."""
    permission_classes = [IsAdmin]
    pagination_class = None

    def get(self, request, *args, **kwargs):
        from products.models import Product

        revenue = (
            Order.objects.exclude(status=Order.Status.CANCELLED)
            .aggregate(total=Sum('total_amount'))['total']
            or 0
        )
        all_orders = Order.objects.all()

        return Response(
            {
                'total_products': Product.objects.count(),
                'total_orders': all_orders.count(),
                'low_stock_count': get_low_stock_products().count(),
                'low_stock_threshold': LOW_STOCK_THRESHOLD,
                'total_revenue': revenue,
                'recent_orders': _serialize_recent(all_orders.order_by('-created_at')),
            }
        )


class CustomerDashboardView(ListAPIView):
    """Aggregated stats for the signed-in customer's dashboard."""
    permission_classes = [IsCustomer]
    pagination_class = None

    def get(self, request, *args, **kwargs):
        my_orders = Order.objects.filter(user=request.user)

        return Response(
            {
                'total_orders': my_orders.count(),
                'pending_orders': my_orders.filter(status=Order.Status.PENDING).count(),
                'total_spent': my_orders.aggregate(
                    total=Sum('total_amount')
                )['total'] or 0,
                'recent_orders': _serialize_recent(my_orders.order_by('-created_at')),
            }
        )
