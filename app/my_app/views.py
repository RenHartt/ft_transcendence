from django.shortcuts import render

def home(request):
    return render(request, 'my_app/home.html')  # Charger home.html

def about(request):
    return render(request, 'my_app/about.html')  # Charger about.html
