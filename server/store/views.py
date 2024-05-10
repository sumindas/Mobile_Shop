from rest_framework import generics
from .models import Product,Cart,CartItem,Custom_User,Order,OrderItem
from .serializers import ProductSerializers,UserSerializer,CartItemSerializer,OrderSerializer,LoginUserSerializer,OrderItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveAPIView
from rest_framework.views import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
import random



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
        product = Product.objects.get(id=product_id)

        if not existing_item:
            return Response({"message": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)

        existing_item.quantity = quantity
        product.quantity_available -= quantity
        product.save()
        existing_item.save()

        return Response({"message": "Item quantity updated successfully."}, status=status.HTTP_200_OK)
    
class Remove_Cart_Item(APIView):
    permission_classes = [IsAuthenticated]
    def post(self,request):
        print("User:",request.user)
        product_id = request.data.get('product_id')
        cart = Cart.objects.get(user=request.user)
        print("Cart:",cart,"--","Product:",product_id)
        existing_item = CartItem.objects.filter(cart=cart, product=product_id).first()
        print(existing_item)   
        if not existing_item:
            return Response({"message": "Item not found in cart."}, status=status.HTTP_404_NOT_FOUND)
        existing_item.delete()
        return Response({"message": "Item removed from cart successfully."}, status=status.HTTP_200_OK)
    

class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        print("Data order:",request.data['order_data'])
        print("Cart:",request.data['cartItems'])
        prefix = "MOB"
        random_number = random.randint(1000, 9999)
        invoice_number = f"#{prefix}{random_number}"
        order_data = request.data['order_data']
        order_data['invoice_number'] = invoice_number
        serializer = OrderSerializer(data=order_data)
        if serializer.is_valid():
            order = serializer.save(user=request.user)
            cart_items = request.data['cartItems']
        else:
            print("Errors:",serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        for item in cart_items:
            product = Product.objects.get(id=item['product_id'])
            order_item_data = {
                'order' : order.id,
                'product' : item['product_id'],
                'quantity': item['quantity'],
                'price_at_purchase' : item['price_at_purchase']
            }
            order_item_serializer = OrderItemSerializer(data=order_item_data)
            if order_item_serializer.is_valid():
                order_item_serializer.save(order=order,product=product)
                product.quantity_available -= item['quantity']
                product.save()
            else:
                print("Errors_Order_Item:",order_item_serializer.errors)
                return Response(order_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            
            cart = Cart.objects.get(user=request.user)
            for existing_item in CartItem.objects.filter(cart=cart):
                existing_item.delete()
        
        order_serializer = OrderSerializer(order)
        return Response({"message": "Order placed and cart cleared successfully.","order":order_serializer.data,"Items":order_item_serializer.data}, status=status.HTTP_200_OK)
        # return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class UserOrders(generics.ListAPIView):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        if not user:
            return Response({"Error":"User Not Found"})
        return Order.objects.filter(user=user).order_by('-created_at')

class OrderItemsView(generics.ListAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        order_id = self.kwargs['pk']
        if not order_id:
            return Response({'error': 'Order ID is required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)
        return OrderItem.objects.filter(order=order)
    
    
    def list(self,request,*args,**kwargs):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset,many=True)
        return Response(serializer.data)