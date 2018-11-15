Meteor.publish("bautismos",function(params){
  	return Bautismos.find(params);
});


Meteor.publish("buscarBautismo",function(options){
	
	if (options != undefined)
	{
			let selector = {
				parroquia_id 		: options.where.parroquia_id,
		  	//nombreCompleto	: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
		  	nombreCompleto	: RegExp('^'+options.where.nombreCompleto)
			}
			
			
			return Bautismos.find(selector,{ skip		: options.options.skip,
																			 limit	: options.options.limit, 
																			 fields	: { nombreCompleto	: 1,
																								  fecha						: 1, 
																								  libro						: 1, 
																								  foja						: 1,
																								  noDeActa				: 1,
																								  estatus					: 1 }})	
	}
});



Meteor.publish("buscarBautismoNotaMarginal",function(options){
	
	if (options != undefined)
	{
			let selector = {
				parroquia_id 		: options.where.parroquia_id,
		  	//nombreCompleto	: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
		  	nombreCompleto	: RegExp('^'+options.where.nombreCompleto)
			}
			
			
			return Bautismos.find(selector,{ skip		: options.options.skip,
																			 limit	: options.options.limit, 
																			 fields	: { nombreCompleto	: 1,
																								  fecha						: 1, 
																								  libro						: 1, 
																								  foja						: 1,
																								  noDeActa				: 1,
																								  estatus					: 1,
																								  notasMarginales	: 1 }})	
	}
});