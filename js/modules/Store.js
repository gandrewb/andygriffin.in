'use strict';

var Dom = require('./../ag_lib/js/modules/Dom.js');
Dom = new Dom();

var Columns = require('./ColumnGenerator.js');

function Store(options) {
	this.storedata = options.storedata;
	this.store_elements = [];
	
	this._processData();
	
	Columns = new Columns({
		column_breaks: [700, 1000, 1400],
		content: this.store_elements,
		element: document.getElementById('laser_products')
	});
}

var proto = Store.prototype;


proto._processData = function() {
	var products = this.storedata.results
	
	for (var i=0, len=products.length; i<len; i++) {
		var curprod = products[i];
		
		var newlink = Dom.createElement({
			type: 'a',
			attributes: {
				'href': curprod.url.split('?')[0],
				'class': 'product_link'
			}
		});
		
		var newimg = Dom.createElement({
			type: 'img',
			attributes: {
				'alt': curprod.title,
				'src': curprod.Images[0].url_570xN
			}
		});
		
		var textdiv = Dom.createElement({
			type: 'div',
			attributes: {
				'class': 'product_text'
			}
		});
		
		var title = Dom.createElement({
			type: 'h3',
			textnode: curprod.title
		});
		
		var price = Dom.createElement({
			type: 'p',
			attributes: {
				'class': 'price'
			},
			textnode: '$' + curprod.price
		});
		
		var span = Dom.createElement({
			type: 'span',
			attributes: {
				'class': 'arrow_link'
			},
			textnode: 'See Details'
		});
		
		textdiv.appendChild(title);
		textdiv.appendChild(price);
		textdiv.appendChild(span);
		
		newlink.appendChild(newimg);
		newlink.appendChild(textdiv);
		this.store_elements.push(newlink);
	}
};


module.exports = Store;