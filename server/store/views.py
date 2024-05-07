from rest_framework import generics
from .models import Product,Category
from .serializers import ProductSerializers,CategoryListSerializers,UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework import status,viewsets
from django.contrib.auth import authenticate




class ProductsListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializers

class UserSignupView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        data = request.data
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
        print(user)
        if user is None:
            return Response({'error':'User Not Found'},status=status.HTTP_400_BAD_REQUEST)
        
        elif user.password != password:
            return Response({'error':'Password Incorrect'},status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "Login successful!", "user": {"id": user.id, "email": user.email}}, status=status.HTTP_200_OK)


    
    
        
