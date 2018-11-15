Meteor.publish("tiemposLiturgicos",function(params){
  	return TiemposLiturgicos.find(params);
});