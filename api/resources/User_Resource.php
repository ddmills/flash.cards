<?php
Class User_Resource extends Rest_Resource {
  public function resource_get($request) {
    $con     = new mywrap_con();
    $uman    = new User_Manager($con);
    $user_id = $request->inputs->requires('user_id', 'uri');
    $user    = User_Manager->get_user($user_id);
    if ($user) { return $user; }
    throw new Exception('user not found', 404);
  }
} ?>