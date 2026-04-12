<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/config.php';
require __DIR__ . '/includes/PHPMailer/Exception.php';
require __DIR__ . '/includes/PHPMailer/PHPMailer.php';
require __DIR__ . '/includes/PHPMailer/SMTP.php';

/**
 * Sends an email via PHPMailer using SMTP settings from config.php
 */
function sendContactEmail($name, $email, $message)
{
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = SMTP_AUTH;
    $mail->Username = SMTP_USERNAME;
    $mail->Password = SMTP_PASSWORD;
    $mail->SMTPSecure = (SMTP_SECURE == 'tls') ? PHPMailer::ENCRYPTION_STARTTLS : PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = SMTP_PORT;

    $mail->setFrom(SMTP_USERNAME, 'BhaivaTech Contact Form');
    $mail->addReplyTo($email, $name);
    $mail->addAddress(CONTACT_RECIPIENT_EMAIL, CONTACT_RECIPIENT_NAME);

    $mail->isHTML(false);
    $mail->Subject = "New Contact from BhaivaTech Website: $name";
    $mail->Body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    $mail->send();
}
?>