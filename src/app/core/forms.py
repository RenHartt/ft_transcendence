from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
import logging

logger = logging.getLogger('core')
User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password1', 'password2')
        logger.info('CustomUserCreationForm')
        logger.info(fields)
        