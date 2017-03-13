
angular
.module("sisPredios")
.controller("cambioContrasenaCtrl", cambioContrasenaCtrl);
function cambioContrasenaCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	window.rc = rc;
	
	this.contratanteId = $stateParams.id;
	
	this.subscribe('usuarios',()=>{
		console.log("Entro a la suscripción:", this.contratanteId);
		if (this.contratanteId != "")
				return [{_id: this.contratanteId}]
	});
	
	this.helpers({
	  contratantes : () => {
		  if ($stateParams.id != "")
		  return Meteor.users.findOne({roles : ["Contratante"]});
	  },
	});
	
 	this.actualizar = function(usuario,form)
	{
			if(form.$invalid){
		      toastr.error('Error al guardar los datos.');
		      return;
		  }
		  
		  if (usuario.password !== usuario.confirmpassword){
			  	toastr.error('Las contraseñas no coiciden.');
		      return;
		  }
		  
		  
		  var u = {};
		  console.log("Parametro:",$stateParams.id);
		  console.log("Cuenta:",Meteor.user()._id);
		  
		  if ($stateParams.id == "")
		  		u = Meteor.users.findOne({_id: Meteor.user()._id});
		  else
		   	  u = Meteor.users.findOne({_id: $stateParams.id});		   	  
		 
			console.log("u:",u);
			console.log("usuario:",usuario);
		  u.password = usuario.password; 
		  
			Meteor.call('updateUsuario', u, "Contratante");
			toastr.success('Actualizado correctamente.');
		
			form.$setPristine();
	    form.$setUntouched();
	    
	    
	    if ($stateParams.id == "")
	    {	
	    		$state.go('root.estadocuenta');
	    }
	    else
					$state.go('root.listarContratantes');	    		
	    		
	};
 	  
  	
};



