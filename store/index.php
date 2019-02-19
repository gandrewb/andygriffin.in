<!DOCTYPE html>
<html lang="en">
<head>
	<?php require_once('../modules/doc_head.php'); ?>
	
	<meta name="keywords" content="Andy Griffin, Studios, Andrew, Brian, designer, laser cut, Etsy, products, for sale, graphic design">
	<meta name="description" content="Unique pieces for sale designed by Andy Griffin.">
	
	<title>Store • Andy Griffin</title>
	<link rel="stylesheet" href="/styles/store.css">
</head>
<body class="store_page">

	<?php require_once('../modules/header.php'); ?>
	
	<main>
		<section class="store_intro">
			<h1>Store</h1>
			<p class="intro">Conscientiously designed by Andy Griffin, and precision-cut by a beam of laser light, these unique pieces promise glints of delight and creativity as you welcome them into your life.</p>
		</section>
		
		<section class="store_showroom">
			
			<div class="laser_products columns" id="laser_products"></div>
			
		</section>
	</main>
	
	<?php require_once('../modules/footer.php'); ?>

	<script>
		var etsyData;
		
		function getData(data) {
			etsyData = data;
		}
	</script>
	
	<script src="https://openapi.etsy.com/v2/shops/andygriffinstudios/listings/active.js?includes=Images&sort_on=price&callback=getData&api_key=x0erwi582u4jm7uflooajy2k"></script>
	
	<script src="/scripts/store_page.js"></script>
	
</body>
</html>