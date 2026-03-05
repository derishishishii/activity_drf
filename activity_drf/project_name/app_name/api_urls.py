# app_name/api_urls.py
from django.urls import path
from . import api_views   # ← must be api_views not views

urlpatterns = [
    # Customers
    path('customers/', api_views.CustomerListCreateAPIView.as_view()),
    path('customers/<int:pk>/', api_views.CustomerDetailAPIView.as_view()),

    # Products
    path('products/', api_views.ProductListCreateAPIView.as_view()),
    path('products/<int:pk>/', api_views.ProductDetailAPIView.as_view()),

    # Orders
    path('orders/', api_views.OrderListCreateAPIView.as_view()),
    path('orders/<int:pk>/', api_views.OrderDetailAPIView.as_view()),

    # Order Items
    path('order-items/', api_views.OrderItemListCreateAPIView.as_view()),
    path('order-items/<int:pk>/', api_views.OrderItemDetailAPIView.as_view()),
]