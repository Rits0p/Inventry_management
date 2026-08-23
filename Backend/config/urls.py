from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({"message": "Backend API is running. Auth endpoints are at /api/auth/"})

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
]
