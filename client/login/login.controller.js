angular
  .module('sisPredios')
  .controller('LoginCtrl', LoginCtrl);
 
function LoginCtrl($scope, $meteor, $reactive, $state, toastr) {
	let rc = $reactive(this).attach($scope);
	
	var myCanvas = document.getElementById("myCanvas");

  this.credentials = {
    username: '',
    password: ''
  };

  this.login = function () {
	  
	  //console.log(this.credentials.username);
	  //console.log(this.credentials.password);
	  
	  this.credentials.username = this.credentials.username.replace("@", ".");
	  
    $meteor.loginWithPassword(this.credentials.username, this.credentials.password).then(
	    /*
	    if (Meteor.user().profile.estatus == false && Meteor.user().profile.nombre != "Super Administrador")
	      {
		      	return $meteor.logout().then(
	            function () {
	              $state.go('anon.login');
	            },
	            function (error) {
	              toastr.error(error.reason);
	            }
          );
	    }
	    */
	    
      function () {
	      toastr.success("Bienvenido al Sistema");
        $state.go('root.home');        
      },
      function (error) {

	      if(error.reason == "Match failed"){
		      toastr.error("Escriba su usuario y contraseña para iniciar");
	      }else if(error.reason == "User not found"){
		      toastr.error("Usuario no encontrado");
	      }else if(error.reason == "Incorrect password"){
		      toastr.error("Contraseña incorrecta");
	      }        
      }
    )
  }
  

	
}