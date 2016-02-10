// each filter needs an additional property to track currently number of currently showing films for the badge

var dom = {
	tbody: document.querySelector('#film_list tbody'),
	filter_box: document.getElementById('filter_box'),
	clear: document.getElementById('clear_filters'),
	order: document.getElementById('order_filters'),
	frames: []
};

AG.ajax({
	url: 'model.php',
	type: 'POST',
	data: {action: 'load'},
	done: function(msg){
		var data = JSON.parse(msg);
		
		films.master = data.films;
		films.reset();
		films.order();
		films.build();
		
		filters.master = data.filters;
		filters.reset();
		filters.order();
		filters.build();
	}
});

var films = {
	master: [],
	working: [],

	search_fields: ['title', 'actors', 'composers', 'directors', 'tags', 'shorts'],	
	sort_by: {
		field: 'sort_title',
		order: 'asc'
	},	
	
	build: function(){
		films.clear();
		var len = films.working.length;
		for(var x=0; x<len; x++){
			dom.tbody.appendChild(this.printRow(this.master[this.working[x]]));
		}
	},
	change_order: function(field){
		if(this.sort_by.field == field){
			this.sort_by.order = (this.sort_by.order=='asc') ? 'desc' : 'asc'; 
		}else{
			this.sort_by.field = field;
			this.sort_by.order = 'asc';
		}
	},
	clear: function(){
		dom.tbody.innerHTML = '';
	},
	order: function(){
		this.working.sort(function(a,b){
			var res = (films.master[a][films.sort_by.field] > films.master[b][films.sort_by.field]) ? 1: -1;
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
	},
	reset: function(){
		var len = this.master.length;
		for(var x=0; x<len; x++){
			this.working[x] = x;
		}
	},
	search: function(term){
		var temp = [];
		var len = this.working.length;
		for(var x=0; x<len; x++){
			var film = this.master[this.working[x]];
			console.log(film.title);
			var s_len = this.search_fields.length;
			for(var i=0; i<s_len; i++){
				if(term.match(film[this.search_fields[i]]) && temp.indexOf(this.working[x])==-1){
					temp.push(this.working[x]);
					console.log(' - '+this.search_fields[i]);
				}	
			}
		}
		this.working = temp;
	}
};
var filters = {
	master: [],
	working: [],
	
	selection: [],
	
	sort_by: {
		field: 'name', // name | number
		order: 'asc'
	},
	
	apply: function(new_fltr){
		films.working = this.common_vals(films.working, this.master[new_fltr].films);
		this.selection.push(new_fltr);

		films.order();
		films.build();
				
		filters.pare();		
		filters.order();
		filters.build();
	},
	build: function(){
		filters.clear();
		var len = this.working.length;
		for(var x=0; x<len; x++){
			var filter = this.master[this.working[x]];
			var cat_id = this.catId(filter.category);
			if(dom.frames[cat_id] === undefined){
			dom.frames[cat_id] = document.getElementById(cat_id);
			}
			dom.frames[cat_id].querySelector('div').appendChild(this.printButton(filter));
		}
	},
	catId: function(name){
		return name.toLowerCase()+'_frame';
	},
	clear: function(){
		for(i in dom.frames){
			dom.frames[i].querySelector('div').innerHTML = '';
		}
	},
	common_vals: function(arr1, arr2){
		var fin_arr = [], first, second;		
		if(arr1.length < arr2.length){ first = arr1; second = arr2; } //makes the smallest of the two "first"
		else{ first = arr2; second = arr1; }
		
		var ct = first.length;
		for(var x=0; x<ct; x++){
			if(second.indexOf(first[x]) > -1){
				fin_arr.push(first[x]);
			}
		}
		return fin_arr;
	},
	existing_idx: function(filter, arr){
		var len = arr.length;
		var check = -1;
		for(var x=0; x<len; x++){
			if(arr[x].name == filter.name && arr[x].category == filter.category){
				check = x;
				x = len;
			}
		}
		return check;
	},
	order: function(){
		this.working.sort(function(a, b){
			var res;
			a = filters.master[a]; b = filters.master[b];
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
	pare: function(){
		var temp = [];
		var fm_len = films.working.length;
		
		for(var x=0; x<fm_len; x++){ // Each current film
			var film_idx = films.working[x];
			var cur_film = films.master[film_idx];
			var ft_len = this.working.length;
			
			for(var i=0; i<ft_len; i++){ // Each current filter
				var filt_idx = this.working[i];
				var cur_filt = this.master[filt_idx];
				
				if(cur_filt.films.indexOf(cur_film.idx) > -1){ // if film is in current filter
					if(temp.indexOf(filt_idx) > -1){
						cur_filt.badge++;
					}else{	
						temp.push(filt_idx);					
						cur_filt.badge = 1;
					}					
				}
			}
		}filters.working = temp;
	},
	printButton: function(fltr){
		var filter = document.createElement('span');
		var class_txt = (this.selection.indexOf(fltr.idx+'') > -1) ? 'filter_btn selected': 'filter_btn';
		filter.setAttribute('class', class_txt);
		filter.setAttribute('data-idx', fltr.idx);
		filter.setAttribute('data-val', fltr.badge);
		var txt = document.createTextNode(fltr.name);
		filter.appendChild(txt);
		filter.addEventListener('click', function(e){
			if(e.target.classList.contains('selected')){
				// remove idx from this.selection
				// sort, apply, etc.
			}
			filters.apply(e.target.getAttribute('data-idx'));
		});
		return filter;
	},
	reset: function(){
		this.selection = [];
		var len = this.master.length;
		for(var x=0; x<len; x++){
			this.master[x].badge = this.master[x].total;
			this.working[x] = x;
		}
	}
};

document.body.onload = function(){
	
	dom.clear.addEventListener('click', function(){
		films.reset();
		films.order();
		films.build();
		
		filters.reset();
		filters.order();
		filters.build();
	});
	dom.order.addEventListener('click', function(){
		
	});
	var sorts = document.querySelectorAll('[data-sort]');
	var len = sorts.length;
	for(var x=0; x<len; x++){
		sorts[x].addEventListener('click', function(){
			films.change_order(this.getAttribute('data-sort'));
			films.order();
			films.build();
		});
	}
	document.getElementById('search_field').addEventListener('keyup', function(){
		films.search(this.value);
		films.order();
		films.build();
	});
}