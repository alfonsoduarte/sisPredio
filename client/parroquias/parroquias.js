angular.module("parroquias")
.controller("ParroquiasCtrl", ParroquiasCtrl);
 function ParroquiasCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
  window.rc = rc;
  
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {};
  this.buscar = {};
  this.buscar.nombre = "";
  
  this.subscribe('diocesis',()=>{
		return [{estatus: true}]
	});
  
	this.subscribe('zonasPastorales',()=>{
		return [{ estatus: true}]
	});
	
	this.subscribe('decanatos',()=>{
		return [{ zonaPastoral_id: this.getReactively('objeto.zonaPastoral_id')? this.getReactively('objeto.zonaPastoral_id'):"",
							estatus: true
		}]
	});
	
	this.subscribe('parroquias',()=>{
		return [{}]
	});
	 
	this.helpers({
		diocesis : () => {
		  return Diocesis.find({});
	  },
		zonasPastorales : () => {
		  return ZonasPastorales.find({ diocesis_id : this.getReactively("objeto.diocesis_id") }).fetch();
	  },
	  decanatos : () => {
		  return Decanatos.find({ zonaPastoral_id : this.getReactively("objeto.zonaPastoral_id") });
	  },
	  parroquias : () => {
		  
		  var parrqs = [];
		  
		  if (this.getReactively('buscar.nombre').length == 0)
		  {
		  
				  parrqs = Parroquias.find({}).fetch();
				  
				  _.each(parrqs, function(parroquia){
					  	
					  	Meteor.call('getDecanato', parroquia.decanato_id, function(error, result){
						  	
						  	if (result)
						  	{
						  		parroquia.decanato = result.nombre;
						  		 $scope.$apply();
						  	}
					  	});
							
				  });
				  
			}
			else
			{
					parrqs = Parroquias.find({nombre:{ '$regex' : '.*' + this.getReactively('buscar.nombre') || '' + '.*', '$options' : 'i' } }).fetch();
				  
				  _.each(parrqs, function(parroquia){
					  	
					  	Meteor.call('getDecanato', parroquia.decanato_id, function(error, result){
						  	
						  	if (result)
						  	{
						  		parroquia.decanato = result.nombre;
						  		 $scope.$apply();
						  	}
					  	});
							
				  });		
					
			}
				  
		 
		  return parrqs;
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
			objeto.estatus = true;
			objeto.usuarioInserto = Meteor.userId();
			Parroquias.insert(objeto);
			toastr.success('Guardado correctamente.');
			this.objeto = {}; 
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	
	};

	this.editar = function(id)
	{
	    this.objeto = Parroquias.findOne({_id:id});
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
			var idTemp = objeto._id;
			delete objeto._id;		
			objeto.usuarioActualizo = Meteor.userId(); 
			Parroquias.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
      form.$setUntouched();
	};

	this.cambiarEstatus = function(id)
	{
			var objeto = Parroquias.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			Parroquias.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };	
};