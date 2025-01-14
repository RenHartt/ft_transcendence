from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver

@receiver(user_logged_in)
def set_user_logged_in(sender, request, user, **kwargs):
    user.is_logged_in = True
    user.save()

@receiver(user_logged_out)
def set_user_logged_out(sender, request, user, **kwargs):
    user.is_logged_in = False
    user.save()
