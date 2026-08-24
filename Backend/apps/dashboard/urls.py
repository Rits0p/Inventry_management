from django.urls import path

from .views import AdminDashboardView, CustomerDashboardView

urlpatterns = [
    path('admin/', AdminDashboardView.as_view(), name='dashboard-admin'),
    path('customer/', CustomerDashboardView.as_view(), name='dashboard-customer'),
]
