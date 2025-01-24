from django.urls import path, include
from django.views.i18n import set_language  


urlpatterns = [
  path('', include("core.urls")),
  path('i18n/setlang/', set_language, name='set_language'),
]
