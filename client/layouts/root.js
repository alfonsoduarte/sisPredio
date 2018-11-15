angular.module("parroquias")
.controller("RootCtrl", RootCtrl);  
 function RootCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope); 
 	this.usuarioActual = {};
 	
 	rc.nombreParroquia = ""; 
  	 
 	 	
 	if(Meteor.user() && Meteor.user().roles && Meteor.user().roles[0] != "super admin"){
	 	this.autorun(function() {
		 	 //console.log("usuario:",Meteor.user());
	    if(Meteor.user() && Meteor.user()._id){
	      rc.usuarioActual = Meteor.user();
	    }
	    
	    var parroquia_id = "";
	    this.subscribe('parroquias', () => {
		    if (Meteor.userId())
		    {
		  		parroquia_id = Meteor.users.findOne({_id:  Meteor.user() != undefined ? Meteor.userId() : "" }).profile.parroquia_id;
		  		return [{_id: parroquia_id}];
		  	}	
		  },
			{
				onReady: function () {
 						var parroquia = Parroquias.findOne(parroquia_id);
						rc.nombreParroquia = parroquia.nombre;		 		
 				}
		  });
		  
 	  });
	}
	 
	 
	 //Funcion Evalua la sessión del usuario
	this.autorun(function() {
    if(!Meteor.user()){	    
	    //console.log("usuario:",Meteor.user());
    	$state.go('anon.login');
    }    
  });	

	 
	 
};