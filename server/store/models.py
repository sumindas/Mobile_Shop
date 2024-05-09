from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin
from .managers import CustomUserManager
from rest_framework_simplejwt.tokens import RefreshToken

# Create your models here.

class Custom_User(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=30)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    
    def tokens(self):
        refresh = RefreshToken.for_user(self)
        return {
            'refresh':str(refresh),  
            'access': str(refresh.access_token)
            
        }

class Category(models.Model):
    categories = (
        ('Redmi', 'Redmi'),
        ('Samsung', 'Samsung'),
        ('Apple', 'Apple'),
        ('Realme', 'Realme'),
    )
    name = models.CharField(max_length=100,choices=categories,unique=True)
    is_deleted = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name
    
     
class Product(models.Model):
    name = models.CharField(max_length=250)
    description = models.CharField(max_length=250)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    quantity_available = models.IntegerField()
    image = models.ImageField(upload_to='products/',blank=True,null=True)
    category = models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    

class Cart(models.Model):
    user = models.ForeignKey(Custom_User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Cart for {self.user.username}"
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    
    class Meta:
        unique_together = ('cart','product')
    
    def __str__(self):
        return f"{self.product.name} in {self.cart.user.username}"
    
class Order(models.Model):
    user = models.ForeignKey(Custom_User,on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10,decimal_places=2)
    status = models.CharField(max_length=100,default='pending',choices=[
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    invoice_number = models.CharField(max_length=100)
    invoice_date = models.DateField(auto_now_add=True)
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    address = models.TextField()
    
    def __str__(self):
        return f"Order#{self.invoice_number}"
    
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_at_purchase = models.DecimalField(max_digits=10,decimal_places=2)
    
    def __str__(self):
        return f"Order #{self.id} - {self.product.name}"     
    