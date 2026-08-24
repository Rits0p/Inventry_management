from django.contrib import admin

from .models import StockTransaction


@admin.register(StockTransaction)
class StockTransactionAdmin(admin.ModelAdmin):
    list_display = ('product', 'change', 'resulting_stock', 'reason', 'reference', 'created_at')
    list_filter = ('reason',)
    search_fields = ('product__name', 'product__sku', 'reference')
    readonly_fields = (
        'product', 'change', 'resulting_stock', 'reason', 'reference',
        'created_by', 'created_at',
    )

    def has_add_permission(self, request):
        return False
