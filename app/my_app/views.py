from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login as auth_login
from django.contrib import messages

def home(request):
    return render(request, 'my_app/home.html')  # Charger home.html

def about(request):
    return render(request, 'my_app/about.html')  # Charger about.html

def login(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('home')  # Redirige vers la page "home"
        else:
            messages.error(request, 'Invalid username or password')
    return render(request, 'my_app/login.html')

def logout(request):
    return render(request, 'my_app/logout.html')  # Charger logout.html

def register(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')  # Redirection vers la page de connexion après l'inscription
    else:
        form = UserCreationForm()
    return render(request, 'my_app/register.html', {'form': form})