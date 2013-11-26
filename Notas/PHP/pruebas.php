<?php
    $message = '<html>
            <body>
                <img src="http://planet-earth.bogus.us/icons/secret.pictures.gif">
            </body>
        </html>';

    // Add the content headers
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";

    $headers .= 'To: David <betomartinkio@gmail.com>' . "\r\n";
    $headers .= 'From: Bot <bot@domain.com>' . "\r\n";

    echo mail("betomartinkio@gmail.com", "mysubject", $message, $headers);
?>