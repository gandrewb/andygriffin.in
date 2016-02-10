$('#search').on('keyup click', function(e){
	var entry = $(this).val();
	$('#search_results').html('');
	if(entry.length>=3){
		$.ajax({
			url: 'http://www.omdbapi.com',
			type: 'GET',
			dataType: 'jsonp',
			data: {'s': entry}
		}).done(function(msg){
			if(msg.Response != 'False'){
				var len = msg.Search.length;
				for(var x=0; x<len; x++){
					var res = $('<div data-imdb="'+msg.Search[x].imdbID+'" class="search_result"><span class="res_year">'+msg.Search[x].Year+'</span> <span class="res_title">'+msg.Search[x].Title+'</span> <span class="res_type">'+msg.Search[x].Type+'</span></div>');
					$('#search_results').append(res);
				}
			}		
		});
	}
});

$('#search_results').on('click', '.search_result', function(){
	$.ajax({
		url: 'http://www.omdbapi.com',
		type: 'GET',
		dataType: 'jsonp',
		data: {'i': $(this).attr('data-imdb') }
	}).done(function(msg){
		$('#movie_form input[type=text]').each(function(){
			$(this).val( msg[$(this).attr('name')] );
			$('#movie_poster').attr('src', msg.Poster);
			$('#imdb_link').attr('href', 'http://www.imdb.com/title/'+msg.imdbID);
		});
	});
});