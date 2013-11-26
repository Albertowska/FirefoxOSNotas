(function () {
	checksession();
	var coordenadas = [];
	var notifActiva = [];
	if (window.webkitNotifications && window.webkitNotifications.checkPermission() === 1){
		$("#botones").show();
		$("#notificaciones").click(function(){
			webkitNotifications.requestPermission(function(){
				if(window.webkitNotifications.checkPermission()===0){
					if($("#install").css("display")=="none"){
						$("#botones").hide();
					}else{
						$("#notificaciones").hide();
					}
				}
			});
		});
	}else{
		$("#notificaciones").hide();
	}
	$.ajax({
		url: 'PHP/notas.php',
		type: 'get',
		contentType: "application/json; charset=utf-8",
		data: '',
		dataType: 'json',
		success: function(data){
			$('#cuerpoNotas').empty();
			$('#cuerpoNotas').show();
			$.each(data, function(index, element) {
				var nota ="";
				if(element.imagen){
					nota = "<div class=\"row-fluid nota\" id=\"nota-"+element.id+"\"><div class=\"span3 divEditar\" style=\"margin-left: 2%;\">\
						<img id=\"image-"+element.id+"\" class=\"imagen\" src=\""+element.imagen+"\" alt=\"Icono\" style=\"width:100%;\"></div>\
						<div class=\"span8 divEditar\"><div class=\"titulo\" id=\"titulo-"+element.id+"\">"+element.titulo+"</div>\
						<div class=\"contenido\" id=\"contenido-"+element.id+"\">"+element.contenido+"</div></div><div class=\"botones\" id=\""+element.titulo+"\">\
						"//<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-time\"></i></a>\
						+"<a href=\"#\" class=\"share\" style=\"text-align: center;\" title=\"Compartir\"><i class=\"icon-share\"></i></a>\
						<a href=\"#\" class=\"mapa\" title=\"Añadir ubicación\"><i class=\"icon-map-marker\"></i></a>\
						<a href=\"#\" class=\"borrar\" title=\"Borrar nota\"><i class=\"icon-remove\"></i></a>\
						</div></div>";
					
				}
				else{
					nota = "<div class=\"row-fluid nota\" id=\"nota-"+element.id+"\">\
						<div class=\"span11 divEditar\"><div class=\"titulo\" id=\"titulo-"+element.id+"\">"+element.titulo+"</div>\
						<div class=\"contenido2\" id=\"contenido-"+element.id+"\">"+element.contenido+"</div></div><div class=\"botones\" id=\""+element.titulo+"\">\
						"//<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-time\"></i></a>\
						+"<a href=\"#\" class=\"share\" style=\"text-align: center;\" title=\"Compartir\"><i class=\"icon-share\"></i></a>\
						<a href=\"#\" class=\"mapa\" title=\"Añadir ubicación\"><i class=\"icon-map-marker\"></i></a>\
						<a href=\"#\" class=\"borrar\" title=\"Borrar nota\"><i class=\"icon-remove\"></i></a>\
						</div></div>";
				}
				$('#cuerpoNotas').append(nota);
			});
			coordenadas = data;
			if ("geolocation" in navigator) {
				var tid = setInterval(mycode, 60000);
				mycode();
			}
			var anchura = $(window).width()*0.2056; 
			if($(window).width()>=650){
				anchura = $(window).width()*0.112;
			}		
			if(anchura){
				$(".imagen").css("height",anchura+"px");
				$(".span8").css("height",anchura+"px");
				$(".contenido").css("height",anchura-16+"px");
				$(".span11").css("height",anchura+"px");
				$(".contenido2").css("height",anchura-16+"px");
			}
			$(".borrar").click(function (e) {
				var tituloBorrar = this.parentNode.id;
				var notaID = this.parentNode.parentNode.id;
				var id = notaID.substr(5);
    			bootbox.confirm("Se va a eliminar la nota <strong>"+tituloBorrar+"</strong>, así como todos los datos asociados.\
    				 ¿Esta seguro que desea continuar?", function(result) {
  					if(result){
  						$.ajax({
							url: 'PHP/borrar.php',
							type: 'post',
							data: {id:id},
							success: function(data){
  								$("#"+notaID).remove();
  								location.reload();
							}
  						});
  						borrarLocalStorage();
  					}
  				}); 
			});
			$(".divEditar").click(function (e) {
				var notasID=this.parentNode.id.substr(5);
				localStorage.notasID=notasID;
				localStorage.titulo=$("#titulo-"+notasID).text();
				localStorage.contenido=$("#contenido-"+notasID).text();
				if($("#image-"+notasID).length>0){
					localStorage.imagen=$("#image-"+notasID).attr("src");
				} else{
					localStorage.removeItem("imagen");
				}
				buscarNota(notasID,coordenadas);
				location.href="nuevaNota.html";
			});
			$(".mapa").click(function (e) {
				var id = this.parentNode.parentNode.id.substr(5);
				buscarNota(id,coordenadas);
				localStorage.page="inicio.html";
				location.href="mapa.html";	
			});
			$(".share").click(function (e) {
				var id = this.parentNode.parentNode.id.substr(5);
				tituloCompartir = "Nota: "+$("#titulo-"+id).text();
				if($("#contenido-"+id).text()){
					contenidoCompartir = "Contenido: "+$("#contenido-"+id).text();
				}else{
					contenidoCompartir="";
				}
				if($("#image-"+id).attr("src")){
					imagenCompartir = "Imagen: http://localhost:9999/Notas/"+$("#image-"+id).attr("src");
				}else{
					imagenCompartir="";
				}
				$("#shareSelect").show();
				$("#inicio").hide();
			});
		},
        error: function(xhr, err){
        	if(xhr.status != 0){
           	 	alert("readyState: "+xhr.readyState+"\nstatus: "+xhr.status+"\nresponseText: "+xhr.responseText);
            }
        }
	});
	window.addEventListener("resize", function(e) {
		var anchura = $(window).width()*0.2056; 
		if($(window).width()>=650){
			anchura = $(window).width()*0.112;
		}		
		if(anchura){
			$(".imagen").css("height",anchura+"px");
			$(".span8").css("height",anchura+"px");
			$(".contenido").css("height",anchura-16+"px");
			$(".span11").css("height",anchura+"px");
			$(".contenido2").css("height",anchura-16+"px");			
		}
	});
	
	var buscador = document.querySelector("#buscar");
	if (buscador) { 
        buscador.onclick = mensaje;
	}

	function mensaje() {
  		$.msgBox({
			title:"Lo sentimos",
			content: unescape("Este apartado aún no funciona.\n Estamos trabajando en ello :)"),
			autoClose:"true"
		});
	}

	$("#nuevaNota").click(function(e) {
		borrarLocalStorage();
	});

	try{
		if(MozActivity){
			$("#mensajes").click(function(e) {
				//alert(tituloCompartir+" "+contenidoCompartir);
				var sms = new MozActivity({
	                name: "new", // Possible compose-sms in future versions
	                data: {
	                    type: "websms/sms",
	                    number: "",
						body: tituloCompartir+" "+contenidoCompartir
	                }
            	});
            	$("#shareSelect").hide();
				$("#inicio").show();
			});
			$("#correo").click(function(e) {
	            var createEmail = new MozActivity({
	                name: "new", // Possibly compose-mail in future versions
	                data: {
	                    type : "mail",
	                    url: "mailto:?subject="+tituloCompartir+"%20&body="+contenidoCompartir+imagenCompartir
	                }
	            });
	            $("#shareSelect").hide();
				$("#inicio").show();
			});
		}
	}
	catch(e){
		$("#mensajes").hide();
		$("#correo").click(function(e) {
			//imagenCompartir=imagenCompartir.replace(" ", "%20");
			window.location.href = "mailto:?subject="+tituloCompartir+"%20&body="+contenidoCompartir+imagenCompartir;
			$("#shareSelect").hide();
			$("#inicio").show();
		});
	}


	$("#cancel").click(function(e) {
		$("#shareSelect").hide();
		$("#inicio").show();
	});


	function borrarLocalStorage(){
		if(localStorage.titulo !== undefined){
			localStorage.removeItem("notasID");
			localStorage.removeItem("titulo");
			localStorage.removeItem("contenido");
			if(localStorage.imagen !== undefined){
				localStorage.removeItem("imagen");
			}
			if(localStorage.lat !== undefined){
				localStorage.removeItem("lat");
			}
			if(localStorage.lng !== undefined){
				localStorage.removeItem("lng");
			}
		}
	}

	function geo_success(position){
        $.each(coordenadas, function(index, element) {
        	if(element.lat != null && element.lng != null){
			    var d = distance(element.lat,element.lng,position.coords.latitude,position.coords.longitude);
			    //showNotification(element,d);
			    //alert(d+" "+element.id+" "+element.lat+" "+element.lng);
			    if(d<500 && position.coords.accuracy < 100 && jQuery.inArray(element.id,notifActiva)==-1){
	                showNotification(element, d);
	                notifActiva.push(element.id);
	           	}
	        }
	    });
    }

    function mycode() {
        navigator.geolocation.getCurrentPosition(geo_success, geo_error, {enableHighAccuracy:true, maximumAge:30000, timeout:10000});
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

    function distance(lat1,lon1,lat2,lon2) {
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2-lat1) * Math.PI / 180;
        var dLon = (lon2-lon1) * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return Math.round(d*1000);
    }

    function buscarNota(id, coordenadas){
    	var encontrada = false;
    	localStorage.notasID=id;
    	$.each(coordenadas, function(index, element) {
			if(element.id==id && element.lat != null && element.lng != null){
				localStorage.lat=element.lat;
				localStorage.lng=element.lng;
				localStorage.notasID=id;
				encontrada = true;
			}
		});
		if(!encontrada){
			if(localStorage.lat !== undefined){
				localStorage.removeItem("lat");
			}
			if(localStorage.lng !== undefined){
				localStorage.removeItem("lng");
			}
		}
		localStorage.notasID=id;
    }

    function showNotification(element, distancia) {
		// only show if we've got the correct permissions
		var titulo="Está a "+distancia+" metros de la posición marcada para la nota "+element.titulo;
		var contenido="";
		var imagen="";
		if(element.contenido){
			contenido="Cuerpo de la nota: "+element.contenido;
		}
		if(element.imagen){
			imagen=element.imagen;
		}
		if (window.webkitNotifications && window.webkitNotifications.checkPermission() === 0) {
			// note the show()
			var notification=window.webkitNotifications.createNotification(imagen, titulo, contenido);
			notification.onclick = function(){
				localStorage.lat=element.lat;
				localStorage.lng=element.lng;
				localStorage.notasID=element.id;
				localStorage.page="inicio.html";
				location.href="mapa.html";
			};
			notification.show();
		}else if(navigator.mozNotification) {
			var notification = navigator.mozNotification.createNotification(titulo,contenido,imagen);
			notification.onclick = function() {
			    localStorage.lat=element.lat;
				localStorage.lng=element.lng;
				localStorage.notasID=element.id;
				localStorage.page="inicio.html";
				location.href="mapa.html";
			};
			notification.show();
		}else if(window.Notification){
			Notification.requestPermission();
			var notification = new Notification(titulo, {
		        dir: "auto",
		        body: contenido,
		        iconUrl: imagen
     		});
     		notification.onclick = function() {
			    localStorage.lat=element.lat;
				localStorage.lng=element.lng;
				localStorage.notasID=element.id;
				localStorage.page="inicio.html";
				location.href="mapa.html";
			};
		}else{
			bootbox.dialog("Está a "+distancia+" metros de la posicion marcada para la nota <strong>"
					+element.titulo+"</strong>; "+contenido, [{
			    "label" : "Cerrar",
				}, {
			    "label" : "Ver mapa",
			    "class" : "btn-primary",
			    "callback": function() {
					localStorage.lat=element.lat;
					localStorage.lng=element.lng;
					localStorage.notasID=element.id;
					localStorage.page="inicio.html";
					location.href="mapa.html";
				}
			}]);
		}
	}
})();


