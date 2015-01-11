<?php
class UserCollection_Resource extends Rest_Resource {
  public function resource_post($request) {
    $method = $request->inputs->requires('method', 'uri');
    $con    = new mywrap_con();
    $uman   = new User_Manager($con);

    if ($method == 'login') {
      $email = $request->inputs->requires('email');
      $pass  = $request->inputs->requires('pass');
      $uman->login($email, $pass);
    }

    if ($method == 'register') {
      $email = $request->inputs->requires('email');
      $pass  = $request->inputs->requires('pass');
      $name  = $request->inputs->requires('name');
      $uman->register($email, $pass, $name);
    }
  }
} ?>