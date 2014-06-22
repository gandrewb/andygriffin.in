<?php
header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('America/Los_Angeles');

require_once('../db/db.php');
$db = new Database();

$filter_props = array('category', 'actors', 'composers', 'directors', 'genres', 'languages', 'media', 'mpaa', 'tags', 'tech');

$how_many = 0;

function extractFilters($film, $idx){
	global $list, $filter_props;	
	$len = sizeof($filter_props);
	
	for($x=0; $x<$len; $x++){ // Each database property that matches a filter
		if(!empty($film[$filter_props[$x]])){
			$fil = explode(',', $film[$filter_props[$x]]);
			$fil_len = sizeof($fil);
			for($f=0; $f<$fil_len; $f++){ // Each tag in a category		
				$name = trim($fil[$f]);
				$ct = sizeof($list['filters']);
				$test = false;
				while($test==false){ // Each existing filter looking for matches
					$ct--;
					if($ct<0){
						$new_idx = sizeof($list['filters']);
						$list['filters'][$new_idx] = array('name' => $name, 'category' => $filter_props[$x], 'films' => array($idx), 'idx' => $new_idx);
						$test=true;
					}else{
						if($list['filters'][$ct]['name'] == $name && $list['filters'][$ct]['category'] == $filter_props[$x]){
							$list['filters'][$ct]['films'][] = $idx;
							$test = true;
						}
					}
				}	
			}
		}
	}
}
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
	global $filter_props;
	$new_array = array();
	foreach($a as $k => $v){
		if(!is_int($k) && !in_array($k, $filter_props)){
			$new_array[$k] = $v;
		}
	}
	return $new_array;
}

switch($_REQUEST['action']){
	case 'load':			
		$res = $db->dq('SELECT * FROM movies LIMIT 20');
		$list = array(
			'films' => array(),
			'filters' => array(),
		);
		$res_len = sizeof($res);
		for($i=0; $i<$res_len; $i++){
			$entry = trimArray($res[$i]);
			$entry['sort_title'] = filterTitle($entry['title']);
			$entry['idx'] = $i;
			$list['films'][$i] = $entry;
			extractFilters($res[$i], $i);
		}
		
		echo json_encode($list);
		break;
}

/*
echo $list['filters'][5]['name'];
foreach($list['filters'][5]['films'] as $f){
	echo $list['films'][$f]['title'];
}
*/

?>