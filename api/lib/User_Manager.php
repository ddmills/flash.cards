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

  public function forgot_pass($email) {

  }

  public function update_pass($old, $new) {


  }

  /* register a new user */
  public function register($email, $pass, $name) {
    $hash    = $this->hash($pass);
    $params  = array($email, $hash, $name, $email);
    $results = $this->con->run('
      insert into users
        (email, hash, name)
      values
        (?, ?, ?)
      where
        email != ?',
      'ssss', $params);

    /*
     * todo:
     *    send email verification?
     *    catch "account already exists"
     */
  }

  public function login($email, $pass) {
    $results = $this->con->run('select * from users where email = ? limit 1', 's', $email);
    $user    = $results->fetch_array();
    if ($user) {
      $valid = crypt($pass, $user['hash']);
      if ($valid) {
        $_SESSION['user'] = $user;
      }
    }
    return false;
  }

  public function get_user($id) {
    $results = $this->con->run('
      select user_id, name
      from users
      where user_id = ?',
      'i', $id);
    return $results->fetch_array();
  }

} ?>