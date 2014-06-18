//array.map() 
//array.filter()

var dom = {
	tbody: document.querySelector('#film_list tbody'),
	filter_box: document.getElementById('filter_box')
};

AG.ajax({
	url: 'model.php',
	type: 'POST',
	data: {action: 'load'},
	done: function(msg){
		var data = JSON.parse(msg);
		var len = data.length;
		for(var x=0; x<len; x++){
			films.add(new Film(data[x], x));
			films.master.push(x);

			films.working.push(x); //this line to be removed once a filter function works
		}		
		films.order();
		films.build();
		filters.order();
		filters.build();
	}
});

var films = {
	data: [],
	
	master: [],
	working: [],

	search_fields: ['title', 'actors', 'composers', 'directors', 'tags'],	
	sort_by: {
		field: 'sort_title',
		order: 'asc'
	},	
	
	add: function(obj){
		this.data[this.data.length] = obj;
	},
	build: function(){
		dom.tbody.innerHTML = '';
		filters.clear();
		var len = films.working.length;
		for(var x=0; x<len; x++){
			var cur_film = films.data[films.working[x]];
			dom.tbody.appendChild(cur_film.printRow());
			filters.extract(cur_film);
		}
	},	
	order: function(){
		films.working.sort(function(a,b){
			var res = (films.data[a].getProp(films.sort_by.field) > films.data[b].getProp(films.sort_by.field)) ? 1: -1;
			if(films.sort_by.order == 'desc'){ 
				res = (res == 1) ? -1: 1; 
			};
			return res;
		});
	},	
};
var filters = {
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
	sort_by: 'name', //name || number
	
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
		for(key in this.list){
			var frame = document.createElement('div');
			frame.setAttribute('class', 'frame');
			var h2 = document.createElement('h2');
			var title = document.createTextNode(key);
			h2.appendChild(title);
			var div = document.createElement('div');			
			for(fil in this.list[key]){
				div.appendChild(this.list[key][fil].printButton());
			}
			frame.appendChild(h2);
			frame.appendChild(div);
			dom.filter_box.appendChild(frame);
		}
	},
	clear: function(){
	},
	extract: function(film){
		for(key in this.list){			
			var vals = film.getFilter(key);
			if(vals){
				var len = vals.length;
				for(var x=0; x<len; x++){				
					var counter = this.list[key].length;
					var tester = false;
					while(tester==false){
						counter--;
						if(counter<0){
							var fidx = this.list[key].length;
							this.list[key][fidx] = new Filter(vals[x].trim(), fidx);
							this.list[key][fidx].add(idx);
							tester = true;
						}else{
							tester = this.list[key][counter].compare(idx, vals[x].trim());
						}
					}
				}
			}
		}
	},
	order: function(){
		for(i in this.list){
			switch(this.sort_by){
				case 'name':
					this.list[i].sort(function(a, b){
						return (a.name > b.name) ? 1 : -1;
					});
					break;
				case 'number':
					this.list[i].sort(function(a, b){
						return a.films.length - b.films.length;
					});
					break;	
			}
		}
	}
};

function Film(params, idx){
	var p = params;
	p.idx = idx;
	
	this.getFilter = function(filter){
		if(p[filter]!=''){
			return p[filter].split(', ');
		}else{
			return false;
		}
	};
	this.getProp = function(prop){
		return p[prop];
	};
	this.printRow = function(){
		var row = document.createElement('tr');
		
		var cell1 = document.createElement('td');
		var txt1 = document.createTextNode(p.year);
		cell1.appendChild(txt1);
		row.appendChild(cell1);
		
		var cell2 = document.createElement('td');
		var txt2 = document.createTextNode(p.title);
		cell2.appendChild(txt2);
		row.appendChild(cell2);
		
		return row;
	};
}

function Filter(name, idx){
	this.name = name;
	this.idx = idx;	
	this.films = [];

	this.add = function(idx){
		this.films[this.films.length] = idx;
	};
	this.compare = function(idx, val){
		if(val==this.name){
			this.add(idx);
			return true;
		}else{
			return false;
		}
	};
	this.printButton = function(){
		var filter = document.createElement('span');
		filter.setAttribute('class', 'filter_btn');
		filter.setAttribute('data-idx', idx);
		filter.setAttribute('data-val', this.films.length);
		var txt = document.createTextNode(name);
		filter.appendChild(txt);
		return filter;
	};
}