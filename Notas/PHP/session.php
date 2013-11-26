<?php
	include("login.php");
	include("conexion.php");
	session_start();
	if(initiate(Conectarse())){
        echo $_SESSION["usuario"]; //1 que si valida
    } else{
        echo "0"; //no valido
    }
?>