<?php
class UserCollection_Resource extends Rest_Resource {
  public function resource_post($request) {
    $method = $request->inputs->requires('method', 'query');
    $con    = new mywrap_con();
    $uman   = new User_Manager($con);
    switch ($method) {
      case 'register':
        $email = $request->inputs->requires('email');
        $pass  = $request->inputs->requires('pass');
        $name  = $request->inputs->requires('name');
        return $uman->register($email, $pass, $name);
        break;
      case 'login':
        $email = $request->inputs->requires('email');
        $pass  = $request->inputs->requires('pass');
        return $uman->login($email, $pass);
        break;
      case 'logout':
        $uman->logout();
        break;
      default:
        throw new Exception('Invalid method requested', 400);
    }
  }
} ?>