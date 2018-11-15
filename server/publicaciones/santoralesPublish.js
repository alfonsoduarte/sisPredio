Meteor.publish("santorales",function(params){
  	return Santorales.find(params);
});