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

var Dom = require('./../ag_lib/js/modules/Dom.js');
Dom = new Dom();

var Url = require('./../ag_lib/js/modules/Url.js');
Url = new Url();

function Portfolio(container_el, data) {
	this.el = container_el;
	this.projects = JSON.parse(data).projects;
	
	this.thumbnails = this.el.querySelectorAll('[data-portfolio_detail]');
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
	this._analyzeData(this.projects);
	this._createTags(this.el, this.tags);
}

var proto = Portfolio.prototype;


proto.filterByTag = function(tag) {
	this.selected_tag = tag;
	
	this._updateTagTriggers();
	this._updateThumbnails();
	
	this._analyticsEvent('Filter By Tag', tag);
};




proto._analyticsEvent = function(action, label){
	if(window.ga) {
		ga('send', {
			hitType: 'event',
			eventCategory: 'Portfolio',
			eventAction: action,
			eventLabel: label
		});
	}
};


proto._analyzeData = function(data) {
	for (var project in data) {
		this._populateTags(data[project].tags);
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
				'src': '/imgs/portfolio/' + dir + '/' + list[i].filename
			}
		});
		el.appendChild(img);
	}
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
			'href': url
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


proto._detailBtnClick = function(e) {
	var key = e.currentTarget.dataset.portfolio_detail;
	
	Url.addVariables({
		vars: [{key: 'portfolio', val: key}],
		title: this.projects[key].title,
		history: false
	});
	
	this._openPortfolio(key);
};


proto._detailsTriggers = function() {
	for(var i=0, len = this.thumbnails.length; i<len; i++) {
		this.thumbnails[i].addEventListener('click', this._detailBtnClick.bind(this));
	}
	
	this.close_details.addEventListener('click', this._closeDetails.bind(this));
};


proto._openPortfolio = function(projectkey) {

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
	
	this._analyticsEvent('Open Project Detail', projectkey);

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
	for (var i=0, len = this.thumbnails.length; i<len; i++) {
		
		var thm = this.thumbnails[i];
		
		if (this.selected_tag=='') { 
			thm.classList.remove('hidden'); 
		} 
		
		else {
			var key = thm.dataset.portfolio_detail;
			
			if (
				this.projects[key] !== undefined &&
				this.projects[key].tags.indexOf(this.selected_tag) > -1
			) { 
				thm.classList.remove('hidden'); 
			}
			
			else {
				thm.classList.add('hidden');
			}
		}
	}
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
},{"./../ag_lib/js/modules/Dom.js":2,"./../ag_lib/js/modules/Url.js":3}],5:[function(require,module,exports){
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
},{"./ag_lib/js/modules/Ajax.js":1,"./modules/Portfolio.js":4}]},{},[5]);
