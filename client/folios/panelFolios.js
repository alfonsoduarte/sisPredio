angular
.module("verificaciones")
.controller("panelFoliosCtrl", panelFoliosCtrl);
function panelFoliosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);	
	
	Window = rc;
	this.buscar = {}
	
  this.action = true;
	this.subscribe('foliosPanel',()=>{
			return [{verificacionEstatus :{$gte:"1",$lt:"8"}, folioEstatus: "1"}]
	});
		
	this.subscribe('logistica',()=>{
		return [{"profile.estatus": true}]
	});
	
	this.subscribe('zona',()=>{
		return [{estatus: true}]
	});

  this.helpers({
	  folios : () => {
		  return Folios.find();
	  },
	  foliosPendientes : () => {
		  return Folios.find({$or: [{verificacionEstatus : "1"}, {verificacionEstatus : "7"} ]}, { sort : {zona_id : 1 } }  ).fetch();
	  },
	  foliosAsignados : () => {
		  	if (this.getReactively('buscar.verificador_id') == undefined)
					 return Folios.find({verificacionEstatus : "2"}, { sort : {nombre:1 ,verificador_id : 1 } }).fetch();
				else
					 return Folios.find({$and: [{verificacionEstatus : "2"}, 
		   													{verificador_id: this.getReactively('buscar.verificador_id')}] 
		  									 			},{ sort : {nombre:1 ,verificador_id : 1 } }).fetch();
	  },	
	  foliosVisitados : () => {	
		  var visitados = Folios.find({verificacionEstatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  if(visitados){
			  return Folios.find({verificacionEstatus : "3", verificacionRazon: {$ne : "No encontrado cliente"} }).fetch();
		  }
	  },
	  foliosVisitadosSegundaVisita : () => {
		  return Folios.find({verificacionEstatus : "3", verificacionRazon: "No encontrado cliente"}).fetch();
	  },
		foliosNoEncontrados : () => {
		  return Folios.find({verificacionEstatus : "4"}).fetch();
	  },
	  foliosNoVisitados : () => {
		  return Folios.find({verificacionEstatus : "5"}).fetch();
	  },
	  foliosPorVisitar : () => {
		  return Folios.find({verificacionEstatus : "6"}).fetch();
	  },
	  zonas : () => {
		  return Zona.find();
	  },
	  verificadores : () => {
		  return Meteor.users.find({roles: ["Verificador"]});
	  },
  });
  
  
  
  
  
  this.nuevo = true;  
  this.nuevoFolio = function()
  {
			this.action = true;
		  this.nuevo = !this.nuevo;
		  this.folio = {}; 
  };
 
	this.guardar = function(folio,form)
	{
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
						
			folio.estatus = 'Pendiente';
			folio.usuarioInserto = Meteor.userId();
			Folios.insert(folio);
			toastr.success('Guardado correctamente.');
			this.folio = {};
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
			$state.go('root.folios');
		
	};
	
	this.editar = function(id)
	{
	    this.folio = Folios.findOne({_id:id});
			this.action = false;
			$('.collapse').collapse('show');
			this.nuevo = false;
	};
	
	this.actualizar = function(folio,form)
	{
			if(form.$invalid){
		        toastr.error('Error al guardar los datos.');
		        return;
		  }
			//console.log(folio);
			var idTemp = folio._id;
			delete folio._id;		
			folio.usuarioActualizo = Meteor.userId(); 
			Folios.update({_id:idTemp},{$set:folio});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	};
		
	this.cambiarEstatus = function(id)
	{
			var folio = Folios.findOne({_id:id});
			if(folio.estatus == true)
				folio.estatus = false;
			else
				folio.estatus = true;
			
			Folios.update({_id:id}, {$set : {estatus : folio.estatus}});
	};
	
	this.finalizarFolio = function(id)
	{
			var folio = Folios.findOne({_id:id});
			folio.folioEstatus = "2";			//Folio Finalizado
			Folios.update({_id:id}, {$set : {folioEstatus : folio.folioEstatus}});
	};
	
	this.duplicadoFolio = function(id)
	{
			var folio = Folios.findOne({_id:id});
			folio.folioEstatus = "3";			//Folio Duplicado
			Folios.update({_id:id}, {$set : {folioEstatus : folio.folioEstatus}});
	};

	this.AsignaAnalistaFolio = function(id)
	{
			var folio = Folios.findOne({_id:id});
			folio.verificacionEstatus = "8";			//Folio Asignado al Analista
			Folios.update({_id:id}, {$set : {verificacionEstatus : folio.verificacionEstatus}});
	};
	
	this.getAnalista = function(usuario_id)
	{		
		//console.log(usuario_id);
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};
	
	this.getVerificador = function(usuario_id)
	{		
			var usuario = Meteor.users.findOne({_id:usuario_id});

			if (usuario)
				 return usuario.profile.nombre;
				 
	};
	
	this.getZona = function(zona_id)
	{		
			var zona = Zona.findOne({_id:zona_id});

			if (zona)
				 return zona.nombre;
				 
	};
	
	this.inicializar = function()
	{		
			this.buscar = {};
						 
	};
	

};