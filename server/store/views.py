from rest_framework import generics
from .models import Product,Cart,CartItem,Custom_User,Order,OrderItem
from .serializers import ProductSerializers,UserSerializer,CartItemSerializer,OrderSerializer,LoginUserSerializer,OrderItemSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.views import status
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.views import View
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle,Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import random
from .tasks import generate_order_report_csv
from django.http import JsonResponse
from django.core.mail import EmailMessage
from django.conf import settings
import os




class ProductsListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers


class ProductDetailView(generics.RetrieveAPIView):
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
                return Response(order_item_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
            
            cart = Cart.objects.get(user=request.user)
            for existing_item in CartItem.objects.filter(cart=cart):
                existing_item.delete()
        
        order_serializer = OrderSerializer(order)
        return Response({"message": "Order placed and cart cleared successfully.","order":order_serializer.data,"Items":order_item_serializer.data}, status=status.HTTP_200_OK)
    
    
class UserOrders(generics.ListAPIView):
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        user = self.request.user
        print("---------------",user)
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
    
class DownloadInvoiceApiView(View):
    permission_classes = [IsAuthenticated]

    def get(self, request, order_id):
        order = Order.objects.get(pk=order_id)
        order_items = OrderItem.objects.filter(order=order)

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{order.invoice_number}.pdf"'

        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = [Paragraph("MobShop", style=getSampleStyleSheet()['Heading1'])]

        elements.append(Paragraph(""))

        data = [
            ['Invoice Number:', order.invoice_number],
            ['Invoice Date:', order.invoice_date.strftime('%Y-%m-%d')],
            ['Customer:', order.user.username],
            ['Total Price:', f'₹{order.total_price}'],
            ['Address:',order.address]
        ]
        table = Table(data, colWidths=[150, 200])
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('TOPPADDING', (0, 0), (-1, 0), 12),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
        ]))
        elements.append(table)
        elements.append(Paragraph("", style=getSampleStyleSheet()['Normal']))

        data = [['Product', 'Quantity', 'Price']]
        data.extend(
            [item.product.name, item.quantity, f'₹{item.price_at_purchase}']
            for item in order_items
        )
        table = Table(data)
        table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('FONTSIZE', (0, 0), (-1, -1), 12),
        ]))
        elements.append(table)

        doc.build(elements)
        return response


class TriggerMonthlyReportView(View):
    permission_classes = [IsAuthenticated]
    def get(self,request,format=None):
        print(request.user,"--")
        task = generate_order_report_csv.delay()
        task_result = task.get()
        if task_result:
            filename = os.path.join('C:\\Portfolio\\B40\\Machine_Test\\server', task_result)

            with open(filename, 'r') as file:
                csv_content = file.read()

            return HttpResponse(csv_content, content_type='text/csv')
        else:
            return HttpResponse('Failed to generate order report', status=500)


class EmailOrderReportView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        user_email = self.request.user.email
        print("User:",user_email)
        task = generate_order_report_csv.delay()
        email_sent = self.send_email_with_attachment(task.id,user_email)

        if email_sent:
            return JsonResponse({'task_id': task.id, 'email_sent': True})
        else:
            return JsonResponse({'task_id': task.id, 'email_sent': False})
        
    def send_email_with_attachment(self, task_id,user_email):
        try:
            
            task_result = generate_order_report_csv.AsyncResult(task_id).get()
            filename = os.path.join('C:\\Portfolio\\B40\\Machine_Test\\server', task_result)

            
            subject = 'Order Report CSV'
            message = 'Hello From MobShop,Please find the attached order report CSV file.'
            email = EmailMessage(subject, message, settings.EMAIL_HOST_USER, [user_email])

            email.attach_file(filename)

            
            email.send()

            return True
        except Exception as e:
            print("Error sending email:", e)
            return False