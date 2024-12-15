from django.urls import path, include
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    path('', views.home, name='login'),  
    path('about/', views.about, name='about'),
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'), 
    path('register/', views.register, name='register'),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('load/<str:page_name>/', views.load_page, name='load_page'),
]