(function () {
	checksession();
	$.ajax({
		url: 'http://www.firefoxos.hol.es/notas.php',
		type: 'get',
		data: '',
		dataType: 'json',
		success: function(data){
			$('#cuerpoNotas').empty();
			$('#cuerpoNotas').show();
			$.each(data, function(index, element) {
				var nota ="";
				var titulo = element.titulo.replace(" ","-");
				if(element.imagen){
					nota = "<div class=\"row-fluid nota\" id=\"nota-"+titulo+"\"><div class=\"span3\" style=\"text-align: center; margin-left: 3%;\">\
						<img id=\"image\" class=\"imagen\" src=\""+element.imagen+"\" alt=\"Icono\" style=\"width:100%;\"></div>\
						<div class=\"span8\"><div class=\"titulo\">"+element.titulo+"</div>\
						<div class=\"contenido\">"+element.contenido+"</div><div class=\"botones\" id=\""+element.titulo+"\">\
						<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-time\"></i></a>\
						<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-upload\"></i></a>\
						<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-map-marker\"></i></a>\
						<a href=\"#\" class=\"borrar\" style=\"text-align: center;\"><i class=\"icon-remove\"></i></a>\
						</div></div></div>";
					
				}
				else{
					nota = "<div class=\"row-fluid nota\" id=\"nota-"+titulo+"\">\
						<div class=\"span11\" style=\"padding-left:5%\"><div class=\"titulo\">"+element.titulo+"</div>\
						<div class=\"contenido\">"+element.contenido+"</div><div class=\"botones\" id=\""+element.titulo+"\">\
						<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-time\"></i></a>\
						<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-upload\"></i></a>\
						<a href=\"#\" style=\"text-align: center;\"><i class=\"icon-map-marker\"></i></a>\
						<a href=\"#\" class=\"borrar\" style=\"text-align: center;\"><i class=\"icon-remove\"></i></a>\
						</div></div></div>";
				}
				$('#cuerpoNotas').append(nota);
			});
			var anchura = $("#image").width(); //cambiar segun tamaño de pantalla
			if(anchura){
				$(".imagen").css("height",anchura+"px");
				$(".span8").css("height",anchura+"px");
				$(".span11").css("height",anchura+"px");
				$(".contenido").css("height",anchura-16+"px");
			}
			$(".borrar").click(function (e) {
				var tituloBorrar = this.parentNode.id;
    			bootbox.confirm("Se va a eliminar la nota <strong>"+tituloBorrar+"</strong>, así como todos los datos asociados. ¿Esta seguro que desea continuar?", function(result) {
  					if(result){
  						$.ajax({
							url: 'borrar.php',
							type: 'post',
							data: {titulo:tituloBorrar},
							success: function(data){
								tituloBorrar = "#nota-"+tituloBorrar.replace(" ", "-");
  								$(tituloBorrar).html("");
  								$(tituloBorrar).css("display", "none");
							}
  						});
  					}
  				}); 
			});
		}
	});
	
	window.addEventListener("resize", function(e) {
		var anchura = $("#image").width();
		if(anchura){
			$(".imagen").css("height",anchura+"px");
			$(".span8").css("height",anchura+"px");
			$(".span11").css("height",anchura+"px");
			$(".contenido").css("height",anchura-16+"px");
		}
	});
	
	var buscador = document.querySelector("#buscar");
	if (buscador) { 
        buscador.onclick = mensaje;
	}

	var config = document.querySelector("#configuracion");
	if (config) { 
        config.onclick = mensaje;
	}

	function mensaje() {
  		$.msgBox({
			title:"Lo sentimos",
			content: unescape("Este apartado aún no funciona.\n Estamos trabajando en ello :)"),
			autoClose:"true"
		});
	}
	
})();


