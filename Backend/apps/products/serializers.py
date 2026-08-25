from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    reviews = serializers.IntegerField(source='reviews_count', read_only=True)
    image = serializers.SerializerMethodField()
    savings = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'sku',
            'brand',
            'description',
            'category',
            'category_name',
            'price',
            'original_price',
            'discount',
            'savings',
            'rating',
            'reviews',
            'highlights',
            'specifications',
            'badge',
            'image',
            'stock',
            'status',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

    def get_image(self, obj):
        if not obj.image:
            return None
        url = obj.image.url
        request = self.context.get('request')
        return request.build_absolute_uri(url) if request else url

    def get_savings(self, obj):
        if obj.original_price and obj.original_price > obj.price:
            return obj.original_price - obj.price
        return 0


class ProductWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'name',
            'sku',
            'brand',
            'description',
            'category',
            'price',
            'original_price',
            'discount',
            'highlights',
            'specifications',
            'badge',
            'image',
            'stock',
            'status',
        ]

    def validate(self, attrs):
        price = attrs.get('price', getattr(self.instance, 'price', None))
        original_price = attrs.get(
            'original_price', getattr(self.instance, 'original_price', None)
        )
        if original_price is not None and price is not None and original_price < price:
            raise serializers.ValidationError(
                {'original_price': 'Original price (MRP) cannot be lower than the selling price.'}
            )
        return attrs


class AdjustStockSerializer(serializers.Serializer):
    TYPE_ADD = 'add'
    TYPE_REMOVE = 'remove'
    TYPE_SET = 'set'

    type = serializers.ChoiceField(choices=[TYPE_ADD, TYPE_REMOVE, TYPE_SET])
    quantity = serializers.IntegerField(min_value=0)

    def validate_quantity(self, value):
        if self.initial_data.get('type') == self.TYPE_REMOVE and value == 0:
            raise serializers.ValidationError('Remove quantity must be greater than zero.')
        return value
