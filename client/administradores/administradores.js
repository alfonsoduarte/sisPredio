angular.module("parroquias")
.controller("AdministradoresCtrl", AdministradoresCtrl);
 function AdministradoresCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
 	this.cambiarContrasena = false;
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {};
  this.buscar = {};
  
  $(".js-example-basic-single").select2();
  
  this.subscribe('diocesis',()=>{
		return [{estatus: true}]
	});
  
  this.subscribe('usuarios',()=>{
		return [{	roles: ["Administrador"] }]
	});
  
	this.subscribe('parroquias',()=>{
		return [{ diocesis_id : this.getReactively("objeto.profile.diocesis_id"), 
							estatus			: true}]
	});
	 
	this.helpers({
		diocesis : () => {
		  return Diocesis.find({});
	  },
	  parroquias : () => {
		  return Parroquias.find({});
	  },
	  administradores : () => {
		  var admins = Meteor.users.find({roles: ["Administrador"]}).fetch();
		  _.each(admins, function(admin){
			  	Meteor.call('getParroquia', admin.profile.parroquia_id, function(error,result){
			    	if (result)
			    	{
				    		admin.profile.parroquia = result.nombre;
				    		$scope.$apply();
			    	}	    
					});			  	
		  });
		  return admins;
	  },
  });
  
  this.Nuevo = function()
  {
    this.action = true;
    this.nuevo = !this.nuevo;
    this.objeto = {};		
  };

  this.guardar = function(objeto,form)
	{
			if(form.$invalid){
						toastr.error('Error al guardar los datos.');
						return;
			}
			
			objeto.profile.estatus = true;
			objeto.profile.usuarioInserto = Meteor.userId();
			objeto.profile.fechaCreacion = new Date();
			var nombre = objeto.profile.nombre != undefined ? objeto.profile.nombre + " " : "";
			var apPaterno = objeto.profile.apellidoPaterno != undefined ? objeto.profile.apellidoPaterno + " " : "";
			var apMaterno = objeto.profile.apellidoMaterno != undefined ? objeto.profile.apellidoMaterno : "";
			objeto.profile.nombreCompleto = nombre + apPaterno + apMaterno;
			//console.log(objeto.profile.nombreCompleto);
			Meteor.call('createUsuario', objeto, "Administrador");
			toastr.success('Guardado correctamente.');
			this.objeto = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.administradores');
	
	};

	this.editar = function(id)
	{
			this.objeto = Meteor.users.findOne(id);  	
			this.objeto.password = "1234";
			this.objeto.confirmPassword = "1234";
	    this.action = false;
	    this.cambiarContrasena = true;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(objeto,form)
	{
			if(form.$invalid){
				toastr.error('Error al actualizar los datos.');
				return;
			}
			var nombre = objeto.profile.nombre != undefined ? objeto.profile.nombre + " " : "";
			var apPaterno = objeto.profile.apPaterno != undefined ? objeto.profile.apPaterno + " " : "";
			var apMaterno = objeto.profile.apMaterno != undefined ? objeto.profile.apMaterno : "";
			objeto.profile.nombreCompleto = nombre + apPaterno + apMaterno;
			delete objeto.profile.confirmPassword;
			Meteor.call('updateUsuario', rc.objeto, "Administrador", this.cambiarContrasena);
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
			form.$setUntouched();
			$state.go("root.administradores");

	};

	this.cambiarEstatus = function(id)
	{
			var objeto = Meteor.users.findOne({_id:id});
			if(objeto.profile.estatus == true)
				objeto.profile.estatus = false;
			else
				objeto.profile.estatus = true;
			
			Meteor.call('updateUsuarioEstatus', id, objeto.profile.estatus);
  };	
  
  this.cambiarPassword = function()
  {
      this.cambiarContrasena = !this.cambiarContrasena; 
  }
};