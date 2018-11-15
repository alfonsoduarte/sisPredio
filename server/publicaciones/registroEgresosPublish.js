Meteor.publish("registroEgresos",function(params){
  	return RegistroEgresos.find(params);
});
