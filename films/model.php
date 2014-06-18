<?php
header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('America/Los_Angeles');

require_once('../db/db.php');
$db = new Database();

function filterTitle($title){
	if(preg_match('/^The /', $title)===1){
		return substr($title, 4);	
	}
	else if(preg_match('/^A /', $title)===1){
		return substr($title, 2);
	}
	else {
		return $title;
	}
}
function trimArray($a){
	$new_array = array();
	foreach($a as $k => $v){
		if(!is_int($k)){
			$new_array[$k] = $v;
		}
	}
	return $new_array;
}

	switch($_REQUEST['action']){
		case 'load':			
			$res = $db->dq('SELECT * FROM movies');
			$list = array();
			foreach($res as $r){
				$entry = trimArray($r);
				$entry['sort_title'] = filterTitle($entry['title']);
				$list[] = $entry;
			}
			echo json_encode($list);
			break;
	}
?>