angular.module("parroquias")
.controller("AgendaDiocesanaCtrl", AgendaDiocesanaCtrl);
 function AgendaDiocesanaCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	windows = rc;
  
  rc.action = true;
  rc.nuevo = true;	 
  rc.objeto = {}; 

  this.subscribe('diocesis',()=>{
		return [{estatus: true}]
	}); 
    
	this.subscribe('agendaDiocesana',()=>{
		return [{}]
	});
	
 
	this.helpers({
		diocesis : () => {
		  return Diocesis.find({});
	  },
	  arreglo : () => {
		  return AgendaDiocesana.find();
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
			
			objeto.fecha.setHours(5,0,0,0);
			objeto.estatus = true;
			objeto.usuarioInserto = Meteor.userId();
			AgendaDiocesana.insert(objeto);
			toastr.success('Guardado correctamente.');
			this.objeto = {}; 
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
		
	};

	this.editar = function(id)
	{
	    this.objeto = AgendaDiocesana.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	this.actualizar = function(objeto,form)
	{
			if(form.$invalid){
		        toastr.error('Error al actualizar los datos.');
		        return;
		  }
		  objeto.fecha.setHours(5,0,0,0);
			var idTemp = objeto._id;
			delete objeto._id;		
			objeto.usuarioActualizo = Meteor.userId(); 
			AgendaDiocesana.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
      form.$setUntouched();
	};

	this.cambiarEstatus = function(id)
	{
			var objeto = AgendaDiocesana.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			AgendaDiocesana.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };
  
    	
};