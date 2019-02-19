(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var Ajax = function(options){ //data, url, type, done
	var ajx, response, params='';
	
	if(options.data!==undefined){
		var ct=0;
		for(var idx in options.data){
			ct++;
			var cha = (ct==1) ? '?': '&';
			params+= cha+idx+'='+options.data[idx];
		}
	}
	
	if(window.XMLHttpRequest){
		ajx = new XMLHttpRequest();
	}else{
		ajx = new ActiveXObject("Microsoft.XMLHTTP");
	}
	ajx.onreadystatechange = function() {
		if(ajx.readyState==4 && ajx.status==200){
			options.done(ajx.responseText);
		}
	}
	ajx.open(options.type, options.url+params, true);
	ajx.send();
};

module.exports = Ajax;
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
'use strict';

var Url = function(){
	this.info = {
		hosts: window.location.host.split('.'),
		path: [],
		protocol: window.location.protocol,
		target: window.location.hash,
		vars: {}
	};
	
	var path = window.location.pathname;
	if (path.length>1){
		this.info.path = path.substr(1).split('/');
	}
	
	var get_vars = window.location.href.split('?');
	if(get_vars.length>1){
		get_vars = get_vars[1].split('&');
		for(var i in get_vars){
			var kv = get_vars[i].split('=');
			this.info.vars[kv[0]] = kv[1];
		}
	}
};

var proto = Url.prototype;




/*
{ 
	vars: [{key: "foo", val: "bar"}],
	title: ''
	history: true
}
*/

proto.addVariables = function(options) {
	options.vars    = options.vars || [];
	options.title   = options.title || '';
	options.history = options.history !== false;
	
	for(var i=0, len=options.vars.length; i<len; i++) {
		var newvar = options.vars[i];
		this.info.vars[newvar.key] = newvar.val;
	}
	
	var newpath = this._assembleURL(false);
	
	if(options.history) {
		window.history.pushState('object or string', options.title, newpath);
	} else {
		window.history.replaceState('object or string', options.title, newpath);
	}
};

proto.getInfo = function() { return this.info; };



proto._assembleURL = function(includehost) {
	
	var vars = '';
	var hash = '';
	var ct = 0;
	
	for(var key in this.info.vars){
		if(this.info.vars[key]) {
			var sep = (ct>0) ? '&' : '?';
			vars += sep + key + '=' + this.info.vars[key];
			ct++;
		}
	}
	
	if(this.info.target) {
		hash = '#' + this.info.target;
	}
	
	var newpath = '/' + this.info.path.join('/') + vars + hash;
	
	if(includehost) {
		return this.info.protocol + '//' + this.info.hosts.join('.') + newpath;
	} else {
		return newpath;
	}
};

module.exports = Url;
},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
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
},{"./../ag_lib/js/modules/Dom.js":2,"./Analytics.js":4}],6:[function(require,module,exports){
'use strict';

var Analytics = require('./Analytics.js');
Analytics = new Analytics();

var Dom = require('./../ag_lib/js/modules/Dom.js');
Dom = new Dom();

var Url = require('./../ag_lib/js/modules/Url.js');
Url = new Url();

var Columns = require('./ColumnGenerator.js');

function Portfolio(options) {
	this.el = options.container;
	this.projects = options.data.projects; // project info from db
	this.show_pieces = options.show_pieces; // names of pieces from db to show
	this.visible_elements = []; // references to elements visible after filtering, passed to columns
	this.img_directory = options.img_directory || '/imgs/';
	
	this.portfolio_frame = document.getElementById('portfolio_frame');
	this.close_details = document.getElementById('close_details');
	
	this.detail_pane = document.getElementById('detail_pane');
	this.details = {
		title: document.getElementById('project_title'),
		year: document.getElementById('project_year'),
		description: document.getElementById('project_description'),
		linklist: document.getElementById('project_linklist'),
		imgreel: document.getElementById('image_reel')
	};
	
	this.tags = [];
	this.tag_triggers = [];
	this.selected_tag = '';
	
	this._checkPortfolioVar();
	this._detailsTriggers();
	this._analyzeData();
	this._initCols();
	this._createTags(this.el, this.tags);
}

var proto = Portfolio.prototype;


proto.filterByTag = function(tag) {
	this.selected_tag = tag;
	
	this._updateTagTriggers();
	this._updateThumbnails();
	
	Analytics.recordEvent('Portfolio', 'Filter By Tag', tag);
};




proto._analyzeData = function() {
	for (var i=0, len=this.show_pieces.length; i<len; i++) {
		var key = this.show_pieces[i];
		var project = this.projects[key];
		
		this._populateTags(project.tags);
		project.el = this._createPortfolioItem(key, project);
		this.visible_elements.push(project.el);
	}
	this.tags.sort()
};


proto._checkPortfolioVar = function() {
	var info = Url.getInfo();
	if(info.vars.portfolio) {
		this._openPortfolio(info.vars.portfolio);
	}
};


proto._closeDetails = function(e) {
	this.detail_pane.classList.remove('show');
	document.documentElement.classList.remove('modal-open');
	
	Url.addVariables({
		vars: [{key: 'portfolio', val: null}],
		title: 'Close Portfolio Modal',
		history: false
	});
};


proto._createImageReel = function(el, dir, list) {
	for (var i=0, len = list.length; i<len; i++){
		var img = Dom.createElement({
			type: 'img',
			attributes: {
				'alt': list[i].alt,
				'src': this.img_directory + dir + '/' + list[i].filename
			}
		});
		el.appendChild(img);
	}
};


proto._createPortfolioItem = function(key, project) {
	var fig = Dom.createElement({
		type: 'figure',
		attributes: {
			'class': 'thumbnail'
		}
	});
	var img = Dom.createElement({
		type: 'img',
		attributes: {
			'src': this.img_directory + project.directory + '/' + project.thumbnail,
			'alt': project.title + ' — by Andy Griffin'
		}
	});
	
	fig.addEventListener('click', function() { this._openPortfolio(key) }.bind(this));
	
	fig.appendChild(img);
	return fig;
};


proto._createTags = function(el, tags) {
	var ul = Dom.createElement({
		type: 'ul',
		attributes: {
			'class': 'tag_frame'
		}
	});
	
	for(var i=0, len = tags.length; i<len; i++) {
		var new_tag = Dom.createElement({
			type: 'li',
			attributes: {
				'class': 'portfolio_tag',
				'data-sort_portfolio': tags[i]
			},
			textnode: tags[i]
		});

		new_tag.addEventListener('click', this._tagBtnClick.bind(this));
		this.tag_triggers.push(new_tag);
		ul.appendChild(new_tag);
	}
	
	el.insertBefore(ul, document.getElementById("portfolio_frame"));
};


proto._createLink = function(url, text) {
	var a = Dom.createElement({
		type: 'a',
		attributes: {
			'href': url,
			'class': 'arrow_link'
		},
		textnode: text
	});

	return a;
};


proto._createLinkList = function(el, list){
	for(var i=0, len = list.length; i<len; i++){
		var li = document.createElement('li');
		var a = this._createLink(list[i].url, list[i].linktext);
		li.appendChild(a);
		el.appendChild(li);
	}
};


proto._detailsTriggers = function() {
	this.close_details.addEventListener('click', this._closeDetails.bind(this));
};


proto._initCols = function() {
	Columns = new Columns({
		column_breaks: [700, 1000, 1400],
		content: this.visible_elements,
		element: this.portfolio_frame
	});
};


proto._openPortfolio = function(projectkey) {

	Url.addVariables({
		vars: [{key: 'portfolio', val: projectkey}],
		title: this.projects[projectkey].title,
		history: false
	});

	var project = this.projects[projectkey];
	
	this.details.title.innerHTML = (project.title) ? project.title : '';
	this.details.year.innerHTML = (project.year) ? project.year : '';
	this.details.description.innerHTML = (project.description) ? project.description : '';
	this.details.linklist.innerHTML = '';
	this.details.imgreel.innerHTML = '';
	
	if (project.urls) {
		this._createLinkList(this.details.linklist, project.urls);
	}
	
	this.detail_pane.classList.add('show');
	
	if (project.images) {
		this._createImageReel(this.details.imgreel, project.directory, project.images);
	}
	
	document.documentElement.classList.add('modal-open');
	
	Analytics.recordEvent('Portfolio', 'Open Project Detail', projectkey);

};


proto._tagBtnClick = function(e) {
	var clicked_tag = e.target.dataset.sort_portfolio;
	var tag = (this.selected_tag == clicked_tag) ? '' : clicked_tag;
	this.filterByTag(tag);
};


proto._updateTagTriggers = function() {
	for (var i=0, len = this.tag_triggers.length; i<len; i++) {
		var trig = this.tag_triggers[i];
		if(this.selected_tag == trig.dataset.sort_portfolio) {
			trig.classList.add('selected');
		}else {
			trig.classList.remove('selected');
		}
	}
};


proto._updateThumbnails = function() {
	this.visible_elements = [];
	
	for (var i=0, len = this.show_pieces.length; i<len; i++) {
		var project = this.projects[this.show_pieces[i]];
		var thm = project.el;
		
		if (this.selected_tag=='') { 
			this.visible_elements.push(thm);
		} 
		
		else {			
			if (
				project !== undefined &&
				project.tags.indexOf(this.selected_tag) > -1
			) { 
				this.visible_elements.push(thm);
			}
		}
	}
	
	Columns.updateContent(this.visible_elements);
};


proto._setClickEvents = function(){
	var triggers = this.el.querySelector('[data-portfolio-detail]');
};


proto._populateTags = function(project_tags){
	for (var i=0, len = project_tags.length; i<len; i++) {
		
		var tag = project_tags[i];
		
		if(this.tags.indexOf(tag) < 0) {
			this.tags.push(tag);
		}
	}
};



module.exports = Portfolio;
},{"./../ag_lib/js/modules/Dom.js":2,"./../ag_lib/js/modules/Url.js":3,"./Analytics.js":4,"./ColumnGenerator.js":5}],7:[function(require,module,exports){
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
},{"./ag_lib/js/modules/Ajax.js":1,"./modules/Analytics.js":4,"./modules/Portfolio.js":6}]},{},[7]);
