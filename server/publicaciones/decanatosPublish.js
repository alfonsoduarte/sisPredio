Meteor.publish("decanatos",function(params){
  	return Decanatos.find(params);
});