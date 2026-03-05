from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from .models import Customer, Product, Order, OrderItem
from .forms import CustomerForm, ProductForm, OrderForm, OrderItemForm


# ──────────────────────────────────────────────
# Dashboard
# ──────────────────────────────────────────────
def dashboard(request):
    context = {
        'total_customers': Customer.objects.count(),
        'total_products': Product.objects.count(),
        'total_orders': Order.objects.count(),
        'total_order_items': OrderItem.objects.count(),
        'recent_orders': Order.objects.select_related('customer').order_by('-created_at')[:5],
    }
    return render(request, 'store/dashboard.html', context)


# ──────────────────────────────────────────────
# Customer CRUD
# ──────────────────────────────────────────────
def customer_list(request):
    customers = Customer.objects.all().order_by('-created_at')
    return render(request, 'store/customer_list.html', {'customers': customers})

def customer_detail(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    orders = customer.orders.all().order_by('-created_at')
    return render(request, 'store/customer_detail.html', {'customer': customer, 'orders': orders})

def customer_create(request):
    form = CustomerForm(request.POST or None)
    if form.is_valid():
        customer = form.save()
        messages.success(request, f'Customer "{customer.full_name}" created successfully!')
        return redirect('customer_list')
    return render(request, 'store/form.html', {'form': form, 'title': 'Add Customer', 'back_url': 'customer_list'})

def customer_update(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    form = CustomerForm(request.POST or None, instance=customer)
    if form.is_valid():
        form.save()
        messages.success(request, f'Customer "{customer.full_name}" updated successfully!')
        return redirect('customer_list')
    return render(request, 'store/form.html', {'form': form, 'title': f'Edit {customer.full_name}', 'back_url': 'customer_list'})

def customer_delete(request, pk):
    customer = get_object_or_404(Customer, pk=pk)
    if request.method == 'POST':
        name = customer.full_name
        customer.delete()
        messages.success(request, f'Customer "{name}" deleted.')
        return redirect('customer_list')
    return render(request, 'store/confirm_delete.html', {'object': customer, 'title': 'Delete Customer', 'back_url': 'customer_list'})


# ──────────────────────────────────────────────
# Product CRUD
# ──────────────────────────────────────────────
def product_list(request):
    products = Product.objects.all().order_by('-created_at')
    return render(request, 'store/product_list.html', {'products': products})

def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return render(request, 'store/product_detail.html', {'product': product})

def product_create(request):
    form = ProductForm(request.POST or None)
    if form.is_valid():
        product = form.save()
        messages.success(request, f'Product "{product.name}" created successfully!')
        return redirect('product_list')
    return render(request, 'store/form.html', {'form': form, 'title': 'Add Product', 'back_url': 'product_list'})

def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk)
    form = ProductForm(request.POST or None, instance=product)
    if form.is_valid():
        form.save()
        messages.success(request, f'Product "{product.name}" updated successfully!')
        return redirect('product_list')
    return render(request, 'store/form.html', {'form': form, 'title': f'Edit {product.name}', 'back_url': 'product_list'})

def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    if request.method == 'POST':
        name = product.name
        product.delete()
        messages.success(request, f'Product "{name}" deleted.')
        return redirect('product_list')
    return render(request, 'store/confirm_delete.html', {'object': product, 'title': 'Delete Product', 'back_url': 'product_list'})


# ──────────────────────────────────────────────
# Order CRUD
# ──────────────────────────────────────────────
def order_list(request):
    orders = Order.objects.select_related('customer').order_by('-created_at')
    return render(request, 'store/order_list.html', {'orders': orders})

def order_detail(request, pk):
    order = get_object_or_404(Order, pk=pk)
    items = order.order_items.select_related('product').all()
    return render(request, 'store/order_detail.html', {'order': order, 'items': items})

def order_create(request):
    form = OrderForm(request.POST or None)
    if form.is_valid():
        order = form.save()
        messages.success(request, f'Order #{order.pk} created successfully!')
        return redirect('order_list')
    return render(request, 'store/form.html', {'form': form, 'title': 'Create Order', 'back_url': 'order_list'})

def order_update(request, pk):
    order = get_object_or_404(Order, pk=pk)
    form = OrderForm(request.POST or None, instance=order)
    if form.is_valid():
        form.save()
        messages.success(request, f'Order #{order.pk} updated successfully!')
        return redirect('order_list')
    return render(request, 'store/form.html', {'form': form, 'title': f'Edit Order #{order.pk}', 'back_url': 'order_list'})

def order_delete(request, pk):
    order = get_object_or_404(Order, pk=pk)
    if request.method == 'POST':
        order_id = order.pk
        order.delete()
        messages.success(request, f'Order #{order_id} deleted.')
        return redirect('order_list')
    return render(request, 'store/confirm_delete.html', {'object': order, 'title': 'Delete Order', 'back_url': 'order_list'})


# ──────────────────────────────────────────────
# OrderItem CRUD
# ──────────────────────────────────────────────
def orderitem_list(request):
    items = OrderItem.objects.select_related('order', 'product').order_by('-order__created_at')
    return render(request, 'store/orderitem_list.html', {'items': items})

def orderitem_create(request):
    form = OrderItemForm(request.POST or None)
    if request.GET.get('product'):
        from .models import Product as P
        try:
            p = P.objects.get(pk=request.GET['product'])
            form.initial['unit_price'] = p.price
        except P.DoesNotExist:
            pass
    if form.is_valid():
        item = form.save()
        messages.success(request, f'Order item added successfully!')
        return redirect('order_detail', pk=item.order.pk)
    return render(request, 'store/form.html', {'form': form, 'title': 'Add Order Item', 'back_url': 'orderitem_list'})

def orderitem_update(request, pk):
    item = get_object_or_404(OrderItem, pk=pk)
    form = OrderItemForm(request.POST or None, instance=item)
    if form.is_valid():
        form.save()
        messages.success(request, 'Order item updated successfully!')
        return redirect('order_detail', pk=item.order.pk)
    return render(request, 'store/form.html', {'form': form, 'title': 'Edit Order Item', 'back_url': 'orderitem_list'})

def orderitem_delete(request, pk):
    item = get_object_or_404(OrderItem, pk=pk)
    order_pk = item.order.pk
    if request.method == 'POST':
        item.delete()
        messages.success(request, 'Order item deleted.')
        return redirect('order_detail', pk=order_pk)
    return render(request, 'store/confirm_delete.html', {'object': item, 'title': 'Delete Order Item', 'back_url': 'orderitem_list'})