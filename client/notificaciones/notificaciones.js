angular
.module("parroquias")
.controller("NotificacionesCtrl", NotificacionesCtrl);
function NotificacionesCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	window = rc;
	
	rc.fechaInicial = new Date();
  rc.fechaInicial.setHours(0,0,0,0);
  
  rc.fechaFinal = new Date();
  rc.fechaFinal.setHours(23,59,59,999);
  
  this.buscar = {};
  this.buscar.nombre = "";
  
  rc.nota = {};
  rc.objetoImprimir = {};
	
	rc.notificacionesPorAplicar = [];
	rc.notificacionesHechas 		= [];
	rc.historial						 		= [];
	
	
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{	"profile.parroquia_id": usuario.profile.parroquia_id,
							"profile.estatus"			: true,
							roles									: ["Sacerdote"]
						}]
	});
	
	this.subscribe('buscarBautismoNotaMarginal', () => {
	  
		if(this.getReactively("buscar.nombre")!= undefined && this.getReactively("buscar.nombre").length >= 4){
			
			var user = Meteor.users.findOne();
 
			return [{
		    options : { limit	: 20
		    					},
		    where 	: { parroquia_id : user.profile.parroquia_id,
				 						nombreCompleto : this.getReactively('buscar.nombre')
									} 		   
	    }];
		}
  });
	
	this.subscribe('notificaciones',()=>{
		return [{ $or : [ { parroquiaDestino_id :  Meteor.user().profile.parroquia_id}, { parroquiaOrigen_id:   Meteor.user().profile.parroquia_id } ], estatus : 1} ];
	});
	
	
	this.helpers({
		notificacionesPorAplicar : () => {
			 return Notificaciones.find({parroquiaDestino_id: Meteor.user().profile.parroquia_id, estatus: 1});
		}, 	
		
		notificacionesHechas : () => {
			 return Notificaciones.find({parroquiaOrigen_id: Meteor.user().profile.parroquia_id, estatus: 1});
		}, 
		arreglo : () => {
			if(this.getReactively("buscar.nombre")!= undefined && this.getReactively("buscar.nombre").length >= 4){
			
				return Bautismos.find({
			  	"nombreCompleto": { '$regex' : this.getReactively('buscar.nombre') } });
			
			}
		},
			
	});	 
	
	
	this.buscarBautizados = function(nota)
	{	
			this.buscar.nombre ="";
			rc.nota = nota;
			$("#modalAplicarBautizado").modal('show');	
	}	
	
	this.aplicarNota = function(bautizado)
	{	

			customConfirm('¿Estás seguro de aplicar la nota?, verifique que antes se haya escrito en el libro.', function() {
										
					var numero = 0;
	  			if (bautizado.notasMarginales == undefined)
	  			{
		  				bautizado.notasMarginales = [];
	  			}

	  			numero = bautizado.notasMarginales.length + 1;
	  				  			
	  			bautizado.notasMarginales.push({numero: numero, tipoNota: rc.nota.tipoNota, fecha: rc.nota.fecha, nota: rc.nota.nota, lugar: rc.nota.lugarOrigen});
	  			
	  			Bautismos.update({_id: bautizado._id}, {$set: {notasMarginales: bautizado.notasMarginales}} )
			  	
			  	Notificaciones.update({_id: rc.nota._id}, {$set: {estatus: 2}});
					
					$("#modalAplicarBautizado").modal('hide');
					
					
			});	
			
	}
	
	this.aplicarNotificacion = function(objeto)
	{	

			customConfirm('¿Estás seguro de aplicar la nota?, verifique que antes se haya recibido la carta correspondiente para aplicarla.', function() {
										
					
					Notificaciones.update({_id: objeto._id},{$set: {estatus:2}});
					toastr.success("Nota Aplicada");
					
			});	
			
	}
	
	
	this.imprimirNotificacion = function(form, tipo)
	{
			
			var tieneFirma 		= "";
		  var firma 		 		= "";
		  var nombreReporte = "";
		  
		  function formatDate(date) {
			  
		  	  date = new Date(date);
 
				  var monthNames = [
				    "ENERO", "FEBRERO", "MARZO",
				    "ABRIL", "MAYO", "JUNIO", "JULIO",
				    "AGOSTO", "SEPTIEMBRE", "OCTUBRE",
				    "NOVIEMBRE", "DICIEMBRE"
				  ];
				  var day = date.getDate();
				  var monthIndex = date.getMonth();
				  var year = date.getFullYear();
			
				  return day + ' ' + 'DE ' + monthNames[monthIndex] + ' DE'  + ' ' + year;
			}
		  
			var parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
			//console.log(rc.objetoImprimir)
		  var sacerdote = Meteor.users.findOne(rc.sacerdoteFirma_id);
		  
		  var parroquia = Parroquias.findOne({_id: parroquia_id});
		  
		  if (sacerdote.profile.firma == undefined)
			{
					tieneFirma 		= "No";
					firma			 		= "";
					
					if (rc.objetoImprimir.tipoNota == 'MATRIMONIO')
							nombreReporte = 'NotificacionMatrimonio';	
					else if (rc.objetoImprimir.tipoNota == 'PRIMERA COMUNIÓN')			
							nombreReporte = 'NotificacionPrimeraComunion';
					else if (rc.objetoImprimir.tipoNota == 'CONFIRMACIÓN')			
							nombreReporte = 'NotificacionConfirmacion';		
							
					
			}
			else
			{
					tieneFirma 		= "Si";
					firma			 		= sacerdote.profile.firma;
					if (rc.objetoImprimir.tipoNota == 'MATRIMONIO')
							nombreReporte = 'NotificacionMatrimonioFirma';	
					else if (rc.objetoImprimir.tipoNota == 'PRIMERA COMUNIÓN')			
							nombreReporte = 'NotificacionPrimeraComunionFirma';
					else if (rc.objetoImprimir.tipoNota == 'CONFIRMACIÓN')			
							nombreReporte = 'NotificacionConfirmacionFirma';
							
							
			}
			
			var datos = {};
			
			datos 													= rc.objetoImprimir;
			datos.fechaImpresion						= formatDate(new Date());
																			
			datos.parroquia									= parroquia.nombre;
			datos.tipoParroquia							= parroquia.tipo;
			datos.parroquiaLugar						= parroquia.lugar;
																			
			datos.nombreFirma								= sacerdote.profile.nombreCompleto;
			datos.cargoFirma								= sacerdote.profile.cargo;
			
			datos.fechaSacramentoImpresion	= formatDate(rc.objetoImprimir.fechaSacramento);

			loading(true);
			Meteor.call('report', {
	      templateNombre: nombreReporte,
	      reportNombre	: nombreReporte + 'Out',
		      type					: 'pdf',  
	      datos					: datos,
		    }, function(err, file) {
		      if(!err){
		        downloadFile(file);
		      }else{
		        toastr.warning("Error al generar el reporte");
		      }
		      loading(false);
	    });
	    
	    $("#modalFirma").modal('hide');
			
			
	}
	
	this.seleccionaFirma = function(objeto)
	{
			rc.sacerdote_id = "";
			rc.sacerdoteFirma_id = "";
			rc.objetoImprimir = objeto;
			rc.sacerdotesFirma = Meteor.users.find({roles : ["Sacerdote"]}).fetch();
		
			$("#modalFirma").modal();
			
 	}	
 	
 	this.verNota = function(objeto)
	{
			rc.notaSacramento = objeto;
			$("#verNota").modal();
			
 	}	
 	
 	this.buscar = function(){

		var usuario = Meteor.user();
				
	  rc.fechaInicial.setHours(0,0,0,0);
		rc.fechaFinal.setHours(23,59,59,999);
		
    rc.historial = [];
		
		loading(true);		
		Meteor.call("getNotificaciones", this.fechaInicial, this.fechaFinal, usuario.profile.parroquia_id, function(error, result){
				if  (result)
				{
						rc.historial  = result;
										
						
						loading(false);
						$scope.$apply();
				}
		});
			
	};
		
	
