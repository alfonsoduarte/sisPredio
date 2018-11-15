Estipendios 						= new Mongo.Collection("estipendios");
Estipendios.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});