Agenda 						= new Mongo.Collection("agenda");
Agenda.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});