from django.urls import path, include
from django.contrib.auth.views import LogoutView
from django.views.i18n import set_language  # ✅ Import corrigé
from . import views
from django.contrib.auth.views import PasswordChangeView, PasswordChangeDoneView
import logging

logger = logging.getLogger('myproject')

urlpatterns = [
    path('', views.index, name='index'),
    path('tictactoe/', views.tictactoe, name='tictactoe'),
    path('logout/', views.logout, name='logout'), 
    path('register/', views.register, name='register'),
    path('404/', views.custom404, name='404'),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('load/<str:page_name>/', views.load_page, name='load_page'),
    path('api/update-profile', views.update_profile, name='update_profile'),
    path('api/change-password', views.change_password, name='change_password'),
    path('api/save-profile', views.save_profile, name='save_profile'),
    path('api/add-friend', views.add_friend, name='add_friend'),
    path('i18n/setlang/', set_language, name='set_language'), 
    path('test-lang/', views.test_language, name='test_language'),
    path('test-csrf/', views.test_csrf, name='test_csrf'),   
]
