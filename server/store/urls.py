from django.urls import path
from .views import ProductsListView,CategoryList


urlpatterns = [
    path('products/',ProductsListView.as_view(),name='addproduct'),
    path('category/',CategoryList.as_view(),name='category')
]
