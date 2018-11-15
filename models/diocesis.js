Diocesis 						= new Mongo.Collection("diocesis");
Diocesis.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});