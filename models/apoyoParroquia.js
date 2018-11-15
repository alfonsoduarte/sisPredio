ApoyoParroquia 						= new Mongo.Collection("apoyoParroquia");
ApoyoParroquia.allow({
  insert: function () { return true; },
  update: function () { return true; },
  remove: function () { return true; }
});