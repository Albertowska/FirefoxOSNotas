function checksession(){
	$.ajax({
        url: "http://www.firefoxos.hol.es/session.php",
        cache: false,
        type: "POST",
        data: '',
        success: function(data){
            if (data != '1') {
                window.location.href = "formulario.html";
            }
        },
        error: function(){
            $("#formularioLogin").effect("shake", {times:2}, 100);
        }
    });
}