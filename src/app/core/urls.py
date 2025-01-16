from django.urls import path, include
from django.contrib.auth.views import LogoutView
from django.views.i18n import set_language
from . import views
import logging

logger = logging.getLogger('myproject')

urlpatterns = [
    path('', views.home_view, name='index'),
    path('load/<slug:page>/', views.load_page_view, name='load_page'),
    path('logout/', views.logout, name='logout'), 

    path('register/', views.register, name='register'),
    path('404/', views.custom404, name='404'),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('i18n/setlang/', set_language, name='set_language'), 

    path('test-lang/', views.test_language, name='test_language'),
    path('test-csrf/', views.test_csrf, name='test_csrf'),
    
    path('api/accept-friend-request/<int:request_id>/', views.accept_friend_request, name='accept_friend_request'),
    path('api/change-password', views.change_password, name='change_password'),
    path('api/decline-friend-request/<int:request_id>/', views.decline_friend_request, name='decline_friend_request'),
	path('api/get-history/', views.get_history, name='get_history'),
    path('api/profile', views.profile, name='profile'),
    path('api/remove-friend/<int:friend_id>/', views.remove_friend, name='remove_friend'),
	path('api/save-history/', views.save_history, name='save_history'),
    path('api/save-profile', views.save_profile, name='save_profile'),
    path('api/send-friend-request/', views.send_friend_request, name='send_friend_request'),
    path('api/update-profile', views.update_profile, name='update_profile'),

    path('<slug:page>/', views.home_view, name='index'),
]
