 window.onload = function() {
    var today = new Date().toISOString().split('T')[0];
    $('[type="date"]').attr('min', today);

    thisele = this
    $.ajax({
        url: "http://127.0.0.1:8000/offers/get_list",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            thisele.loadOffersTable(JSON.parse(res));
            new DataTable('#offers-table');
        }
    });
    
}

function refreshOfferTable(){
    $.ajax({
        url: "http://127.0.0.1:8000/offers/get_list",
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            loadOffersTable(JSON.parse(res));
        }
    });
}


offer_id = 0

function delete_offer(){
    id = offer_id
    $.ajax({
        url: "http://127.0.0.1:8000/offers/delete_offer/"+id,
        type: 'GET',
        dataType: 'json', // added data type
        success: function(res) {
            refreshOfferTable()
        }
    });
}


/*Function to search the flight */
function searchFlight() {
    if(document.getElementById('from').value == ''){
        document.getElementById('from').classList.add("red");
       return;
    }else{
        document.getElementById('from').classList.remove("red");
    }

    if(document.getElementById('to').value == ''){
        document.getElementById('to').classList.add("red");
       return;
    }else{
        document.getElementById('to').classList.remove("red");
    }

    if(document.getElementById('class').value == ''){
        document.getElementById('class').classList.add("red");
       return;
    }else{
        document.getElementById('class').classList.remove("red");
    }

    if(document.getElementById('passengerCount').value == ''){
        document.getElementById('passengerCount').classList.add("red");
       return;
    }else{
        document.getElementById('passengerCount').classList.remove("red");
    }
    // var rows = [{
    //     sno: "1",
    //     flightNo: "ZHDY344",
    //     flightName: "Indigo",
    //     departure: "14:30",
    //     arrival: "22:30",
    //     travelTime: "8 Hr",
    //     fare: "Rs. 12589/-",
    // },
    // {
    //     sno: "1",
    //     flightNo: "BHDI1233",
    //     flightName: "Air Asia",
    //     departure: "00:30",
    //     arrival: "03:30",
    //     travelTime: "3 Hr",
    //     fare: "Rs. 4589/-",
    // }, {
    //     sno: "1",
    //     flightNo: "DSDH3234",
    //     flightName: "Emrites",
    //     departure: "04:30",
    //     arrival: "22:30",
    //     travelTime: "12 Hr",
    //     fare: "Rs. 26789/-",
    // }];
    var data = new FormData($('#find_flight')[0]);
    csrfToken = $('[name="csrfmiddlewaretoken"]').val()
    $.ajax({
        url: 'http://127.0.0.1:8000/get_flight/',
        type: 'POST',
        data: data,
        dataType: 'json',
        processData: false, // Prevents jQuery from automatically processing the data
        contentType: false, // Prevents jQuery from automatically setting the content type
        beforeSend: function(xhr, settings) {
            // Set the CSRF token header
            xhr.setRequestHeader("X-CSRFToken", csrfToken);
        },
        success: function(res) {
            rows = JSON.parse(res)
            console.log(rows)
            var html = "<table class='table table-striped flight-table w-75 m-auto'><thead><tr><th scope='col'>S.No</th><th scope='col'>Flight #</th><th scope='col'>Flight Name</th><th scope='col'>Departure</th><th scope='col'>Arrival</th><th scope='col'>Fare/Person</th><th scope='col'>Select</th></tr></thead><tbody>";
            if(rows){
                for (var i = 0; i < rows.length; i++) {
                    html += "<tr>";
                    html += "<th scope='row'>" + parseInt(parseInt(i)+1) + "</td>";
                    html += "<td>" + rows[i].fields.flight_code + "</td>";
                    html += "<td>" + rows[i].fields.name + "</td>";
                    html += "<td>" + rows[i].fields.departure + "</td>";
                    html += "<td>" + rows[i].fields.arrival + "</td>";
                    html += "<td>" + rows[i].fields.fare + "</td>";
                    html += "<td><button onclick='entercode(" + rows[i].pk + ")' class='confirm-booking-btn'>Book </button></td>";
                    html += "</tr>";
                }
            }

            html += "<tbody></table>";
            document.getElementById("search-data").innerHTML = html;
            new DataTable('#flight-table')
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
}

function entercode(flight_id){
    $("#codeModal").show()
    $(".flight_id").val(flight_id)
}

function applycode(){
    $("#codeModal").hide()
    showConfirmation($(".flight_id").val(),$(".offer_code").val())
}

/*Function to show confirmation on booking*/
function showConfirmation(flight_id, code) {
    var data = new FormData($('#find_flight')[0]);
    data.append('flight_id',flight_id)
    data.append('code',code)
    csrfToken = $('[name="csrfmiddlewaretoken"]').val()
    $.ajax({
        url: 'http://127.0.0.1:8000/flight/',
        type: 'POST',
        data: data,
        dataType: 'json',
        processData: false, // Prevents jQuery from automatically processing the data
        contentType: false, // Prevents jQuery from automatically setting the content type
        beforeSend: function(xhr, settings) {
            // Set the CSRF token header
            xhr.setRequestHeader("X-CSRFToken", csrfToken);
        },
        success: function(res) {
            if (res.status == 200){
                var confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"), {});
                confirmationModal.show();
            }
            else{
                alert(res.message)
            }
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
    
}

/*Function to show the signin modal */
function signIn() {
    var signInModal = new bootstrap.Modal(document.getElementById("signInModal"), {});
    signInModal.show();
}

/*Function to validate the signin */
function validateSignIn() {

    var signInModal = document.getElementById('signInModal');
    var modal = bootstrap.Modal.getInstance(signInModal)
    modal.hide();

    localStorage.setItem("isLogged", true);
    this.onLoadFunction();
}

/*On Load Function */
function onLoadFunction() {
    if (localStorage.getItem("isLogged") === 'true') {
        document.getElementById("signOutBtn").style.visibility = "visible";
        document.getElementById("myBookings").style.visibility = "visible";
        document.getElementById("signInBtn").style.visibility = "hidden";
    } else {
        document.getElementById("signOutBtn").style.visibility = "hidden";
        document.getElementById("myBookings").style.visibility = "hidden";
        document.getElementById("signInBtn").style.visibility = "visible";
    }
}

/*Function to signout */
function singOut(){
    localStorage.setItem("isLogged", false);
    this.onLoadFunction();
}


function login(){
    if(document.getElementById("adminUser").checked){
        window.open("../html/admin.html");
    }else{
        window.open("../html/sales.html");
    }
}

function signOutAdminSales(){
    window.open("../html/login.html","_self");
}


var offersList = [{
    sno: "1",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "LIVE"
}, {
    sno: "2",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "PENDING"
}, {
    sno: "3",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "LIVE"
}, {
    sno: "4",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "LIVE"
}, {
    sno: "5",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "LIVE"
}, {
    sno: "6",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "LIVE"
}, {
    sno: "7",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "LIVE"
}, {
    sno: "8",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "PENDING"
}, {
    sno: "6",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "LIVE"
}, {
    sno: "7",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "PENDING"
}, {
    sno: "8",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "PENDING"
}];

function loadOffersTable(olist) {
    document.getElementById("offer-section-heading").innerHTML = "OFFERS";
    var html = "<table id='offers-table' class='table table-striped' style='width:100%'>";
    html += "<thead><tr><th>S.No</th><th>Poster</th><th>Offer Desc</th><th>Start Dt</th><th>End Dt</th><th>Offer Code</th><th>Discount</th>"
    if (user_type == 'Moderator' || user_type == 'Sales'){
        html += "<th>Status</th><th>Actions</th>"
    }
     if (user_type == 'Student' ){
        html += "<th>Mark as favourite</th>";
     }
    html += "</tr></thead>"
    for (var i = 0; i < olist.length; i++) {
        html += "<tr class="+ parseInt(olist[i].pk)+">";
        html += "<th scope='row'>" + parseInt(parseInt(i)+1) + "</td>";
        html += "<td><img width = '50' src='" + olist[i].fields.image + "'></td>";
        html += "<td>" + olist[i].fields.description + "</td>";
        html += "<td>" + olist[i].fields.start_date + "</td>";
        html += "<td>" + olist[i].fields.end_date + "</td>";
        html += "<td>" + olist[i].fields.code + "</td>";
        html += "<td>" + olist[i].fields.discount + "</td>";

        if (user_type == 'Moderator' || user_type == 'Sales'){
            if( olist[i].fields.status == 'approved'){
                html += "<td><span class='chips green'>"+ olist[i].fields.status +"</span></td>";
            }else{
                html += "<td><span class='chips orange'>"+ olist[i].fields.status +"</span></td>";
            }
            html += "<td class='action-icons'></i> <i class='bi bi-pencil' onclick='showOfferDetailsModal("+olist[i].pk+")'></i><i class='bi bi-trash-fill' onclick='deleteModal("+olist[i].pk+")'></i>";
            if (user_type == 'Moderator'){
                html += "<a onclick =update_offer('/"+ parseInt(olist[i].pk)+"/approved" +"') >Approve</a><a onclick=update_offer('/"+ parseInt(olist[i].pk)+"/rejected" +"') > Reject</a></td>"
            }
            if(user_type == 'Sales' && olist[i].fields.status != 'approved' && olist[i].fields.status != 'under_review'){
                html += "<a class='active' onclick=update_offer('/"+ parseInt(olist[i].pk)+"/under_review" +"') >Send for Approval</a></td>"
            }
        }
         if (user_type == 'Student' ){
                html += "<td><span class='chips green' onclick = mark_as_favourite("+ parseInt(olist[i].pk)+")>Mark as favorite</span><span class='chips green m-2' onclick = enquiryModalOpen("+ parseInt(olist[i].pk)+")>Send Enquiry</span></td>";
         }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("offers-section").innerHTML = html;
    new DataTable('#offers-table');
}

function addreply(id){
    $(".enquiry_id").val(id)
    $("#replyModal").show()
}

function sendreply(){
        var data = new FormData($('#reply_form')[0]);
        csrfToken = $('[name="csrfmiddlewaretoken"]').val()
        $.ajax({
            url: 'http://127.0.0.1:8000/querydetail/'+$(".enquiry_id").val(),
            type: 'POST',
            data: data,
            dataType: 'json',
            processData: false, // Prevents jQuery from automatically processing the data
            contentType: false, // Prevents jQuery from automatically setting the content type
            beforeSend: function(xhr, settings) {
                // Set the CSRF token header
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            },
            success: function(res) {
                // Handle success, maybe update the DataTable here
                refreshOfferTable()
                 $("#replyModal").hide()
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(error);
            }
        });

    }

function enquiryModalOpen(id){
    $(".offer_id").val(id)
    $("#enquiryModal").show()
}

function sendenquiry(){
        var data = new FormData($('#query_form')[0]);
        csrfToken = $('[name="csrfmiddlewaretoken"]').val()
        $.ajax({
            url: 'http://127.0.0.1:8000/query/',
            type: 'POST',
            data: data,
            dataType: 'json',
            processData: false, // Prevents jQuery from automatically processing the data
            contentType: false, // Prevents jQuery from automatically setting the content type
            beforeSend: function(xhr, settings) {
                // Set the CSRF token header
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            },
            success: function(res) {
                // Handle success, maybe update the DataTable here
                refreshOfferTable()
                 $("#enquiryModal").hide()
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(error);
            }
        });

    }


function mark_as_favourite(id){
    $.ajax({
        url: 'http://127.0.0.1:8000/offers/favourite/'+id,
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            refreshOfferTable()
        },
        error: function(xhr, status, error) {
            // Handle error
            console.error(error);
        }
    });
}

function update_offer(url=null){
    if (url){
        $.ajax({
            url: 'http://127.0.0.1:8000/offers'+url,
            type: 'GET',
            dataType: 'json', // added data type
            success: function(res) {
                refreshOfferTable()
                $("#offer-details-Modal").hide()
            }
        });
    }
    else{
        var data = new FormData($('#update-form')[0]);
        id = offer_id
        csrfToken = $('[name="csrfmiddlewaretoken"]').val()
        $.ajax({
            url: 'http://127.0.0.1:8000/offers/update_offer/'+id,
            type: 'POST',
            data: data,
            dataType: 'json',
            processData: false, // Prevents jQuery from automatically processing the data
            contentType: false, // Prevents jQuery from automatically setting the content type
            beforeSend: function(xhr, settings) {
                // Set the CSRF token header
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            },
            success: function(res) {
                // Handle success, maybe update the DataTable here
                refreshOfferTable()
            },
            error: function(xhr, status, error) {
                // Handle error
                console.error(error);
            }
        });

    }
}


function showOfferDetailsModal(id) {
    offer_id = id
    data = $('#offers-table tr.'+id)
    $("#offer-desc").val(data.find("td:eq(1)").text().trim())
    $("#offerCode").val(data.find("td:eq(5)").text().trim())
    $("#startdate").val(data.find("td:eq(2)").text().trim())
    $("#endDate").val(data.find("td:eq(3)").text().trim())
    var offerDetailsModal = new bootstrap.Modal(document.getElementById("offer-details-Modal"), {});
    offerDetailsModal.show();
}

function closeOfferDtlsModal() {
    var offerDetailsModal = document.getElementById('offer-details-Modal');
    var modal = bootstrap.Modal.getInstance(offerDetailsModal)
    modal.hide();
}


var offersListRejExp = [{
    sno: "1",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers 1",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "REJECTED",
    reason: "No proper Data"
}, {
    sno: "2",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers 2",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "REJECTED",
    reason: "No proper Data"
}, {
    sno: "3",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers 3",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "EXPIRED",
    reason: "Expired"
}, {
    sno: "4",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers 4",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "EXPIRED",
    reason: "Expired"
}, {
    sno: "5",
    offerImg: "../img/about-us1.jpg",
    offerDesc: "Student Offers 5",
    offerStartDt: "01-08-2023",
    offerEndDt: "22-08-2023",
    OfferCode: "ABCUDI",
    TotatDiscount: "Rs. 12589/-",
    status: "EXPIRED",
    reason: "Expired"
}];

function showExpRejOffers(){
    document.getElementById("offer-section-heading").innerHTML = "EXPIRED/REJECTED OFFERS";
    var html = "<table id='offers-table' class='table table-striped' style='width:100%'>";
    html += "<thead><tr><th>S.No</th><th>Poster</th><th>Offer Desc</th><th>Start Dt</th><th>End Dt</th><th>Offer Code</th><th>Discount</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead>"
    for (var i = 0; i < offersListRejExp.length; i++) {
        html += "<tr>";
        html += "<th scope='row'>" + offersListRejExp[i].sno + "</td>";
        html += "<td><img width = '50' src=" + offersListRejExp[i].offerImg + "></td>";
        html += "<td>" + offersListRejExp[i].offerDesc + "</td>";
        html += "<td>" + offersListRejExp[i].offerStartDt + "</td>";
        html += "<td>" + offersListRejExp[i].offerEndDt + "</td>";
        html += "<td>" + offersListRejExp[i].OfferCode + "</td>";
        html += "<td>" + offersListRejExp[i].TotatDiscount + "</td>";
        html += "<td>" + offersListRejExp[i].reason + "</td>";
        
        if( offersListRejExp[i].status == 'REJECTED'){
            html += "<td><span class='chips red'>"+ offersListRejExp[i].status +"</span></td>";
        }else{
            html += "<td><span class='chips black'>"+ offersListRejExp[i].status +"</span></td>";
        }
        html += "<td class='action-icons'></i> <i class='bi bi-pencil' onclick='showOfferDetailsModal()'></i><i class='bi bi-trash-fill' onclick='deleteModal()'></i></td>";
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById("offers-section").innerHTML = html;
    new DataTable('#offers-table');
}



function deleteModal(id) {
    offer_id = id
    var deleteModal = new bootstrap.Modal(document.getElementById("delete-Modal"), {});
    deleteModal.show();
}

function closdeleteModal() {
    var deleteModal = document.getElementById('delete-Modal');
    var modal = bootstrap.Modal.getInstance(deleteModal)
    modal.hide();
}