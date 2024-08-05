<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/**
 * Modular Extensions - HMVC
 *
 * Adapted from the CodeIgniter Core Classes
 * @link	http://codeigniter.com
 *
 * Description:
 * This library extends the CodeIgniter CI_Loader class
 * and adds features allowing use of modules and the HMVC design pattern.
 *
 * Install this file as application/third_party/MX/Loader.php
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

class MX_Loader extends CI_Loader
{
	protected $_module;

	public $_ci_plugins = array();
	public $_ci_cached_vars = array();
	
	public $x_debug = FALSE;

	/** Initialize the loader variables **/
	public function initialize($controller = NULL)
	{
		/* setup link name */
		$this->_role = CI::$APP->router->role;
		$this->_page = CI::$APP->router->page;
		$this->_page_controller = CI::$APP->router->page_controller;
		$this->_page_method = CI::$APP->router->page_controller_method;
		
		//app path
		$this->_ci_module_path = CI::$APP->router->ci_modules_path;
		$this->_role_path = CI::$APP->router->role_path;
		$this->_page_path = CI::$APP->router->page_path;
		
		//for check dup
		$this->exist_models = [];
		$this->exist_views = [];
		$this->exist_helpers = [];
		$this->exist_librarys = [];
		$this->exist_plugins = [];
		$this->exist_configs = [];
		$this->exist_langs = [];
	

		//
		if ($controller instanceof MX_Controller) {
			/* reference to the module controller */
			$this->controller = $controller;

			/* references to ci loader variables */
			foreach (get_class_vars('CI_Loader') as $var => $val)
			{
				if ($var != '_ci_ob_level')
				{
					$this->$var =& CI::$APP->load->$var;
				}
			}
		}
		else {
			parent::initialize();
		}

		
		/* add this module path to the loader variables */
		@array_unshift($this->_ci_model_paths, $this->_page_path);
	}

	/** Load a module config file **/
	public function config($file, $use_sections = FALSE, $fail_gracefully = FALSE)
	{
		return CI::$APP->config->load($file, $use_sections, $fail_gracefully);
	}

	/** Load the database drivers **/
	public function database($params = '', $return = FALSE, $query_builder = NULL)
	{
		if ($return === FALSE && $query_builder === NULL &&
			isset(CI::$APP->db) && is_object(CI::$APP->db) && ! empty(CI::$APP->db->conn_id))
		{
			return FALSE;
		}

		require_once BASEPATH.'database/DB'.EXT;

		if ($return === TRUE) return DB($params, $query_builder);

		CI::$APP->db = DB($params, $query_builder);

		return $this;
	}
	
	/** Load a module helper **/
	public function helper($helper = array(), $params = FALSE, $object_name = FALSE) {		
		//
		if (is_array($helper)) return $this->helpers($helper);
		
		//ended _helper required
		if( substr($helper, -7)!="_helper" ){
			$helper = trim($helper."_helper");
		}
		$helper = ucfirst($helper);
		
		//deny dup
		if( isset($this->exist_helpers[strtolower($helper)]) || isset($this->_ci_helpers[$helper]) ){
			show_error('This helper:'.$helper.' already loaded !');
			return;
		}
		
		//
		if( substr($helper, 0, 3)=="My_" ){
			$loaded = Modules::load_file($helper, APPPATH."helpers/");
			if($loaded==TRUE){
				$this->exist_helpers[strtolower($helper)] = TRUE;
				$this->_ci_helpers[$helper] = TRUE;

				if( class_exists($helper, FALSE) ){
					if($object_name) $class_name = $object_name;
					else $class_name = $helper;
					CI::$APP->$class_name = new $helper($params);
				}
			}
			else{
				show_error("Cant load your helper: $helper !");
			}
		}
		else{
			parent::helper($helper);
		}

		return;
	}


	/** Load an array of helpers **/
	public function helpers($helpers = array())
	{
		foreach ($helpers as $_helper) $this->helper($_helper);
		return $this;
	}

	/** Load a module language file **/
	public function lang($langfile, $idiom = '', $return = FALSE, $add_suffix = TRUE, $alt_path = '')
	{
		//
		if (is_array($langfile)) return $this->langs($langfile);
		return CI::$APP->lang->load($langfile, $idiom, $return, $add_suffix, $alt_path);
	}

	public function langs($languages = [])
	{
		foreach($languages as $_language) $this->lang($_language);
		return $this;
	}

	/** Load a module library **/
	public function library($library, $params = NULL, $object_name = NULL)
	{
		//
		if (is_array($library)) return $this->libraries($library);
		
		//deny dup
		if( isset($this->exist_librarys[strtolower($library)]) ) {
			show_error("This Library already loaded: $library");
			return;
		}
		else {
			$this->exist_librarys[strtolower($library)] = TRUE;
		}
		
		//
		$this->_ci_load_library($library, $params, $object_name);
		
		return $this;
    }

	/** Load an array of libraries **/
	public function libraries($libraries)
	{
		foreach ($libraries as $library => $alias) 
		{
			(is_int($library)) ? $this->library($alias) : $this->library($library, NULL, $alias);
		}
		return $this;
	}

	/** Load a module model **/
	public function model_bridge($path, $model, $object_name = NULL, $connect = FALSE) {
		if( empty($model) || empty($path) ) show_error("Path and Model name must valid !");
		if (is_array($model)) show_error("Model cant be array !");
		
		//check slash
		if( $path[0]=="/" || substr($path, -1)<>"/" ) show_error("Path(1) should Begin without '/' and End with '/' !");
		
		//add path
		$new_model_path = APPPATH.$path;
		if( is_dir($new_model_path) ){
			@array_unshift($this->_ci_model_paths, $new_model_path);
		}
		else show_error("Invalid path: $path");
		
		//
		return $this->model($model, $object_name, $connect);
	}
	
	public function model($model, $object_name = NULL, $connect = FALSE) {
		if( empty($model) ) return;
		if (is_array($model)) return $this->models($model);
		
		//deny dup
		if( isset($this->exist_models[strtolower($model)]) ){
			show_error("This Model already loaded: $model");
			return;
		}
		else{
			$this->exist_models[strtolower($model)] = TRUE;
		}

		parent::model($model, $object_name, $connect);
		
		return $this;
	}

	/** Load an array of models **/
	public function models($models)
	{
		foreach ($models as $model => $alias) 
		{
			(is_int($model)) ? $this->model($alias) : $this->model($model, $alias);
		}
		return $this;
	}

	/** Load a plugin **/
	public function plugin($plugin = array(), $params = FALSE, $object_name = FALSE) {
		//
		if (is_array($plugin)) return $this->plugins($plugin);
		
		//ended plugin required
		if( substr($plugin, -7)!="_plugin" ){
			$plugin = ucfirst($plugin."_plugin");
		}
		
		//deny dup
		if( isset($this->exist_plugins[strtolower($plugin)]) || isset($this->_ci_plugins[$plugin]) ){
			show_error('This plugin:'.$plugin.' already loaded !');
			return;
		}
		
		//
		$loaded = Modules::load_file($plugin, APPPATH."plugins/");
		if($loaded==TRUE){
			$this->exist_plugins[strtolower($plugin)] = TRUE;
			$this->_ci_plugins[$plugin] = TRUE;

			if( class_exists($plugin, FALSE) ){
				if($object_name) $class_name = $object_name;
				else $class_name = $plugin;
				CI::$APP->$class_name = new $plugin($params);
			}

		}
		else{
			show_error("Cant load the plugin: $plugin");
		}
// 		
		return;
	}

	/** Load an array of plugins **/
	public function plugins($plugins)
	{
		foreach ($plugins as $_plugin) $this->plugin($_plugin);
		return $this;
	}

	/** Load a module view **/
	public function view($view, $vars = array(), $return = FALSE) {
		//deny dup
		if( isset($this->exist_views[strtolower($view)]) ){
			show_error("This View:$view is already loaded before !");
			return;
		}
		else{
			 $this->exist_views[strtolower($view)] = TRUE;
		}
		
		//add module view path
		$path = $this->_page_path."views/";
		$this->_ci_view_paths = array($path => TRUE) + $this->_ci_view_paths;

		//
		if (method_exists($this, '_ci_object_to_array')) {
			return $this->_ci_load(array('_ci_view' => $view, '_ci_vars' => $this->_ci_object_to_array($vars), '_ci_return' => $return));
		}
		else {
			return $this->_ci_load(array('_ci_view' => $view, '_ci_vars' => $this->_ci_prepare_view_vars($vars), '_ci_return' => $return));
		}
	}

	protected function &_ci_get_component($component)
	{
		return CI::$APP->$component;
	}

	public function __get($class)
	{
		return (isset($this->controller)) ? $this->controller->$class : CI::$APP->$class;
	}

	public function _ci_load($_ci_data)
	{
		extract($_ci_data);

		if (isset($_ci_view)) {
			$_ci_path = '';

			/* add file extension if not provided */
			$_ci_file = (pathinfo($_ci_view, PATHINFO_EXTENSION)) ? $_ci_view : $_ci_view.EXT;

			foreach ($this->_ci_view_paths as $path => $cascade) {
				if (is_file($view = $path.$_ci_file)) {
					$_ci_path = $view;
					break;
				}
				if ( ! $cascade) break;
			}
		}
		elseif (isset($_ci_path)) {
			$_ci_file = basename($_ci_path);
			if( ! file_exists($_ci_path)) $_ci_path = '';
		}

		if (empty($_ci_path)) show_error('Unable to load the requested file: '.$_ci_file);

		if (isset($_ci_vars)) $this->_ci_cached_vars = array_merge($this->_ci_cached_vars, (array) $_ci_vars);

		extract($this->_ci_cached_vars);

		ob_start();

		if ((bool) @ini_get('short_open_tag') === FALSE && CI::$APP->config->item('rewrite_short_tags') == TRUE)
		{
			echo eval('?>'.preg_replace("/;*\s*\?>/", "; ?>", str_replace('<?=', '<?php echo ', file_get_contents($_ci_path))));
		}
		else
		{
			include($_ci_path);
		}

		log_message('debug', 'File loaded: '.$_ci_path);

		if ($_ci_return == TRUE) return ob_get_clean();

		if (ob_get_level() > $this->_ci_ob_level + 1)
		{
			ob_end_flush();
		}
		else
		{
			CI::$APP->output->append_output(ob_get_clean());
		}
	}

	public function __destruct() {
        if( $this->x_debug==TRUE ){
			//fix
			echo "<pre>LOADER DEBUG:".print_r($this,true)."</pre>";
		}
    }
}

/** load the CI class for Modular Separation **/
(class_exists('CI', FALSE)) OR require dirname(__FILE__).'/Ci.php';