Meteor.publish("agendaDiocesana",function(params){
  	return AgendaDiocesana.find(params);
});