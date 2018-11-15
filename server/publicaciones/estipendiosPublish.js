Meteor.publish("estipendios",function(params){
  	return Estipendios.find(params);
});