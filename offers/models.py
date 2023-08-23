from django.db import models
from authentication.models import *


class Offer(models.Model):
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    code = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=50, default="pending")#(approved, rejected, under_review, pending)
    image = models.CharField(max_length=150)
    discount = models.IntegerField()
    is_used = models.BooleanField(default=False)


class Student(models.Model):
    user_id = models.ForeignKey(UserInfo, on_delete=models.CASCADE)
    favorite_offer = models.ManyToManyField(Offer)


class Enquiry(models.Model):
    offer_id = models.ForeignKey(Offer, on_delete=models.CASCADE)
    message = models.TextField()
    start_date = models.DateField(auto_now=True)
    end_date = models.DateField(auto_now=True)
    enquiry_by = models.ForeignKey(UserInfo, on_delete=models.CASCADE)


class Reply(models.Model):
    enquiry_id = models.ForeignKey(Enquiry, on_delete=models.CASCADE)
    message = models.TextField()
    start_date = models.DateField(auto_now=True)
    end_date = models.DateField(auto_now=True)
    reply_by = models.ForeignKey(UserInfo, on_delete=models.CASCADE)


class BookingInfo(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    flight = models.ForeignKey(Flight, on_delete=models.CASCADE)
    offer_applied = models.BooleanField(default=False)
    offer = models.ForeignKey(Offer, on_delete=models.CASCADE, blank=True, null=True)
    price = models.IntegerField()
    status = models.BooleanField(default=True)#(True if booked, False if cancelled)
    total_passenger = models.IntegerField()
    booked_on = models.DateField()