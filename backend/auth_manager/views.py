from datetime import timedelta
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from rest_framework.decorators import action
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.core.mail import send_mail
from django.conf import settings
import random
from django.contrib.auth.models import Group

OTP_STORE = {}

class AuthViewSet(ViewSet):

    @action(detail=False, methods=["post"])
    def register(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        password = request.data.get("password")

        if User.objects.filter(username=username).exists():
            return Response({"meta": {"message": "Username already exists", "status_code": 400}}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"meta": {"message": "Email already exists", "status_code": 400}}, status=400)

        User.objects.create_user(username=username, email=email, password=password)

        return Response({"meta": {"message": "User registered successfully. Please verify your email."}})

    @action(detail=False, methods=["post"])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"meta": {"message": "Invalid credentials", "status_code": 400}}, status=400)
        
        user = User.objects.get(username=username)
        refresh = RefreshToken.for_user(user)
        access = AccessToken.for_user(user)
        access.set_exp(lifetime=timedelta(hours=10))

        return Response({
            "message": "Login successful",
            "data": {
                "name": user.username,
                "access": str(access),
                "refresh": str(refresh),
            },
        })


