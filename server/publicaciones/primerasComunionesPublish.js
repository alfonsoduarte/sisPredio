Meteor.publish("primerasComuniones",function(params){
  	return PrimerasComuniones.find(params);
});


Meteor.publish("buscarPrimerasComuniones",function(options){
	
	if (options != undefined)
	{
			let selector = {
				parroquia_id 		: options.where.parroquia_id,
		  	//nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
		  	nombreCompleto	: RegExp('^'+options.where.nombreCompleto)
			}
			return PrimerasComuniones.find(selector,options.options);
	}											  																						
});