<?php
/**
 * Used as a wrapper for prepared statements after they're executed.
 *
 * Created August 4th 2014
 */
class Result {

    private $bound_variables;
    private $results;
    private $statement;
    
    /** 
     * Constructor - 
     * Creates a result object from a prepared statement
     */
	public function __construct($statement) {
        $this->statement = $statement;
		$this->bound_variables = array();
        $this->results = array();
        
        $meta = $this->statement->result_metadata();
        if ($meta) {
            while ($column = $meta->fetch_field()) {
                $this->bound_variables[$column->name] =& $this->results[$column->name];
            }
            call_user_func_array(array($this->statement, 'bind_result'), $this->bound_variables); 
            $meta->close();
        }
	}
    
    /**
     * Destructor - 
     * called as soon as there are no references left to this object
     * closes the mysqli statement
     */
    public function __destruct() {
        $this->statement->close();
    }
    
    /**
     * Returns the original statement object
     */
    public function get_statement() {
        return $this->statement;
    }
    
    /**
     * Fetch result while it can, returns false when finished
     */
    public function fetch() {
        return $this->statement->fetch() ? $this->results : false;
    }
    
    /**
     * count the number of rows in the result
     */
    public function rows() {
        return $this->statement->num_rows();
    }
    
    /**
     * Fetch a result row as an associative array
     */
     public function fetch_array() {
     
        // while ($result = $this->fetch()) {
            // $row = $result;
        // }
        // $row = array();
        // $this->statement->bind_assoc($row);
        // return $row;
     }
    
    /**
     * retrieve the last id that was inserted 
     */
    public function last_id() {
        return $this->statement->insert_id;
    }
}