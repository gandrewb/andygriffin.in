<?php

require_once('../../db/db.php');
$db = new Database();

$cat = array(
	"series" => "tv",
	"movie" => "movie" );

$query = 'INSERT INTO movies (title, year, category, imdb, genres, directors, actors, composers, poster, media, tech, languages, length, mpaa, stars, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

$params = array($_POST['Title'], $_POST['Year'], $cat[$_POST['Type']], $_POST['imdbID'], $_POST['Genre'], $_POST['Director'], $_POST['Actors'], $_POST['Composers'], $_POST['Poster'], $_POST['Media'], $_POST['Tech'], $_POST['Languages'], (int)$_POST['Runtime'], $_POST['Rated'], $_POST['Stars'], $_POST['Tags']);

$db->dcParams($query, $params);


header('Location: write_json.php');
exit;