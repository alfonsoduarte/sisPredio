Meteor.publish("zonasPastorales",function(params){
  	return ZonasPastorales.find(params);
});