from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({'message': 'API Root', 'endpoints': {
        'admin': '/admin/',
        'customers': '/api/v1/customers/',
        'products': '/api/v1/products/',
        'orders': '/api/v1/orders/',
        'order_items': '/api/v1/order-items/',
    }})

urlpatterns = [
    path('', api_root, name='home'),
    path('admin/', admin.site.urls),
    path('api/v1/', include('app_name.api_urls')),  # ← api_urls
    path('web/', include('app_name.urls')),          # ← html views
]