from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from .models import UserInfo


def user_login(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return redirect("home")
    if request.user.is_authenticated:
        return redirect("home")
    return render(request, 'login.html')


def user_logout(request):
    logout(request)
    return redirect('login')


def user_register(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        email = request.POST['email']
        user_type = request.POST['type']
        user = User.objects.create_user(username, email, password)
        if user:
            login(request, user)
            UserInfo.objects.create(user_type=user_type, user_id=user)
            return redirect("home")
    if request.user.is_authenticated:
        return redirect("home")
    return render(request, 'register.html')