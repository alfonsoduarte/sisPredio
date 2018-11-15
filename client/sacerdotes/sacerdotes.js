angular.module("parroquias")
.controller("SacerdotesCtrl", SacerdotesCtrl);
 function SacerdotesCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
 	this.cambiarContrasena = false;
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {};
  this.buscar = {};
  this.buscar.nombre = "";
  
  $(".js-example-basic-single").select2();
  
  this.subscribe('diocesis',()=>{
		return [{estatus: true}]
	});
  
	this.subscribe('usuarios',()=>{
		return [{	roles: ["Sacerdote"] }]
	});
	
	this.subscribe('parroquias',()=>{
		return [{estatus: true}]
	});
	 
	this.helpers({
		diocesis : () => {
		  return Diocesis.find({});
	  },
	  parroquias : () => {
		  return Parroquias.find({diocesis_id : this.getReactively("objeto.profile.diocesis_id"), 
															estatus			: true});
	  },
	  sacerdotes : () => {
		  var usuarios = [];
		  
		  if (this.getReactively('buscar.nombre').length == 0)
		  {
					usuarios = Meteor.users.find({roles: ["Sacerdote"]}).fetch();
		  
				  _.each(usuarios, function(usuario){
					  	Meteor.call('getParroquia', usuario.profile.parroquia_id, function(error,result){
					    	if (result)
					    	{
						    		usuario.profile.parroquia = result.nombre;
						    		
						    		$scope.$apply();
					    	}	    
							});			  	
				  });  
			  
		  }
		  else
		  {
			  	usuarios = Meteor.users.find({"profile.nombreCompleto":{ '$regex' : '.*' + this.getReactively('buscar.nombre') || '' + '.*', '$options' : 'i' }, roles: ["Sacerdote"]}).fetch();
		  
				  _.each(usuarios, function(usuario){
					  	Meteor.call('getParroquia', usuario.profile.parroquia_id, function(error,result){
					    	if (result)
					    	{
						    		usuario.profile.parroquia = result.nombre;
						    		
						    		$scope.$apply();
					    	}	    
							});			  	
				  });
			  	
			  	
		  }
		  
		  


		  
		  
		  
		  
		  
		  return usuarios;
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
			Meteor.call('createUsuario', objeto, "Sacerdote");
			toastr.success('Guardado correctamente.');
			this.objeto = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			$state.go('root.sacerdotes');
	
	};

	this.editar = function(id)
	{
	    this.objeto = Meteor.users.findOne(id);  	
			this.objeto.password = "1234";
			this.objeto.confirmPassword = "1234";
	    this.action = false;
	    this.cambiarContrasena = true;
 			
 			var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
	  	while (fileDisplayArea1.firstChild) {
			    fileDisplayArea1.removeChild(fileDisplayArea1.firstChild);
			}
 				    
	    if (this.objeto.profile.firma != undefined)
	    {
		    var img = new Image();
													
				img.id 		= "fotoCargada";
				img.src 	= this.objeto.profile.firma;
				img.width = 400;
				img.height= 150;
											
				fileDisplayArea1.appendChild(img);
			}	
	    
	    
	    $('.collapse').collapse('show');
	    this.nuevo = false;	};
	
	this.actualizar = function(objeto,form)
	{
			if(form.$invalid){
				toastr.error('Error al actualizar los datos.');
				return;
			}
			var nombre = objeto.profile.nombre != undefined ? objeto.profile.nombre + " " : "";
			var apPaterno = objeto.profile.apellidoPaterno != undefined ? objeto.profile.apellidoPaterno + " " : "";
			var apMaterno = objeto.profile.apellidoMaterno != undefined ? objeto.profile.apellidoMaterno : "";
			objeto.profile.nombreCompleto = nombre + apPaterno + apMaterno;
			delete objeto.profile.confirmPassword;
			Meteor.call('updateUsuario', rc.objeto, "Sacerdote", this.cambiarContrasena);
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
			form.$setUntouched();
			$state.go("root.sacerdotes");
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
  
  
  
  $(document).ready( function() {
		
 					
			var fileInput1 = document.getElementById('fileInput1');
			var fileDisplayArea1 = document.getElementById('fileDisplayArea1');
			
			
			//JavaScript para agregar la Foto
			fileInput1.addEventListener('change', function(e) {
				var file = fileInput1.files[0];
				var imageType = /image.jpeg/;
	
				if (file.type.match(imageType)) {
					
					if (file.size <= 512000)
					{
						
						var reader = new FileReader();
		
						reader.onload = function(e) {
							fileDisplayArea1.innerHTML = "";
		
							var img = new Image();
							
							img.id = "fotoCargada";
							img.src = reader.result;
							img.width = 600;
							img.height= 150;
							
							rc.objeto.profile.firma = reader.result;
							
							fileDisplayArea1.appendChild(img);
							
						}
						reader.readAsDataURL(file);			
					}else {
						toastr.error("Error la Imagen supera los 512 KB");
						return;
					}
					
				} else {
					fileDisplayArea1.innerHTML = "File not supported!";
				}
			});
			
			
			
	});
  
};