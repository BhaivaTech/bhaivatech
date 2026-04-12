<?php
header('Content-Type: application/json');
require 'includes/mail-helper.php';

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "There was a problem with your submission."]);
    exit;
}

// 1. Collect and sanitize input
$name = strip_tags(trim($_POST["name"]));
$name = str_replace(["\r", "\n"], [" ", " "], $name);
$email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
$message = trim($_POST["message"]);

// 2. Validate
if (empty($name) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Please complete the form and provide a valid email address."]);
    exit;
}

// 3. Send email
try {
    sendContactEmail($name, $email, $message);
    echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent successfully."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Message could not be sent. Please try again later."]);
}
?>