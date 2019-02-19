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
					show_pieces: ['voi', 'cinema_sign', 'you_twit', 'lanturn', 'mayfield', 'joy_to_all_people', 'jewelry_stand', 'radical', 'wedding', 'first_light', 'warthen_50', 'holiday_beacon', 'pixar_portal', 'apple', 'farrell_cabinhouse', 'griffin_firepit', 'pinwheel', 'johnson_sandbox', 'pumpkins', 'north_magazine', 'happy_place', 'cyber_warfare', 'faux_fox', 'johnson_firepit', 'creche', 'brandenburg_gate', 'penetration']
					}
				);
				
			}
		});
	}

}

main.init();