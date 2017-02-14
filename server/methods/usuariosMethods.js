Meteor.methods({
  createUsuario: function (usuario, rol) {
	 			var usuario_id = Accounts.createUser({
					username: usuario.username,
					password: usuario.password,			
					profile: usuario.profile
		});
		
		Roles.addUsersToRoles(usuario_id, rol);
		return usuario_id;
	},
	userIsInRole: function(usuario, rol, grupo, vista){
		if (!Roles.userIsInRole(usuario, rol, grupo)) {
	    throw new Meteor.Error(403, "Usted no tiene permiso para entrar a " + vista);
	  }
	},
	updateUsuario: function (usuario, rol) {		
	  var user = Meteor.users.findOne({"username" : usuario.username});
	  Meteor.users.update({_id: user._id}, {$set:{
			username: usuario.username,
			roles: [rol],
			profile: usuario.profile
		}});
		
		Accounts.setPassword(user._id, usuario.password, {logout: false});
	},
	getContratante: function (correo) {
    var c = Meteor.users.findOne({username:correo});
    if (c)
    	return c._id;
    else
    	return null;	
  },
  crearContratantes: function (contratantes) {
	  
		//Borrar la colección Contratantes
		Contratantes.remove();
		  var c;
		  
		  _.each(contratantes, function(contratante){
		  		console.log(contratante);
		  
		  });
  },
  insertarMovimientos: function (movimientos) {
	 	  
		_.each(movimientos, function(movimiento){
		  					
					var obj = {Icontid:"",
										 Cnomcomp:"",
										 Ipredid:"",
										 Nom_predio:"",
										 Nom_programa:"",
										 Imanz:"",
										 Ilote:"",
										 Icredid:"",
										 Precio:"",
										 Irecibo:"",
										 Fpago:"",
										 Capmov:"",
										 Camov:"",
										 Svmov:"",
										 Intmov:"",
										 Intmormov:""};
									 
					obj.Icontid = movimiento.Icontid;
					obj.Cnomcomp = movimiento.Cnomcomp.trim();
							
					obj.Ipredid = movimiento.Ipredid;
					obj.Nom_predio = movimiento.Nom_predio.trim();
					obj.Nom_programa = movimiento.Nom_programa.trim();
					obj.Imanz = movimiento.Imanz;
					obj.Ilote = movimiento.Ilote;
					obj.Icredid = movimiento.Icredid;
					obj.Precio = movimiento.Precio;
					obj.Irecibo = movimiento.Irecibo;
					
					
					obj.Fpago = movimiento.Fpago;
					obj.Capmov = movimiento.Capmov;
					obj.Camov = movimiento.Camov;
					obj.Svmov = movimiento.Svmov;
					obj.Intmov = movimiento.Intmov;
					obj.Intmormov = movimiento.Intmormov;
					
					Movimientos.insert(obj);
		  });	  
			return true;
  },
  removeAllContratantes: function() {
			return Contratantes.remove({});
	},
	removeAllMovimientos: function() {
			return Movimientos.remove({});
	},
  
});