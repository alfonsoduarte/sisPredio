Meteor.publish("diocesis",function(params){
  	return Diocesis.find(params);
});