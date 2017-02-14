
angular
.module("sisPredios")
.controller("estadoCuentaCtrl", estadoCuentaCtrl);
function estadoCuentaCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
 	
 	this.subscribe('movimientos',()=>{
		return [{Icontid: Meteor.user().profile.Icontid}];
	});
 	
  this.helpers({
	  	movimientos : () => {
		  return Movimientos.find();
	  },
  });
  
 
		
	
};



