angular.module("parroquias")
.controller("PComunionesListaCtrl", PComunionesListaCtrl);
 function PComunionesListaCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
  this.action = true;
  this.nuevo = true;	 
  this.objeto = {}; 
  this.buscar = {};
  this.buscar.nombre = "";
  
  rc.arreglo = [];
  rc.busqueda = "nombre";
 	
 	rc.fechaFinal = new Date();
 	rc.fechaInicial = new Date();	
  rc.fecha = new Date();
  
  //Sacerdotes
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{ "profile.parroquia_id": usuario.profile.parroquia_id,
						  "profile.estatus"			: true,
						 	roles									: ["Sacerdote"]
						}]
	});
  
  this.subscribe('buscarPrimerasComuniones', () => {
	  
		if(this.getReactively("buscar.nombre").length > 4){
			
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
				var arr =  PrimerasComuniones.find({}, {sort:{nombreCompleto: 1}});
					if (arr != undefined)
							 return arr;
		
		},
		
		arregloListado : () => {
				
				var listado = PrimerasComuniones.find({}, { sort : {"hora" : 1 }}).fetch();
				
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
	});
  
  this.verDatos = function(objeto)
  {
	  	$("#modalVerDatos").modal(); 
 	  	
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
 						
						objeto.parroquiaNombre 						= result.nombre;
						objeto.parroquiaDomicilio 				= result.domicilio;
						objeto.parroquiaTelefono 					= result.telefono;
 																							
 						objeto.fechaPrimeraComunionLetra  = formatDate(objeto.fecha);
						objeto.fechaBautismoLetra 				= objeto.fechaBautismo 		== "" ? "" :formatDate(objeto.fechaBautismo);
 						
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
							nombreReporte = 'ActaPComunion';
					}
					else
					{
							tieneFirma 		= "Si";
							firma			 		= sacerdote.profile.firma;
							nombreReporte = 'ActaPComunionFirma';
					}
				
					var datos = {};
  
 					datos.parroquia						= parroquia.nombre;
					datos.parroquiaDomicilio 	= parroquia.domicilio;
					datos.parroquiaTelefonos 	= parroquia.telefonos;
					datos.parroquiaLugar		 	= parroquia.lugar;
					datos.tipo		 						= parroquia.tipo;
					
					
					datos.fechaPrimeraComunion= formatDate(objeto.fecha);
					datos.nombreCompleto			= objeto.nombreCompleto;
					datos.libro								= objeto.libro;
				  datos.foja								= objeto.foja;
				  datos.noDeActa						= objeto.noDeActa;
				  datos.esHijo							= objeto.esHijo;
					datos.padre								= objeto.padre;
					datos.madre								= objeto.madre;
				  datos.fechaBautismoLetra  = objeto.fechaBautismo 		== "" ? "" :formatDate(objeto.fechaBautismo);
				  datos.parroquiaBautismo		= objeto.parroquiaBautismo;
				  datos.sacerdoteNombre			= objeto.sacerdoteNombre;
				  datos.parroco							= objeto.parroco;
					
					datos.fechaImpresion			= formatDate(new Date());
 					datos.nombreFirma					= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
					datos.cargoFirma		  		= sacerdote.profile.cargo;
  				
  				var conjuncionM = "";
					if (objeto.madrina != "")
					{
							primeraLetra = objeto.madrina.substr(0,1);
							if (primeraLetra == "I" || primeraLetra == "i" || primeraLetra == "Í" || primeraLetra == "í" || primeraLetra == "H" || primeraLetra == "h" )
									conjuncionM = " E ";
							else
									conjuncionM = " Y ";		
			    }
  					
					datos.padrinos					 	= objeto.padrino + conjuncionM + objeto.madrina;
					
					datos.tieneFirma				= tieneFirma;
 					datos.firma							= firma;
  
 					loading(true);
					Meteor.call('report', {
			      templateNombre: nombreReporte,
			      reportNombre: 'ActaPComunionOut',
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
 
 					objeto.numeroFolio				= parroquia.folioConfirmacion + 1;
 					
					objeto.parroquia 			 		= parroquia.nombre;
					objeto.parroquiaDomicilio = parroquia.domicilio;
					objeto.parroquiaTelefono 	= parroquia.telefono;
					objeto.sacerdoteConfirmo  = objeto.sacerdoteNombre;
					
					objeto.edad								= moment().diff(objeto.fechaNacimiento, 'years',false);
							
					var month 								= objeto.fechaNacimiento.getMonth() + 1; //months from 1-12
					var day 									= objeto.fechaNacimiento.getDate();
					var fechaActual 					=  new Date();
					var d 										= new Date(month+"/"+day+"/"+(fechaActual.getFullYear() - 1) );
					
					
					objeto.meses							= moment(fechaActual).diff(d, 'months', false);
					
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
 					
					objeto.padres					 		= objeto.madre == "" ? objeto.padrino : objeto.padrino + conjuncionM + objeto.madrina;
  
					rc.datos = {};
					rc.datos.nombreFirma		 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
					rc.datos.cargoFirma		  	= sacerdote.profile.cargo;
					
					rc.datos.confirmaciones = [];
					rc.datos.confirmaciones.push(objeto);
					Meteor.call ("setFolioConfirmacion", objeto.parroquia_id, objeto.numeroFolio, function(err, response){
							if (response)
							{
								
									loading(true);
									Meteor.call('report', {
							      templateNombre: 'boletaConfirmacionArreglo',
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
					var folio = parroquia.folioBautismo + 1;
					
					_.each(rc.arregloListado, function(objeto){
						
							if (objeto.imprimir)
							{
										
									objeto.numeroFolio				= parroquia.folioConfirmacion + 1;
 					
									objeto.parroquia 			 		= parroquia.nombre;
									objeto.parroquiaDomicilio = parroquia.domicilio;
									objeto.parroquiaTelefono 	= parroquia.telefono;
									objeto.sacerdoteConfirmo  = objeto.sacerdoteNombre;
									
									objeto.edad								= moment().diff(objeto.fechaNacimiento, 'years',false);
											
									var month 								= objeto.fechaNacimiento.getMonth() + 1; //months from 1-12
									var day 									= objeto.fechaNacimiento.getDate();
									var fechaActual 					=  new Date();
									var d 										= new Date(month+"/"+day+"/"+(fechaActual.getFullYear() - 1) );
									
									
									objeto.meses							= moment(fechaActual).diff(d, 'months', false);
									
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
									
									folio = folio + 1;
									
									con ++;
									
									if (con == totalImprimir)
									{
											Meteor.call ("setFolioConfirmacion", parroquia_id, folio, function(err, response){
													if (response)
													{
														
															loading(true);
															Meteor.call('report', {
													      templateNombre: 'boletaConfirmacionArreglo',
													      reportNombre: 'todosConfirmados',
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
										
									}
 		 					}
					});
 
 					var chkxr = document.getElementById('todos');
					chkxr.checked = false;
	 				
	 			
 			}
  			
			$("#modalFirma").modal('hide'); 
			
			
	}
	
	this.buscarPrimerasComunionesFecha = function() 
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
 				Meteor.call ("getPrimerasComunionesFecha", parroquia_id, rc.fechaInicial, rc.fechaFinal, function(error,result){
	
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