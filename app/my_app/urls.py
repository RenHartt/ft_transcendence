# my_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # Page d'accueil
    path('about/', views.about, name='about'),  # Page "À propos"
]
