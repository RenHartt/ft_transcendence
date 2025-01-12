from django.urls import path, include
from . import views
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
    path('api/profile', views.profile, name='profile'),
    path('api/update-profile', views.update_profile, name='update_profile'),
    path('api/change-password', views.change_password, name='change_password'),
    path('api/save-profile', views.save_profile, name='save_profile'),
    path('api/send-friend-request/', views.send_friend_request, name='send_friend_request'),
    path('api/accept-friend-request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('api/decline-friend-request/<int:request_id>/', views.decline_friend_request, name='decline_friend_request'),
]
