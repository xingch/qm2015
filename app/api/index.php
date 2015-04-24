<?php

header ( "Content-type: text/html; charset=utf-8" );
$_SERVER ['HTTP_HOST'] = isset ( $_SERVER ['HTTP_X_FORWARDED_HOST'] ) ? $_SERVER ['HTTP_X_FORWARDED_HOST'] : (isset ( $_SERVER ['HTTP_HOST'] ) ? $_SERVER ['HTTP_HOST'] : '');
defined ( 'YII_DEBUG' ) or define ( 'YII_DEBUG', true );
$yii = dirname ( __FILE__ ) . '/../../framework/yiilite.php';
$defineFile	= dirname ( __FILE__ ) . '/../../protected/data/define.php';
require_once ($defineFile);

if(YII_DEBUG){
	$config = dirname ( __FILE__ ) . '/../../protected/config/test/api.php';
	defined ( 'YII_TRACE_LEVEL' ) or define ( 'YII_TRACE_LEVEL', 3 );
}else{
	$config = dirname ( __FILE__ ) . '/../../protected/config/production/api.php';
}
bcscale(8);//设定BC算法精度,小数点后面8位
require_once ($yii);
Yii::createWebApplication ( $config )->run ();
