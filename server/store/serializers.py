from rest_framework import serializers
from .models import *


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
        model = User
        fields = ['username','email','password']
        extra_kwargs = {'password':{'write_only':True}}
        
    # def validate(self, data):
    #     """
    #     Check if the username or email already exists.
    #     """
    #     username = data.get('username')
    #     email = data.get('email')

    #     if User.objects.filter(username=username).exists():
    #         raise serializers.ValidationError("Username already exists.")
    #     if User.objects.filter(email=email).exists():
    #         raise serializers.ValidationError("Email already exists.")

    #     return data
        
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializers(read_only = True)
    class Meta:
        model = CartItem
        fields = ['cart','product','quantity']
        
class CartSerializer(serializers.ModelSerializer):
    cart_items = CartItemSerializer(many = True,read_only = True)
    
    class Meta:
        model = Cart
        fields = ['id','cart_items']
        
        

        
