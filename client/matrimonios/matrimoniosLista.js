angular.module("parroquias")
.controller("MatrimoniosListaCtrl", MatrimoniosListaCtrl);
 function MatrimoniosListaCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
  window.rc = rc;
  
  rc.action = true;
  rc.nuevo = true;	 
  rc.objeto = {}; 
  rc.buscar = {};
  rc.buscar.nombre = "";
  
  rc.objetoImprimir = {};
  rc.arreglo = [];
  rc.datos = {};
  rc.sacerdotes = [];
	rc.sacerdote_id = "";
 	rc.busqueda = "nombreEl";
 	
 	rc.fechaFinal = new Date();
 	rc.fechaInicial = new Date();
  
   //Sacerdotes
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{ "profile.parroquia_id": usuario.profile.parroquia_id,
						  "profile.estatus"			: true,
						 	roles									: ["Sacerdote"]
						}]
	});
  
  this.subscribe('buscarMatrimoniosEl', () => {
		if(this.getReactively("buscar.nombre").length > 4 && rc.busqueda == "nombreEl") {
 			var user = Meteor.users.findOne();

 			return [{
		    options : { limit: 100 },
		    where : { 
			    parroquia_id : user.profile.parroquia_id,
					nombreCompleto : this.getReactively('buscar.nombre')
				} 		   
	    }];
		}
  });
  
  this.subscribe('buscarMatrimoniosElla', () => {
		if(this.getReactively("buscar.nombre").length > 4 && rc.busqueda == "nombreElla") {
 			var user = Meteor.users.findOne();

 			return [{
		    options : { limit: 100 },
		    where : { 
			    parroquia_id : user.profile.parroquia_id,
					nombreCompleto : this.getReactively('buscar.nombre')
				} 		   
	    }];
		}
  });
  
  this.helpers({
		arreglo : () => {
			
			if (rc.busqueda == "nombreEl"){
				
				var arr =  Matrimonios.find({}, {sort:{nombreCompletoEl: 1}});
					if (arr != undefined)
							 return arr;
					
			}
			else if (rc.busqueda == "nombreElla"){
				var arr =  Matrimonios.find({}, {sort:{nombreCompletoElla: 1}});
					if (arr != undefined)
							 return arr;
					
			}
			
		},
		
		sacerdotes : () =>{
			
			return Meteor.users.find({roles : ["Sacerdote"]});
		},
	});
	
	this.verDatos = function(objeto)
  {
	  	$("#modalVerDatos").modal(); 
	  	//console.log(objeto)
	  	Meteor.call ("getParroquia", objeto.parroquia_id, function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al obtener los datos.: ', error.details);
					 loading(false);
					 return;
				}
				if (result)
				{
																	
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
 						
						objeto.parroquiaNombre 		= result.nombre;
						objeto.parroquiaDomicilio = result.domicilio;
						objeto.parroquiaTelefono 	= result.telefono;
 
 						objeto.sexo								= objeto.esHijo == "HIJO" ? "NIÑO" : "NIÑA";
						objeto.fechaMatrimonio		= formatDate(objeto.fecha);
						objeto.fechaRegistro			= objeto.fechaRegistro == undefined ? "" :formatDate(objeto.fechaRegistro);
 						
 						rc.objeto = objeto;
						
						$scope.$apply();
						
				}
			});			
  }
  
  this.seleccionaFirma = function(objeto, tipo)
	{
			
			rc.sacerdote_id = "";
			rc.objetoImprimir = objeto;
			rc.objetoImprimir.tipo = tipo;
			
			$("#modalFirma").modal(); 
 	}	 
	
	this.imprimir = function(form)
	{
		 	if (form.$invalid){
		     toastr.error('Error al imprimir.');
		     return;
		  }
		  
		  var tieneFirma 		= "";
		  var firma 		 		= "";
		  var nombreReporte = "";
		  
			var parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
			
		  var objeto 		= rc.objetoImprimir;
		  var sacerdote = Meteor.users.findOne(rc.sacerdote_id);
		  var parroquia = Parroquias.findOne({_id: parroquia_id});
 
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
			
			
 			//Acta
			if (rc.objetoImprimir.tipo == 1)
			{
					if (sacerdote.profile.firma == undefined)
					{
							tieneFirma 		= "No";
							firma			 		= "";
							nombreReporte = 'ActaMatrimonio';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							nombreReporte = 'ActaMatrimonioFirma';
					}
					
					var datos = {};
 											
					datos.parroquia						= parroquia.nombre;
					datos.parroquiaDomicilio 	= parroquia.domicilio;
					datos.parroquiaTelefonos 	= parroquia.telefonos;
					datos.parroquiaLugar		 	= parroquia.lugar;
					datos.tipo		 						= parroquia.tipo;

					if (objeto.libro == undefined || objeto.libro == "")
					{
							toastr.warning("El acta no lleva libro, favor de revisar.");
							return;
					}
					if (objeto.foja == undefined || objeto.foja == "")
					{
							toastr.warning("El acta no lleva foja, favor de revisar.");
							return;
					}
					if (objeto.noDeActa == undefined || objeto.noDeActa == "")
					{
							toastr.warning("El acta no lleva número de acta, favor de revisar.");
							return;
					}		
					
					datos.libro								= objeto.libro;
					datos.foja								= objeto.foja;
					datos.noDeActa						= objeto.noDeActa;
					datos.parroco							= objeto.parroco;
																		
					datos.nombreCompletoEl		= objeto.nombreCompletoEl;
					datos.nombreCompletoElla	= objeto.nombreCompletoElla;

  																		
					datos.fechaMatrimonioLetra= formatDate(objeto.fecha);
					datos.sacerdoteNombre			= objeto.sacerdoteNombre;
																		
					datos.fechaImpresion			= formatDate(new Date());
																		
					datos.nombreFirma					= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
					datos.cargoFirma		  		= sacerdote.profile.cargo;
										

					
					var conjuncionPaEl = "";
					var primeraLetra = "";
					if (objeto.padreEl == undefined) objeto.padreEl = "";
					if (objeto.madreEl != undefined && objeto.madreEl != "")
					{
							primeraLetra = objeto.madreEl.substr(0,1);
							if (objeto.padreEl != "")
								if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í" || primeraLetra == "H" || primeraLetra == "h")
										conjuncionPaEl = " E ";
								else
										conjuncionPaEl = " Y ";		
							else
								conjuncionPaEl = "";				
			    }
			    else 
				    	objeto.madreEl = "";
			    
			    datos.padresEl 						= objeto.padreEl + conjuncionPaEl + objeto.madreEl;
			    
 			    var conjuncionPaElla = "";
 			    if (objeto.padreElla == undefined) objeto.padreElla = "";
					if (objeto.madreElla != undefined && objeto.madreElla != "")
					{
							primeraLetra = objeto.madreElla.substr(0,1);
							if (objeto.padreElla != "")
								if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í"  || primeraLetra == "H" || primeraLetra == "h")
										conjuncionPaElla = " E ";
								else
										conjuncionPaElla = " Y ";		
							else
									conjuncionPaElla = "";			
			    }
			    else
			    		objeto.madreElla = "";
			    
			    datos.padresElla 					= objeto.padreElla + conjuncionPaElla + objeto.madreElla;
			    
			    
			    var conjuncionPadrinosEl = "";
			    if (objeto.padrinoEl == undefined) objeto.padrinoEl = "";
					if (objeto.madrinaEl != undefined && objeto.madrinaEl != "")
					{
							primeraLetra = objeto.madrinaEl.substr(0,1);
							if (objeto.padrinoEl != "")
								if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í"  || primeraLetra == "H" || primeraLetra == "h")
										conjuncionPadrinosEl = " E ";
								else
										conjuncionPadrinosEl = " Y ";		
							else
									conjuncionPadrinosEl = "";				
			    }
			    else
			    		objeto.madrinaEl = "";
			    
			    datos.padrinosEl 			 = objeto.padrinoEl + conjuncionPadrinosEl + objeto.madrinaEl;
			    
			    var conjuncionPadrinosElla = "";
			    if (objeto.padrinoElla == undefined) objeto.padrinoElla = "";
					if (objeto.madrinaElla != undefined && objeto.madrinaElla != "")
					{
							primeraLetra = objeto.madrinaElla.substr(0,1);
							if (objeto.padrinoElla != "")
								if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í"  || primeraLetra == "H" || primeraLetra == "h")
										conjuncionPadrinosElla = " E ";
								else
										conjuncionPadrinosElla = " Y ";		
							else
									conjuncionPadrinosElla = "";			
			    }
			    else
			    		objeto.madrinaElla = "";
			    
			    datos.padrinosElla 			 = objeto.padrinoElla + conjuncionPadrinosElla + objeto.madrinaElla;
  					
 					datos.tieneFirma				= tieneFirma;
 					datos.firma							= firma;
 					
 					loading(true);
					Meteor.call('report', {
			      templateNombre: nombreReporte,
			      reportNombre	: 'ActaMatrimonioOut',
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
					
			}//Boleta Uno solo
			else if (rc.objetoImprimir.tipo == 2) 
			{
					if (sacerdote.profile.firma == undefined)
					{
							tieneFirma 		= "No";
							firma			 		= "";
							nombreReporte = 'boletaBautismoArreglo';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							nombreReporte = 'boletaBautismoArregloFirma';
					}
					
 					objeto.numeroFolio				= parroquia.folioBautismo + 1;
					objeto.parroquiaNombre 		= parroquia.nombre;
					objeto.parroquiaDomicilio = parroquia.domicilio;
					objeto.parroquiaTelefono 	= parroquia.telefono;
					objeto.sacerdote					= objeto.sacerdoteNombre;
					
					objeto.sexo								= objeto.esHijo == "HIJO" ? "NIÑO" : "NIÑA";
					objeto.fechaBautizo				= formatDate(objeto.fecha);
					objeto.fechaRegistro			= objeto.fechaRegistro 		== "" ? "" :formatDate(objeto.fechaRegistro);
					objeto.fechaNac						= objeto.fechaNacimiento  == "" ? "" :formatDate(objeto.fechaNacimiento);
 
					rc.datos = {};
					rc.datos.nombreFirma		 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
					rc.datos.cargoFirma		  	= sacerdote.profile.cargo;
					
					rc.datos.tieneFirma				= tieneFirma;
 					rc.datos.firma						= firma;
					
					rc.datos.bautismos = [];
					rc.datos.bautismos.push(objeto);
					Meteor.call ("setFolioBautismo", objeto.parroquia_id, objeto.numeroFolio, function(err, response){
							if (response)
							{
								
									loading(true);
									Meteor.call('report', {
							      templateNombre: nombreReporte,
							      reportNombre: 'boleta' + objeto.nombre,
							      type: 'pdf',  
							      datos: rc.datos,
								    }, function(err, file) {
								      if(!err){
											    loading(false);
								        downloadFile(file);
								      }else{
								        toastr.warning("Error al generar el reporte");
								      }
								  });	
								}
					});	
 
 
 			}//Boleta arreglo
 			else if (rc.objetoImprimir.tipo == 3) 
 			{
	 				if (sacerdote.profile.firma == undefined)
					{
							tieneFirma 		= "No";
							firma			 		= "";
							nombreReporte = 'boletaBautismoArreglo';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							nombreReporte = 'boletaBautismoArregloFirma';
					}
	 				
	 				var ban = false;
		 			var totalImprimir = 0;
					
					_.each(rc.arregloListado, function(bautizado){
						
						if (bautizado.imprimir)
						{
								ban = true; 
								totalImprimir = totalImprimir + 1;
						}
							
						
					});
					
		 			if (ban == false){ 
						toastr.warning("No hay nada que imprimir seleccione al menos uno");
						return;
					}
					
					rc.datos = {};
					rc.datos.bautismos = [];
					
 					
					var con = 0;
					var folio = parroquia.folioBautismo + 1;
					
					_.each(rc.arregloListado, function(objeto){
						
							if (objeto.imprimir)
							{
										
									objeto.numeroFolio				= folio;
									objeto.parroquiaNombre 		= parroquia.nombre;
									objeto.parroquiaDomicilio = parroquia.domicilio;
									objeto.parroquiaTelefono 	= parroquia.telefono;
									objeto.sacerdote					= objeto.sacerdoteNombre;
									
									objeto.sexo								= objeto.esHijo == "HIJO" ? "NIÑO" : "NIÑA";
									objeto.fechaBautizo				= formatDate(objeto.fecha);
									objeto.fechaRegistro			= objeto.fechaRegistro 		== "" ? "" :formatDate(objeto.fechaRegistro);
									objeto.fechaNac						= objeto.fechaNacimiento  == "" ? "" :formatDate(objeto.fechaNacimiento);
									objeto.nombreFirma		 		= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
									objeto.cargoFirma		  		= sacerdote.profile.cargo;
									
									rc.datos.bautismos.push(objeto);	
									
									folio = folio + 1;
									
									con ++;
									
									if (con == totalImprimir)
									{
											rc.datos.tieneFirma				= tieneFirma;
											rc.datos.firma						= firma;
											
											Meteor.call ("setFolioBautismo", parroquia_id, folio, function(err, response){
												if (response)
												{
		 											loading(true);
													Meteor.call('report', {
											      templateNombre: nombreReporte,
											      reportNombre: 'todosBautizados',
											      type: 'pdf',  
											      datos: rc.datos,
												    }, function(err, file) {
												      if(!err){
 												        downloadFile(file);
 												      }else{
												        toastr.warning("Error al generar el reporte");
												      }
												  });		
													loading(false);		
													$("#modalVerListado").modal('hide');
												}
											});		
										
									}
 		 					}
					});
 
 					var chkxr = document.getElementById('todos');
					chkxr.checked = false;
	 				
	 			
 			}
 			
			$("#modalFirma").modal('hide'); 
			
			
	}	
	
	this.buscarBautismosFecha = function() 
  {
   			
			  rc.fechaInicial.setHours(0,0,0,0);
	 		  rc.fechaFinal.setHours(23,59,59,999);
	 		  
	 		  if (rc.fechaInicial > rc.fechaFinal)
	 		  {
		 		  	toastr.warning('La fecha final debe ser mayor o igual que la fecha inicial.');
		 				return;
		 		  	
	 		  }
	 		  
    	  var parroquia_id = Meteor.users.findOne({_id:  Meteor.userId()}).profile.parroquia_id;
				loading(true);
 				Meteor.call ("getMatrimoniosFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, function(error,result){
	
					if (error){
						 console.log(error);
						 toastr.error('Error al obtener los datos.: ', error.details);
	 					 return;
					}
					if (result)
					{
 
							rc.arreglo = result;
					 		$scope.$apply();	
					 		loading(false);
	 				}
				});
  			 
					
	};
  
};