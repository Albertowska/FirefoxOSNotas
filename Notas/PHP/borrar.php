<?php
	session_start();
	include("conexion.php");
	$link=Conectarse();
	$usuario=mysqli_real_escape_string($link, $_SESSION["usuario"]);
	$id=mysqli_real_escape_string($link, $_POST['id']);
	$result=mysqli_query($link, "select rutaImagen from notas where notasID='$id' and usuario = '$usuario'");
	$row = mysqli_fetch_array($result);
	if(!empty($row["rutaImagen"])){
		unlink("../".$row["rutaImagen"]);
	}
	mysqli_query($link, "delete from notas where notasID='$id' and usuario = '$usuario'");
?>