(function () {
	checksession();
	var blobImagen;
    $("#addimage").click(annadirImagen);
	
	var guardar = document.querySelector("#guardarNota");
	if (guardar) {
        guardar.onclick = function () {
        	// Si se envia la imagen a la vez que el formulario falla
			$("#formularioNota").submit();
		}
	}

	window.addEventListener("resize", function(e) {
		var anchura = $("#imagenTemporal").width();
		if(anchura){
			$("#imagenTemporal").css("height",anchura+"px");
		}
	});

function annadirImagen() {
    var pick = new MozActivity({
        name: "pick",
        data: {
            type: ["image/png", "image/jpg", "image/jpeg"]
        }
    });

    pick.onsuccess = function () {
		blobImagen = this.result.blob;
		var blobUrl = window.URL.createObjectURL(blobImagen);
		var img = $("<img src=\""+blobUrl+"\" id=\"imagenTemporal\"></img>");
	    img.appendTo("#imagenContenedor");
		img.css("width","45%");
		img.css("float","left");
		img.css("display","block");
		img.css("height", img.width()+"px");
		var buttonRemove = $("<button id=\"botonBorrar\" type=\"button\">Borrar Imagen</button>");
		buttonRemove.click(function() {
	   		$("#imagenContenedor").html("");
	   		$("#addimage").css("display","block");
		});
		var buttonChange = $("<button id=\"botonCambiar\" type=\"button\">Cambiar Imagen</button>");
		buttonChange.click(cambiarImagen);
		buttonRemove.appendTo("#imagenContenedor");
		buttonRemove.css("width","45%");
		buttonRemove.css("float","left");
		buttonRemove.css("display","block");
		buttonRemove.css("margin-bottom","10px");
		buttonRemove.css("margin-left","5%");
		buttonChange.appendTo("#imagenContenedor");
		buttonChange.css("width","45%");
		buttonChange.css("float","left");
		buttonChange.css("display","block");
		buttonChange.css("margin-left","5%");
		$("#addimage").css("display","none");
		var input = $("<input>").attr("type", "hidden").attr("name", "formImg").attr("id","formImg").val(blobUrl.substr(5));
		$("#formularioNota").append($(input));
		enviarImagen();
    };

    pick.onerror = function () {
        alert("Can't view the image!");
    };
}

function cambiarImagen() {
 	var pick = new MozActivity({
        name: "pick",
        data: {
            type: ["image/png", "image/jpg", "image/jpeg"]
        }
    });

    pick.onsuccess = function () {
		blobImagen = this.result.blob;
		var blobUrl = window.URL.createObjectURL(blobImagen);
		$("#imagenTemporal").attr("src",blobUrl);
		$("#formImg").val(blobUrl.substr(5));
		enviarImagen();
    };

    pick.onerror = function () {
        alert("Can't view the image!");
    };
}

function enviarImagen(){
    var http = new XMLHttpRequest();
    var url = "http://www.firefox.hol.es/fotoTemporal.php";
	http.open("POST", url, true);
	http.overrideMimeType('text/plain; charset=x-user-defined-binary');
	http.setRequestHeader("Content-length", blobImagen.size);

	var reader = new FileReader();
	reader.addEventListener("loadend", function() {
		http.sendAsBinary(reader.result);
	});
	reader.readAsBinaryString(blobImagen);
}

})();