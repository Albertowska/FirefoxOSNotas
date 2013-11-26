<?php
	session_start();
	$usuario=$_SESSION["usuario"];
	$filename = "tmp/".$usuario."/image.jpg";
	file_put_contents($filename, file_get_contents('php://input'));
?>