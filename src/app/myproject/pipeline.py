def custom_user_details(
    backend, details, response, social=None,
    uid=None, user=None, is_new=False, *args, **kwargs
):
    # si l'user n'existe pas, on ne peut rien faire
    if not user:
        return

    # si c'est un nouvel utilisateur, on met à jour librement
    if is_new:
        user.first_name = details.get('first_name') or user.first_name
        user.last_name = details.get('last_name') or user.last_name
        user.pp_link = details.get('pp_link') or user.pp_link
        user.save()
    else:
        # si l'user existe déjà, on décide de ne pas écraser
        # (ou alors, vous faites une condition champ par champ)
        pass