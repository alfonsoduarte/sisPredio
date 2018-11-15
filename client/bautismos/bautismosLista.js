angular.module("parroquias")
.controller("BautismosListaCtrl", BautismosListaCtrl);
 function BautismosListaCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;

  this.objeto = {}; 
  this.buscar = {};
  this.buscar.nombre = "";
  
  rc.arreglo = [];
  
  rc.objetoImprimir = {};
  rc.datos = {};
	rc.datos.bautismos = [];
	rc.sacerdotes = [];
	rc.sacerdote_id = "";
	rc.parroquiaForanea_id = "";
 	
 	rc.busqueda = "nombre";
 	rc.busquedaParroquia = "local";
 	
 	$(".js-example-basic-single").select2();
 	
 	
 	rc.fechaFinal = new Date();
 	rc.fechaInicial = new Date();	
 	
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
  
  rc.fecha = new Date();

  this.subscribe('parroquias', () => {
  		return [{busquedas: true}];
  });
  	
  this.subscribe('buscarBautismo', () => {
	  
		if(this.getReactively("buscar.nombre").length >= 4){
			
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
		    where 	: { parroquia_id : parroquia_id,
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
					var arr = Bautismos.find({}, {sort:{nombreCompleto: 1}}).fetch();
					if (arr != undefined)
						 return arr;
			}
		},
		
		arregloListado : () => {
				
				var listado = Bautismos.find({}, { sort : {fecha : 1 } }).fetch();
				
				if (listado != undefined)
				{
						_.each(listado, function(bautizado){
								bautizado.imprimir = false;
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

	  	Meteor.call ("getBautismosId", id, function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al obtener los datos.: ', error.details);
					 //loading(false);
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
 						
 						objeto.sexo								= objeto.esHijo == "HIJO" ? "NIÑO" : "NIÑA";
						objeto.fechaBautizo				= formatDate(objeto.fecha);
						objeto.fechaRegistro			= objeto.fechaRegistro == undefined || objeto.fechaRegistro == "" ? "" :formatDate(objeto.fechaRegistro);
						objeto.fechaNac						= objeto.fechaRegistro == undefined || objeto.fechaNacimiento  == "" ? "" :formatDate(objeto.fechaNacimiento);
						
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
			
					Meteor.call ("getBautismosId", id, function(error,result){
			
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
			//console.log(rc.objetoImprimir)
		  var objeto 		= rc.objetoImprimir;
		  var sacerdote = Meteor.users.findOne(rc.sacerdote_id);
		  var parroquia = Parroquias.findOne({_id: parroquia_id});
 
		  function formatDate(date) {
			  
		  	  date = new Date(date);
 
				  var monthNames = [
				    "Enero", "Febrero", "Marzo",
				    "Abril", "Mayo", "Junio", "Julio",
				    "Agosto", "Septiembre", "Octubre",
				    "Noviembre", "Diciembre"
				  ];
				  var day = date.getDate();
				  var monthIndex = date.getMonth();
				  var year = date.getFullYear();
			
				  return day + ' ' + 'de ' + monthNames[monthIndex] + ' de'  + ' ' + year;
			}
			
			
			
 			//Acta
			if (rc.objetoImprimir.tipo == 1)
			{
					if (sacerdote.profile.firma == undefined)
					{
							tieneFirma 		= "No";
							firma			 		= "";										
							if (objeto.notasMarginales.length > 0)
									nombreReporte = 'ActaBautismo';
							else
									nombreReporte = 'ActaBautismoSinNM';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							if (objeto.notasMarginales.length > 0)
									nombreReporte = 'ActaBautismoFirma';
							else
									nombreReporte = 'ActaBautismoFirmaSinNM';
							
					}
					
					console.log(objeto.notasMarginales);
					_.each(objeto.notasMarginales, function(nota){
							
							nota.tipoNota = camelize(nota.tipoNota.toLowerCase());
							nota.nota 		= camelize(nota.nota.toLowerCase());
							nota.lugar		= camelize(nota.lugar.toLowerCase());
						
					});
					
					var datos = {};
 											
					datos.parroquia						= camelize(parroquia.nombre.toLowerCase());//parroquia.nombre;
					datos.parroquiaDomicilio 	= parroquia.domicilio;
					datos.parroquiaTelefonos 	= parroquia.telefonos;
					datos.parroquiaLugar		 	= parroquia.lugar;
					datos.tipo		 						= camelize(parroquia.tipo.toLowerCase());//parroquia.tipo;
 
					datos.tipoHijo 						= objeto.tipoHijo == 'NATURAL' ? 'NATURALES' : 'LEGÍTIMOS';
					datos.libro								= objeto.libro;
					datos.foja								= objeto.foja;
					datos.noDeActa						= objeto.noDeActa;
																		
					datos.lugarNacimiento 		= camelize(objeto.lugarNacimiento.toLowerCase());//objeto.lugarNacimiento;
					datos.fechaNac  					= objeto.fechaNacimiento  == "" ? "" :formatDate(objeto.fechaNacimiento);
					datos.esHijo							= camelize(objeto.esHijo.toLowerCase());//objeto.esHijo;
					datos.naturalLegitimo			= camelize(objeto.tipoHijo.toLowerCase());//objeto.tipoHijo;
					datos.nombreCompleto			= camelize(objeto.nombreCompleto.toLowerCase());
					
						
					datos.nombre							= camelize(objeto.nombre.toLowerCase());//objeto.nombre;
					datos.padre								= camelize(objeto.padre.toLowerCase());//objeto.padre;
					datos.madre								= camelize(objeto.madre.toLowerCase());//objeto.madre;
					
					datos.registroCivil				= objeto.registroCivil == undefined ? "" : objeto.registroCivil;
 																		
					datos.fecha								= formatDate(objeto.fecha);
					datos.sacerdoteBautizo		= camelize(objeto.sacerdoteNombre.toLowerCase());//objeto.sacerdoteNombre;
					datos.parroco							= camelize(objeto.parroco.toLowerCase());//objeto.parroco;
																		
					datos.fechaImpresion			= formatDate(new Date());
																		
					datos.nombreFirma					= camelize(sacerdote.profile.titulo.toLowerCase()) + " " + camelize(sacerdote.profile.nombreCompleto.toLowerCase());//sacerdote.profile.nombreCompleto;
					datos.cargoFirma		  		= camelize(sacerdote.profile.cargo.toLowerCase())//sacerdote.profile.cargo;

					datos.notaAlMargen				= objeto.notaAlMargen == undefined || objeto.notaAlMargen == "" ? 'NINGUNO': objeto.notaAlMargen;
					
					var conjuncionAP = "";
					var conjuncionAM = "";
					var conjuncionM = "";
					var primeraLetra = "";
					
					datos.abuelosPaternos = "";
					datos.abuelosMaternos = "";
					
					if (objeto.abueloPaterno == undefined || objeto.abueloPaterno == "" )
					{						
							if (objeto.abuelaPaterna != undefined && objeto.abuelaPaterna != "" ) 						
									datos.abuelosPaternos 	= objeto.abuelaPaterna;
					}
					else 
					{						
							if (objeto.abuelaPaterna != "")
							{
									primeraLetra = objeto.abuelaPaterna.substr(0,1);
									if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í" || primeraLetra == "H" || primeraLetra == "h")
											conjuncionAP = " E ";
									else
											conjuncionAP = " Y ";		
					    }   
					    datos.abuelosPaternos 	= objeto.abuelaPaterna == "" ? objeto.abueloPaterno : objeto.abueloPaterno + conjuncionAP + objeto.abuelaPaterna;
					}
					
					datos.abuelosPaternos 	=  camelize(datos.abuelosPaternos.toLowerCase());
										
			    if (objeto.abueloMaterno == undefined || objeto.abueloMaterno == "" )
					{						
							if (objeto.abuelaMaterna != undefined && objeto.abuelaMaterna != "" ) 						
									datos.abuelosMaternos 	= objeto.abuelaMaterna;
					}
					else 
					{	
			    		if (objeto.abuelaMaterna != "")
							{
									primeraLetra = objeto.abuelaMaterna.substr(0,1);
									if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í"  || primeraLetra == "H" || primeraLetra == "h")
											conjuncionAM = " E ";
									else
											conjuncionAM = " Y ";		
					    }
							datos.abuelosMaternos 	= objeto.abuelaMaterna == "" ? objeto.abueloMaterno : objeto.abueloMaterno + conjuncionAM + objeto.abuelaMaterna;			    
			    }
					
					datos.abuelosMaternos 	=  camelize(datos.abuelosMaternos.toLowerCase());
					
					if (objeto.madrina != "")
					{
							primeraLetra = objeto.madrina.substr(0,1);
							if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í"  || primeraLetra == "H" || primeraLetra == "h")
									conjuncionM = " E ";
							else
									conjuncionM = " Y  ";		
			    }		
					
					datos.padrinos				 	= objeto.madrina == "" ? objeto.padrino : objeto.padrino + conjuncionM + objeto.madrina;
					
					datos.padrinos				 	=	camelize(datos.padrinos.toLowerCase());
					datos.parroco						= camelize(datos.parroco.toLowerCase());//objeto.parroco;
					
 					datos.notasMarginales		= objeto.notasMarginales;
 					
 					datos.tieneFirma				= tieneFirma;
 					datos.firma							= firma;
 					
 					loading(true);
					Meteor.call('report', {
			      templateNombre: nombreReporte,
			      reportNombre	: 'ActaBautismoOut',
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
					objeto.fechaRegistro			= objeto.fechaRegistro == undefined || objeto.fechaRegistro == "" ? "" :formatDate(objeto.fechaRegistro);
					objeto.fechaNac						= objeto.fechaNacimiento == undefined || objeto.fechaNacimiento  == "" ? "" :formatDate(objeto.fechaNacimiento);
					
					var conjuncionAP = "";
					var conjuncionAM = "";
					var primeraLetra = "";
					
					objeto.abuelosPaternos = "";
					objeto.abuelosMaternos = "";
					
					
					if (objeto.abueloPaterno == undefined || objeto.abueloPaterno == "" )
					{						
							if (objeto.abuelaPaterna != undefined && objeto.abuelaPaterna != "" ) 						
									objeto.abuelosPaternos 	= objeto.abuelaPaterna;
					}
					else 
					{						
							if (objeto.abuelaPaterna != "")
							{
									primeraLetra = objeto.abuelaPaterna.substr(0,1);
									if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í" || primeraLetra == "H" || primeraLetra == "h")
											conjuncionAP = " E ";
									else
											conjuncionAP = " Y ";		
					    }   
					    objeto.abuelosPaternos 	= objeto.abuelaPaterna == "" ? objeto.abueloPaterno : objeto.abueloPaterno + conjuncionAP + objeto.abuelaPaterna;
					}
			    if (objeto.abueloMaterno == undefined || objeto.abueloMaterno == "" )
					{						
							if (objeto.abuelaMaterna != undefined && objeto.abuelaMaterna != "" ) 						
									objeto.abuelosMaternos 	= objeto.abuelaMaterna;
					}
					else 
					{	
			    		if (objeto.abuelaMaterna != "")
							{
									primeraLetra = objeto.abuelaMaterna.substr(0,1);
									if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í"  || primeraLetra == "H" || primeraLetra == "h")
											conjuncionAM = " E ";
									else
											conjuncionAM = " Y ";		
					    }
							objeto.abuelosMaternos 	= objeto.abuelaMaterna == "" ? objeto.abueloMaterno : objeto.abueloMaterno + conjuncionAM + objeto.abuelaMaterna;			    
			    }
					
					
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
									
									Meteor.call ("getBautismosId", objeto._id, function(error,result){
			
										if (error){
											 console.log(error);
											 toastr.error('Error al obtener los datos.: ', error.details);
											 //loading(false);
											 return;
										}
										if (result)
										{																									
						 						
						 						objeto 										= result;
						 												 						
						 						objeto.numeroFolio				= folio;
						 						
												objeto.parroquiaNombre 		= parroquia.nombre;
												objeto.parroquiaDomicilio = parroquia.domicilio;
												objeto.parroquiaTelefono 	= parroquia.telefono;
												objeto.sacerdote					= objeto.sacerdoteNombre;
												
												objeto.sexo								= objeto.esHijo == "HIJO" ? "NIÑO" : "NIÑA";
												objeto.fechaBautizo				= formatDate(objeto.fecha);
												objeto.fechaRegistro			= objeto.fechaRegistro == undefined || objeto.fechaRegistro == "" ? "" :formatDate(objeto.fechaRegistro);
												objeto.fechaNac						= objeto.fechaNacimiento == undefined || objeto.fechaNacimiento  == "" ? "" :formatDate(objeto.fechaNacimiento);
												objeto.nombreFirma		 		= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
												objeto.cargoFirma		  		= sacerdote.profile.cargo;
												
												var conjuncionAP = "";
												var conjuncionAM = "";
												var primeraLetra = "";
												
												objeto.abuelosPaternos = "";
												objeto.abuelosMaternos = "";
												
												
												if (objeto.abueloPaterno == undefined || objeto.abueloPaterno == "" )
												{						
														if (objeto.abuelaPaterna != undefined && objeto.abuelaPaterna != "" ) 						
																objeto.abuelosPaternos 	= objeto.abuelaPaterna;
												}
												else 
												{						
														if (objeto.abuelaPaterna != "")
														{
																primeraLetra = objeto.abuelaPaterna.substr(0,1);
																if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í" || primeraLetra == "H" || primeraLetra == "h")
																		conjuncionAP = " E ";
																else
																		conjuncionAP = " Y ";		
												    }   
												    objeto.abuelosPaternos 	= objeto.abuelaPaterna == "" ? objeto.abueloPaterno : objeto.abueloPaterno + conjuncionAP + objeto.abuelaPaterna;
												}
										    if (objeto.abueloMaterno == undefined || objeto.abueloMaterno == "" )
												{						
														if (objeto.abuelaMaterna != undefined && objeto.abuelaMaterna != "" ) 						
																objeto.abuelosMaternos 	= objeto.abuelaMaterna;
												}
												else 
												{	
										    		if (objeto.abuelaMaterna != "")
														{
																primeraLetra = objeto.abuelaMaterna.substr(0,1);
																if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í"  || primeraLetra == "H" || primeraLetra == "h")
																		conjuncionAM = " E ";
																else
																		conjuncionAM = " Y ";		
												    }
														objeto.abuelosMaternos 	= objeto.abuelaMaterna == "" ? objeto.abueloMaterno : objeto.abueloMaterno + conjuncionAM + objeto.abuelaMaterna;			    
										    }
												
												rc.datos.bautismos.push(objeto);
										}
										folio = folio + 1;
									});
									
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
 	
 	this.buscarBautismos = function() 
  {
			if (rc.fecha != undefined)
			{
				var fechaInicial = rc.fecha;
			  fechaInicial.setHours(0,0,0,0);
			  var fechaFinal = new Date(rc.fecha);
			  fechaFinal.setHours(23,59,59,999);
 			  
			  var parroquia_id = Meteor.users.findOne({_id:  Meteor.userId()}).profile.parroquia_id;
 
 				Meteor.call ("getBautismosFecha", parroquia_id, fechaInicial, fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
	
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
  
  this.buscarBautismosFecha = function() 
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
 				Meteor.call ("getBautismosFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
	
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
	 				Meteor.call ("getBautismosFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
		
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
	 				Meteor.call ("getBautismosFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, rc.numeroPagina, rc.avance, function(error,result){
		
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
      		Bautismos.remove({_id: objeto._id});
	      	toastr.success("Eliminado");
	    });
	}
	
	
	/*
function camelize (str) {
		 	var res = str.split(" ");
	  	var cadena = "";
	  	_.each(res, function(palabra){
		  		if (palabra.trim() == 'de' || palabra.trim() == 'del')		  		
		  			 cadena += palabra + " ";	
		  		else
			  		 cadena += palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase() + " ";
	  	});
			
      return cadena.trim();
	}
*/
     
};