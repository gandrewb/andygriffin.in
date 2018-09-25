<?php
	$path = 'articles/'.$_GET['title'].'/';
?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="initial-scale=1.0">
	<link rel="stylesheet" href="../styles/article_base.css" />
	<?php require $path.'head.inc'; ?>
	
	<?php require_once('../modules/analytics.php'); ?>

</head>
<body>

	<header class="logo_header content_width">
		<a href="/blog"><img src="/imgs/ag_logo.svg"></a>
	</header>
	
	<article class="article_body">
		<?php require $path.'article.inc'; ?>
	</article>
	
	<footer></footer>

</body>
</html>