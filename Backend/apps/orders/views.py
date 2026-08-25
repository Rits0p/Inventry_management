from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.conf import settings

from core.mixins import RoleFilteredQuerysetMixin
from core.permissions import IsAdmin, IsCustomer

from .models import Order
from .serializers import (
    CreateOrderSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
)
from .services import cancel_order, create_razorpay_order, verify_razorpay_payment


class OrderViewSet(RoleFilteredQuerysetMixin, viewsets.ModelViewSet):
    queryset = Order.objects.all()
    user_filter_field = 'user'
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['order_number', 'user__full_name', 'user__email']
    ordering_fields = ['created_at', 'total_amount']

    def get_queryset(self):
        qs = super().get_queryset().select_related('user')
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        return qs

    def get_serializer_class(self):
        if self.action == 'create':
            return CreateOrderSerializer
        if self.action == 'list':
            return OrderListSerializer
        return OrderDetailSerializer

    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [IsCustomer]
        elif self.action in ('update', 'partial_update', 'destroy'):
            permission_classes = [IsAdmin]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def _get_order_for_user(self):
        """Admins access any order; customers only their own."""
        order = self.get_object()
        user = self.request.user
        is_admin = user.role == 'Admin' or user.is_superuser
        if not is_admin and order.user_id != user.id:
            raise PermissionDenied('You do not have access to this order.')
        return order

    def retrieve(self, request, *args, **kwargs):
        order = self._get_order_for_user()
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        read_serializer = OrderDetailSerializer(order, context=self.get_serializer_context())
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=201, headers=headers)

    def update(self, request, *args, **kwargs):
        """Admin-only. PATCH {status} and/or {payment_status}."""
        order = self.get_object()
        new_status = request.data.get('status')
        if new_status and new_status not in Order.Status.values:
            raise ValidationError(
                {'status': f'Status must be one of: {", ".join(Order.Status.values)}.'}
            )
        payment_status = request.data.get('payment_status')
        if payment_status and payment_status not in Order.PaymentStatus.values:
            raise ValidationError(
                {'payment_status': f'Payment status must be one of: {", ".join(Order.PaymentStatus.values)}.'}
            )

        if new_status == Order.Status.CANCELLED and order.status != Order.Status.CANCELLED:
            cancel_order(order)
            if payment_status and payment_status != order.payment_status:
                order.payment_status = payment_status
                order.save(update_fields=['payment_status'])
        else:
            changed = False
            if new_status and new_status != order.status:
                order.status = new_status
                changed = True
            if payment_status and payment_status != order.payment_status:
                order.payment_status = payment_status
                changed = True
            if changed:
                order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        order = self._get_order_for_user()
        cancel_order(order)
        serializer = self.get_serializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='razorpay-order')
    def razorpay_order(self, request, pk=None):
        order = self._get_order_for_user()
        if order.payment_status == Order.PaymentStatus.PAID:
            raise ValidationError({'detail': 'This order has already been paid.'})

        razorpay_order_id = create_razorpay_order(order)

        return Response({
            'razorpay_order_id': razorpay_order_id,
            'amount': int(order.total_amount * 100),
            'currency': 'INR',
            'key_id': settings.RAZORPAY_KEY_ID,
            'order_number': order.order_number,
            'customer_name': order.user.full_name or order.user.email,
            'customer_email': order.user.email,
        })

    @action(detail=True, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request, pk=None):
        order = self._get_order_for_user()

        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')

        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            raise ValidationError({'detail': 'Missing payment verification data.'})

        order = verify_razorpay_payment(
            order, razorpay_payment_id, razorpay_order_id, razorpay_signature
        )

        return Response({
            'detail': 'Payment verified successfully.',
            'payment_status': order.payment_status,
        })
