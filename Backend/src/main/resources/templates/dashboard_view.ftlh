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
    
    <div class="container">
        <h2>Hello ${name!''}!</h2>
        <div class="test"></div>
        <div class="test"></div>
        <div class="test"></div>
        <table id="myTable" class="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>NO PENDAFTARAN</th>
                <th>NO SIJIL PELABURAN</th>
                <th>KADAR FAEDAH (%)</th>
              </tr>
            </thead>
            <tbody id="dataTable">

            </tbody>
        </table>
    </div>
    <script src='/js/extractData.js'></script>
</body>
</html>