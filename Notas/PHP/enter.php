<?php
	include("login.php");
	include("conexion.php"); 
	$link=Conectarse();
	$tipo = $_POST['tipo'];
	$usuario = mysqli_real_escape_string($link, $_POST['inputEmail']);
	$password = md5($_POST['inputPassword']);
	$remember = false;
	if(isset($_POST['remember'])){
		$remember = $_POST['remember'];
	}
	if($tipo == "login"){	
		if($result = mysqli_query($link, "SELECT password from usuarios where usuario = '$usuario'")){
			if(mysqli_num_rows($result) > 0){
				$row = mysqli_fetch_array($result);
				if($password==$row["password"]){
					session_start();
					if(login($usuario, $remember, $link)){
						header("Location: ../inicio.html");
					}
				}
				else{
					echo "Contrasenna incorrecta";
				}
			}else{
				echo "No existe ningun usuario con ese correo";
			}
		}
		mysqli_free_result($result);
	}
	else{
		$password2 = md5($_POST['repeatPassword']);
		if($password2!=$password){
			echo "contraseñas diferentes";
		}
		else{
			if(!preg_match("/^[a-zA-Z0-9_\.\-]+@([a-zA-Z0-9\-]+\.)+[a-zA-Z0-9]{2,4}$/",$usuario)){
				echo "email no valido";
			}
			else{
				if($result=mysqli_query($link, "SELECT password from usuarios where usuario = '$usuario'")){
					if(mysqli_num_rows($result) == 0){
						mysqli_free_result($result);
						if($result=mysqli_query($link, "insert into usuarios (Usuario, Password) values ('$usuario','$password')")){
							session_start();
        					if(login($usuario, $remember, $link)){
        						mkdir ("../Images/".$usuario);
								header("Location: ../inicio.html");
							}
						}else{
							echo "Error insertando datos";
							echo $result;
						}
					}else{
						echo "Ya existe un usuario registrado con este mail";
					}
				}
			}
		}
	}
?> 