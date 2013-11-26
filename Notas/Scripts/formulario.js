(function () {

	$.ajax({
        url: "PHP/session.php",
        cache: false,
        type: "POST",
        data: '',
        success: function(data){
            if (data != '0') {
                window.location.replace("inicio.html");
            }else{
            	$("body").css("display","block");
            }
        },
        error: function(){
            alert("error interno");
        }
    });

	$("#registerNow").click(function () {
		$(".entrar").hide();
		$(".registro").show();
	});

	$("#back").click(function () {
		$(".registro").hide();
		$(".entrar").show();
	});
    if (navigator.mozApps) {
        var manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
        var checkIfInstalled = navigator.mozApps.checkInstalled(manifestURL);
        checkIfInstalled.onsuccess = function () {
            if (checkIfInstalled.result) {}
            else {
                var installApp = navigator.mozApps.install(manifestURL);
                installApp.onsuccess = function(data) {
                    alert("App successfully installed");
                };
                installApp.onerror = function() {
                    alert("Install failed\n\n:" + installApp.error.name);
                };
            }
        };
    }
    else {
        console.log("Open Web Apps not supported");
    }
})();