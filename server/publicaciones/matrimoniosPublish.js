Meteor.publish("matrimonios",function(params){
  	return Matrimonios.find(params);
});


Meteor.publish("buscarMatrimoniosEl",function(options){
	
	if (options != undefined)
	{
			let selector = {
				parroquia_id 		: options.where.parroquia_id,
		  	//nombreCompletoEl: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
		  	nombreCompletoEl	: RegExp('^'+options.where.nombreCompleto)
			}
			return Matrimonios.find(selector,options.options);
	}											  																						
});

Meteor.publish("buscarMatrimoniosElla",function(options){
	
	if (options != undefined)
	{
			let selector = {
				parroquia_id 		: options.where.parroquia_id,
		  	//nombreCompletoElla: { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' }
		  	nombreCompletoElla	: RegExp('^'+options.where.nombreCompleto)
			}
			return Matrimonios.find(selector,options.options);
	}											  																						
});