<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hello ${name!''}!</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.slim.min.js"></script>
    <script src="/js/script.js"></script>
</head>
<body>
    <div  id="data" style="display:none;">${data!''}</div>
    <!-- <#include "importFile.ftlh"> -->
    <div class="container">
    <h1>Testing</h1>
        <h2>Hello ${name!''}!</h2>
        <a href="/dashboard">Dashboard</a>
        <div class="test"></div>
    </div>
</body>
</html>