<?php
	include("conexion.php"); 
	$link=Conectarse();
	session_start();
	$usuario = mysqli_real_escape_string($link, $_SESSION["usuario"]);
	$oldPassword = md5($_POST['oldPassword']);
	$newPassword = md5($_POST['newPassword']);
	$repeatPassword = md5($_POST['repeatPassword']);
	if($result = mysqli_query($link, "select password from usuarios where usuario = '$usuario'")){
		if(mysqli_num_rows($result) > 0){
			$row = mysqli_fetch_array($result);
			if($oldPassword==$row["password"]){
				if($newPassword==$repeatPassword){
					mysqli_query($link, "update usuarios set password='$newPassword' where usuario = '$usuario'");
					header("Location: ../inicio.html");					
				}else{
					echo "Contraseñas diferentes";
				}
			}
			else{
				echo "Contraseña incorrecta";
			}
		}else{
			echo "Error interno del programa";
		}
	}else{
		echo "Error interno del programa";
	}
?>