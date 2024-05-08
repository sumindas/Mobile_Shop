from rest_framework import generics
from .models import Product,Cart,CartItem
from .serializers import ProductSerializers,UserSerializer,CartItemSerializer,CartSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login




class ProductsListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers
    
class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers
    def get(self, request, *args, **kwargs):
        product = self.get_object()
        print("Product:",product)
        print("User:",self.request.user)
        serializer = self.get_serializer(product)
        user = request.user
        response_data = serializer.data
        response_data['username'] = user.username
        return Response(response_data, status=status.HTTP_200_OK)
    

class UserSignupView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        data = request.data
        username = data.get('username')
        email = data.get('email')
        
        if User.objects.filter(email=email).exists():
            return Response({'error':'Email Already Exists'},status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error':'Username Already Exists'},status=status.HTTP_400_BAD_REQUEST)
        
        serializer = UserSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response({
                'status':200,
                'message':'User Signup Successfully',
                'data' : serializer.data
            })
        except Exception as e:
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)
        
class LoginView(APIView):
    def post(self,request):
        email = request.data['email']
        password = request.data['password']

        if not email:
           return Response({'error':'Email is Required'},status=status.HTTP_400_BAD_REQUEST)
        if not password:
           return Response({'error':'Password is Required'},status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.all().filter(email=email).first()
        print(user.username,"name")
        auth = authenticate(request,username=user.username,password=password)
        print("Auth User:",auth)
        if user is None:
            return Response({'error':'User Not Found'},status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Login successful!", "user": {"id": user.id, "username":user.username, "email": user.email}}, status=status.HTTP_200_OK)

class AddToCartView(generics.CreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def perform_create(self, serializer):
        print("--------------",self.request.user)
        product_id = self.request.data.get('product_id')
        product = get_object_or_404(Product, id=product_id)
        cart = get_object_or_404(Cart, user=self.request.user)
        serializer.save(cart=cart, product=product)

class UpdateCartItemView(generics.UpdateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def get_object(self):
        cart_item_id = self.kwargs['cart_item_id']
        return get_object_or_404(CartItem, id=cart_item_id)

    def perform_update(self, serializer):
        serializer.save(quantity=self.request.data.get('quantity'))

    
    
