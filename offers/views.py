from django.shortcuts import render, redirect
from .models import *
from django.http import JsonResponse
import json
import uuid
from django.conf import settings
import os
from django.core.files.storage import FileSystemStorage
from django.core.serializers import serialize
from django.db.models import Count


def offer(request):
    return render(request, 'index.html')


def get_offer_list(request):
    offers = Offer.objects.all()
    if request.user.userinfo_set.all()[0].user_type == 'Student':
        offers = offers.filter(status='approved', is_used=False).annotate(is_favourite=Count('student'))
        # offers.filter(status='approved', is_used=False)[0].student_set.all().filter(user_id=request.user.userinfo_set.all()[0])
    data = serialize("json", offers)
    return JsonResponse(data, safe=False)


def update_status(request, id, status):
    offer = Offer.objects.get(id=id)
    offer.status = status
    offer.save()
    data = {"status": 200, "message": "data updated"}
    return JsonResponse(data, safe=False)


def post_offer(request):
    if request.method == "POST":
        image = request.FILES['image']
        discount = request.POST['discount']
        description = request.POST['description']
        end_date = request.POST['end_date']
        start_date = request.POST['start_date']
        base_url = request.scheme + "://" + request.get_host()
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save(image.name, image)
        url = base_url + '/media/' + filename
        Offer.objects.create(discount=discount, image=url, end_date=end_date, start_date=start_date,
                             code=uuid.uuid4(), description=description)
        return redirect('offer')
    return render(request, 'offer.html')


def update_offer(request, id):
    if request.method == "POST":
        image = request.FILES['image']
        discount = request.POST['discount']
        description = request.POST['description']
        end_date = request.POST['end_date']
        start_date = request.POST['start_date']
        base_url = request.scheme + "://" + request.get_host()
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save(image.name, image)
        url = base_url + '/media/' + filename
        offer = Offer.objects.get(id=id)
        offer.discount = discount
        offer.image = url
        offer.end_date = end_date
        offer.start_date = start_date
        offer.description = description
        offer.save()
    data = {"message": 'offer updated'}
    return JsonResponse(data, safe=False)


def delete_offer(request, offer_id):
    Offer.objects.get(id=offer_id).delete()
    data = {"status": 200, "message": "data deleted"}
    return JsonResponse(data, safe=False)


def favourite_offer(request, id):
    offer = Offer.objects.get(id=id)
    student= Student.objects.create(user_id =request.user.userinfo_set.all()[0])
    student.favorite_offer.add(offer)
    student.save()
    data = {"status": 200, "message": "data updated"}
    return JsonResponse(data, safe=False)
