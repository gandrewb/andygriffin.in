(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Dom = function(){};

var proto = Dom.prototype;


proto.createElement = function(options) { // type, attributes, textnode
	var el = document.createElement(options.type);
	
	if (options.attributes !== undefined) {
		for(var attr in options.attributes) {
			el.setAttribute(attr, options.attributes[attr]);
		}
	}
	
	if (options.textnode !== undefined) {
		var text = document.createTextNode(options.textnode);
		el.appendChild(text);
	}
	
	return el;
};


module.exports = Dom;
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
'use strict';

var Analytics = require('./Analytics.js');
Analytics = new Analytics();

var Dom = require('./../ag_lib/js/modules/Dom.js');
Dom = new Dom();

function ColumnGenerator(options) {
	this.column_breaks = options.column_breaks || [700, 1000, 1400];
	this.content = options.content || [];
	this.cur_class = null;
	this.num_cols = 0;
	this.parent_el = options.element;
	
	this._testCols();
	window.addEventListener('resize', this._testCols.bind(this));
}

var proto = ColumnGenerator.prototype;



proto.updateContent = function(content) {
	this.content = content;
	this._rebuildCols(this.num_cols);
};



proto._getNumCols = function(browser_wid) {
	for (var i=0, len=this.column_breaks.length; i<len; i++){
		if (browser_wid < this.column_breaks[i]) {
			return i+1;
		} else if (i == len-1) {
			return i+2;
		}
	}
};


proto._populateColumns = function(divs) {
	var column = 0, colnum = divs.length;
	
	for(var i=0, len=this.content.length; i<len; i++){
		divs[column].appendChild(this.content[i]);
		column = (column==colnum-1) ? 0 : column+1;
	}
};


proto._rebuildCols = function(num) {
	this._setColClass(num);
	this.parent_el.innerHTML = '';
	var column_divs = [];
	
	for(var i=0; i<num; i++) {
		column_divs[i] = Dom.createElement({
			type: 'div',
			attributes: {
				'class': 'col col_' + (i+1)
			}
		});
		
		this.parent_el.appendChild(column_divs[i]);
	};
	
	this._populateColumns(column_divs);
	Analytics.recordEvent('Store', 'Column View', num);
};


proto._setColClass = function(num) {
	this.parent_el.classList.remove(this.cur_class);
	this.cur_class = 'columns_'+num;
	this.parent_el.classList.add(this.cur_class);
};


proto._testCols = function() {
	var numcols = this._getNumCols(window.innerWidth);
	if (numcols != this.num_cols) {
		this._rebuildCols(numcols);
		this.num_cols = numcols;
	}
};



module.exports = ColumnGenerator;
},{"./../ag_lib/js/modules/Dom.js":1,"./Analytics.js":2}],4:[function(require,module,exports){
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
},{"./../ag_lib/js/modules/Dom.js":1,"./ColumnGenerator.js":3}],5:[function(require,module,exports){
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
},{"./modules/Analytics.js":2,"./modules/Store.js":4}]},{},[5]);
