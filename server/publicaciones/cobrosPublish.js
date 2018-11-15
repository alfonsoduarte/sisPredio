Meteor.publish("cobros",function(params){
  	return Cobros.find(params);
});