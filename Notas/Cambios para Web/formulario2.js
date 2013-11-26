(function () {
	$.ajax({
        url: "http://www.firefoxos.hol.es/session.php",
        cache: false,
        type: "POST",
        data: '',
        success: function(data){
            if (data == '1') {
                window.location.replace("index.html");
            }else{
            	$("body").css("display","block");
            }
        },
        error: function(){
            $("#formularioLogin").effect("shake", {times:2}, 100);
        }
    });

	var registro = "<div class=\"control-group\"><label class=\"control-label\" for=\"inputEmail\">Email</label>\
	        <div class=\"controls\">\
	        <input type=\"text\" id=\"inputEmail\" placeholder=\"Email\" autocomplete=\"on\" name=\"inputEmail\"\
	        	required pattern=\"([a-zA-Z0-9_\\.\\-])+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9]{2,4})\">\
	        </div></div>\
	        <div class=\"control-group\"><label class=\"control-label\" for=\"inputPassword\">Password</label>\
	        <div class=\"controls\"><input type=\"password\" id=\"inputPassword\" placeholder=\"Password\" name=\"inputPassword\" required>\
	        </div></div><div class=\"control-group\"><label class=\"control-label\" for=\"repeatPassword\">Repeat Password</label>\
	        <div class=\"controls\"><input type=\"password\" id=\"repeatPassword\" placeholder=\"RepeatPassword\" name=\"repeatPassword\" required>\
	        </div></div><div class=\"control-group\"><div class=\"controls\">\
	        <button id=\"register\" type=\"submit\" class=\"btn\">Register</button></div></div>\
	        <input id=\"tipo\" type=\"hidden\" value=\"register\" name=\"tipo\"/>"

	$("#registerNow").click(function () {
		$("#formularioLogin").html(registro);
	})
})();