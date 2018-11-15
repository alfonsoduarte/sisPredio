Meteor.publish("usuarios",function(params){
  	return Meteor.users.find(params);
});

/*
Meteor.publish("contratantes", function(){
	return Roles.getUsersInRole( ['Contratante']);
});
*/


Meteor.publish("buscarUsuario",function(options){
	
	if (options != undefined)
	{
			let selector = {
		  	"profile.nombreCompleto": { '$regex' : '.*' + options.where.nombreCompleto || '' + '.*', '$options' : 'i' },
			  	roles : ["Contratante"]
			}

			return Meteor.users.find(selector,options.options);
	}											  																						
});
