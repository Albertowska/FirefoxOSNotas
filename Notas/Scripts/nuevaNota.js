(function () {
	checksession();
	var pattern=/Mozilla\/[5-9]\.[0-9] \(Mobile; rv:[1-9][0-9]\.[0-9]\) Gecko\/[1-9][0-9]\.[0-9] Firefox\/[1-9][0-9]\.[0-9]/
	var firefoxOS = pattern.test(navigator.userAgent);
	var imagenModificada = "false";
	if(localStorage.titulo !== undefined){
		$("#titulo").val(localStorage.titulo);
	}
	if(localStorage.contenido !== undefined){
		$("#contenido").val(localStorage.contenido);
	}
	//Imagen existente
	if(localStorage.imagen !== undefined){
			$("#addimage").css("display","none");
			$("#imagenContenedor").show();
			var img = $("<img src=\""+localStorage.imagen+"\" id=\"imagenTemporal\"></img>");
		    img.appendTo("#imagenContenedor");
			img.css("width","50%");
			img.css("float","left");
			img.css("display","block");
			img.css("height", img.width()+"px");
			// Boton de borrar imagen
			var buttonRemove = $("<button id=\"botonBorrar\" type=\"button\">Borrar Imagen</button>");
			// Si es FirefoxOS o no mostrar el boton o el input
			buttonRemove.click(function() {
				imagenModificada = "true";
		   		$("#imagenContenedor").html("");
		   		$("#addimage").css("display","block");
		   		if(!firefoxOS){
					$("#file").replaceWith("<input type=\"file\" id=\"file\" name=\"file\" accept=\"image\/*\" style=\"display:none\">");
					document.getElementById('file').addEventListener('change', handleFileSelect, false);
				}
			});
			// Boton de cambiar imagen (cambia comportamiento segun Firefox o NO)
			var buttonChange = $("<button id=\"botonCambiar\" type=\"button\">Cambiar Imagen</button>");
			if(firefoxOS){
				buttonChange.click(cambiarImagen);
			} else{
				buttonChange.click(function(e) {
					$("#file").click();
				});
			}
			//Añadir Botones
			buttonRemove.appendTo("#imagenContenedor");
			buttonRemove.css("width","40%");
			buttonRemove.css("float","left");
			buttonRemove.css("display","block");
			buttonRemove.css("margin-bottom","10px");
			buttonRemove.css("margin-left","5%");
			buttonChange.appendTo("#imagenContenedor");
			buttonChange.css("width","40%");
			buttonChange.css("float","left");
			buttonChange.css("display","block");
			buttonChange.css("margin-left","5%");
	}else{
		$("#addimage").css("display","block");
	}

	if(localStorage.lat !== undefined){
		$("#ubicacion").html("<b>LAT:</b> "+parseFloat(localStorage.lat).toFixed(4)+", <b>LONG:</b> "+parseFloat(localStorage.lng).toFixed(4)); 
	}

	var blobImagen, blobUrl;
    $("#addimage").click(annadirImagen);
    $("#ubicacion").click(function(){
    	localStorage.titulo=$("#titulo").val();
    	localStorage.contenido=$("#contenido").val();
    	if($("#imagenTemporal").length>0){
    		localStorage.imagen=$("#imagenTemporal").attr("src");
    	}
    	localStorage.page="nuevaNota.html";
    	location.href="mapa.html";
    });


    // Mostrar imagen en pequeño (si no es FirefoxOS)
    function handleFileSelect(evt) {
    	imagenModificada = "true";
	    var files = evt.target.files; // FileList object

	    // Loop through the FileList and render image files as thumbnails.
	    for (var i = 0, f; f = files[i]; i++) {

		    // Only process image files.
		    if (!f.type.match('image.*')) {
		     	alert("Archivo erroneo");
		     	continue;
		    }

		    var reader = new FileReader();

		    // Closure to capture the file information.
		    reader.onload = (function(theFile) {
		        return function(e) {
		          	// Render thumbnail
		          	if($("#imagenTemporal").length>0){
		          		$("#imagenTemporal").attr("src",e.target.result);
		          	} else{
						var img = $("<img src=\""+e.target.result+"\" id=\"imagenTemporal\"></img>");
						$("#imagenContenedor").show();
		          		$("#addimage").hide();
			   			img.appendTo("#imagenContenedor");
			   			img.css("width","50%");
			   			img.css("max-width", "200px");
						img.css("float","left");
						img.css("display","block");
						img.css("height", img.width()+"px");
						// Boton de borrar imagen
						var buttonRemove = $("<button id=\"botonBorrar\" type=\"button\">Borrar Imagen</button>");
						// Si es FirefoxOS o no mostrat el boton o el input
						buttonRemove.click(function() {
							$("#addimage").css("display","block");
					   		$("#imagenContenedor").html("");
							$("#file").replaceWith("<input type=\"file\" id=\"file\" name=\"file\" accept=\"image\/*\" style=\"display:none\">");
							document.getElementById('file').addEventListener('change', handleFileSelect, false);
						});
						// Boton de cambiar imagen (cambia comportamiento segun Firefox o NO)
						var buttonChange = $("<button id=\"botonCambiar\" type=\"button\">Cambiar Imagen</button>");
						buttonChange.click(function(e) {
							$("#file").click();
						});
						//Añadir Botones
						buttonRemove.appendTo("#imagenContenedor");
						buttonRemove.css("width","40%");
						buttonRemove.css("max-width", "200px");
						buttonRemove.css("float","left");
						buttonRemove.css("display","block");
						buttonRemove.css("margin-bottom","10px");
						buttonRemove.css("margin-left","5%");
						buttonChange.appendTo("#imagenContenedor");
						buttonChange.css("width","40%");
						buttonChange.css("max-width", "200px");
						buttonChange.css("float","left");
						buttonChange.css("display","block");
						buttonChange.css("margin-left","5%");		          		
		          	}
		        };
		    })(f);

		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		}
	}
  	document.getElementById('file').addEventListener('change', handleFileSelect, false);
	
	//Subir formulario
	$("#guardarNota").click(function(){
		if(($("#formularioNota")[0]).length >0) { 
			var formData = new FormData($("#formularioNota")[0]);
			if(localStorage.notasID != undefined){
				formData.append("id", localStorage.notasID);
			}
			formData.append("modif", imagenModificada);
			if(blobImagen){
				formData.append("file", blobImagen);
				formData.append("blobName", blobUrl);
			}else{
				formData.append("file", $("file")[0]);
			}
			if(localStorage.lat !== undefined){
				formData.append("lat", localStorage.lat);
				formData.append("lng", localStorage.lng);
			}
			$.ajax({
				url: "PHP/nuevaNota.php",
				type: 'POST',
				async: false,
				beforeSend: null,
				success: function(d){
					if(d==1){ location.href="inicio.html"; }
				},
				error: function(e){
					alert("Error:" + e);
				},
				data: formData,
				contentType: false,
				processData: false
			});
		} else {
			alert("Campos incorrectos.");
		}
	});


	window.addEventListener("resize", function(e) {
		var anchura = $("#imagenTemporal").width();
		if(anchura){
			$("#imagenTemporal").css("height",anchura+"px");
		}
	});

	// Solo en firefox OS, evitar comprobaciones
	function annadirImagen() {
		if(firefoxOS){
			imagenModificada = "true";
		    var pick = new MozActivity({
		        name: "pick",
		        data: {
		            type: ["image/*"]
		        }
		    });

		    pick.onsuccess = function () {
				blobImagen = this.result.blob;
				blobUrl = window.URL.createObjectURL(blobImagen);
				var img = $("<img src=\""+blobUrl+"\" id=\"imagenTemporal\"></img>");
				$("#imagenContenedor").show();
			    img.appendTo("#imagenContenedor");
				img.css("width","50%");
				img.css("float","left");
				img.css("display","block");
				img.css("height", img.width()+"px");
				var buttonRemove = $("<button id=\"botonBorrar\" type=\"button\">Borrar Imagen</button>");
				buttonRemove.click(function() {
			   		$("#imagenContenedor").html("");
			   		$("#addimage").css("display","block");
			   		blobImagen = "";
				});
				var buttonChange = $("<button id=\"botonCambiar\" type=\"button\">Cambiar Imagen</button>");
				buttonChange.click(cambiarImagen);
				buttonRemove.appendTo("#imagenContenedor");
				buttonRemove.css("width","40%");
				buttonRemove.css("float","left");
				buttonRemove.css("display","block");
				buttonRemove.css("margin-bottom","10px");
				buttonRemove.css("margin-left","5%");
				buttonChange.appendTo("#imagenContenedor");
				buttonChange.css("width","40%");
				buttonChange.css("float","left");
				buttonChange.css("display","block");
				buttonChange.css("margin-left","5%");
				$("#addimage").css("display","none");
		    };

		    pick.onerror = function () {
		        alert("Can't view the image!");
		    };
		}else{
			$("#file").click();
		}
	}

	function cambiarImagen() {
		imagenModificada = "true";
	 	var pick = new MozActivity({
	        name: "pick",
	        data: {
	            type: ["image/png", "image/jpg", "image/jpeg"]
	        }
	    });

	    pick.onsuccess = function () {
			blobImagen = this.result.blob;
			blobUrl = window.URL.createObjectURL(blobImagen);
			$("#imagenTemporal").attr("src",blobUrl);
	    };

	    pick.onerror = function () {
	        alert("Can't view the image!");
	    };
	}

})();