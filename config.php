<?php
/**
 * SMTP Configuration
 * Update these settings with your actual SMTP server details.
 */
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_AUTH', true);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_SECURE', 'tls'); // 'tls' or 'ssl'
define('SMTP_PORT', 587); // 587 for tls, 465 for ssl

// Recipient setting
define('CONTACT_RECIPIENT_EMAIL', 'admin@bhaivatech.com');
define('CONTACT_RECIPIENT_NAME', 'Admin BhaivaTech');
?>