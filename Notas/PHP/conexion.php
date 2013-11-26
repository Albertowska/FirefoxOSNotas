<?php 
function Conectarse() 
{ 
   if (!($link=mysqli_connect("localhost","root","vivahuesca", "pruebasphp"))) 
   { 
      echo "Error conectando a la base de datos."; 
      exit(); 
   }
   return $link; 
}
?>