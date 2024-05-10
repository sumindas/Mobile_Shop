from django.urls import path
from .views import ProductsListView,UserSignupView,LoginView,ProductDetailView,AddToCartView,UpdateCartItemView,UserCartItemsView,Remove_Cart_Item,OrderCreateView,UserOrders,OrderItemsView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('signup/',UserSignupView.as_view(),name='signup'),
    path("login/", LoginView.as_view(), name="login"),
    path('token/refresh',TokenRefreshView.as_view(),name= 'token_refresh'),
    path('products/',ProductsListView.as_view(),name='addproduct'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('cart/',UserCartItemsView.as_view(),name='cart'),
    path('add_to_cart/', AddToCartView.as_view(), name='add_to_cart'),
    path('update_cart_item/', UpdateCartItemView.as_view(), name='update_cart_item'),
    path('remove_cart_item/', Remove_Cart_Item.as_view(), name='remove_cart_item'),
    path('place_order/', OrderCreateView.as_view(), name='place_order'),
    path('user_orders/',UserOrders.as_view(),name='user_orders'),
    path('order_item_detail/<int:pk>/', OrderItemsView.as_view(), name='order-item-detail')
]
