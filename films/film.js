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
		
		films.working = data.films.slice(0);
		filters.working = data.filters.slice(0);
				
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
	
	selection: [],
	sort_by: {
		field: 'name', // name | number
		order: 'asc'
	},
	
	apply: function(){
		var sel_len = this.selection.length;
		if(sel_len > 0){			
			var idxs = this.master[this.selection[0]].films; // films in first filter
			
			if(sel_len > 1){
				for(var x=1; x<sel_len; x++){ // each item in filters.selection (active filters)
					idxs = this.common_vals(idxs, filters.master[this.selection[x]].films);
				}
			}
			
			// populate films.working object with filtered results
			films.working = [];
			var new_len = idxs.length;
			for(var y=0; y<new_len; y++){
				films.working.push(films.master[idxs[y]]);
			}
		}
		films.order();
		films.build();
		filters.pare();
		for(i in dom.frames){
			dom.frames[i].querySelector('div').innerHTML = '';
		}
		filters.order();
		filters.build();
	},
	build: function(){
		var len = this.working.length;
		for(var x=0; x<len; x++){
			var cat_id = this.catId(this.working[x].category);
			if(dom.frames[cat_id] === undefined){
				/*
dom.frames[cat_id] = this.printFrame(this.working[x].category);
				dom.filter_box.appendChild(dom.frames[cat_id]);
*/
			dom.frames[cat_id] = document.getElementById(cat_id);
			}
			dom.frames[cat_id].querySelector('div').appendChild(this.printButton(this.working[x]));
		}
	},
	catId: function(name){
		return name.toLowerCase()+'_frame';
	},
	clear: function(){},
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
			var ft_len = filters.working.length;
			for(var i=0; i<ft_len; i++){
				if(filters.working[i].films.indexOf(films.working[x].idx) > -1){					
					var flt_idx = filters.existing_idx(filters.working[i], temp);
					if(flt_idx > -1){
						temp[flt_idx].films.push(films.working[x].idx);
					}else{						
						var nf = filters.working[i];						
						temp.push({name: nf.name, category: nf.category, films: [films.working[x].idx]});
					}					
				}
			}
		}filters.working = temp;
	},
	printButton: function(fltr){
		var filter = document.createElement('span');
		var class_txt = (this.selection.indexOf(fltr.idx) > -1) ? 'filter_btn selected': 'filter_btn';
		filter.setAttribute('class', class_txt);
		filter.setAttribute('data-idx', fltr.idx);
		filter.setAttribute('data-val', fltr.films.length);
		var txt = document.createTextNode(fltr.name);
		filter.appendChild(txt);
		filter.addEventListener('click', function(e){
			filters.selection.push(e.target.getAttribute('data-idx'));
			filters.apply();
		});
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