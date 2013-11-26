(function () {
	var usuario = "";
	$.ajax({
        url: "PHP/session.php",
        cache: false,
        async: false,
        type: "POST",
        data: '',
        success: function(data){
            if (data == '0') {
                window.location.href = "index.html";
            }else{
            	usuario = data;
            	$("#usuario").html(usuario);
                $("#informacion").show();
            }
        },
        error: function(){
            $("#formularioLogin").effect("shake", {times:2}, 100);
        }
    });
	$("#cambiar").click(function(e){
		$("#informacion").hide();
        $("#cambiarContraseña").show();
        $("#back").click(function(){
            $("#informacion").show();
            $("#cambiarContraseña").hide();
            $("#back").click(function(){
                javascript:history.go(-1);
            });
            return false;
        });
	});
	$("#cerrar").click(function(e){
		$.ajax({
	        url: "PHP/cerrarSesion.php",
	        cache: false,
	        type: "POST",
	        data: '',
	        success: function(data){
	        	location.href="index.html";
	        },
	        error: function(){
	            alert("error interno del sistema");
       		}
    	});
	});
    size();
    window.addEventListener("resize", size);

    function size(){
        if($(window).width()>600){
            var anchura = $(window).width()*0.23+350; 
            $("#botonGuardar").css("width",anchura+"px");
        }else{
            $("#botonGuardar").css("width","95%");
        }
    }
})();