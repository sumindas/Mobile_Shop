from rest_framework import generics
from .models import Product,Cart,CartItem,Custom_User
from .serializers import ProductSerializers,UserSerializer,CartItemSerializer,CartSerializer,LoginUserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import status
from django.shortcuts import get_object_or_404
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated


class ProductsListView(generics.ListAPIView):
    print("--------")
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
    


class UserSignupView(generics.CreateAPIView):
    permission_classes = ()
    authentication_classes = ()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        username = request.data.get('username')
        print(email,username)
        if Custom_User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        if Custom_User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        response = super().create(request, *args, **kwargs)
        return Response({
            'data': response.data,
            'message': 'account created successfully'
        }, status=status.HTTP_201_CREATED)
        
        
        
    
class LoginView(generics.CreateAPIView):
    permission_classes = ()
    authentication_classes = ()
    serializer_class = LoginUserSerializer
    
    def create(self,request,*args,**kwargs):
        serializer = self.get_serializer(
            data=request.data,context={'request':request}
        )
        print(serializer,"==data")
        if serializer.is_valid():
            return Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class UserCartItemsView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CartItemSerializer
    
    def get_queryset(self):
        user = self.request.user
        return CartItem.objects.filter(cart__user=user)

class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        print("user:",request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity',1)
        product = get_object_or_404(Product, id=product_id)
        cart, created = Cart.objects.get_or_create(user=request.user)
        existing_item = CartItem.objects.filter(cart=cart, product_id=product_id).first()
        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()
        else:
            CartItem.objects.create(cart=cart, product_id=product_id, quantity=quantity)

        return Response({"message": "Item added to cart successfully."}, status=status.HTTP_200_OK)
      



class UpdateCartItemView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)  

        product = get_object_or_404(Product, id=product_id)
        cart, created = Cart.objects.get_or_create(user=request.user)

        existing_item = CartItem.objects.filter(cart=cart, product_id=product_id).first()

        if not existing_item:
            return Response({"message": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)

        existing_item.quantity = quantity
        existing_item.save()

        return Response({"message": "Item quantity updated successfully."}, status=status.HTTP_200_OK)

    
    
