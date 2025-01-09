def save_user_profile(backend, user, response, *args, **kwargs):
    """
    Custom pipeline step to store 42 profile picture in CustomUser.
    Called after 'create_user' and before 'associate_user'.
    """
    if backend.name == '42':
        # The 42 API returns user data in `response`.
        # e.g. response.get('image_url') might have the avatar link.
        image_url = response.get('image_url')
        if image_url:
            user.pp_url = image_url
            user.save()

