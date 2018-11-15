angular
  .module('parroquias')
  .controller('HomeCtrl', HomeCtrl);
 
function HomeCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams) {
	let rc = $reactive(this).attach($scope);

	window = rc;
	 


}