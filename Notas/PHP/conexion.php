<?php 
function Conectarse() 
{ 
   if (!($link=mysqli_connect("HOST","USER","PASSWORD", "DATABASE"))) 
   { 
      echo "Error conectando a la base de datos."; 
      exit(); 
   }
   return $link; 
}
?>