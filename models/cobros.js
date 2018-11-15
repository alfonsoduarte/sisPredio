Cobros 						= new Mongo.Collection("cobros");
Cobros.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});