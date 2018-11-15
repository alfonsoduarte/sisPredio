PrimerasComuniones 						= new Mongo.Collection("primerasComuniones");
PrimerasComuniones.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});