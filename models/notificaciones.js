Notificaciones 						= new Mongo.Collection("notificaciones");
Notificaciones.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});