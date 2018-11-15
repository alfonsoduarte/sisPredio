angular.module("parroquias")
.controller("CobroEstipendioCtrl", CobroEstipendioCtrl);
 function CobroEstipendioCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
 	rc.action = true;

  rc.objeto = {}; 
  rc.objeto.arancel = 0;
  rc.objeto.apoyo = 0;
  rc.objeto.hora = new Date();
  rc.objeto.hora.setHours(0,0,0,0);
  
  rc.pago = {};
  rc.pago.pagar = 0;
  rc.pago.total = 0;
  rc.pago.cantidad = 0;
  
  rc.tipo = "";
 
  rc.objeto.esAbono = false;
  rc.objeto.esIndividual = false;
  
  rc.parroquia = {};
  
  rc.arregloEstipendios = [];
  //rc.intencionesPorPagar = [];
  
  rc.num = 0;
  rc.porPagar = false;
  
  this.subscribe('estipendios',()=>{
		return [{estatus: true}]
	});
	
	this.subscribe('parroquias',()=>{
		return [{_id: Meteor.user().profile.parroquia_id}]
	});
	 
	this.subscribe('apoyoParroquia',()=>{
			return [{parroquia_id: Meteor.user() != undefined ? Meteor.user().profile.parroquia_id : "" }]
	});
  
 
	this.helpers({
	  estipendios : () => {
		  return Estipendios.find({tipo: rc.getReactively("tipo") }, {sort : {nombre : 1}});
	  },
	  parroquia : () => {
		  return Parroquias.findOne({_id: Meteor.user().profile.parroquia_id});
	  },
  }); 
  
  this.guardar = function(objeto, form)
	{
			
			if (form.$invalid){
		     toastr.error('Error al agregarx los datos.');
		     return;
		  }
		  
		  if (rc.arregloEstipendios.length == 0)
		  {
			  	toastr.warning('No hay nada por cobrar.');
					return;
		  }
		  
		  if (rc.pago.pagar == 0 &&  rc.pago.total > 0)
		  {
			  	
			  	toastr.warning('No ha ingresado alguna cantidad en los detalles.');
					return;
 		  }
		  
		  if (rc.pago.cantidad < rc.pago.pagar)
		  {
			  	
			  	toastr.warning('Ingrese la cantidad por pagar correcta.');
					return;
 		  }
		  
		  
		  if (rc.pago.pagar < rc.pago.total)
		  {
			  	rc.pago.esAbono = true;
		  }
		  else
		  {
			  	rc.pago.esAbono = false;
		  }
 		  
		  _.each(rc.arregloEstipendios, function(estipendio){
			  	
			  	//hora
		  		var hora = new Date(estipendio.fecha);
		  		hora.setHours(estipendio.hora.getHours(), estipendio.hora.getMinutes(),0,0);
			  	
			  	estipendio.hora = hora;
			  	
			  	if (estipendio.importePagado < estipendio.total)
			  	{
				  		estipendio.esAbono = true;
				  		
			  	}
			  	else if (estipendio.importePagado == estipendio.total)
			  	{
				  		estipendio.esAbono = false;
			  	}
			  	else if (estipendio.importePagado > estipendio.total)
			  	{
				  		estipendio.importePagado = estipendio.total;
				  		estipendio.esAbono = false;
			  	}
			  	
		  });
		  
		  rc.pago.parroquia_id 		= Meteor.user().profile.parroquia_id;
		  rc.pago.usuario_id 			= Meteor.userId();
		  rc.pago.fechaPago				= new Date();
		  rc.pago.estatus					= 1; //1.- pagado		2.- Cancelado
		  
						
			loading(true);
			Meteor.call ("setCobroEstipendio", rc.arregloEstipendios, rc.pago, function(error,result){
	
				if(error){
					console.log(error);
					toastr.error('Error al guardar los datos.: ', error.details);
					loading(false);
					return;
				}
				if (result)
				{
					
					loading(false);
					var cobro_id = result;
					toastr.success('Guardado correctamente.');
					var url = $state.href("anon.cobroTicket", { cobro_id: cobro_id }, { newTab: true });
					window.open(url, '_blank');	
					rc.objeto = {};
										
					rc.arregloEstipendios = [];
					rc.objeto.arancel = 0;
				  rc.objeto.apoyo = 0;				  
				  rc.pago.total = 0;
				  rc.pago.pagar = 0;
				  rc.pago.cantidad = 0;
											
				}
			});
	
			
	
	};
	
	$(document).ready(function() {
		
		//Quita el mouse wheels 
		document.getElementById('cobro').onwheel = function(){ return false; }
		document.getElementById('hora').onwheel = function(){ return false; }
		document.getElementById('fecha').onwheel = function(){ return false; }

	});
	
	
	//**************************************************************************************************************
	this.agregarEstipendio = function(objeto, form)
	{
			if(form.$invalid){
						toastr.error('Error al agregar los datos.');
						return;
			}		
			
						
			rc.num +=1;
			
			if (objeto.pendiente == true)
				objeto.total = 0;
			else
				objeto.total = Number(parseFloat(objeto.arancel + objeto.apoyo).toFixed(2));
				
				
			objeto.pagoSeleccionado = false;
			objeto.importePagado = 0;
			objeto.numero = rc.num;
			objeto.tipo = rc.tipo;
			
			var hora = objeto.hora;
			objeto.hora = new Date(objeto.hora);
			objeto.hora.setHours(hora.getHours());
			
			rc.arregloEstipendios.push(objeto);
			rc.objeto = {};
			rc.objeto.arancel = 0;
			rc.objeto.apoyo = 0;
			rc.tipo = "";
			
			this.sumaTotal();
		
	}
	
	/*
this.agregarEstipendioSinBorrar = function(objeto, form)
	{
			if(form.$invalid){
						toastr.error('Error al agregar los datos.');
						return;
			}		
			
						
			rc.num +=1;
			
			if (objeto.pendiente == true)
				objeto.total = 0;
			else
				objeto.total = Number(parseFloat(objeto.arancel + objeto.apoyo).toFixed(2));
				
				
			objeto.pagoSeleccionado = false;
			objeto.importePagado = 0;
			objeto.numero = rc.num;
			objeto.tipo = rc.tipo;
			
			var hora = objeto.hora;
			objeto.hora = new Date(objeto.hora);
			objeto.hora.setHours(hora.getHours());
			
			rc.arregloEstipendios.push(objeto);
			
			this.sumaTotal();
		
	}
*/
	
	this.quitarIntencion = function(numero)
	{
			pos = functiontofindIndexByKeyValue(rc.arregloEstipendios, "numero", numero);
      rc.arregloEstipendios.splice(pos, 1);
      if (rc.arregloEstipendios.length == 0) rc.num = 0;
      //reorganiza el consecutivo     
      functiontoOrginiceNum(rc.arregloEstipendios, "numero");
      
      
      rc.pago.total = 0;
	    _.each(rc.arregloEstipendios, function(estipendio){
		    	
		    	rc.pago.total += Number(parseFloat(estipendio.importePagado).toFixed(2));
	
	    });
	    
	    rc.pago.total = Number(parseFloat(rc.pago.total).toFixed(2));
	    
	    this.sumaTotal();
	}
	
	this.editarIntencion = function(objeto)
	{
			
			rc.objeto.fecha 					= objeto.fecha;
      rc.objeto.hora						= objeto.hora;
      rc.tipo 									= objeto.tipo;
      rc.objeto.estipendio_id		= objeto.estipendio_id;
      rc.objeto.intencion				= objeto.intencion;
      rc.objeto.concepto				= objeto.concepto;
      rc.objeto.numero					= objeto.numero;
			rc.objeto.arancel					= objeto.arancel;
			rc.objeto.apoyo						= objeto.apoyo;
			
      rc.action = false;
	}
	
	this.actualizarEstipendio = function(objeto, form)
	{
			
			if(form.$invalid){
						toastr.error('Error al actulizar los datos.');
						return;
			}	
			
			if (objeto.pendiente == true)
				objeto.total = 0;
			else
				objeto.total = Number(parseFloat(objeto.arancel + objeto.apoyo).toFixed(2));
			
			rc.pago.pagar = 0;
	    rc.pago.total = 0;
			
			//objeto.numero = rc.num;
      _.each(rc.arregloEstipendios, function(estipendio){
	      	
              if (estipendio.numero == objeto.numero)
              {
                  estipendio.fecha 						= objeto.fecha;
						      estipendio.hora							= objeto.hora;
						      rc.tipo											= objeto.tipo;
						      estipendioestipendio_id			= objeto.estipendio_id;
						      estipendio.intencion 				= objeto.intencion;
						      estipendio.concepto					= objeto.concepto;
						      estipendio.arancel 					= objeto.arancel;
									estipendio.apoyo 						= objeto.apoyo;
									estipendio.total 						= objeto.total;
									estipendio.pagoSeleccionado = false;
									estipendio.importePagado 		= 0;
              }
              
              rc.pago.pagar += Number(parseFloat(estipendio.importePagado).toFixed(2));
							rc.pago.total += Number(parseFloat(estipendio.total).toFixed(2));
              
      });
      
      rc.objeto = {};
      //rc.num = 0;
      rc.action = true;
      
       
			
			rc.pago.pagar = Number(parseFloat(rc.pago.pagar).toFixed(2));
			rc.pago.total = Number(parseFloat(rc.pago.total).toFixed(2));
      

	}
	
	this.cancelarEstipendio = function()
	{
			rc.objeto = {};
      rc.num = -1;
      rc.action = true;

	}
	
	//**************************************************************************************************************
	
	//busca un elemento en el arreglo
  function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
      for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
      
    }
      return null;
  };
    
    //Obtener el mayor
  function functiontoOrginiceNum(arraytosearch, key) {
    var mayor = 0;
      for (var i = 0; i < arraytosearch.length; i++) {
        arraytosearch[i][key] = i + 1;  
      }
  };
	
	this.getEstipendio = function(id)
	{
			return Estipendios.findOne(id).nombre;

	}
	
	this.getArancel = function(id)
	{
			var estipendio = Estipendios.findOne(id).arancel;
			var apoyo = ApoyoParroquia.findOne({parroquia_id	: Meteor.user() != undefined ? Meteor.user().profile.parroquia_id : "",
																					estipendio_id : id	});
																					
			if (apoyo == undefined)
					rc.objeto.apoyo = 0;
			else			
					rc.objeto.apoyo = apoyo.apoyo;
			
			rc.objeto.arancel = estipendio;
			

	}
	
	this.seleccionarPago = function(pago) {
    pago.pagoSeleccionado = !pago.pagoSeleccionado;

    if (pago.pagoSeleccionado)
    	 pago.importePagado = Number(parseFloat(pago.total).toFixed(2)); 
    else
    	 pago.importePagado = 0; 		 
    
    rc.pago.pagar = 0;
    rc.pago.total = 0;
    _.each(rc.arregloEstipendios, function(estipendio){
	    	
	    	rc.pago.pagar += Number(parseFloat(estipendio.importePagado).toFixed(2));
	    	rc.pago.total += Number(parseFloat(estipendio.total).toFixed(2));

    });
		
		rc.pago.pagar = Number(parseFloat(rc.pago.pagar).toFixed(2));
		rc.pago.total = Number(parseFloat(rc.pago.total).toFixed(2));
		    
    
  }
	
	this.sumaTotal = function(objeto)
	{
 		if (objeto != undefined)
 			 if (objeto.importePagado > objeto.total)
				 	 objeto.importePagado = objeto.total;
		
		rc.pago.pagar = 0;
    rc.pago.total = 0;
    _.each(rc.arregloEstipendios, function(estipendio){
	    	
	    	rc.pago.pagar += Number(parseFloat(estipendio.importePagado).toFixed(2));
	    	rc.pago.total += Number(parseFloat(estipendio.total).toFixed(2));

    });
		
		rc.pago.pagar = Number(parseFloat(rc.pago.pagar).toFixed(2));
		rc.pago.total = Number(parseFloat(rc.pago.total).toFixed(2));
			

	}
	
};