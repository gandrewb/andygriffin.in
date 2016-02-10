<?php

require_once('db/db.php');
$db = new Database();

// ! CYCLE THROUGH ENTRIES, CHANGE IMDB VALS
/*
$res = $db->dq('SELECT id, imdb FROM movies');

foreach($res as $r){
	preg_match('/tt[0-9]+/', $r['imdb'], $matches);
	$db->dc('UPDATE movies SET imdb = "'.$matches[0].'" WHERE id = '.$r['id']);
	echo $matches[0].'<br>';
}
*/

$res = $db->dq('SELECT * FROM movies');

foreach($res as $r){
	switch($_GET['action']){
		case 'imdb':
			$mov = json_decode( file_get_contents('http://www.omdbapi.com/?i='.$r['imdb']) );
			
			$query = 'UPDATE movies SET 
						genres = "'. $mov->Genre .'", 
						directors = "'. $mov->Director .'", 
						writers = "'. $mov->Writer .'", 
						actors = "'. $mov->Actors .'", 
						poster = "'. $mov->Poster .'", 
						length  = "'. (int)$mov->Runtime .'",
						mpaa = "'. $mov->Rated .'"
					 WHERE id = '.$r['id'];
			//$query = 'UPDATE movies SET mpaa = "'. $mov->Rated .'" WHERE id = '.$r['id'];
			$query = 'UPDATE movies SET category = "movie" WHERE category = "feature"';
			if($db->dc($query)){ echo $mov->Title .'<br>'; }
			break;
		
		case 'index':
			$tech = array(); //sound, three_d
				if(!empty($r['sound'])){ $tech[] = $r['sound']; }
				if(!empty($r['3d'])){ $tech[] = '3D'; }
			$media = array(); //bluray, dvd, digital
				if(!empty($r['bluray'])){ $media[] = 'Bluray'; }
				if(!empty($r['dvd'])){ $media[] = 'DVD'; }
				if(!empty($r['digital'])){ $media[] = 'Digital'; }
			$query = 'UPDATE movies SET
						media = "'. implode(', ', $media) .'",
						tech = "'. implode(', ', $tech) .'"
					WHERE id = '. $r['id'];
			if($db->dc($query)){ echo $r['title'] .'<br>'; }
			break;
	}
}

?>