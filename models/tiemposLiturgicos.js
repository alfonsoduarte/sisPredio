TiemposLiturgicos 						= new Mongo.Collection("tiemposLiturgicos");
TiemposLiturgicos.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});