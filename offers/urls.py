from django.urls import path
from .views import *

urlpatterns = [
    path('', offer, name="offer"),
    path('<int:id>/<str:status>', update_status, name="update_status"),
    path('get_list', get_offer_list, name="offer_list"),
    path('delete_offer/<int:offer_id>', delete_offer, name="delete_offer"),
    path('update_offer/<int:id>', update_offer, name="update_offer"),
    path('add', post_offer, name="add_offers"),
    path('favourite/<int:id>', favourite_offer, name="favourite"),
]