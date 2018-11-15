window.camelize = function(str) {
		 	var res = str.split(" ");
	  	var cadena = "";
			_.each(res, function(palabra){
		  		if (palabra.trim() == 'de' || palabra.trim() == 'del' || palabra.trim() == 'la' || palabra.trim() == 'las' || palabra.trim() == 'los' ||
		  				palabra.trim() == 'y' || palabra.trim() == 'e')
		  			 cadena += palabra + " ";	
		  		else
			  		 cadena += palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase() + " ";
	  	});
      return cadena.trim();
}