<?php
    function rand_string($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $randomString;
    }

    function session_encrypt($string) {
        $salt = "qswedcfghhrt";
        $string = md5($salt . $string);
        return $string;
    }

    function login($username, $remember = false, $link)
    {
        // Check if user wants account to be saved in cookie
        if($remember){
            // Generate new auth key for each log in (so old auth key can not be used multiple times in case 
            // of cookie hijacking)
            $cookie_auth= rand_string(10) . $username;
            $auth_key = session_encrypt($cookie_auth);
            $auth_query = mysqli_query($link, "UPDATE usuarios SET auth_key = '$auth_key' WHERE usuario = '$username'");
            setcookie("auth_key", $auth_key, time() + 60 * 60 * 24 * 7);
        }
        // Assign variables to session
        if(isset($_SESSION['usuario'])){
            session_regenerate_id(true);
        }else{
            $_SESSION['usuario'] = $username;
        }
    	return true;
    }

    function initiate($link)
    {
        if(isset($_SESSION['usuario']))
        {
            return true;
        }
     
        // Check that cookie is set
        if(isset($_COOKIE['auth_key']))
        {
            $auth_key = $_COOKIE['auth_key'];
            // Select user from database where auth key matches (auth keys are unique)
            $auth_key_query = mysqli_query($link, "SELECT usuario, password FROM usuarios WHERE auth_key = '$auth_key'");
            if($auth_key_query === false)
            {
                // If auth key does not belong to a user delete the cookie
                setcookie("auth_key", "", time() - 3600);
                return false;
            }
            else
            {
                while($u = mysqli_fetch_array($auth_key_query))
                {
                    // Go ahead and log in
                    return login($u['usuario'], true, $link);
                }
            }
        }else{
            return false;
        }
    }

?>