from django.conf import settings

def cdn_url(request):
    return {"CDN_URL": settings.CDN_URL}
