Parroquias 						= new Mongo.Collection("parroquias");
Parroquias.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});