from django.shortcuts import render, redirect, get_object_or_404
from .forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout, get_user_model
from django.views.decorators.cache import never_cache
from django.contrib import messages
from django.utils.translation import gettext as _
from django.http import JsonResponse, HttpResponse, HttpResponseNotFound
from django.shortcuts import render, redirect
import logging, json, re
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from .models import Friendship, History
from django.db.models import Q
from django.db import models
from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from django.core.cache import cache
from django.utils.translation import get_language
from django.core.exceptions import ValidationError

User = get_user_model()
logger = logging.getLogger('core')

def index(request):
    page = request.GET.get('page', 'home') 

    if page == 'login':
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                auth_login(request, user)
                return redirect('/?page=home')  
            else:
                messages.error(request, 'Invalid username or password')
        return render(request, 'my_app/login.html') 
    elif page == 'home':
        if not request.user.is_authenticated:
            return redirect('/?page=login')  
        return render(request, 'my_app/home.html')
    elif page == 'register':  
        form = CustomUserCreationForm(request.POST)
        if request.method == 'POST':
            form = CustomUserCreationForm(request.POST)
            if form.is_valid():
                form.save()
                return redirect('/?page=login')
        return render(request, 'my_app/register.html', {'form': form})  
    elif page == 'tictactoe':
        return render(request, 'my_app/tictactoe.html')
    
    return HttpResponseNotFound(render(request, 'my_app/404.html'))


@never_cache
def load_page(request, page_name):
    if page_name == "login":
        return render(request, 'my_app/login.html')
    elif page_name in ["home", "index", ""]:
        if not request.user.is_authenticated:
            return redirect('login')
        else:
            return redirect('home')
    
    return HttpResponseNotFound(render(request, 'my_app/404.html'))


@login_required
@never_cache
def home(request):
    return render(request, 'my_app/home.html', {"username": request.user.username})

def tictactoe(request):
    return render(request, 'my_app/tictactoe.html')

def login(request):
    logger.debug("coucou")
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('/?page=home')  
        else:
            messages.error(request, 'Invalid username or password')
            return redirect('/?page=login') 
    return render(request, 'my_app/login.html')

def logout(request):
    auth_logout(request)
    return redirect('/?page=login')

def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/?page=login')
        else:
            logger.warning(f'❌ Invalid form: {form.errors}')
    else:
        form = CustomUserCreationForm()
    return render(request, 'my_app/register.html', {'form': form})

def profile(request):
    if request.method == 'GET':
        pending_requests = Friendship.objects.filter(
            receiver=request.user, is_accepted=False
            ).values(
            'id',
            'requester__username',
            )
        friends = Friendship.objects.filter(
            (models.Q(requester=request.user) | models.Q(receiver=request.user)) & models.Q(is_accepted=True)
        ).values(
            'id',
            'requester__username',
            'receiver__username',
            'requester__is_logged_in',
            'receiver__is_logged_in',
            )

        return JsonResponse({
            'username': request.user.username,
            'email': request.user.email,
            'first_name': request.user.first_name,
            'last_name': request.user.last_name,
            'is_logged_in': request.user.is_logged_in,
            'pending_requests': list(pending_requests),
            'friends': list(friends),
        })
    else:
        return HttpResponse(status=405)

def test_language(request):
    return HttpResponse(f"Langue actuelle : {get_language()}")

