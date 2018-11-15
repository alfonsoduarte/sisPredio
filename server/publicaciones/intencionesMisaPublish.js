Meteor.publish("intencionesMisa",function(params){
  	return IntencionesMisa.find(params);
});