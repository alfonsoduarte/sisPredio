Meteor.publish("egresos",function(params){
  	return Egresos.find(params);
});
