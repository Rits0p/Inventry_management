from django.db.models import Count
from rest_framework import generics
from rest_framework.permissions import AllowAny

from core.permissions import IsAdmin

from .models import Category
from .serializers import CategorySerializer


class ActiveCategoryManagerMixin:
    def get_queryset(self):
        qs = Category.objects.annotate(product_count=Count('products')).order_by('name')
        user = self.request.user
        is_admin = bool(
            user and user.is_authenticated and (user.role == 'Admin' or user.is_superuser)
        )
        if self.request.method == 'GET' and not is_admin:
            return qs.filter(is_active=True)
        return qs


class CategoryListCreateView(ActiveCategoryManagerMixin, generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [AllowAny()]


class CategoryDetailView(ActiveCategoryManagerMixin, generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_object(self):
        if 'slug' in self.kwargs:
            return self.get_object_by('slug', self.kwargs['slug'])
        return super().get_object()

    def get_object_by(self, field, value):
        from django.shortcuts import get_object_or_404
        return get_object_or_404(self.get_queryset(), **{field: value})

    def get_permissions(self):
        if self.request.method in ('PUT', 'PATCH', 'DELETE'):
            return [IsAdmin()]
        return [AllowAny()]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save(update_fields=['is_active'])
