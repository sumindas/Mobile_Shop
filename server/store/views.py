from rest_framework import generics
from .models import Product,Category
from .serializers import ProductSerializers,CategoryListSerializers
from rest_framework.response import Response


class ProductsListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers
    
class CategoryList(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryListSerializers