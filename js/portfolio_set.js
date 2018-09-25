'use strict';

var AJAX = require('./ag_lib/js/modules/Ajax.js'),
    Portfolio = require('./modules/Portfolio.js');

var AG_Portfolio;

var main = {
	
	init: function(){
		this.retrieveData();
		this.init_analytics();
	},
	
	init_analytics: function(){
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		
		ga('create', 'UA-17915017-11', 'auto');
		ga('send', 'pageview');
	},
	
	retrieveData: function(){
		AJAX({
			url: '/portfolio/portfolio.json',
			type: 'GET',
			done: function(data) {
				
				AG_Portfolio = new Portfolio(
					document.getElementById('ag_portfolio'),
					data
				);
				
			}
		});
	}

}

main.init();