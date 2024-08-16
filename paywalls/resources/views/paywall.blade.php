<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title></title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="" />

  <style>
    :root,
html {
    overflow: hidden;
    position: absolute;
    top:0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 100vw;
    max-height: 100vh;
    }
    {{ $paywall->css }}
  </style>

  <script>
    {{ $paywall->js }}
  </script>
</head>
{!! $paywall->html !!}
</html>