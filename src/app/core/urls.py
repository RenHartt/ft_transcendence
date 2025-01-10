from django.urls import path, include
from django.contrib.auth.views import LogoutView
from . import views
from django.contrib.auth.views import PasswordChangeView, PasswordChangeDoneView
import logging

logger = logging.getLogger('myproject')
logger.debug("Test log DEBUG")

urlpatterns = [
    path('', views.index, name='index'),
    path('tictactoe/', views.tictactoe, name='tictactoe'),
    path('logout/', views.logout, name='logout'), 
    path('register/', views.register, name='register'),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('load/<str:page_name>/', views.load_page, name='load_page'),
    path('api/update-profile', views.update_profile, name='update_profile'),
    path('api/change-password', views.change_password, name='change_password'),
    path('api/save-profile', views.save_profile, name='save_profile'),
    path('api/add-friend', views.add_friend, name='add_friend'),
]
