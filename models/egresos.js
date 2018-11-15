Egresos 						= new Mongo.Collection("egresos");
Egresos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});


