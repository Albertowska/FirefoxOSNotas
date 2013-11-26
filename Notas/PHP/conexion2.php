<?php 
function Conectarse() 
{ 
   if (!($link=mysqli_connect("mysql.hostinger.es","u368313787_notas","vivahuesca", "u368313787_notas"))) 
   { 
      echo "Error conectando a la base de datos."; 
      exit(); 
   }
   return $link; 
} 
?>