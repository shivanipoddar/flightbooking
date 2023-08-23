from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class UserInfo(models.Model):
    user_type = models.CharField(max_length=20) #(Moderator, Student, Sales, Advertiser)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)


class Flight(models.Model):
    name = models.CharField(max_length=20) #(Moderator, Student, Sales, Advertiser)
    departure = models.TimeField()
    arrival = models.TimeField()
    fare = models.IntegerField()
    flight_from = models.CharField(max_length=60)
    flight_to = models.CharField(max_length=60)
    flight_class = models.CharField(max_length=60) #(ECONOMY, )
    flight_code = models.CharField(max_length=60)
    flight_pnr = models.CharField(max_length=60)
