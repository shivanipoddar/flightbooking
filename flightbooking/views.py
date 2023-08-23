from django.shortcuts import render, redirect
from django.core.serializers import serialize
from authentication.models import *
from offers.models import *
from django.http import JsonResponse
from django.core.mail import send_mail


def about(request):
    return render(request, 'about.html')


def home(request):
    if request.user.is_authenticated:
        return render(request, 'home.html')
    return redirect("login")


def get_flight(request):
    if request.method == "POST":
        flight_from = request.POST['from']
        flight_to = request.POST['to']
        flight_class = request.POST['class']
        flights = Flight.objects.filter(flight_from=flight_from, flight_to=flight_to, flight_class=flight_class)
        data = serialize("json", flights)
        return JsonResponse(data, safe=False)


def flight(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            flight_id = request.POST['flight_id']
            passenger = request.POST['passenger']
            date = request.POST['date']
            code = request.POST['code']
            discount = 0
            if code:
                try:
                    offer = Offer.objects.get(code=code,status='approved')
                    offer.is_used = True
                    offer.save()
                    discount = offer.discount
                except:
                    return JsonResponse({"message": "Invalid Code", "status": 400}, safe=False)
            flight = Flight.objects.get(id=flight_id)
            price = (int(flight.fare)*int(passenger)) - int(discount)
            bookingInfo = BookingInfo.objects.create(user_id=request.user,flight=flight,price=price,total_passenger=passenger,
                                       booked_on=date)
            send_mail(
                'Your Flight ticket details',
                'Congratulation your ticket is successfully booked. Below are details of your flight:'
            + 'Journey date '+ str(date) + ' fight name ' + flight.name + ' PNR ' + str(flight.flight_pnr) + ' ammount ' + str(price)
                + ' from ' + str(flight.flight_from) + ' destination ' + str(flight.flight_to) + ' departure at '+ str(flight.departure)
                + ' arrival at '+ str(flight.arrival),
                'sushasan841@gmai.com',
                ['{}'.format(request.user.email)],
                fail_silently=False,
            )
            return JsonResponse({"message": "Flight booked", "status": 200}, safe=False)
        return render(request, 'flight.html')
    return redirect("login")


def booking(request):
    bookings = BookingInfo.objects.filter(user_id=request.user)
    return render(request, 'booking.html', context={"bookings":bookings})


def query(request):
    if request.user.is_authenticated:
        if request.method == "POST":
            offer_id = request.POST['offer_id']
            offer = Offer.objects.get(id=offer_id)
            query = request.POST['query']
            enquery = Enquiry.objects.create(message=query, enquiry_by=request.user.userinfo_set.all()[0], offer_id=offer)
            return JsonResponse({"message": "Enquiry added", "status": 200}, safe=False)
        Queries = Enquiry.objects.all()
        return render(request, 'enquiry.html', context={"Queries": Queries})
    return redirect("login")


def queryDetail(request, id):
    if request.user.is_authenticated:
        if request.method == "POST":
            query = request.POST['reply']
            enquery = Enquiry.objects.get(id=id)
            reply = Reply.objects.create(message=query, reply_by=request.user.userinfo_set.all()[0],
                                             enquiry_id=enquery)
            return JsonResponse({"message": "Reply added", "status": 200}, safe=False)
        queries = Enquiry.objects.get(id=id)
        replies = Reply.objects.filter(enquiry_id=queries)
        return render(request, 'enquirydetail.html', context={"Queries": queries, "Replies": replies})
    return redirect("login")
