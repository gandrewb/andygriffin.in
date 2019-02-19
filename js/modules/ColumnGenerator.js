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