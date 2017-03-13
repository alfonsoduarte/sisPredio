
angular
.module("sisPredios")
.controller("listarContratantesCtrl", listarContratantesCtrl);
function listarContratantesCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	window.rc = rc;
	
	this.contratantes = [];
	
	this.buscar = {};
  this.buscar.nombre = '';

	this.subscribe('buscarContratante', () => {
		
			
			if (this.getReactively('buscar.nombre') == "")
					return;
					
			if (this.getReactively("buscar.nombre").length > 4)
			{
			
			    return [{
				    options : { limit: 10 },
				    where : { 
					    "nombreCompleto" : this.getReactively('buscar.nombre')
					  }  
			    }];
			}   
  });
	
	this.helpers({
	  contratantes : () => {
		  return Meteor.users.find({roles : ["Contratante"]});
	  },
	});
			
	
};



