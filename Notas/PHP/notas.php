<?php
	include("conexion.php");
	$link=Conectarse();
	session_start();
	$usuario=mysqli_real_escape_string($link, $_SESSION["usuario"]);
	mysqli_set_charset ($link , "UTF-8");
	$result=mysqli_query($link, "select titulo, contenido, rutaImagen, notasID, latitud, longitud from notas where usuario = '$usuario'"); 
	$resultado = "";
	while($row = mysqli_fetch_array($result)) { 
		$resultado[]=array('titulo' => htmlspecialchars($row["titulo"]), 'contenido' => htmlspecialchars($row["contenido"]), 
			'imagen' => $row["rutaImagen"], 'id' => $row["notasID"], 'lat' => $row["latitud"], 'lng' => $row["longitud"]);
	}
	echo json_encode($resultado);
	mysqli_free_result($result); 
	mysqli_close($link);
?> 