//array.map() 
//array.filter()

var dom = {
	tbody: document.querySelector('#film_list tbody'),
	filter_box: document.getElementById('filter_box'),
	frames: []
};

AG.ajax({
	url: 'model.php',
	type: 'POST',
	data: {action: 'load'},
	done: function(msg){
		var data = JSON.parse(msg);
		
		films.master = data.films;
		filters.master = data.filters;
		
		//these lines to be removed once proper filter functions work
		films.working = data.films;
		filters.working = data.filters;
				
		films.order();
		films.build();
		filters.order();
		filters.build();
	}
});

var films = {
	master: [],
	working: [],

	search_fields: ['title', 'actors', 'composers', 'directors', 'tags'],	
	sort_by: {
		field: 'sort_title',
		order: 'asc'
	},	
	
	build: function(){
		dom.tbody.innerHTML = '';
		var len = films.working.length;
		for(var x=0; x<len; x++){
			dom.tbody.appendChild(films.printRow(films.working[x]));
		}
	},	
	order: function(){
		films.working.sort(function(a,b){
			var res = (a[films.sort_by.field] > b[films.sort_by.field]) ? 1: -1;
			if(films.sort_by.order == 'desc'){ 
				res = (res == 1) ? -1: 1; 
			};
			return res;
		});
	},	
	printRow: function(film){
		var row = document.createElement('tr');
		
		var cell1 = document.createElement('td');
		var txt1 = document.createTextNode(film.year);
		cell1.appendChild(txt1);
		row.appendChild(cell1);
		
		var cell2 = document.createElement('td');
		var txt2 = document.createTextNode(film.title);
		cell2.appendChild(txt2);
		row.appendChild(cell2);
		
		return row;
	}
};
var filters = {
	master: [],
	working: [],
	
	list: {
		category: [],
		actors: [],
		composers: [],
		directors: [],
		genres: [],		
		languages: [],
		media: [],
		mpaa: [],
		tags: [],
		tech: []
	},
	selection: [211],
	sort_by: {
		field: 'name', // name | number
		order: 'asc'
	},
	
	apply: function(){
		films.working = films.master;
		for(var i in this.selection){
			for (var f in this.selection[i]){
				films.working.filter(function(el){
					
				});
			}
		}
	},
	build: function(){
		var len = this.working.length;
		for(var x=0; x<len; x++){
			var cat_id = this.catId(this.working[x].category);
			if(dom.frames[cat_id] === undefined){
				dom.frames[cat_id] = this.printFrame(this.working[x].category);
				dom.filter_box.appendChild(dom.frames[cat_id]);
			}
			dom.frames[cat_id].querySelector('div').appendChild(this.printButton(this.working[x], x));
		}
	},
	catId: function(name){
		return name.toLowerCase()+'_frame';
	},
	clear: function(){},
	order: function(){
		this.working.sort(function(a, b){
			var res;
			switch(filters.sort_by.field){
				case 'name':
					res = (a.name > b.name) ? 1 : -1;
					break;
				case 'number':
					res = a.films.length - b.films.length;
					break;
			}
			if(filters.sort_by.order == 'desc'){ 
				res = (res > 0) ? -1: 1; 
			}
			return res;
		});
	},
	printButton: function(fltr, idx){
		var filter = document.createElement('span');
		filter.setAttribute('class', 'filter_btn');
		filter.setAttribute('data-idx', idx);
		filter.setAttribute('data-val', fltr.films.length);
		var txt = document.createTextNode(fltr.name);
		filter.appendChild(txt);
		return filter;
	},
	printFrame: function(name){
		var frame = document.createElement('div');
		frame.setAttribute('class', 'frame');
		frame.setAttribute('id', this.catId(name));
		var h2 = document.createElement('h2');
		var title = document.createTextNode(name);
		h2.appendChild(title);
		var div = document.createElement('div');
		frame.appendChild(h2);
		frame.appendChild(div);
		return frame;
	}
};