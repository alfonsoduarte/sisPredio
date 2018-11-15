angular.module("parroquias")
.controller("UsuariosCtrl", UsuariosCtrl);
 function UsuariosCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
 	this.cambiarContrasena = false;
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {};
  this.buscar = {};
  
  rc.parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
  
  $(".js-example-basic-single").select2();
  
  this.subscribe('usuarios',()=>{
	  
	   var parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
	  
		return [{	"profile.parroquia_id" :  parroquia_id,
							roles : {$in : ["Asistente", "Secretaria"]} }]
	});
  
	this.helpers({
	  usuarios : () => {
		  
		  var parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
		  return Meteor.users.find({ "profile.parroquia_id" :  parroquia_id,
			  												 roles : {$in : ["Asistente", "Secretaria"]} });
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
			
			objeto.profile.diocesis_id = Meteor.user().profile.diocesis_id;
			objeto.profile.estatus = true;
			objeto.profile.usuarioInserto = Meteor.userId();
			objeto.profile.fechaCreacion = new Date();
			var nombre = objeto.profile.nombre != undefined ? objeto.profile.nombre + " " : "";
			var apPaterno = objeto.profile.apellidoPaterno != undefined ? objeto.profile.apellidoPaterno + " " : "";
			var apMaterno = objeto.profile.apellidoMaterno != undefined ? objeto.profile.apellidoMaterno : "";
			objeto.profile.nombreCompleto = nombre + apPaterno + apMaterno;
			
			var usuario = Meteor.users.findOne({_id: Meteor.userId()});
			objeto.profile.parroquia_id = usuario.profile.parroquia_id;
			
			Meteor.call('createUsuario', objeto, objeto.profile.rol);
			toastr.success('Guardado correctamente.');
			this.objeto = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.usuarios');
	
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
			var usuario = Meteor.users.findOne({_id: Meteor.userId()});
			objeto.profile.diocesis_id = usuario.profile.diocesis_id;
			objeto.profile.parroquia_id = usuario.profile.parroquia_id;
			delete objeto.profile.confirmPassword;
			Meteor.call('updateUsuario', rc.objeto, objeto.profile.rol, this.cambiarContrasena);
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
			form.$setUntouched();
			$state.go("root.usuarios",{objeto_id : rc.cliente._id});
			
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