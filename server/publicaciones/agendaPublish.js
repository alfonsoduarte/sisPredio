Meteor.publish("agenda",function(params){
  	return Agenda.find(params);
});