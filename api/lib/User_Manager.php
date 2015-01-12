<?php
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
      throw new Exception('Invalid username supplied. Alphanumeric names only.', 400);
    }

    /* register the user */
    $hash    = $this->hash($pass);
    $params  = array($email, $hash, $name);
    $results = $this->con->run('
      insert into users (email, hash, name)
      values (?, ?, ?)',
      'sss', $params);

    /* check for registration success */
    if ($results->affected_rows()) {
      $user = $this->login($email, $pass);
      $this->send_email_confirm($user);
      return true;
    }

    throw new Exception('Account with the given email address already exists.', 409);
  }

  public function login($email, $pass) {
    $results = $this->con->run('select * from users where email = ? limit 1', 's', $email);
    $user    = $results->fetch_array();
    if ($user) {
      $valid = crypt($pass, $user['hash']);
      if ($valid) {
        $_SESSION['user'] = $user;
        $this->flag_activity($user['user_id']);
        return $user;
      }
    }
    return false;
  }

  /*
   * Update when the user was last active
   */
  public function flag_activity($user_id) {
    $results = $this->con->run('
      update users
      set activity = NOW()
      where user_id = ?
      limit 1',
      'i', $user_id);
    return ($results->affected_rows() == 1);
  }

  /*
   * Get current user
   */
  public function logged_in() {
    if (isset($_SESSION['user'])) {
      return $_SESSION['user'];
    }
    return false;
  }

  public function logout() {
    if ($this->is_logged_in()) {

    }
    return false;
  }

  public function get_user($id) {
    $results = $this->con->run('
      select *
      from users
      where user_id = ?
      limit 1',
      'i', $id);
    return $results->fetch_array();
  }

} ?>