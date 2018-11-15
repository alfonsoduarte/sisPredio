Meteor.publish("egresosDetalle",function(params){
  	return EgresosDetalle.find(params);
});
