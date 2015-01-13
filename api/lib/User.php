<?php
class User {

  /* mywrap_con object */
  private $con;

  /* user variables */
  public $name;
  public $user_id;
  public $activity;
  public $created;
  public $verified;
  public $email;
  public $premium;
  public $hash;

  public function __construct($con, $data) {
    $this->name     = $data['name'];
    $this->user_id  = $data['user_id'];
    $this->premium  = $data['premium'];
    $this->email    = $data['email'];
    $this->verified = $data['verified'];
    $this->created  = $data['created'];
    $this->activity = $data['activity'];
    $this->hash     = $data['hash'];
  }

  /* check if password matches */
  public function pass_match($pass) {
    return crypt($pass, $this->hash);
  }

  /*
   * Update when the user was last active
   */
  public function flag_activity() {
    $results = $this->con->run('
      update users
      set activity = NOW()
      where user_id = ?
      limit 1',
      'i', $this->user_id);
    $this->activity = date('Y-m-d H:i:s');
    return ($results->affected_rows() == 1);
  }


  /* is this user currently logged in? */
  public function logged_in() {
    if (isset($_SESSION['user'])) {
      return $_SESSION['user']->user_id == $this->user_id;
    }
    return false;
  }

  /*
   * Get the json version of this user
   * @returns json data about the user
   */
  public function json() {
    $data = array(
      'name'     => $this->name,
      'user_id'  => $this->user_id,
      'premium'  => $this->premium,
      'activity' => $this->activity,
      'created'  => $this->created
    );

    /* only include these fields when logged in */
    if ($this->logged_in()) {
      array_push($data, $email);
      array_push($data, $verified);
    }

    return json_encode($data);
  }

} ?>