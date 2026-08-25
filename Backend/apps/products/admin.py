from django.contrib import admin

from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'sku',
        'brand',
        'category',
        'price',
        'discount',
        'stock',
        'status',
    )
    list_filter = ('status', 'category', 'brand')
    search_fields = ('name', 'sku', 'brand')
    list_editable = ('price', 'stock', 'status')
    list_per_page = 25
    readonly_fields = ('highlights', 'specifications')
