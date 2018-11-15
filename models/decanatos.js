Decanatos 						= new Mongo.Collection("decanatos");
Decanatos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});