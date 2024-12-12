# my_app/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),  # Page d'accueil
    path('about/', views.about, name='about'),  # Page "À propos"
    path('login/', views.login, name='login'),  # Page de connexion
    path('logout/', views.logout, name='logout'),  # Page de déconnexion
    path('register/', views.register, name='register'),  # Page d'inscription
]
