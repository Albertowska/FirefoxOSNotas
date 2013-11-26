(function() {
    checksession();
    if(localStorage.notasID == undefined){
        alert("No se ha seleccionado ninguna nota");
        location.href="inicio.html";
    }
    var marker;
    var map;

    $("#map-canvas").css("height",$(window).height()-86+"px");
    $("body").css("height",$(window).height()-40+"px");

    $("#cerrar").click(function(){
        $("#nota-informativa").hide();
        $("#map-canvas").css("height",$(window).height()-40+"px");
    });

    $("#addPosition").click(function(){
        if(marker && localStorage.notasID){
            localStorage.lat = marker.getPosition().lat();
            localStorage.lng = marker.getPosition().lng();
            if(localStorage.page=="inicio.html"){
                $.ajax({
                    url: "PHP/mapa.php",
                    type: 'POST',
                    async: false,
                    beforeSend: null,
                    data: {id: localStorage.notasID, lat: marker.getPosition().lat(), lng: marker.getPosition().lng(), type: "insert"},
                    success: function(d){
                        //alert(d);
                        location.href="inicio.html";
                    },
                    error: function(xhr, err){
                        if(xhr.status != 0){
                            alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status+"\nresponseText: "+xhr.responseText);
                        }
                    }
                });
            }else{
                location.href=localStorage.page;
            }
        }
    });

    if(localStorage.lat != undefined && localStorage.lng != undefined){
        initialize(15, localStorage.lat, localStorage.lng);
        placeMarker(new google.maps.LatLng(localStorage.lat, localStorage.lng),map);
        informeBorrar();
    } else{
        initialize(5, 40, 0);
        navigator.geolocation.getCurrentPosition(geo_success, geo_error, {enableHighAccuracy:true, maximumAge:30000, timeout:10000});
    }
    
    window.addEventListener("resize", function(e) {
        if(marker){
            map.panTo(marker.getPosition());
        }
        if($("#nota-informativa").css("display")=="none"){
            $("#map-canvas").css("height",$(window).height()-40+"px");
        }else{
            $("#map-canvas").css("height",$(window).height()-86+"px");
        }
    });

    function geo_success(position){
        initialize(15, position.coords.latitude, position.coords.longitude);
    }

    function initialize(zoom, lat, lng){
        var mapOptions = {
            zoom: zoom,
            center: new google.maps.LatLng(lat,lng),
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);

        google.maps.event.addListener(map, 'click', function(e) {
            if(marker != undefined){
                marker.setMap(null);
            }else{
                informeBorrar();
            }
            placeMarker(e.latLng, map);
        });
    }

    function geo_error(error){
        var message = "";
        switch (error.code) {
            case 0:
                message = "Something went wrong: " + error.message;
                break;
            case 1:
                message = "You denied permission to this page to retrieve a location.";
                break;
            case 2:
                message = "The browser was unable to determine a location: " + error.message;
                break;
            case 3:
                message = "The browser timed out before retrieving the location.";
                break;
        }
        alert(message);
    }

    function placeMarker(position, map) {
        marker = new google.maps.Marker({
            position: position,
            map: map
        });
        google.maps.event.addListener(marker, 'click', function() {
            bootbox.confirm("¿Realmente desea eliminar la ubicación seleccionada?", function(result) {
                if(result){
                   marker.setMap(null);
                   marker = undefined;
                   $.ajax({
                        url: "PHP/mapa.php",
                        type: 'POST',
                        async: false,
                        beforeSend: null,
                        data: {id: localStorage.notasID, type: "delete"},
                        success: function(d){
                            //alert(d);
                            localStorage.removeItem("lat");
                            localStorage.removeItem("lng");
                        },
                        error: function(xhr, err){
                            if(xhr.status != 0){
                                alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status+"\nresponseText: "+xhr.responseText);
                            }
                        }
                    });
                }
            });
        });
        map.panTo(position);
    }

    function informeBorrar(){
        $("#nota-informativa").html("<a id=\"cerrar\" href=\"#\"><i id=\"cerrar2\" class=\"icon-remove\"></i></a>\
                <p>Para eliminar una ubicación, pulse sobre ella o seleccione otra diferente.<p>");
        $("#nota-informativa").show();
        $("#map-canvas").css("height",$(window).height()-86+"px");
        $("#cerrar").click(function(){
            $("#nota-informativa").hide();
            $("#map-canvas").css("height",$(window).height()-40+"px");
        });
    }
})();