'use strict';

function Analytics(options){}

var proto = Analytics.prototype;


proto.init = function(){
	(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
		
		ga('create', 'UA-17915017-11', 'auto');
		ga('send', 'pageview');
};

proto.recordEvent = function(page, action, label){
	if(window.ga) {
		ga('send', {
			hitType: 'event',
			eventCategory: page,
			eventAction: action,
			eventLabel: label
		});
	}
}


module.exports = Analytics;