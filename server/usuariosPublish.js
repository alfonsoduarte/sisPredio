Meteor.publish("usuarios",function(params){
  	return Meteor.users.find(params);
});

Meteor.publish("contratantes", function(){
	return Roles.getUsersInRole( ['Contratante']);
});