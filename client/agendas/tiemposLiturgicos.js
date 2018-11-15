angular.module("parroquias")
.controller("TiemposLiturgicosCtrl", TiemposLiturgicosCtrl);
 function TiemposLiturgicosCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	windows = rc;
  
  rc.action = true;
  rc.nuevo = true;	 
  rc.objeto = {}; 
  rc.objeto.fecha = "";  
  rc.objeto.fecha = new Date();
    
	this.subscribe('tiemposLiturgicos',()=>{
		return [{}]
	});
	
 
	this.helpers({
	  arreglo : () => {
		  return TiemposLiturgicos.find();
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
			TiemposLiturgicos.insert(objeto);
			toastr.success('Guardado correctamente.');
			this.objeto = {}; 
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
		
	};

	this.editar = function(id)
	{
	    this.objeto = TiemposLiturgicos.findOne({_id:id});
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
			TiemposLiturgicos.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
      form.$setUntouched();
	};

	this.cambiarEstatus = function(id)
	{
			var objeto = TiemposLiturgicos.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			TiemposLiturgicos.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };
  
    	
};