from django.urls import path, include
from django.views.i18n import set_language  
from django.conf.urls import handler404
from core.views import custom_404  # Assurez-vous que la vue existe
from core.views import custom_500
handler404 = custom_404
handler500 = custom_500
urlpatterns = [
  path('', include("core.urls")),
  path('i18n/setlang/', set_language, name='set_language'),
]
