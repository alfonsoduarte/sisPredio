Santorales 						= new Mongo.Collection("santorales");
Santorales.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});