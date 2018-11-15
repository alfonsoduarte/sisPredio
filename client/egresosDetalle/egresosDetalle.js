angular.module("parroquias")
.controller("EgresosDetalleCtrl", EgresosDetalleCtrl);
 function EgresosDetalleCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {}; 
  
	this.subscribe('egresos',()=>{
		return [{estatus : true, tieneDetalle: true}]
	});
	
	this.subscribe('egresosDetalle',()=>{
		return [{}]
	});
	 
	this.helpers({
	  egresos : () => {
		  return Egresos.find({}, {sort : {nombre : 1}});
	  },
	  arreglo : () => {
		  return EgresosDetalle.find({}, {sort : {nombre : 1}});
	  }
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
			objeto.fechaCreacion = new Date();
			
			EgresosDetalle.insert(objeto);
			toastr.success('Guardado correctamente.');
			this.objeto = {}; 
			$('.collapse').collapse('hide');
			this.nuevo = true;

			form.$setPristine();
	    form.$setUntouched();
		
	};

	this.editar = function(id)
	{
	    this.objeto = EgresosDetalle.findOne({_id:id});
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
			objeto.fechaUltimaModificación = new Date();
			EgresosDetalle.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
      form.$setUntouched();
	};

	this.cambiarEstatus = function(id)
	{
			var objeto = EgresosDetalle.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			EgresosDetalle.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };
  
  this.getNombreEgreso = function(id)
	{
			var egreso = Egresos.findOne({_id: id});
			return egreso.nombre;		
	}

};