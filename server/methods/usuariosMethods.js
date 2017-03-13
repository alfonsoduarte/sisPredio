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
	 	  
	 	Movimientos.remove({});
	 	
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
										 Saldo_capital:"",
										 Capmov:"",
										 Camov:"",
										 Svmov:"",
										 Intmov:"",
										 Intmormov:"",
										 Saldo:""};
									 
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
					obj.Saldo_capital = movimiento.Saldo_capital;
					obj.Capmov = movimiento.Capmov;
					obj.Camov = movimiento.Camov;
					obj.Svmov = movimiento.Svmov;
					obj.Intmov = movimiento.Intmov;
					obj.Intmormov = movimiento.Intmormov;
					obj.Saldo = movimiento.Saldo;
					
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
	insertarContratantes: function (contratantes) {
			
			Contratantes.remove({});
			
			_.each(contratantes, function(contratante){
		  					
					var c = {Icontid:"",Cnomcomp:"",Cnombres:"",Capellidos:"",Crfc:"",Cdomicilio:"",Ctel1:"",Ctel2:"",Ctel3:"",Ccorreo:"",Ccorreo2:"",Icontacid:"",Cuserweb:"",Nom_contacto:""};
					c.Icontid = contratante.Icontid;
					c.Cnomcomp = contratante.Cnomcomp.trim();
							
					c.Cnombres = contratante.Cnombres.trim();
					c.Capellidos = contratante.Capellidos.trim();
					c.Crfc = contratante.Crfc.trim();
					c.Cdomicilio = contratante.Cdomicilio.trim();
					c.Ctel1 = contratante.Ctel1.trim();
					c.Ctel2 = contratante.Ctel2.trim();
					c.Ctel3 = contratante.Ctel3.trim();
					
					c.Ccorreo = contratante.Ccorreo.trim();
					c.Ccorreo2 = contratante.Ccorreo2.trim();
					c.Icontacid = contratante.Icontacid;
					c.Cuserweb = contratante.Cuserweb.trim();
					c.Nom_contacto = contratante.Nom_contacto.trim();
					//Preguntar si existe el contratante	
					
					var buscar = contratante.Cuserweb.trim();
					
					Meteor.call('getContratante', buscar, function(error, result) {
					   if(error)
					   {
						    console.log('ERROR :', error);
						    return;
					   }
					   else if (result)//Ya existe
					   {
						   	//agregarlo a la colección Contratante
						   	c.cuenta_id = result;	
								Contratantes.insert(c);
			  
					   }
					   else if (result===null)
					   {

						   	var cuentaUsuario = {};
						   	cuentaUsuario.profile = {};
						   	
						   	cuentaUsuario.username = contratante.Cuserweb.trim();
						   	cuentaUsuario.password = 'untsaac1';
						   	cuentaUsuario.profile.Icontid = contratante.Icontid;
						   	cuentaUsuario.profile.nombreCompleto = contratante.Cnomcomp.trim();
						   	
								Meteor.call('createUsuario', cuentaUsuario, "Contratante", function(e, r) { 
											if (e)
											{
													console.log("Error:", e);
											}
											else if (r)
											{
												c.cuenta_id = r;	
												Contratantes.insert(c);	
											}		
								});
								
					   }
					});
		  });	 
			return true;
	},
	
  
});