from rest_framework import serializers

from .models import Order, OrderItem
from .services import create_order


class OrderItemSerializer(serializers.ModelSerializer):
    line_total = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'unit_price', 'quantity', 'line_total']


class OrderListSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.EmailField(source='user.email', read_only=True)
    items_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'order_number',
            'status',
            'payment_status',
            'customer_name',
            'customer_email',
            'subtotal_amount',
            'delivery_fee',
            'total_amount',
            'items_count',
            'created_at',
        ]

    def get_customer_name(self, obj):
        return obj.user.full_name or obj.user.email


class OrderDetailSerializer(OrderListSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta(OrderListSerializer.Meta):
        fields = OrderListSerializer.Meta.fields + [
            'items',
            'delivery_address',
            'razorpay_order_id',
            'razorpay_payment_id',
            'cancelled_at',
            'updated_at',
        ]


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):
    items = OrderItemCreateSerializer(many=True)
    delivery_address = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=1000,
    )

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('At least one item is required.')
        return value

    def create(self, validated_data):
        user = self.context['request'].user
        return create_order(
            user=user,
            items_data=validated_data['items'],
            delivery_address=validated_data.get('delivery_address', ''),
        )

    def update(self, instance, validated_data):
        raise NotImplementedError('Orders are not editable via this serializer.')
