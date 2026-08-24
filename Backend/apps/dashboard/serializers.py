from rest_framework import serializers

from orders.models import Order, OrderItem


class DashboardOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'unit_price', 'quantity']


class RecentOrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    items = DashboardOrderItemSerializer(many=True, read_only=True)
    items_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'status',
            'customer_name',
            'items_count',
            'items',
            'total_amount',
            'created_at',
        ]

    def get_customer_name(self, obj):
        return obj.user.full_name or obj.user.email
