<?php
/**
 * 检查Bom文件
 * @author zjx
 *
 */
class findBom {
	public $__dirs = array ();
	public $auto = false;
	public function __construct($path) {
		if (! is_readable ( $path )) {
			throw new Exception ( "path not found {$path}" );
		}
		
		$this->__dirs [0] = $path;
	}
	
	protected function _file($file) {
		if (! strpos ( $file, '.svn' )) {
			$ret = $this->checkBOM ( $file );
			if (strpos ( $ret, 'BOM found' )) {
				echo "filename: $file " . $ret . " <br/>";
			}
		}
	}
	
	public function run() {
		$i = 0;
		while ( true ) {
			if (! isset ( $this->__dirs [$i] )) {
				break;
			}
			
			$this->_fetch ( $i );
			$i += 1;
		}
	}
	
	protected function _fetch($i) {
		$dh = opendir ( $this->__dirs [$i] );
		$file = null;
		while ( false !== ($file = readdir ( $dh )) ) {
			if ($file != '.' && $file != "..") {
				$file = $this->__dirs [$i] . '/' . $file;
				if (is_dir ( $file )) {
					$this->__dirs [] = $file;
				} else {
					$this->_file ( $file );
				}
			}
		}
		
		closedir ( $dh );
	}
	function checkBOM($filename) {
		$contents = file_get_contents ( $filename );
		$charset [1] = substr ( $contents, 0, 1 );
		$charset [2] = substr ( $contents, 1, 1 );
		$charset [3] = substr ( $contents, 2, 1 );
		if (ord ( $charset [1] ) == 239 && ord ( $charset [2] ) == 187 && ord ( $charset [3] ) == 191) {
			if ($this->auto) {
				$rest = substr ( $contents, 3 );
				$this->rewrite ( $filename, $rest );
				$this->checkBOM ( $filename );
				return ("<font color=red>BOM found, automatically removed.</font>");
			} else {
				return ("<font color=red>BOM found.</font>");
			}
		} else
			return ("<font color=blue>BOM Not Found.</font>");
	}
	
	function rewrite($filename, $data) {
		$filenum = fopen ( $filename, "w" );
		flock ( $filenum, LOCK_EX );
		fwrite ( $filenum, $data );
		fclose ( $filenum );
	}
}
date_default_timezone_set ( 'PRC' );
$path = '/home/wwwroot/wg/hqb/protected'; //修改为你要检查的路径
$dir = new findBom ( $path );
$dir->auto = false; //如果设置为True，将直接修改Bom文件
$dir->run ();
?>