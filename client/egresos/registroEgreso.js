angular.module("parroquias")
.controller("RegistroEgresoCtrl", RegistroEgresoCtrl);
 function RegistroEgresoCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
  rc.objeto = {}; 
  rc.objeto.fecha = new Date();
  rc.objeto.cantidad = 0;
  
  rc.arreglo = [];
  
	this.subscribe('egresos',()=>{
		return [{estatus : true}]
	});
	
	this.subscribe('egresosDetalle',()=>{
		if (rc.getReactively('objeto.tipoEgreso_id') != undefined)
		 	 return [{tipoEgreso_id: rc.getReactively('objeto.tipoEgreso_id'), estatus: true}]
	});  
	
	this.helpers({
	  egresos : () => {
		  return Egresos.find({}, {sort : {nombre : 1}});
	  },
	  egresosDetalle : () => {
		  return EgresosDetalle.find({}, {sort : {nombre : 1}});
	  }
  }); 
  

  this.guardar = function(objeto)
	{
			loading(true);
			Meteor.call ("setRegistroEgresos", objeto, function(error,result){
	
				if(error){
					toastr.error('Error al guardar los datos.: ', error.details);
					loading(false);
					return;
				}
				if (result)
				{
					var cobro_id = result;
					toastr.success('Guardado correctamente.');			
					loading(false);
				}
			});
			
			rc.objeto = {}; 
			rc.objeto.fecha = new Date();
			rc.objeto.cantidad = 0;
			rc.arreglo = [];
		
	};
	
	this.agregar = function(objeto,form)
	{
			if(form.$invalid){
		        toastr.error('Error al agregar los datos.');
		        return;
		  }
		  
		  var egreso = Egresos.findOne(objeto.tipoEgreso_id);
		  objeto.tipoEgreso = egreso.nombre;

			if (objeto.tipoEgresoDetalle_id != undefined)
			{
					var egresoDetalle = EgresosDetalle.findOne(objeto.tipoEgresoDetalle_id);
					objeto.tipoEgresoDetalle = egresoDetalle.nombre;	 
			}
			
			objeto.usuarioInserto = Meteor.userId();
			objeto.fechaCreacion = new Date();
			objeto.estatus = true;
			
			var user = Meteor.users.findOne(Meteor.userId());
			objeto.parroquia_id = user.profile.parroquia_id;
			
			rc.arreglo.push(objeto);
			
			rc.objeto = {};
			rc.objeto.fecha = new Date();
			rc.objeto.cantidad = 0;
			
	};
	
	
/*

	this.editar = function(id)
	{
	    this.objeto = Egresos.findOne({_id:id});
	    this.action = false;
	    $('.collapse').collapse('show');
	    this.nuevo = false;
	};
	
	
*/

/*
	this.cambiarEstatus = function(id)
	{
			var objeto = Egresos.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			Egresos.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };
*/

};