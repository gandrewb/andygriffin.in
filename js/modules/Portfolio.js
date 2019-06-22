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
	this.column_breaks = options.column_breaks;
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
		var img;
		
		if(list[i].isVideo) {
			img = this._createVideo(dir, list[i]);
		} else {
			img = this._createImage(dir, list[i]);
		}
		
		el.appendChild(img);
	}
};


proto._createImage = function(dir, item) {
	return Dom.createElement({
		type: 'img',
		attributes: {
			'alt': item.alt,
			'src': this.img_directory + dir + '/' + item.filename
		}
	});
};


proto._createVideo = function(dir, item) {
	var vid_attributes = {
		'src': this.img_directory + dir + '/' + item.filename
	};
	
	var attr = item.properties.split(", ");
	
	for (var i=0, len = attr.length; i<len; i++){
		vid_attributes[attr[i]] = '';
	}
	
	return Dom.createElement({
		type: 'video',
		attributes: vid_attributes
	});
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
		column_breaks: this.column_breaks,
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