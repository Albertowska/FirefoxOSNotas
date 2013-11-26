<?php
	session_start();
	include("conexion.php");
	$link = Conectarse();
	// Need to delete auth key from database so cookie can no longer be used
    $username = $_SESSION['usuario'];
    setcookie("auth_key", "", time() - 3600);
    $auth_query = mysqli_query($link,"UPDATE usuarios SET auth_key = 0 WHERE usuario = '$username'");
    // If auth key is deleted from database proceed to unset all session variables
    if ($auth_query)
    {
        unset($_SESSION['usuario']);
        session_unset();
        session_destroy();
    }else{
        echo "error";
    }
?>