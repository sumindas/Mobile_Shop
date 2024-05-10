from rest_framework import serializers
from .models import *
from rest_framework.exceptions import AuthenticationFailed
import random


class ProductSerializers(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        
class CategoryListSerializers(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom_User
        fields = ['id','email','username','password']
        extra_kwargs = {
            'password': {'write_only':True}
        }
        
        def create(self, validated_data):
            password = validated_data.pop('password', None)
            instance = self.Meta.model(**validated_data)
            if password is not None:
                instance.set_password(password)
            instance.save()
            return instance

class LoginUserSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=25)
    password = serializers.CharField(max_length=128,write_only=True)
    access_token = serializers.CharField(max_length=255,read_only=True)
    refresh_token = serializers.CharField(max_length=255,read_only=True)
    
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Custom_User
        fields = ['email','username','password','access_token','refresh_token']
        
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        print(email,password,"---------")
        user = Custom_User.objects.filter(email=email).first()
        print("User:",user)
        if user is None:
            raise serializers.ValidationError("User does not exist.")
        if not user.is_active:
            raise AuthenticationFailed("User Blocked!")
        
        if user.password != password:
            raise serializers.ValidationError("incorrect Password")
        user_token = user.tokens()
        return {
            'email':email,
            'username':user.username,
            'access_token': str(user_token.get('access')),
            'refresh_token': str(user_token.get('refresh')),
        }
        
class CartSerializer(serializers.ModelSerializer):
    user  = UserSerializer(read_only=True)
    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at']
        
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializers(read_only=True)
    cart = CartSerializer(read_only=True)
    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity']
        


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    class Meta:
        model = Order
        fields = ['id','user','status','total_price','invoice_number','name','mobile','address','created_at','invoice_date']


class OrderItemSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only = True)
    product = ProductSerializers(read_only = True)
    class Meta:
        model = OrderItem
        fields = ['order','product','quantity','price_at_purchase']
        
