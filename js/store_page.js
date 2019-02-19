'use strict';

var Store = require('./modules/Store.js');

var Analytics = require('./modules/Analytics.js');
Analytics = new Analytics();

var main = {
	
	init: function(){
		Analytics.init();
		this.init_etsystore(etsyData);
	},
	
	init_etsystore: function(data) {
		var EtsyStore = new Store({
			storedata: data
		});
	}
}

main.init();