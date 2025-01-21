from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager, User
from django.conf import settings

class CustomUserManager(BaseUserManager):
    def _create_user(self, username=None, email=None, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            username=username or "",
            first_name=extra_fields.pop('first_name', ''),
            last_name=extra_fields.pop('last_name', ''),
            pp_link=extra_fields.pop('pp_link', "https://example.com/default-avatar.jpg"),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username=None, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(username, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(blank=True, null=True, unique=True) 
    username = models.CharField(max_length=150, blank=False, unique=True)
    first_name = models.CharField(max_length=30, blank=True)  
    last_name = models.CharField(max_length=30, blank=True)  
    pp_link = models.URLField(blank=True, default="https://example.com/default-avatar.jpg")  
    name = models.CharField(max_length=255, blank=True, default='')
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_logged_in = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []  

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name or self.username

class Friendship(models.Model):
    requester = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name="friendship_requests_sent",
        on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name="friendship_requests_received",
        on_delete=models.CASCADE
    )
    is_accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('requester', 'receiver')

class History(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        related_name="histories",
        on_delete=models.CASCADE
    )
    pWin = models.CharField(max_length=20)
    p1Score = models.IntegerField()
    p2Score = models.IntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.pWin} - {self.p1Score} - {self.p2Score}"