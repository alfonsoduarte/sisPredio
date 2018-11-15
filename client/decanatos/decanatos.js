angular.module("parroquias")
.controller("DecanatosCtrl", DecanatosCtrl);
 function DecanatosCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
  window.rc = rc;
  
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {};
  this.buscar = {};
  
  
	this.subscribe('diocesis',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('zonasPastorales',()=>{
		return [{ estatus: true}]
	});
	
	this.subscribe('decanatos',()=>{
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
		  var decanatos = Decanatos.find({}).fetch();
		  
		  _.each(decanatos, function(decanato){
			  	var zp = ZonasPastorales.findOne(decanato.zonaPastoral_id);
			  	decanato.zonaPastoral = zp.nombre;
		  })
		  
		  return decanatos;
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
			Decanatos.insert(objeto);
			toastr.success('Guardado correctamente.');
			this.objeto = {}; 
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
	
	};

	this.editar = function(id)
	{
	    this.objeto = Decanatos.findOne({_id:id});
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
			Decanatos.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
      form.$setUntouched();
	};

	this.cambiarEstatus = function(id)
	{
			var objeto = Decanatos.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			Decanatos.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };	
};