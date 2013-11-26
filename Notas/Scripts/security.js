function checksession(){
	$.ajax({
        url: "PHP/session.php",
        async: false,
        cache: false,
        type: "POST",
        data: '',
        success: function(data){
            if (data == '0') {
                window.location.href = "index.html";
            }
        },
        error: function(xhr, err){
            if(xhr.status != 0){
                alert("error interno");
            }
        }
    });
}