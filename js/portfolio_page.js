'use strict';

var AJAX = require('./ag_lib/js/modules/Ajax.js'),
	Analytics = require('./modules/Analytics.js'),
    Portfolio = require('./modules/Portfolio.js');
    
    Analytics = new Analytics();

var AG_Portfolio;

var main = {
	
	init: function(){
		this.retrieveData();
		Analytics.init();
	},
	
	retrieveData: function(){
		AJAX({
			url: '/portfolio/portfolio.json',
			type: 'GET',
			done: function(results) {
				
				AG_Portfolio = new Portfolio( {
					column_breaks: [750, 1100, 1395],
					container: document.getElementById('ag_portfolio'),
					data: JSON.parse(results),
					img_directory: '/imgs/portfolio/',
					show_pieces: ['voi', 'cinema_sign', 'mayfield', 'lanturn', 'bonnaroo', 'radical', 'joy_to_all_people', 'apple', 'wedding', 'warthen_50', 'first_light', 'produce_and_floral', 'bomc', 'you_twit', 'family_signs', 'north_magazine', 'pinwheel', 'happy_place', 'pumpkins', 'jewelry_stand', 'pixar_portal', 'faux_fox', 'holiday_beacon', 'cyber_warfare', 'creche', 'penetration']
					}
				);
				
			}
		});
	}

}

main.init();