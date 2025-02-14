from django.urls import path, include
from django.contrib.auth.views import LogoutView
from django.views.i18n import set_language
from . import views
import logging

logger = logging.getLogger('myproject')
handler404 = 'my_app.views.custom_404'

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
    path('api/remove-friend/<int:friend_id>/', views.remove_friend, name='remove_friend'),
	path('api/save-history/', views.save_history, name='save_history'),
	path('api/get-history/', views.get_history, name='get_history'),
    path("api/user_stats/", views.user_stats, name="user-stats"),
    path('i18n/setlang/', set_language, name='set_language'), 
    path('test-lang/', views.test_language, name='test_language'),
    path("custom_404/", views.custom_404, name="custom_404"),
    path("custom_500/", views.custom_500, name="custom_500"),
]
