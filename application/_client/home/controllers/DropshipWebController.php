<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class DropshipWebController extends CI_Controller
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
        $this->load->helper('url');
		$this->load->view('dropship_web/layouts/head');
        $this->load->view('dropship_web/layouts/header');
        $this->load->view('dropship_web/layouts/banner');
        $this->load->view('dropship_web/layouts/modal');
        $this->load->view('dropship_web/index');
        $this->load->view('dropship_web/layouts/footer');
        $this->load->view('dropship_web/layouts/script');
    }
    

}

