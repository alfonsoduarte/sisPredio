angular.module("sisPredios")
.controller("RootCtrl", RootCtrl);  
 function RootCtrl($scope, $meteor, $reactive, $state, $stateParams, toastr){
 	let rc = $reactive(this).attach($scope); 
 	this.usuarioActual = {};
 	 	
 	if(Meteor.user() && Meteor.user().roles && Meteor.user().roles[0] != "admin"){
	 	this.autorun(function() {
		 	
	    if(Meteor.user() && Meteor.user()._id){
	      rc.usuarioActual=Meteor.user();
	    }
	    
	  });
	 }
};