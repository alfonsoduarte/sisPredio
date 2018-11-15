EgresosDetalle 						= new Mongo.Collection("egresosDetalle");
EgresosDetalle.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});


