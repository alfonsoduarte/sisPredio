angular.module("parroquias")
.controller("SantoralesCtrl", SantoralesCtrl);
 function SantoralesCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	windows = rc;
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {}; 
  this.buscar = {}; 
  
  
  this.meses = [{mes: "Enero"			, numero: 1 }, 
  							{mes: "Febrero"		, numero: 2 },
	  						{mes: "Marzo"			,	numero: 3 },
	  						{mes:	"Abril"			, numero: 4 },
	  						{mes:	"Mayo"			, numero: 5 },
	  						{mes:	"Junio"			, numero: 6 },
	  						{mes:	"Julio"			, numero: 7 },
	  						{mes:	"Agosto"		, numero: 8 },
	  						{mes:	"Septiembre", numero: 9 },
	  						{mes:	"Octubre"		, numero: 10},
	  						{mes:	"Noviembre"	, numero: 11},
	  						{mes:	"Diciembre"	, numero: 12}];
  
  rc.dias = [];
  
	this.subscribe('santorales',()=>{
		return [{}]
	});
	 
 
	this.helpers({
	  arreglo : () => {
		  return Santorales.find();
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
			
			objeto.numeroMes = Number(objeto.numeroMes);
			objeto.numeroDia = Number(objeto.numeroDia);
			objeto.estatus = true;
			objeto.usuarioInserto = Meteor.userId();
			Santorales.insert(objeto);
			toastr.success('Guardado correctamente.');
			this.objeto = {}; 
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
	    form.$setUntouched();
		
	};

	this.editar = function(id)
	{
	    this.objeto = Santorales.findOne({_id:id});
	    
	    console.log(this.objeto);
	    
			
	    
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
			Santorales.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$('.collapse').collapse('hide');
			this.nuevo = true;
			form.$setPristine();
      form.$setUntouched();
	};

	this.cambiarEstatus = function(id)
	{
			var objeto = Santorales.findOne({_id:id});
			if(objeto.estatus == true)
				objeto.estatus = false;
			else
				objeto.estatus = true;
			
			Santorales.update({_id: id},{$set :  {estatus : objeto.estatus}});
  };
  
  this.definirDias = function()
	{
			var fecha = new Date();
			var anio = fecha.getFullYear();
			var now = moment(new Date(anio, rc.objeto.numeroMes - 1, 1));
			var days = moment(now).daysInMonth();
			
			rc.dias = [];
			
			for (i = 1; i <= days; i++ ){
					var dia  = {};
					dia.dia = i;		
					rc.dias.push(dia);
			}
			
			rc.objeto.numeroDia = 1;
			
  };
	
	this.getMes = function(mes)
	{

			var nombre = "";
			switch(mes){
					case 1: nombre = "Enero";break;
					case 2: nombre = "Febrero";break;
					case 3: nombre = "Marzo";break;
					case 4: nombre = "Abril";break;
					case 5: nombre = "Mayo";break;
					case 6: nombre = "Junio";break;
					case 7: nombre = "Julio";break;
					case 8: nombre = "Agosto";break;
					case 9: nombre = "Septiembre";break;
					case 10: nombre = "Octubre";break;
					case 11: nombre = "Noviembre";break;
					case 12: nombre = "Diciembre";break;
			}
			 return nombre;
			
  };
  
   	
};