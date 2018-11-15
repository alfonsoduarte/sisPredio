Meteor.publish("confirmaciones",function(params){
  	return Confirmaciones.find(params);
});


Meteor.publish("buscarConfirmacion",function(options){
	
	if (options != undefined)
	{
			let selector = {
				parroquia_id 		: options.where.parroquia_id,
		  	//nombreCompleto: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
		  	nombreCompleto	: RegExp('^'+options.where.nombreCompleto)
			}
			
			return Confirmaciones.find(selector,{ skip		: options.options.skip,
																					  limit		: options.options.limit, 
																					  fields	: { nombreCompleto	: 1,
																										  	fecha						: 1, 
																												libro						: 1, 
																												foja						: 1,
																												noDeActa				: 1,
																												estatus					: 1 }})
			
			//return Confirmaciones.find(selector,options.options);
	}											  																						
});