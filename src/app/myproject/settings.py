from pathlib import Path
from decouple import config
from django.utils.translation import gettext_lazy as _
import logging
from django.utils.translation import get_language

logger = logging.getLogger('myproject')

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-))m0tjq+d(9#5+x(%!&^d=p^9k-svgm^xbe-hwl6)t#j^cyrm-'

DEBUG = False
LANGUAGE_CODE = 'en'
USE_I18N = True
USE_L10N = True
USE_TZ = True
CDN_URL = 'https://localhost:8443/static'

LANGUAGES = [
    ('en', _('English')),
    ('fr', _('Français')),
    ('es', _('Español')),
]
ALLOWED_HOSTS = ['*']
LANGUAGE_COOKIE_NAME = 'django_language'
LANGUAGE_COOKIE_AGE = 31536000 
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'core': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'social_django',

    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'myproject/templates/'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.static',
                'django.template.context_processors.csrf',
                'django.contrib.messages.context_processors.messages',
                'myproject.context_processors.cdn_url',
            ],
        },
    },
]

WSGI_APPLICATION = 'myproject.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': config('DB_PORT'),
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


TIME_ZONE = 'Europe/Paris'

USE_I18N = True

USE_TZ = True


STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'myproject/static']
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
SITE_ID = 1

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username'

SOCIAL_AUTH_42_KEY = 'u-s4t2ud-996544e675137d321c58aadcc8e6d5dcdff78712fc296361f5c306709ebe4b70'
SOCIAL_AUTH_42_SECRET = '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'
# SOCIAL_AUTH_42_REDIRECT_URI = 'http://localhost:8080/oauth/complete/42/'
SOCIAL_AUTH_42_REDIRECT_URI = 'https://localhost:8443/oauth/complete/42/'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend', 
    'allauth.account.auth_backends.AuthenticationBackend', 
    'myproject.auth.FortyTwoOAuth2',
]

AUTH_USER_MODEL = 'core.User'
LOCALE_PATHS = [
    BASE_DIR / "myproject/locale", 
]

EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

CSRF_TRUSTED_ORIGINS = ['https://localhost:8443', 'https://ft_attribute.com']
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
