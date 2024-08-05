<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/* load the MX core module class */
require dirname(__FILE__).'/Modules.php';

/**
 * Modular Extensions - HMVC
 *
 * Adapted from the CodeIgniter Core Classes
 * @link	http://codeigniter.com
 *
 * Description:
 * This library extends the CodeIgniter router class.
 *
 * Install this file as application/third_party/MX/Router.php
 *
 * @copyright	Copyright (c) 2015 Wiredesignz
 * @version 	5.5
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 **/

class MX_Router extends CI_Router
{
	
	//
	public $ci_modules_path = APPPATH;
	public $role_path;
	public $page_path;
	
	//
	public $role;
	public $page;
	public $page_controller;
	public $page_method;

	//
	public $x_debug = FALSE;
	private $located = -999;


	protected function _set_request($segments = array(), $abc=false) {
		
		//echo "<pre>Module:_set_request:[$abc]==>".print_r($segments,true)."</pre>";
		
		if ($this->translate_uri_dashes === TRUE) {
			foreach(range(0, 2) as $v) {
				isset($segments[$v]) && $segments[$v] = str_replace('-', '_', $segments[$v]);
			}
		}
				
		//
		if(empty($segments) || empty($segments[0])) {
			$this->_set_default_controller();
			return;
		}
		
		//fix segments
		$segments = $this->locate($segments);
		
		//
		if($this->located<0) {
			$this->_set_404override_controller();
			return;
		}

		//clean segments for Core
		array_unshift($segments, NULL);
		unset($segments[0]);		
		$this->uri->rsegments = $segments;
		
	}
	
	protected function _set_404override_controller()
	{
		//$this->_set_module_path($this->routes['404_override']);
		show_404();
	}

	protected function _set_default_controller()
	{
		if (empty($this->directory)) {
			/* set the default controller module path */
			$this->_set_module_path($this->default_controller);
		}
		
		parent::_set_default_controller();
		
		if(empty($this->class)) {
			$this->_set_404override_controller();
		}
	}

	/** Locate the controller **/
	public function locate($segments)
	{
		$ext = $this->config->item('controller_suffix').EXT;

		/* get the segments array elements */
		$segments = array_pad($segments, 4, NULL);
		list($this->role, $this->page, $this->page_controller, $this->page_method) = $segments;
		//echo "<pre>LOCATE==>:".print_r(array_pad($segments, 4, NULL), true)."</pre>";
		
		//set controller(class)
		if(empty($this->page_controller)){
			$this->located = -1;
		}
		else{
			$this->set_class($this->page_controller);
		}
		
		//set method
		if(empty($this->page_method)){
			$this->page_method = "index";
		}
		$this->set_method($this->page_method);
		
		/* setup module path */
		$this->role_path = $this->ci_modules_path.$this->role."/";
		$this->page_path = $this->role_path.$this->page."/";
		$this->page_controller_path =  $this->page_path.'controllers/';
				
		if (is_dir($this->page_controller_path)) {
			
			//IMPORTANT: CHANGE THE CI CORE PATH
			$this->directory = str_replace(APPPATH, "../", $this->ci_modules_path).$this->role."/".$this->page.'/controllers/';

			/* module sub-controller exists? */
			$this->page_controller_file = $this->page_controller_path.ucfirst($this->page_controller).$ext;
			if(is_file($this->page_controller_file)) {
				$this->located = 2;
			}
			else{
				//show_error("PageControllerFile: $this->page_controller_file not found !");
				$this->located = -1;
			}
		}
		else{
			//show_error("PageController: $this->page_controller_path not found !");
			$this->located = -1;
		}
		
		//fix segments
		$segments = array_slice($segments, 2);
		
		return $segments;
	}

	/* set module path */
	protected function _set_module_path(&$_route)
	{		
		if ( !empty($_route) )
		{
			// Are module/directory/controller/method segments being specified?
			$sgs = sscanf($_route, '%[^/]/%[^/]/%[^/]/%s', $module, $sub_module, $class, $method);
						
			// set the module/controller directory location if found
			$locatex = $this->locate(array($module, $sub_module, $class));
			if ($locatex) {
				$_route = $class.'/'.$method;
				
			}
			else{
				//echo "<pre>>>CANT LOCATE: $locatex</pre>";
			}
		}
		
	}

	public function set_class($class)
	{
		$suffix = $this->config->item('controller_suffix');
		if (@strpos($class, $suffix) === FALSE)
		{
			$class .= $suffix;
		}
		parent::set_class($class);
	}
	
	public function __destruct() {
        if( $this->x_debug==TRUE ){
			//fix
			echo "<pre>ROUTER DEBUG:".print_r($this,true)."</pre>";
		}
    }
}	