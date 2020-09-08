<?php

require_once("DatabaseAccess.php");

function processRequest()
{
    $requestMethod = $_SERVER["REQUEST_METHOD"];
    switch ($requestMethod) {
        case 'GET':
            $orders = getOrdersFromDb();
            showJSONresponse(true, "OK", $orders);
            break;

        case 'POST':
            $price = getRequestParameter("totalPrice");
            $pizzas = getRequestParameter("pizzas");
            if (isset($price) && ($price !== '') && isset($pizzas) && ($pizzas !== '')) {
                $newOrderId = addOrderToDb($price, $pizzas);
                showJSONresponse(true, "OK", $newOrderId);
            } else {
                showJSONresponse(false, "Bad parameters", null);
            }
            break;

        default:
            showJSONresponse(false, "Unknown request method: $requestMethod", null);
            break;
    }
}

function getOrdersFromDb()
{
    return getDbAccess()->executeQuery("SELECT * FROM Orders ORDER BY Date DESC;");
}

function addOrderToDb($totalPrice, $pizzas)
{
    return getDbAccess()->executeInsertQuery("INSERT INTO Orders (Date, TotalPrice, Pizzas) VALUES (NOW(), '$totalPrice', '$pizzas')");
}

function showJSONresponse($success, $message, $data)
{
    echo (json_encode(array(
        "success" => $success,
        "message" => $message,
        "data" => $data
    )));
}

function getRequestParameter($key)
{
    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data[$key])) {
        return $data[$key];
    } else {
        return isset($_REQUEST[$key]) ? $_REQUEST[$key] : "";
    }
    return "";
}

processRequest();
