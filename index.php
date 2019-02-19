<!DOCTYPE html>
<html lang="en">
<head>
	<?php require_once('modules/doc_head.php'); ?>
	
	<meta name="keywords" content="Andy Griffin, Andrew, Brian, designer, portfolio, web developer, front end, graphic design, environmental graphics, pumpkin, illustration, laser cut, sculpture, landscape architecture, interaction, lighting, website">
	<meta name="description" content="Andy Griffin is a designer specializing in environmental graphics and interaction design.">
	
	<title>Design Portfolio • Andy Griffin</title>
	<link rel="stylesheet" href="styles/portfolio.css">
</head>
<body class="portfolio_page">

	<?php require_once('modules/header.php'); ?>
	
	<main>
		<section class="hero">
			<h2>Andy Griffin</h2>
			<p class="intro">With years of experience in web and graphic design, including 5 years at Apple, I’m seeking new opportunities in interaction design and environmental graphics. If you know of any, <a href="mailto:griffinandyb@gmail.com?subject=About Your Portfolio">let’s talk</a>.</p>
		</section>
		
		<section class="gallery" id="ag_portfolio">
			<h1>Portfolio</h1>
			
			<div class="portfolio_frame columns" id="portfolio_frame">


			</div>
		</section>
	</main>
	
	<?php require_once('modules/footer.php'); ?>
	
	<section id="detail_pane" class="detail_pane">
		<div class="close_bar" id="close_details">&times;</div>
		
		<div class="detail_content">
			<div class="full_info">
				<div class="details">
					<h3>
						<span id="project_title" class="project_title"></span>
						<time id="project_year" class="project_year"></time>
					</h3>
					<p id="project_description" class="project_description"></p>
					<ul id="project_linklist" class="project_linklist"></ul>
				</div>
			</div>
			
			<div class="reel_frame">
				<div id="image_reel" class="image_reel"></div>
			</div>
		</div>
		
		
	</section>

	<script src="scripts/portfolio_page.js"></script>

</body>
</html>