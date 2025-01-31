from social_core.backends.oauth import BaseOAuth2
from django.shortcuts import redirect
from social_core.exceptions import AuthForbidden
from core.models import User

class FortyTwoOAuth2(BaseOAuth2):
    name = '42'
    AUTHORIZATION_URL = 'https://api.intra.42.fr/oauth/authorize'
    ACCESS_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
    ACCESS_TOKEN_METHOD = 'POST'
    EXTRA_DATA = [
        ('access_token', 'access_token'),
        ('expires_in', 'expires'),
        ('refresh_token', 'refresh_token'),
    ]

    def get_user_details(self, response):
        if User.objects.filter(username=response.get('login')).exists():
            return {}
        return {
            'username': response.get('login'),
            'email': response.get('email'),
            'first_name': response.get('first_name'),
            'last_name': response.get('last_name'),
            'pp_link': response.get('image', {}).get('link'),
        }

    def user_data(self, access_token, *args, **kwargs):
        response = self.get_json(
            'https://api.intra.42.fr/v2/me',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        return response

    def social_auth_exception_handler(get_response):
        def middleware(request):
            try:
                return get_response(request)
            except (AuthForbidden, AuthCanceled, AuthFailed):
                return redirect('login')
        return middleware
        
