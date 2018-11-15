Confirmaciones 						= new Mongo.Collection("confirmaciones");
Confirmaciones.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});