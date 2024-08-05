<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class HomeController extends CI_Controller
{
    public function __construct() {
        parent:: __construct();
        //$this->load->model('BaseModel'); 
        //$this->load->model('Home_M', 'm');
        //$this->load->model_bridge('_client/cart/', 'Cart_M');
    }
    
	public function index() {
        $data['title'] = '5sao.com - Home';

        //new product
        //$data["new_product"] = $this->db->query("SELECT * FROM v_product_info ORDER BY created_at DESC LIMIT 5")->result_array();

		$this->load->view('_main/head', $data);
        $this->load->view('_main/top');
        $this->load->view('home');
        $this->load->view('homeScript');
        $this->load->view('_main/feet');
    }
    

}

