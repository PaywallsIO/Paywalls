<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="" />

  <style>
    {{ $published->css }}
  </style>

  <script>
    {{ $published->js }}
  </script>
</head>
{!! $published->html !!}
</html>