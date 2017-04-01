<?php
require __DIR__ . '/vendor/autoload.php';

use Syke\Gateway\Gateway;
use Syke\Gateway\SqlCache;
use Curl\Curl;

$dbConnection = new mysqli("localhost", "root", "", "gadget");
$cache = new SqlCache($dbConnection);

try {
    if (!isset($_GET['url'])) {
        return;
    }
    $url = $_GET['url'];
    $expire = $_GET['expire'] ?: 0;
    $gateway = new Gateway(new Curl(), $cache, $_GET['url'], $_GET['expire']);
} catch(Exception $exception) {
    echo $exception;
}

//header('Content-Type: application/json');
echo $gateway->getResponse($cache);