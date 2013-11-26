<?php
	function compress_image($source_url, $destination_url, $quality, $extension) {
		$JPG = array("jpeg", "jpg", "JPEG", "JPG");
		$GIF = array("gif", "GIF");
		$PNG = array("png", "PNG");
		if (in_array($extension, $JPG)){
			//echo "JPG";
			$image = imagecreatefromjpeg($source_url);
			imagejpeg($image, $destination_url, $quality);
		}
		elseif (in_array($extension, $GIF)){
			//echo "GIF";
			$image = imagecreatefromgif($source_url);
			imagegif($image, $destination_url);
		}
		elseif (in_array($extension, $PNG)){
			//echo "PNG";
			$image = imagecreatefrompng($source_url);
			imagepng($image, $destination_url, 2);
		}
		return $destination_url;
	}

	// Comprobar de alguna forma si se sube con FirefoxOS o no 
	include("conexion.php");
	$link=Conectarse();
	$titulo = mysqli_real_escape_string($link, $_POST['titulo']);
	$contenido = mysqli_real_escape_string($link, $_POST['contenido']);
	$imagen = mysqli_real_escape_string($link, $_FILES["file"]["name"]);
	if($imagen=="blob"){
		$imagen = $_POST['blobName'].".jpg";
	}
	if(isset($_POST["lat"])){
		$lat = mysqli_real_escape_string($link, $_POST["lat"]);
		$lng = mysqli_real_escape_string($link, $_POST["lng"]);
	}
	$imagenModificada = $_POST['modif'] == "true";
	session_start();
	$usuario=mysqli_real_escape_string($link, $_SESSION["usuario"]);
	mysqli_set_charset ($link , "utf-8");
	if(!isset($_POST["id"])){
		$titulo = $titulo." - ".date("d/m/Y");
		//No existe todavía esa nota
		if (!empty($imagen)) {
			$allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
			$temp = explode(".", $imagen);
			$extension = end($temp);
			if ((($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg")
			|| ($_FILES["file"]["type"] == "image/jpg")   || ($_FILES["file"]["type"] == "image/pjpeg")
			|| ($_FILES["file"]["type"] == "image/x-png") || ($_FILES["file"]["type"] == "image/png"))
			&& ($_FILES["file"]["size"] < 1000000) && in_array($extension, $allowedExts)){
				if ($_FILES["file"]["error"] > 0) {
				   	echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
				}
				else {
					if(!empty($titulo)){
						$imagen = "Images/".$usuario."/".date("Y-m-d-H-i-s").$_FILES["file"]["name"];
						if($_FILES["file"]["size"] < 100000){
							move_uploaded_file($_FILES["file"]["tmp_name"],"../$imagen");
						}else{
							compress_image($_FILES["file"]["tmp_name"],"../$imagen",80,$extension);
						}
						if(!empty($lat)){
							$result = mysqli_query($link, "insert into notas (usuario, titulo, contenido, rutaimagen, latitud, longitud) 
								values ('$usuario','$titulo','$contenido','$imagen', $lat, $lng)");
							echo $result;
						}else{
							$result = mysqli_query($link, "insert into notas (usuario, titulo, contenido, rutaimagen) values
							 ('$usuario','$titulo','$contenido','$imagen')");
							echo $result;
						}
			        }
				}
			}
			else {
				echo "FAIL";
				if($_FILES["file"]["size"] > 1000000){
					echo "File is too big";
				} else{
					echo "Invalid type of file";
				}				
			}
		}else{
			if(!empty($titulo)){
				if(!empty($lat)){
					$result = mysqli_query($link, "insert into notas (usuario, titulo, contenido, latitud, longitud) values
						('$usuario','$titulo','$contenido', $lat, $lng)");
					echo $result;
				}else{
					$result = mysqli_query($link, "insert into notas (usuario, titulo, contenido) values ('$usuario','$titulo','$contenido')");
					echo $result;
				}
			}
		}
	}
	else{
		$id = mysqli_real_escape_string($link, $_POST["id"]);
		//Ya existia esa nota
		if (!empty($imagen)) {
			$allowedExts = array("gif", "jpeg", "jpg", "png", "GIF", "JPEG", "JPG", "PNG");
			$temp = explode(".", $imagen);
			$extension = end($temp);
			if ((($_FILES["file"]["type"] == "image/gif") || ($_FILES["file"]["type"] == "image/jpeg")
			|| ($_FILES["file"]["type"] == "image/jpg")   || ($_FILES["file"]["type"] == "image/pjpeg")
			|| ($_FILES["file"]["type"] == "image/x-png") || ($_FILES["file"]["type"] == "image/png"))
			&& ($_FILES["file"]["size"] < 1000000) && in_array($extension, $allowedExts)) {
				if ($_FILES["file"]["error"] > 0) {
					echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
				}
				else {
					if(!empty($titulo)){
						$imagen = "Images/".$usuario."/".date("Y-m-d-H-i-s").$_FILES["file"]["name"];
						if($_FILES["file"]["size"] < 100000){
							move_uploaded_file($_FILES["file"]["tmp_name"],"../$imagen");
						}else{
							compress_image($_FILES["file"]["tmp_name"],"../$imagen",80,$extension);
						}
						if(!empty($lat)){
							$result = mysqli_query($link, "update notas set titulo='$titulo', contenido='$contenido', rutaImagen='$imagen', latitud='$lat', longitud='$lng'  
								where notasID='$id' AND usuario='$usuario'");
							echo $result;
						}else{
							$result = mysqli_query($link, "update notas set titulo='$titulo', contenido='$contenido', rutaImagen='$imagen' where
								notasID='$id' AND usuario='$usuario'");
							echo $result;
						}
						
				    }
				}
			}
			else {
				echo "FAIL";
				if($_FILES["file"]["size"] > 1000000){
					echo "File is too big";
				} else{
					echo "Invalid type of file";
				}
				
			}
		}
		else{
			if($imagenModificada){
				if(!empty($lat)){
					$result = mysqli_query($link, "update notas set titulo='$titulo', contenido='$contenido', rutaImagen=NULL, latitud='$lat', longitud='$lng' 
						where notasID='$id' AND usuario='$usuario'");
				}else{
					$result = mysqli_query($link, "update notas set titulo='$titulo', contenido='$contenido', rutaImagen=NULL where
						notasID='$id' AND usuario='$usuario'");
				}
			} else{
				if(!empty($lat)){
					$result = mysqli_query($link, "update notas set titulo='$titulo', contenido='$contenido', latitud='$lat', longitud='$lng' where
						notasID='$id' AND usuario='$usuario'");
				}else{
					$result = mysqli_query($link, "update notas set titulo='$titulo', contenido='$contenido' where
						notasID='$id' AND usuario='$usuario'");
				}
			}
			echo $result;
		}
	}
?>