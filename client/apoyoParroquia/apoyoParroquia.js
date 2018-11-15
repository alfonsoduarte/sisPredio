angular.module("parroquias")
.controller("ApoyoParroquiaCtrl", ApoyoParroquiaCtrl);
 function ApoyoParroquiaCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;

  rc.objeto = {}; 
  rc.estipendio = {};
   
  this.subscribe('estipendios',()=>{
			return [{estatus: true}]
	});
	
	this.subscribe('apoyoParroquia',()=>{
			return [{parroquia_id: Meteor.user() != undefined ? Meteor.user().profile.parroquia_id : "" }]
	});
	
	 
	this.helpers({
	  arreglo : () => {
				  
		  var estipendios = Estipendios.find({}, {sort : {nombre : 1}}).fetch();
			
			if (estipendios != undefined)
			{
					_.each(estipendios, function(estipendio){
						
							var apoyoParroquia = ApoyoParroquia.findOne({parroquia_id: Meteor.user().profile.parroquia_id, estipendio_id: estipendio._id  });
							
							if (apoyoParroquia == undefined){
									estipendio.apoyo = 0;
									estipendio.estado = "insertar";
							}
							else
							{ 
									estipendio.apoyo 							= apoyoParroquia.apoyo;
									estipendio.apoyoParroquia_id 	= apoyoParroquia._id;
									estipendio.estado 						= "actualizar";
							}
		
					});
					
					return estipendios;		
			}		  
				
	  }
  }); 
	
  
  this.editarApoyo = function(objeto)
	{
			rc.estipendio = objeto;
			rc.valor = objeto.apoyo;
			$("#modalApoyo").modal('show');
	
	};
  
  this.actualizarApoyo = function(valor, form)
	{
			
			if(form.$invalid){
						toastr.error('Error al actualizar los datos.');
						return;
			}	
			
			if (rc.estipendio.estado == "insertar")
			{
					var apoyo = {};
					apoyo.apoyo 					= rc.valor;
					apoyo.parroquia_id		= Meteor.user().profile.parroquia_id;
					apoyo.estipendio_id		= rc.estipendio._id;
					apoyo.fechaCreacion		= new Date();
					apoyo.usuarioInserto	= Meteor.userId();	
					
					ApoyoParroquia.insert(apoyo);
				
			}
			else if (rc.estipendio.estado == "actualizar")
			{
					console.log(rc.estipendio.apoyoParroquia_id);
					console.log(valor);
					
					ApoyoParroquia.update({_id: rc.estipendio.apoyoParroquia_id}, {$set: {apoyo: valor, usuarioActualizo: Meteor.userId(), fechaActualizo: new Date() }});
					
				
			}
			
			rc.estipendio = {};
			$("#modalApoyo").modal('hide');
	
	};

	
	

	

  
};