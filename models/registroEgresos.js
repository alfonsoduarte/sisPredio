RegistroEgresos 						= new Mongo.Collection("registroEgresos");
RegistroEgresos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});


