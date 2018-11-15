angular.module("parroquias")
.controller("CartaInexistenciaCtrl", CartaInexistenciaCtrl);
 function CartaInexistenciaCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
 	this.action = true;

  this.objeto = {};
  //this.objeto.tipoSacerdote = "PARROQUIA";
  
  this.buscar = {};
  
  $(".js-example-basic-single").select2();
  
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{ "profile.estatus"			: true,
						 	roles									: ["Sacerdote"]
						}]
	});
	
	//Condición del Parametro
  if($stateParams.id != undefined){
	  	
	  	//console.log($stateParams.id)
	  	rc.action = false;
      this.subscribe('primerasComuniones', () => {
        return [{
          	_id : $stateParams.id
        }];
      });
  }
	 
	this.helpers({
		objeto : () => {
		  	var primeraComunion = PrimerasComuniones.findOne($stateParams.id);
		  	
		  	if (primeraComunion != undefined)
		  	{	
			  		var user = Meteor.users.findOne(Meteor.userId());
 			
						if (primeraComunion.tipoSacerdote == "PARROQUIA")
						{
								rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
						}
						else if (primeraComunion.tipoSacerdote == "DIOCESIS")
						{
								rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
 						}
 						
 						if (primeraComunion.estatus == "confirmado")
						{
								rc.estatus = false;
						}
						else if (primeraComunion.estatus == "enTramite")
						{
								rc.estatus = true;
 						}		
 			  		
			  		return primeraComunion;		
		  	}
		  	
	  },
	  
  });
  

  this.guardar = function(objeto,form)
	{
		
			if (form.$invalid){
		     toastr.error('Error al guardar los datos.');
		     return;
		  }
 
 			objeto.usuario_id = Meteor.userId();
		  objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
			
			var user = Meteor.users.findOne({_id:  Meteor.userId()});
			objeto.parroquia_id 		= user.profile.parroquia_id;
			objeto.fechaCreacion	= new Date(); 	 
			
			if (rc.objeto.tipoSacerdote == "PARROQUIA" || rc.objeto.tipoSacerdote == "DIOCESIS"){
					var sacerdote = Meteor.users.findOne(objeto.sacerdote_id);
  			  objeto.sacerdoteNombre 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
 			}
			else
			{
 					objeto.sacerdote_id			= "";
 			}
 			
			loading(true);
			Meteor.call ("setServicios", objeto, "Primera Comunión", function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al guardar los datos.: ', error.details);
					 return
				}
				if (result)
				{
					 rc.objeto = {};
				 		toastr.success('Guardado correctamente.');
				 		$state.go('root.primerasComunionesLista');
					 	loading(false);		 
											
				}
			});
			
		
	};
	
	this.actualizar = function(objeto,form)
	{
			if(form.$invalid){
		        toastr.error('Error al actualizar los datos.');
		        return;
		  }
		  
		  objeto.usuario_id = Meteor.userId();
		  objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
			
			var user = Meteor.users.findOne({_id:  Meteor.userId()});
			objeto.parroquia_id 	= user.profile.parroquia_id;
			objeto.fechaCreacion	= new Date(); 	 
 
 			if (rc.objeto.tipoSacerdote == "PARROQUIA" || rc.objeto.tipoSacerdote == "DIOCESIS"){
					var sacerdote = Meteor.users.findOne(objeto.sacerdote_id);
  			  objeto.sacerdoteNombre 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
 			}
			else
			{
 					objeto.sacerdote_id			= "";
 			}
 
 			var idTemp = objeto._id;
			delete objeto._id;		
			objeto.usuarioActualizo = Meteor.userId(); 
			PrimerasComuniones.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$state.go('root.primerasComunionesLista');
			
	};
	
	this.cambiarEstatus = function()
	{
			if (rc.objeto.estatus == "primeraComunion")
			{
					rc.estatus = false;
			}
			else if (rc.objeto.estatus == "enTramite")
			{
					rc.estatus = true;
					rc.objeto.libro = 0;
					rc.objeto.foja = 0;
					rc.objeto.noDeActa = 0;
			
			}		
	};
	
	this.cargarSacerdotes = function()
	{
 			var user = Meteor.users.findOne(Meteor.userId());
 			
			if (rc.objeto.tipoSacerdote == "PARROQUIA")
			{
					rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
			}
			else if (rc.objeto.tipoSacerdote == "DIOCESIS")
			{
					rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
 			}		
	};
  

};