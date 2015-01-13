<?php
require_once 'User.php';

class User_Manager {

  private $con;

  public function __construct($con) {
    $this->con = $con;
  }

  /* salt and crypt a raw password */
  private function hash($pass) {
    $cost = 10;
    $salt = strtr(base64_encode(mcrypt_create_iv(16, MCRYPT_DEV_URANDOM)), '+', '.');
    $salt = sprintf('$2a$%02d$', $cost) . $salt;
    $hash = crypt($pass, $salt);
    return $hash;
  }

  /* Determine if an email is valid */
  public function valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
  }

  /* Determine if a username is valid */
  public function valid_name($name) {
    return ctype_alnum($name);
  }

  private function send_email_confirm($user) {

  }

  private function send_email_forgot($user) {

  }

  public function forgot_pass($email) {
    if ($this->valid_email($email)) {
      // TODO send email
    }
    return false;
  }

  /* register a new user */
  public function register($email, $pass, $name) {
    /* cannot register user if currently logged in */
    if ($this->logged_in()) {
      throw new Exception('Cannot register new user while logged in.', 400);
    }

    /* validate the email */
    if (!$this->valid_email($email)) {
      throw new Exception('Invalid email address supplied.', 400);
    }

    /* validate the name */
    if (!$this->valid_name($name)) {
      throw new Exception('Invalid username supplied. Must be at least one character long. Alphanumeric names only.', 400);
    }

    /* try to register the user */
    try{
      $hash    = $this->hash($pass);
      $params  = array($email, $hash, $name);
      $results = $this->con->run('
        insert into users (email, hash, name)
        values (?, ?, ?)',
        'sss', $params);
    } catch (Exception $e) {
      throw new Exception('Account with the given email address already exists.', 409);
    }

    /* log the user in  */
    $user = $this->login($email, $pass);
    $this->send_email_confirm($user);
    return true;
  }

  public function login($email, $pass) {
    /* must log out first */
    if ($this->current()) {
      throw new Exception('You are already logged in.', 400);
    }

    /* get the user by email */
    $user = $this->get_user_by_email($email);

    /* check if password matches and set session */
    if ($user) {
      if ($user->pass_match($pass)) {
        $_SESSION['user'] = $user;
        /* flag user activity */
        $user->flag_activity();
        return $user;
      }
    }
    return false;
  }

  /*
   * Get current user
   */
  public function current() {
    return isset($_SESSION['user']) ? $_SESSION['user'] : false;
  }

  /*
   * log current user out
   * @return current user
   */
  public function logout() {
    $user = $this->current();
    if ($user) {
      unset($_SESSION['user']);
      return $user;
    }
    return false;
  }

  public function get_user_by_id($id) {
    try {
      $results = $this->con->run('
        select *
        from users
        where user_id = ?
        limit 1',
        'i', $id);
      $data = $results->fetch_array();
      if ($data) {
        return new User($this->con, $data);
      }
    }
    return false;
  }

  public function get_user_by_email($email) {
    try {
      $results = $this->con->run('
        select *
        from users
        where email = ?
        limit 1',
        'i', $id);
      $data = $results->fetch_array();
      if ($data) {
        return new User($this->con, $data);
      }
    }
    return false;
  }

} ?>