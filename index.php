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
			<p class="intro">With years of experience in web and graphic design, including 5 years at Apple, I’m seeking new opportunities in interaction design and environmental graphics. If you know of any, <a href="mailto:griffinandyb@gmail.com">let’s talk</a>.</p>
		</section>
		
		<section class="gallery" id="ag_portfolio">
			<h1>Portfolio</h1>
			
			<div class="portfolio_frame" id="portfolio_frame">
				
				
				<figure class="thumbnail" data-portfolio_detail="voi">
					<img src="/imgs/portfolio/voi/voi_home.jpg" alt="Voi Homepage — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="lanturn">
					<img src="/imgs/portfolio/wedding_centerpiece/centerpiece.jpg" alt="Lanturn — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="wedding">
					<img src="/imgs/portfolio/wedding/wedding_homepage.jpg" alt="Wedding Homepage — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="you_twit">
					<img src="/imgs/portfolio/you_twit/twit.png" alt="You Twit Logo — by Andy Griffin">
				</figure>

				<figure class="thumbnail" data-portfolio_detail="pixar_portal">
					<img src="/imgs/portfolio/pixar_portal/pixar_portal_home.jpg" alt="Pixar Portal Website — by Andy Griffin">
				</figure>

				<figure class="thumbnail" data-portfolio_detail="johnson_sandbox">
					<img src="/imgs/portfolio/johnson_sandbox/sandbox.jpg" alt="Johnson Sandbox — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="radical">
					<img src="/imgs/portfolio/radical/radical.jpg" alt="RadiCal App — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="cyber_warfare">
					<img src="/imgs/portfolio/cyber_warfare/cyber_ipad_app.jpg" alt="Cyber Warfare Exhibit — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="first_light">
					<img src="/imgs/portfolio/first_light_nativity/first_light.jpg" alt="First Light Nativity — by Andy Griffin">
				</figure>

				<figure class="thumbnail" data-portfolio_detail="apple">
					<img src="/imgs/portfolio/apple/app_store.jpg" alt="Apple App Store Demo — by Andy Griffin">
				</figure>

				<figure class="thumbnail" data-portfolio_detail="nien_nunb">
					<img src="/imgs/portfolio/nien_nunb_pumpkin/nien_nunb.jpg" alt="Nien Nunb Pumpkin — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="holiday_beacon">
					<img src="/imgs/portfolio/holiday_beacon/holiday_beacon.jpg" alt="Holiday Beacon — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="cinema_sign">
					<img src="/imgs/portfolio/cinema_sign/cinema_sign.jpg" alt="Neon Cinema Sign — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="mayfield">
					<img src="/imgs/portfolio/mayfield_singers/mayfield_home.jpg" alt="Mayfield Singers — by Andy Griffin">
				</figure>

				<figure class="thumbnail" data-portfolio_detail="pinwheel">
					<img src="/imgs/portfolio/pinwheel/pinwheel_logo.png" alt="Pinwheel Logo — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="chinese_warrior">
					<img src="/imgs/portfolio/chinese_warrior/warrior.png" alt="Chinese Warrior Illustration — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="north_magazine">
					<img src="/imgs/portfolio/north/north_homepage.jpg" alt="North Magazine Homepage — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="warthen_50">
					<img src="/imgs/portfolio/warthen_2018/warthen_2018.png"  alt="Warthen 50th T-shirt — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="griffin_firepit">
					<img src="/imgs/portfolio/griffin_firepit/griffin_firepit.jpg" alt="Griffin Firepit — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="e_t">
					<img src="/imgs/portfolio/et_pumpkin/et.jpg" alt="E.T. Pumpkin — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="happy_place">
					<img src="/imgs/portfolio/pixar_cityscape/pixar_cityscape.png" alt="Happy Place, a Pixar Cityscape — by Andy Griffin">
				</figure>

				<figure class="thumbnail" data-portfolio_detail="faux_fox">
					<img src="/imgs/portfolio/faux_fox/faux_fox_logo.png" alt="Faux Fox Logo — by Andy Griffin">
				</figure>

				<figure class="thumbnail" data-portfolio_detail="creche">
					<img src="/imgs/portfolio/christmas_creche/creche.jpg" alt="Christmas Crèche Website — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="johnson_firepit">
					<img src="/imgs/portfolio/johnson_firepit/johnson_firepit.jpg" alt="Johnson Firepit — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="brandenburg_gate">
					<img src="/imgs/portfolio/brandenburg_gate/brandenburg_gate_spread.jpg" alt="Brandenburg Gate Spread — by Andy Griffin">
				</figure>
				
				<figure class="thumbnail" data-portfolio_detail="penetration">
					<img src="/imgs/portfolio/penetration/penetration_illustration.jpg" alt="Arrow Penetration Illustration — by Andy Griffin">
				</figure>

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