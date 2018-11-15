IntencionesMisa 						= new Mongo.Collection("intencionesMisa");
IntencionesMisa.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});