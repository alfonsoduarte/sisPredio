angular.module("parroquias")
.controller("ZonasPastoralesCtrl", ZonasPastoralesCtrl);
 function ZonasPastoralesCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	windows = rc;
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {}; 
  this.buscar = {}; 
  
	this.subscribe('diocesis',()=>{
		return [{estatus: true}]
	}); 
	
	this.subscribe('zonasPastorales',()=>{
		return [{}]
	});
 
	this.helpers({
	  zonasPastorales : () => {
		  return ZonasPastorales.find();
	  },
	  diocesis : () => {
		  return Diocesis.find({});
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
			//console.log(objeto);
			objeto.estatus = true;
			objeto.usuarioInserto = Meteor.userId();
			ZonasPastorales.insert(objeto);
			toastr.success('Guardado correctamente.');
			this.objeto = {}; 
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
		
	};

	this.editar = function(id)
	{
	    this.objeto = ZonasPastorales.findOne({_id:id});
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
			ZonasPastorales.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
      form.$setUntouched();
	};

	this.cambiarEstatus = function(id)
	{
			var objeto = ZonasPastorales.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			ZonasPastorales.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };	
};