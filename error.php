<!DOCTYPE html>
<html lang="en">

<head>
    <?php include 'includes/meta-tags.html'; ?>
    <title>Page Not Found | BhaivaTech</title>
    <meta name="description" content="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.">
</head>

<body>
    <div class="glow-bottom-left"></div>

    <div class="main-wrapper">
        <?php include 'includes/header.html'; ?>

        <section class="error-section">
            <div class="fluid-container">
                <div class="error-content">
                    <h1>404</h1>
                    <!-- <img src="./images/error-404.webp" alt="404 Error Illustration" class="error-image"> -->
                    <h2>Oops! Page Not Found</h2>
                    <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
                    <div class="error-actions">
                        <a href="index" class="btn-blue">Back to Home</a>
                        <a href="contact" class="btn-outline">Contact Support</a>
                    </div>
                </div>
            </div>
        </section>

        <?php include 'includes/footer.html'; ?>
    </div>

    <!-- Core Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script src="js/script.js"></script>
</body>

</html>