@login_required
def update_profile(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            request.user.email = data.get('email', request.user.email)
            request.user.first_name = data.get('first_name', request.user.first_name)
            request.user.last_name = data.get('last_name', request.user.last_name)

            image_base64 = data.get('image')
            if image_base64:
                request.user.pp_link = image_base64

            request.user.save()
            return JsonResponse({
                'email': request.user.email,
                'first_name': request.user.first_name,
                'last_name': request.user.last_name,
                'pp_link': request.user.pp_link,
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def validate_password_strength(password):
    if len(password) < 8:
        raise ValidationError("The password must be at least 8 characters long.")

    if not re.search(r'[A-Z]', password):
        raise ValidationError("The password must contain at least one uppercase letter.")

    if not re.search(r'[a-z]', password):
        raise ValidationError("The password must contain at least one lowercase letter.")

    if not re.search(r'\d', password):
        raise ValidationError("The password must contain at least one digit.")

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        raise ValidationError("The password must contain at least one special character.")

    return True

@login_required
def change_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            old_password = data.get('old_password')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            if not old_password or not new_password or not confirm_password:
                return JsonResponse({'error': 'All input are requiered.'}, status=200)

            if not request.user.check_password(old_password):
                return JsonResponse({'error': 'Incorrect current password.'}, status=200)

            if new_password != confirm_password:
                return JsonResponse({'error': 'Password missmatch.'}, status=200)

            try:
                validate_password_strength(new_password)
            except ValidationError as e:
                return JsonResponse({'error': str(e)}, status=200)

            request.user.set_password(new_password)
            request.user.save()

            update_session_auth_hash(request, request.user)

            return JsonResponse({'message': 'Password changed successfully.'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid json.'}, status=200)

        except Exception as e:
            return JsonResponse({'error': f'Uknown error : {str(e)}'}, status=200)

    return JsonResponse({'error': 'Invalid request.'}, status=405)

@login_required 
def save_profile(request):
    if request.method == 'POST':
        user = request.user 
        first_name = request.POST.get('first_name', user.first_name)
        last_name = request.POST.get('last_name', user.last_name)
        email = request.POST.get('email', user.email)
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()

        return JsonResponse({'message': 'Profil successfully updated !'})

    return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

@login_required
def send_friend_request(request):
    if request.method == 'POST':
        try:
            if request.content_type == 'application/json':
                data = json.loads(request.body)
                username = data.get('username')
            else:
                username = request.POST.get('username')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=200)

        if not username:
            return JsonResponse({'error': 'Username is required'}, status=200)

        try:
            receiver = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({'error': "Unknown user."}, status=200)

        if receiver == request.user:
            return JsonResponse({'error': "You can't add this friend."}, status=200)

        friendship, created = Friendship.objects.get_or_create(
            requester=request.user,
            receiver=receiver
        )

        if created:
            return JsonResponse({'message': "Friend request sent."}, status=200)
        else:
            return JsonResponse({'error': "Friend request already exist."}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
def accept_friend_request(request, request_id):
    friendship = get_object_or_404(Friendship, id=request_id, receiver=request.user)
    if not friendship.is_accepted:
        friendship.is_accepted = True
        friendship.save()
    return JsonResponse({'message': 'Friend request accepted.'}, status=200)

@login_required
def decline_friend_request(request, request_id):
    friendship = get_object_or_404(Friendship, id=request_id, receiver=request.user)
    friendship.delete()
    return JsonResponse({'message': 'Friend request declined.'}, status=200)

@login_required
def friend_list(request):
    friends = Friendship.objects.filter(
        (models.Q(requester=request.user) | models.Q(receiver=request.user)) & models.Q(is_accepted=True)
    )
    return render('index')

@login_required
def friend_requests(request):
    pending_requests = Friendship.objects.filter(receiver=request.user, is_accepted=False)
    return render('index')

@login_required
def handleFriendRequest(request, request_id):
    friendship = get_object_or_404(Friendship, id=request_id, receiver=request.user)
    if request.method == 'POST':
        action = request.POST.get('action')
        if action == 'accept':
            friendship.is_accepted = True
            friendship.save()
            return redirect('friend_requests')
        elif action == 'decline':
            friendship.delete()
            return redirect('friend_requests')
    return render('index')

@login_required
def remove_friend(request, friend_id):
    if request.method == 'POST':
        logger.info(f"Supress friens {friend_id}")
        friendship = get_object_or_404(Friendship, id=friend_id, is_accepted=True)
        friendship.delete()
        return JsonResponse({'message': 'Successfuly suppressed friend.'}, status=200)
    return JsonResponse({'error': 'Forbidden'}, status=405)

@receiver(user_logged_in)
def on_user_logged_in(sender, request, user, **kwargs):
    cache.set(f"user_{user.id}_status", "online", 60*5)

@receiver(user_logged_out)
def on_user_logged_out(sender, request, user, **kwargs):
    cache.delete(f"user_{user.id}_status")

def save_history(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            user = data.get('user')
            p1Score = data.get('p1Score', 0)
            p2Score = data.get('p2Score', 0)
            game_type = data.get('game_type')
            result = data.get('result')

            user = User.objects.get(username=data.get('user'))
            History.objects.create(
                user=user,
                p1Score=p1Score,
                p2Score=p2Score,
                game_type=game_type,
                result=result
            )
            return JsonResponse({"message": "History saved !"}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

def get_history(request):
    user = request.user
    history = History.objects.filter(user=user)

    data = [
        {
            "game_type": history_entry.game_type,
            "user": history_entry.user.username,
            "p1Score": history_entry.p1Score,
            "p2Score": history_entry.p2Score,
            "result": history_entry.result
        }
        for history_entry in history
    ]

    return JsonResponse(data, safe=False)

@login_required
@never_cache
def user_stats(request):
    user = request.user

    pong_played = History.objects.filter(user=user, game_type="Pong").count()
    pong_won = History.objects.filter(user=user, game_type="Pong", result__iexact="Win").count()
    pong_lost = History.objects.filter(user=user, game_type="Pong", result__iexact="Lose").count()

    pong_winrate = round((pong_won / pong_played) * 100, 2) if pong_played > 0 else 0

    pong_stats = {
        "played": pong_played,
        "won": pong_won,
        "lost": pong_lost,
        "winrate": pong_winrate
    }

    ttt_played = History.objects.filter(user=user, game_type="TicTacToe").count()
    ttt_won = History.objects.filter(user=user, game_type="TicTacToe", result__iexact="Win").count()
    ttt_lost = History.objects.filter(user=user, game_type="TicTacToe", result__iexact="Lose").count()

    ttt_winrate = round((ttt_won / ttt_played) * 100, 2) if ttt_played > 0 else 0

    tic_tac_toe_stats = {
        "played": ttt_played,
        "won": ttt_won,
        "lost": ttt_lost,
        "winrate": ttt_winrate
    }

    return JsonResponse({"pong": pong_stats, "tic_tac_toe": tic_tac_toe_stats})

def custom_404(request, exception=None):
    return render(request, "my_app/404.html", status=404)


def custom_500(request, exception=None):
    return render(request, "my_app/404.html", status=500)
