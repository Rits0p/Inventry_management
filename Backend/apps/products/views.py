from django.db import transaction
from django.db.models import Avg, Count
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.permissions import IsAdmin
from inventory.services import log_transaction

from .filters import ProductFilter
from .models import Product
from .serializers import AdjustStockSerializer, ProductSerializer, ProductWriteSerializer


class ProductViewSet(viewsets.ModelViewSet):
    filterset_class = ProductFilter
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'brand', 'description']
    ordering_fields = ['price', 'discount', 'rating', 'created_at', 'name', 'stock']

    def get_queryset(self):
        qs = Product.objects.select_related('category')
        user = self.request.user
        is_admin = bool(
            user and user.is_authenticated and (user.role == 'Admin' or user.is_superuser)
        )
        if not is_admin:
            qs = qs.filter(status=Product.Status.ACTIVE)
        return qs

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return ProductWriteSerializer
        return ProductSerializer

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy', 'adjust_stock'):
            return [IsAdmin()]
        return [AllowAny()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        read_serializer = ProductSerializer(instance, context=self.get_serializer_context())
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        read_serializer = ProductSerializer(instance, context=self.get_serializer_context())
        return Response(read_serializer.data)

    def perform_destroy(self, instance):
        instance.status = Product.Status.INACTIVE
        instance.save(update_fields=['status'])

    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def adjust_stock(self, request, pk=None):
        product = self.get_object()
        serializer = AdjustStockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        adjust_type = serializer.validated_data['type']
        quantity = serializer.validated_data['quantity']

        with transaction.atomic():
            locked = Product.objects.select_for_update().get(pk=product.pk)
            old_stock = locked.stock
            if adjust_type == AdjustStockSerializer.TYPE_ADD:
                locked.stock += quantity
            elif adjust_type == AdjustStockSerializer.TYPE_REMOVE:
                if locked.stock < quantity:
                    raise ValidationError(
                        {
                            'quantity': (
                                f'Cannot remove {quantity}; only {locked.stock} in stock.'
                            )
                        }
                    )
                locked.stock -= quantity
            else:
                locked.stock = quantity
            locked.save(update_fields=['stock'])
            log_transaction(
                product=locked,
                change=locked.stock - old_stock,
                resulting_stock=locked.stock,
                reason='Adjustment',
                reference=f'Manual {adjust_type}',
                user=request.user,
            )

        read_serializer = ProductSerializer(locked, context={'request': request})
        return Response(
            {'detail': f'Stock adjusted ({adjust_type} {quantity}).', 'product': read_serializer.data}
        )

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def brands(self, request):
        brands = (
            Product.objects.filter(status=Product.Status.ACTIVE, brand__isnull=False)
            .exclude(brand='')
            .values_list('brand', flat=True)
            .distinct()
            .order_by('brand')
        )
        return Response(list(brands))
