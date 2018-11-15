angular.module("parroquias")
.controller("ConfirmacionesListaCtrl", ConfirmacionesListaCtrl);
 function ConfirmacionesListaCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
  window.rc = rc;
  
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {}; 
  this.buscar = {};
  this.buscar.nombre = "";
  
  rc.sacerdotes = [];
  rc.arreglo = [];
  rc.sacerdote_id = "";
	rc.parroquiaForanea_id = "";
	
	rc.objetoImprimir = {};
	rc.objetoImprimir.tipo = 0;
  
  rc.busqueda = "nombre";
  rc.busquedaParroquia = "local";
  
  $(".js-example-basic-single").select2();
 	
 	rc.fechaFinal = new Date();
 	rc.fechaInicial = new Date();	
  
  rc.fecha = new Date();
  
  rc.numeroPagina	 		= 0;
 	rc.avance 					= 100;
 	

  
  //Sacerdotes
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{ "profile.parroquia_id": usuario.profile.parroquia_id,
						  "profile.estatus"			: true,
						 	roles									: ["Sacerdote"]
						}]
	});
	
	this.subscribe('parroquias', () => {
  		return [{busquedas: true}];
  });
 
  this.subscribe('buscarConfirmacion', () => {
	  
		if(this.getReactively("buscar.nombre").length > 4){
			
			var user = Meteor.users.findOne();
			var parroquia_id = "";
			
			if (rc.busquedaParroquia == 'local')
					parroquia_id = user.profile.parroquia_id;
			else if (rc.busquedaParroquia == 'foranea')
					parroquia_id = rc.parroquiaForanea_id;
					
			
			return [{
		    options : { skip 	: rc.getReactively("numeroPagina"),
			    					limit	: rc.avance
		    					},
		    where : { 
			    parroquia_id 	 : parroquia_id,
					nombreCompleto : this.getReactively('buscar.nombre')
				} 		   
	    }];
		}
		else
		{
				rc.numeroPagina	 		= 0;
				rc.avance 					= 100;
		}
  });
  
  this.helpers({
		arreglo : () => {
			if(this.getReactively("buscar.nombre").length >= 4){	
			
				var arr =  Confirmaciones.find({}, {sort:{nombreCompleto: 1}});
				if (arr != undefined)
						 return arr;
			}	
		},
		
		arregloListado : () => {
				
				var listado = Confirmaciones.find({}, { sort : {fecha : 1 }}).fetch();
				
				if (listado != undefined)
				{
						_.each(listado, function(objeto){
								objeto.imprimir = false;
						});
 						return listado;
				}

		},
		
		sacerdotes : () =>{
			
			return Meteor.users.find({roles : ["Sacerdote"]});
		},
		
		parroquiasBuscar: () =>{
			
			var parroquia_id = Meteor.users.findOne({_id: Meteor.userId()}).profile.parroquia_id;
			
			return Parroquias.find({_id: {$ne: parroquia_id}, busquedas: true }, {sort :{ nombre : 1}});
			
		},
	});
	
	this.verDatos = function(id)
  {
	  	$("#modalVerDatos").modal(); 
 	  	
	  	Meteor.call ("getConfirmacionesId", id, function(error,result){
	
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
 						
 						var objeto = result;
 						
 						objeto.fechaConfirmacionLetra = formatDate(objeto.fecha);
						objeto.fechaBautismoLetra			= objeto.fechaBautismo 		== "" ? "" :formatDate(objeto.fechaBautismo);
 						objeto.fechaNacimientoLetra		= objeto.fechaNacimiento 	== "" ? "" :formatDate(objeto.fechaNacimiento);
						
						rc.objeto = objeto;
						
						$scope.$apply();
						
				}
			});			
  }
  
  this.verListado = function()
  {
			rc.fecha = new Date();
			
			rc.arregloListado = [];
			
			this.fechaInicial = rc.fecha;
		  this.fechaInicial.setHours(0,0,0,0);
		  this.fechaFinal = new Date(rc.fecha);
		  this.fechaFinal.setHours(23,0,0,0);
			
	  	$("#modalVerListado").modal(); 
	  	
	  	
	  	var chkxr = document.getElementById('todos');
			chkxr.checked = false;

  }
  	
	this.seleccionarTodos = function() 
  {

			var chkxr = document.getElementById('todos');
				
			_.each(rc.arregloListado, function(bautizado){
				bautizado.imprimir = chkxr.checked;

			})
					
	};
	
	this.seleccionaFirma = function(id, tipo)
	{
			rc.sacerdote_id = "";
			
			if (tipo == 1 || tipo == 2)
			{
					var parroquia_id = Meteor.users.findOne({_id: Meteor.userId()}).profile.parroquia_id;
			
					Meteor.call ("getConfirmacionesId", id, function(error,result){
			
						if (error){
							 console.log(error);
							 toastr.error('Error al obtener los datos.: ', error.details);
							 //loading(false);
							 return;
						}
						if (result)
						{																									
		 						rc.objetoImprimir = result;
		 						rc.objetoImprimir.tipo = tipo;
		 						$scope.$apply();
						}
					});
			}
			else
			{
					rc.objetoImprimir.tipo = tipo;
			}
			
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
							nombreReporte = 'ActaConfirmacion';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							nombreReporte = 'ActaConfirmacionFirma';
					}
					
					var datos = {};
  
 					datos.parroquia						= parroquia.nombre;
					datos.parroquiaDomicilio 	= parroquia.domicilio;
					datos.parroquiaTelefonos 	= parroquia.telefonos;
					datos.parroquiaLugar		 	= parroquia.lugar;
					datos.tipo		 						= parroquia.tipo;
					
					datos.fechaConfirmacion		= formatDate(objeto.fecha);
					datos.nombreCompleto			= objeto.nombreCompleto;
					datos.libro								= objeto.libro;
				  datos.foja								= objeto.foja;
				  datos.noDeActa						= objeto.noDeActa;
				  datos.esHijo							= objeto.esHijo;
				  datos.naturalLegitimo			= objeto.tipoHijo;
				  datos.padre								= objeto.padre;
					datos.madre								= objeto.madre;
				  datos.fechaBautismo				= objeto.fechaBautismo 		== "" ? "" :formatDate(objeto.fechaBautismo);
				  datos.parroquiaBautismo		= objeto.parroquiaBautismo;
				  datos.sacerdoteNombre			= objeto.sacerdoteNombre;
				  datos.parroco							= objeto.parroco;
					
					datos.fechaImpresion			= formatDate(new Date());
 					datos.nombreFirma					= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
					datos.cargoFirma		  		= sacerdote.profile.cargo;
  					
					datos.padrino						 	= objeto.padrino;
					
					datos.tieneFirma				= tieneFirma;
 					datos.firma							= firma;
 
 					loading(true);
					Meteor.call('report', {
			      templateNombre: nombreReporte,
			      reportNombre: 'ActaConfirmacionOut',
			      type: 'pdf',  
			      datos: datos,
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
							nombreReporte = 'boletaConfirmacionArreglo';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							nombreReporte = 'boletaConfirmacionArregloFirma';
					}
					
 					objeto.numeroFolio				= parroquia.folioConfirmacion + 1;
 					
					objeto.parroquiaNombre 		= parroquia.nombre;
					objeto.parroquiaDomicilio = parroquia.domicilio;
					objeto.parroquiaTelefono 	= parroquia.telefono;
					objeto.sacerdoteConfirmo  = objeto.sacerdoteNombre;
					
										
					objeto.edad								= moment().diff(objeto.fechaNacimiento, 'years',false);
							
					var month 								= objeto.fechaNacimiento.getMonth() + 1; //months from 1-12 /Mes Nacimiento
					var day 									= objeto.fechaNacimiento.getDate();
					var fechaActual 					= new Date();
					var mesActual							= fechaActual.getMonth() + 1;
					
					var d 										=	0;
					if (mesActual > month)
					{
						 d 											= new Date(month+"/"+day+"/"+(fechaActual.getFullYear()) );
						 objeto.meses						= moment(fechaActual).diff(d, 'months', false);	
					}	 
					else if (mesActual < month) 
					{
						 d 											= new Date(month+"/"+day+"/"+(fechaActual.getFullYear() - 1) );		 
						 objeto.meses						= moment(fechaActual).diff(d, 'months', false);	
					}	 
					else if (mesActual == month)
					{
						 //preguntar por el día
						 var f = new Date(); 
						 if (objeto.fechaNacimiento.getDate() < f.getDate())
								objeto.meses						= 0;	 	
						 else
							 	objeto.meses						= 11;					 		
					}	 
											
					objeto.sexo								= objeto.esHijo == "HIJO" ? "NIÑO" : "NIÑA";
					objeto.fechaConfirmacion 	= formatDate(objeto.fecha);
 					objeto.fechaBautismo 			= objeto.fechaBautismo 		== "" ? "" :formatDate(objeto.fechaBautismo);
  					
 					var conjuncionM = "";
					if (objeto.madre != "")
					{
							primeraLetra = objeto.madre.substr(0,1);
							if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í" || primeraLetra == "H" || primeraLetra == "h")
									conjuncionM = " E ";
							else
									conjuncionM = " Y ";		
			    }
 					
					objeto.padres					 		= objeto.madre == "" ? objeto.padre : objeto.padre + conjuncionM + objeto.madre;
  
					rc.datos = {};
					rc.datos.nombreFirma		 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
					rc.datos.cargoFirma		  	= sacerdote.profile.cargo;

					rc.datos.tieneFirma				= tieneFirma;
 					rc.datos.firma						= firma;
					
					rc.datos.confirmaciones = [];
					rc.datos.confirmaciones.push(objeto);
					Meteor.call ("setFolioConfirmacion", objeto.parroquia_id, objeto.numeroFolio, function(err, response){
							if (response)
							{
								
									loading(true);
									Meteor.call('report', {
							      templateNombre: nombreReporte,
							      reportNombre: 'boleta',
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
							nombreReporte = 'boletaConfirmacionArreglo';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							nombreReporte = 'boletaConfirmacionArregloFirma';
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
					rc.datos.confirmaciones = [];
					
 					
					var con = 0;
					var folio = parroquia.folioConfirmacion + 1;
					
					_.each(rc.arregloListado, function(objeto){
						
							if (objeto.imprimir)
							{
									
									
									Meteor.call ("getConfirmacionesId", objeto._id, function(error,result){
			
										if (error){
											 console.log(error);
											 toastr.error('Error al obtener los datos.: ', error.details);
											 //loading(false);
											 return;
										}
										if (result)
										{
																													
						 						objeto = result;
						 						
						 						objeto.numeroFolio				= folio;
 					
												objeto.parroquiaNombre  	= parroquia.nombre;
												objeto.parroquiaDomicilio = parroquia.domicilio;
												objeto.parroquiaTelefono 	= parroquia.telefono;
												objeto.sacerdoteConfirmo  = objeto.sacerdoteNombre;
												
												objeto.edad								= moment().diff(objeto.fechaNacimiento, 'years',false);
														
												var month 								= objeto.fechaNacimiento.getMonth() + 1; //months from 1-12
												var day 									= objeto.fechaNacimiento.getDate();
												var fechaActual 					= new Date();
												var mesActual							= fechaActual.getMonth() + 1;
								
												var d 										=	0;
												if (mesActual > month)
												{
													 d 											= new Date(month+"/"+day+"/"+(fechaActual.getFullYear()) );
													 objeto.meses						= moment(fechaActual).diff(d, 'months', false);	
												}	 
												else if (mesActual < month) 
												{
													 d 											= new Date(month+"/"+day+"/"+(fechaActual.getFullYear() - 1) );		 
													 objeto.meses						= moment(fechaActual).diff(d, 'months', false);	
												}	 
												else if (mesActual == month)
												{
													 //preguntar por el día
													 var f = new Date(); 
													 if (objeto.fechaNacimiento.getDate() < f.getDate())
															objeto.meses						= 0;	 	
													 else
														 	objeto.meses						= 11;		
												}	 
																								
												objeto.sexo								= objeto.esHijo == "HIJO" ? "NIÑO" : "NIÑA";
												objeto.fechaConfirmacion 	= formatDate(objeto.fecha);
							 					objeto.fechaBautismo 			= objeto.fechaBautismo 		== "" ? "" :formatDate(objeto.fechaBautismo);
							  					
							 					var conjuncionM = "";
												if (objeto.madre != "")
												{
														primeraLetra = objeto.madre.substr(0,1);
														if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í" || primeraLetra == "H" || primeraLetra == "h")
																conjuncionM = " E ";
														else
																conjuncionM = " Y ";		
										    }
							 					
												objeto.padres					 		= objeto.madre == "" ? objeto.padre : objeto.padre + conjuncionM + objeto.madre;
			 
			 									objeto.nombreFirma		 		= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
												objeto.cargoFirma		  		= sacerdote.profile.cargo;
												
												rc.datos.confirmaciones.push(objeto);	
										}
										
										folio = folio + 1;
									});
									
									
									
									con ++;
									
									if (con == totalImprimir)
									{

											Meteor.call ("setFolioConfirmacion", parroquia_id, folio, function(err, response){
													if (response)
													{	
															rc.datos.tieneFirma				= tieneFirma;
															rc.datos.firma						= firma;
															
															loading(true);
															Meteor.call('report', {
													      templateNombre: nombreReporte,
													      reportNombre: 'todosConfirmados',
													      type: 'pdf',  
													      datos: rc.datos,
														    }, function(err, file) {
														      if(!err){
																		loading(false);
																		$("#modalVerListado").modal('hide');
														        downloadFile(file);
														        
														      }else{
														        toastr.warning("Error al generar el reporte");
														      }
														  });	
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
   
	this.buscarConfirmaciones = function() 
  {
			if (rc.fecha != undefined)
			{
				var fechaInicial = rc.fecha;
			  fechaInicial.setHours(0,0,0,0);
			  var fechaFinal = new Date(rc.fecha);
			  fechaFinal.setHours(23,59,59,999);
 			  
			  var parroquia_id = Meteor.users.findOne({_id:  Meteor.userId()}).profile.parroquia_id;
 
 				Meteor.call ("getConfirmacionesFecha", parroquia_id, fechaInicial, fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
	
					if (error){
						 console.log(error);
						 toastr.error('Error al obtener los datos.: ', error.details);
	 					 return;
					}
					if (result)
					{
							rc.arregloListado = result;
					 		$scope.$apply();	
	 				}
				});
 			}
			 
					
	};
	
	this.buscarConfirmacionesFecha = function() 
  {
   			
			  rc.fechaInicial.setHours(0,0,0,0);
	 		  rc.fechaFinal.setHours(23,59,59,999);
	 		  
	 		  if (rc.fechaInicial > rc.fechaFinal)
	 		  {
		 		  	toastr.warning('La fecha final debe ser mayor o igual que la fecha inicial.');
		 				return;
		 		  	
	 		  }
	 		  
    	  var user = Meteor.users.findOne();
    	  var parroquia_id = "";
    	  
    	  if (rc.busquedaParroquia == 'local')
					parroquia_id = user.profile.parroquia_id;
				else if (rc.busquedaParroquia == 'foranea')
						parroquia_id = rc.parroquiaForanea_id;
						
				loading(true);
 				Meteor.call ("getConfirmacionesFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
	
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
  
  this.izq = function()
  {
	 		if (rc.numeroPagina > 0)
	 			 rc.numeroPagina -= rc.avance;
	 			 
	 		if (rc.busqueda == 'fechas')
	 		{
		 		
		 			var user = Meteor.users.findOne();
	    	  var parroquia_id = "";
	    	  
	    	  if (rc.busquedaParroquia == 'local')
						parroquia_id = user.profile.parroquia_id;
					else if (rc.busquedaParroquia == 'foranea')
							parroquia_id = rc.parroquiaForanea_id;
		 			
		 			
					loading(true);
	 				Meteor.call ("getConfirmacionesFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
		
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
	 		}

	}

	this.der = function()
  {
			
	  	if (rc.arreglo.length > 0  && rc.arreglo.length == 100)
	  	{
			  	rc.numeroPagina += rc.avance;
	  	}
	  	
	  	
	  	if (rc.busqueda == 'fechas')
	 		{
		 			var user = Meteor.users.findOne();
	    	  var parroquia_id = "";
	    	  
	    	  if (rc.busquedaParroquia == 'local')
						parroquia_id = user.profile.parroquia_id;
					else if (rc.busquedaParroquia == 'foranea')
							parroquia_id = rc.parroquiaForanea_id;

					loading(true);
	 				Meteor.call ("getConfirmacionesFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
		
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
	 		}
	  	
	}
  
  this.inicializaBusqueda = function()
  {

			this.buscar.nombre = "";
	  	rc.fechaFinal = new Date();
			rc.fechaInicial = new Date();
			rc.parroquiaForanea_id = "";
			
			rc.arreglo = [];
	  	
	}
  
  this.eliminar = function(objeto)
  {
			customConfirm('¿Estás seguro de eliminar a: ' + objeto.nombreCompleto + '?', function() {
      		Confirmaciones.remove({_id: objeto._id});
	      	toastr.success("Eliminado");
	    });
	}
  
};