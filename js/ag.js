var AG = {
	ajax: function(a){ //data, url, type, done		
		var ajx, response, params='';
		
		if(a.data!='undefined'){
			var ct=0;
			for(idx in a.data){
				ct++;
				var cha = (ct==1) ? '?': '&';
				params+= cha+idx+'='+a.data[idx];
			}
		}
		
		if(window.XMLHttpRequest){
			ajx = new XMLHttpRequest();
		}else{
			ajx = new ActiveXObject("Microsoft.XMLHTTP");
		}
		ajx.onreadystatechange = function() {
			if(ajx.readyState==4 && ajx.status==200){
				a.done(ajx.responseText);
			}
		}
		ajx.open(a.type, a.url+params, true);
		ajx.send();
	},
};