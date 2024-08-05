<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

(defined('EXT')) OR define('EXT', '.php');

global $CFG;


/* PHP5 spl_autoload */
spl_autoload_register('Modules::autoload');

/**
 * Modular Extensions - HMVC
 *
 * Adapted from the CodeIgniter Core Classes
 * @link	http://codeigniter.com
 *
 * Description:
 * This library provides functions to load and instantiate controllers
 * and module controllers allowing use of modules and the HMVC design pattern.
 *
 * Install this file as application/third_party/MX/Modules.php
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

class Modules
{
	public static $routes, $registry, $locations;
	
	/** Library base class autoload **/
	public static function autoload($class) 
	{			
		/* don't autoload CI_ prefixed classes or those using the config subclass_prefix */
		if (strstr($class, 'CI_') OR strstr($class, config_item('subclass_prefix'))) return;

		/* autoload Modular Extensions MX core classes */
		if (strstr($class, 'MX_')) 
		{
			if (is_file($location = dirname(__FILE__).'/'.substr($class, 3).EXT)) 
			{
				include_once $location;
				return;
			}
			show_error('Failed to load MX core class: '.$class);
		}
		
		/* autoload core classes */
		if(is_file($location = APPPATH.'core/'.ucfirst($class).EXT)) 
		{
			include_once $location;
			return;
		}		
		
		/* autoload library classes */
		if(is_file($location = APPPATH.'libraries/'.ucfirst($class).EXT)) 
		{
			include_once $location;
			return;
		}		
	}

	/** Load a file without setup class **/
	public static function load_file($file, $path) {
		
		//
		$file = str_replace(EXT, '', $file);		
		$location = $path.$file.EXT;

		//
		if(is_file($location)){
			require_once $location;
			return TRUE;
		}
		else return FALSE;
		
		//
		return FALSE;
	}
	
}