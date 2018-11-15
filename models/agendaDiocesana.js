AgendaDiocesana 						= new Mongo.Collection("agendaDiocesana");
AgendaDiocesana.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});