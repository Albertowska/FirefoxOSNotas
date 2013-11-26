<?php
	session_start();
	include("conexion.php");
	$link=Conectarse();
	$usuario=mysqli_real_escape_string($link, $_SESSION["usuario"]);
	$id=mysqli_real_escape_string($link, $_POST['id']);
	$type=$_POST['type'];
	if($type == "insert"){
		$lat=mysqli_real_escape_string($link, $_POST['lat']);
		$lng=mysqli_real_escape_string($link, $_POST['lng']);
		$result = mysqli_query($link, "update notas set latitud='$lat', longitud='$lng' where
								notasID='$id' AND usuario='$usuario'");
	}else{
		$result = mysqli_query($link, "update notas set latitud=NULL, longitud=NULL where
								notasID='$id' AND usuario='$usuario'");
	}
?>