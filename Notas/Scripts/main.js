(function () {
	if (navigator.mozApps) {
    	var manifestURL = location.href.substring(0, location.href.lastIndexOf("/")) + "/manifest.webapp";
        var checkIfInstalled = navigator.mozApps.checkInstalled(manifestURL);
    	var install = document.querySelector("#install");
        checkIfInstalled.onsuccess = function () {
            if (checkIfInstalled.result && install) {
    			install.style.display = "none";
            }
            else {
                document.querySelector("#botones").style.display="block";
                install.onclick = function () {
                    var installApp = navigator.mozApps.install(manifestURL);
                    installApp.onsuccess = function(data) {
                        install.style.display = "none";
                        alert("App successfully installed");
                    };
                    installApp.onerror = function() {
                        alert("Install failed\n\n:" + installApp.error.name);
                    };
                };
            }
        };	
	}
	else {
    	console.log("Open Web Apps not supported");
		document.querySelector("#install").style.display = "none";
	}
})();