/*
	
		
	rc.objeto = {};
	rc.objeto.evaluacion = "";
	rc.objeto.indicacion = "";

	
	this.subscribe('notificaciones',()=>{
			return [{sucursal_id: Meteor.user() != undefined ? Meteor.user().profile.sucursal_id : "", 
						  requiereVerificacion : true , 
						  estatus: 0}]
	},{
		onReady:()=>{
		}	
	});
	
	
	//Aunque diga cliente es para los verificadores
	this.subscribe('cliente',()=>{
			return [{"profile.sucursal_id"		: Meteor.user() != undefined ? Meteor.user().profile.sucursal_id : "", 
						   "profile.estaVerificado" : false }]	
	});	
	
	
	this.subscribe('verificaciones',()=>{
		  var FI = new Date(rc.getReactively("fechaInicial"));
		  FI.setHours(23,0,0,0);	
			
			return [{ sucursal_id				: Meteor.user() != undefined ? Meteor.user().profile.sucursal_id : "",
								//usuarioVerifico 	: Meteor.user() != undefined ? Meteor.userId():"", 
								fechaVerificacion : { $gte : rc.getReactively("fechaInicial"), $lte : FI}}]
	});
	
	this.helpers({
		creditos : () => {
			rc.creditos = Creditos.find({},{ sort : {fechaSolicito : 1 }}).fetch();
		  if (rc.creditos != undefined)
		  {
			  _.each(rc.creditos, function(credito){
	
							var cliente = {};

							Meteor.apply('getUsuario', [credito.cliente_id], function(error, result) {
							   if(error)
							   {
								    console.log('ERROR :', error);
								    return;
							   }
							   if(result)
							   {	
									 		cliente = result;
											credito.nombreCliente = cliente.nombreCompleto;
											credito.numeroCliente = cliente.numeroCliente;
											$scope.$apply();
								 }
							});							
												})
		  }
			return rc.creditos;			 
		}, 	
		verificacionesHechas :() =>{
			var ver = Verificaciones.find({}).fetch();
			
			_.each(ver, function(v){
				
				if (v.tipoVerificacion == 'solicitante o aval' && v.verificacionPersona == 1)
						v.tipoVerificacionTabla = 'Solicitante';
				if (v.tipoVerificacion == 'solicitante o aval' && v.verificacionPersona == 2)
						v.tipoVerificacionTabla = 'Aval';
				if (v.tipoVerificacion == 'vecino' && v.verificacionPersona == 1)
						v.tipoVerificacionTabla = 'Vecino Solicitante';		
				if (v.tipoVerificacion == 'vecino' && v.verificacionPersona == 2)
						v.tipoVerificacionTabla = 'Vecino Aval';
						
				
			});
			
			
			_.each(ver, function(v){
					Meteor.apply('getUsuario', [v.cliente_id], function(error, result) {
					   if(error)
					   {
						    console.log('ERROR :', error);
						    return;
					   }
					   if(result)
					   {	
							 		cliente = result;
									v.nombreCliente = cliente.nombreCompleto;
									v.numeroCliente = cliente.numeroCliente;
									$scope.$apply();
						 }
					});
				
			});
			
			return ver;
		},
		distribuidores :() =>{
			return Meteor.users.find({roles: ["Distribuidor"]});			
		},		
	});	 
					  
  this.mostrarEvaluacion = function(id)
	{	
			rc.objeto.indicacion = "";
			rc.objeto.evaluacion = "";
			rc.creditoSeleccionado = id;
			rc.distribuidorSeleccionado = "";
			$("#modalEvaluarVerificacion").modal('show');	
	}	
	
	this.mostrarEvaluacionD = function(id)
	{	
			rc.objeto.indicacion = "";
			rc.objeto.evaluacion = "";
			rc.creditoSeleccionado = "";
			rc.distribuidorSeleccionado = id;
			$("#modalEvaluarVerificacionD").modal('show');	
	}	
  
  this.finalizarVerificacion = function(objeto)
	{
			
			if (objeto == undefined)
					return;	
			if (objeto.evaluacion == undefined || objeto.indicacion == undefined)
					return;		
			if (objeto.evaluacion == "" || objeto.indicacion == "")
			{
					toastr.error('faltan datos por llenar.');	
					return;	
			}
			//Validar que el credito tengo las dos verifiaciones antes de guardar la verificación
			
			
			
			
			if (rc.creditoSeleccionado != "")
			{
					var credito = Creditos.findOne(rc.creditoSeleccionado);
					var numeroVerificaciones = 0;
					
					
					if (credito.requiereVerificacion == true && (credito.requiereVerificacionAval == undefined || credito.requiereVerificacionAval == false))
						 numeroVerificaciones = 1;
					else		 
						numeroVerificaciones = 2;
					
					rc.conVecino = 0;
					rc.conSolicitanteAval = 0;
					Meteor.call('getVerificacionesCredito', rc.creditoSeleccionado, function(error, result) {
						   if(error)
						   {
							    console.log('ERROR :', error);
							    return;
						   }
						   if(result)
						   {	
								 		_.each(result, function(v){
		
									 			if (v.tipoVerificacion == "vecino")
									 			{
									 					rc.conVecino +=  1;
									 			}		
									 			if (v.tipoVerificacion == "solicitante o aval")
									 			{
									 					rc.conSolicitanteAval += 1;		
									 			}
								 		});
		
								 		if (rc.conVecino == 0 && rc.conSolicitanteAval == 0)
										{
												toastr.warning('No se ha hecho ninguna verificación');	
												return;	
										}
										else if (rc.conVecino >= numeroVerificaciones && rc.conSolicitanteAval >= numeroVerificaciones)
										{
												Creditos.update({_id:rc.creditoSeleccionado}, {$set: {estatus: 1, verificacionEstatus: objeto.evaluacion, indicacion: objeto.indicacion}});
										}
										else
										{
											 	toastr.warning('El cliente no tiene las suficientes verificaciones para finalizar la verficación');	
												return;	
										}
								 		
							 }
					});		 	
					
					$("#modalEvaluarVerificacion").modal('hide');
			}
			
			if (rc.distribuidorSeleccionado != "")
			{
					rc.conVecino = 0;
					rc.conSolicitanteAval = 0;

					var numeroVerificaciones;
					
					
					
					Meteor.call('getVerificacionesDistribuidor', rc.distribuidorSeleccionado, function(error, result) {
						   if(error)
						   {
							    console.log('ERROR :', error);
							    return;
						   }
						   if(result)
						   {		
							   		var distribuidorRequiereVerificacionAval = Meteor.users.findOne(rc.distribuidorSeleccionado).profile.requiereVerificacionAval;
							   		
							   		if (distribuidorRequiereVerificacionAval == undefined || distribuidorRequiereVerificacionAval == false)
											 numeroVerificaciones = 1;
										else		 
											numeroVerificaciones = 2;
							   		
							   		
								 		_.each(result, function(v){
		
									 			if (v.tipoVerificacion == "vecino")
									 			{
									 					rc.conVecino +=  1;
									 			}		
									 			if (v.tipoVerificacion == "solicitante o aval")
									 			{
									 					rc.conSolicitanteAval += 1;		
									 			}
								 		});
		
								 		if (rc.conVecino == 0 && rc.conSolicitanteAval == 0)
										{
												toastr.warning('No se ha hecho ninguna verificación');	
												return;	
										}
										else if (rc.conVecino >= numeroVerificaciones && rc.conSolicitanteAval >= numeroVerificaciones)
										{
												Meteor.call('finalizarVerificacionDistribuidor', rc.distribuidorSeleccionado, objeto, function(error, result) {
													   if(error)
													   {
														    console.log('ERROR :', error);
														    return;
													   }
												});		   
										}
										else
										{
											 	toastr.warning('El distribuidor no tiene las suficientes verificaciones para finalizar la verficación');	
												return;	
										}
								 		
							 }
					});		 	
					
				
					$("#modalEvaluarVerificacionD").modal('hide');
			}
			
			
	};
  
*/
   
};