from django.urls import path
from .views import ProductsListView,UserSignupView,LoginView,ProductDetailView,AddToCartView,UpdateCartItemView


urlpatterns = [
    path('signup/',UserSignupView.as_view(),name='signup'),
    path("login/", LoginView.as_view(), name="login"),
    path('products/',ProductsListView.as_view(),name='addproduct'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('add_to_cart/', AddToCartView.as_view(), name='add_to_cart'),
    path('update_cart_item/<int:cart_item_id>/', UpdateCartItemView.as_view(), name='update_cart_item'),
]
