Meteor.publish("apoyoParroquia",function(params){
  	return ApoyoParroquia.find(params);
});

