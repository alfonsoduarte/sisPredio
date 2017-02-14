Contratantes 						= new Mongo.Collection("contratantes");
Contratantes.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});