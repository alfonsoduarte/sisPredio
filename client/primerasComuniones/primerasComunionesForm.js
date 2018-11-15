angular.module("parroquias")
.controller("PrimerasComunionesCtrl", PrimerasComunionesCtrl);
 function PrimerasComunionesCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
 	rc.action = true;
 	rc.nuevo = true;
 	rc.actionN = true;

  rc.objeto = {};
  rc.estatus = true;
  
  rc.sacerdotes = [];  
  rc.sacerdoteFirma_id = "";
  
  this.buscar = {};
  this.parroquias = [];
  this.notificaciones = [];
  
  $(".js-example-basic-single").select2();
  
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{ "profile.estatus"			: true,
						 	roles									: ["Sacerdote"]
						}]
	});
	
	this.subscribe('parroquias',()=>{
		return [{notificaciones: true}]
	});
	
	//Condición del Parametro
  if($stateParams.id != undefined){
	  	
	  	//console.log($stateParams.id)
	  	rc.action = false;
      this.subscribe('primerasComuniones', () => {
        return [{ _id : $stateParams.id }];
      });
      
      this.subscribe('notificaciones',()=>{
				return [{ sacramento_id: $stateParams.id}]
			});
      
  }
	 
	this.helpers({
		objeto : () => {
		  	var primeraComunion = PrimerasComuniones.findOne($stateParams.id);
		  	
		  	if (primeraComunion != undefined)
		  	{	
			  		var user = Meteor.users.findOne(Meteor.userId());
 			
						if (primeraComunion.tipoSacerdote == "PARROQUIA")
						{
								rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
						}
						else if (primeraComunion.tipoSacerdote == "DIOCESIS")
						{
								rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
 						}
 						
 						if (primeraComunion.tipoSacerdoteParroco != undefined)
 						{
	 							if (primeraComunion.tipoSacerdoteParroco == "PARROQUIA")
								{
										rc.sacerdotesConstancia = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
								}	
 						}
 						else
 						{
	 							primeraComunion.tipoSacerdoteParroco = "OTRO";
 						}
 						
 						if (primeraComunion.estatus == "primeraComunion")
						{
								rc.estatus = false;
						}
						else if (primeraComunion.estatus == "enTramite")
						{
								rc.estatus = true;
 						}
 						
 						if (primeraComunion.estatus == "primeraComunion")
			  		{
				  			rc.estatus = false;
				  		
			  		}
			  		else if (primeraComunion.estatus == "enTramite")
						{
								rc.estatus = true;
						}
 						
 						this.notificaciones = Notificaciones.find({}).fetch();
 			  		
			  		return primeraComunion;		
		  	}
		  	
	  },
	  
  });
  

  this.guardar = function(objeto,form)
	{
		
			if (form.$invalid){
		     toastr.error('Error al guardar los datos.');
		     return;
		  }
 
 			objeto.usuario_id = Meteor.userId();
		  
		  objeto.apellidoPaterno = objeto.apellidoPaterno == undefined ? "" : objeto.apellidoPaterno;
			objeto.apellidoMaterno = objeto.apellidoMaterno == undefined ? "" : objeto.apellidoMaterno;
			objeto.padre					 = objeto.padre == undefined ? "" : objeto.padre;
			objeto.madre					 = objeto.madre == undefined ? "" : objeto.madre;
		  
		  if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno == "")
				objeto.nombreCompleto = objeto.nombre;
			else if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno != "")
				objeto.nombreCompleto = objeto.apellidoMaterno + " " + objeto.nombre; 	 
			else if (objeto.apellidoPaterno != "" && objeto.apellidoMaterno == "")	
				objeto.nombreCompleto = objeto.apellidoPaterno + " " + objeto.nombre; 
			else
				objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
			
			var user = Meteor.users.findOne({_id:  Meteor.userId()});
			objeto.parroquia_id 		= user.profile.parroquia_id;
			objeto.fechaCreacion	= new Date(); 	 
			
			if (rc.objeto.tipoSacerdote == "PARROQUIA" || rc.objeto.tipoSacerdote == "DIOCESIS"){
					var sacerdote = Meteor.users.findOne(objeto.sacerdote_id);
  			  objeto.sacerdoteNombre 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
 			}
			else
			{
 					objeto.sacerdote_id			= "";
 			}
 			
 			objeto.fecha.setHours(14,0,0,0);
 			objeto.fechaBautismo.setHours(14,0,0,0);
 			
			loading(true);
			Meteor.call ("setServicios", objeto, "Primera Comunión", function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al guardar los datos.: ', error.details);
					 return
				}
				if (result)
				{
					 rc.objeto = {};
				 		toastr.success('Guardado correctamente.');
				 		$state.go('root.primerasComunionesLista');
					 	loading(false);		 
											
				}
			});
			
		
	};
	
	this.actualizar = function(objeto,form)
	{
			if(form.$invalid){
		        toastr.error('Error al actualizar los datos.');
		        return;
		  }
		  
		  objeto.usuario_id = Meteor.userId();
		  
		  objeto.apellidoPaterno = objeto.apellidoPaterno == undefined ? "" : objeto.apellidoPaterno;
			objeto.apellidoMaterno = objeto.apellidoMaterno == undefined ? "" : objeto.apellidoMaterno;
			objeto.padre					 = objeto.padre == undefined ? "" : objeto.padre;
			objeto.madre					 = objeto.madre == undefined ? "" : objeto.madre;
		  
		  if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno == "")
				objeto.nombreCompleto = objeto.nombre;
			else if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno != "")
				objeto.nombreCompleto = objeto.apellidoMaterno + " " + objeto.nombre; 	 
			else if (objeto.apellidoPaterno != "" && objeto.apellidoMaterno == "")	
				objeto.nombreCompleto = objeto.apellidoPaterno + " " + objeto.nombre; 
			else
				objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
			
			var user = Meteor.users.findOne({_id:  Meteor.userId()});
			objeto.parroquia_id 	= user.profile.parroquia_id;
			objeto.fechaCreacion	= new Date(); 	 
 
 			if (rc.objeto.tipoSacerdote == "PARROQUIA" || rc.objeto.tipoSacerdote == "DIOCESIS"){
					var sacerdote = Meteor.users.findOne(objeto.sacerdote_id);
  			  objeto.sacerdoteNombre 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
 			}
			else
			{
 					objeto.sacerdote_id			= "";
 			}
 			
 			if (objeto.estatus == 'primeraComunion')
 			{
	 				if (rc.objeto.tipoSacerdoteParroco == "OTRO"){
		 					objeto.sacerdoteParroco_id			= "";
		 			}	
 			}
 			
 			objeto.fecha.setHours(14,0,0,0);
 			objeto.fechaBautismo.setHours(14,0,0,0);
 
 			var idTemp = objeto._id;
			delete objeto._id;		
			objeto.usuarioActualizo = Meteor.userId(); 
			PrimerasComuniones.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$state.go('root.primerasComunionesLista');
			
	};
	
	this.cambiarEstatus = function()
	{
			if (rc.objeto.estatus == "primeraComunion")
			{
					rc.estatus = false;
			}
			else if (rc.objeto.estatus == "enTramite")
			{
					rc.estatus = true;
					rc.objeto.libro = 0;
					rc.objeto.foja = 0;
					rc.objeto.noDeActa = 0;
			
			}		
	};
	
	this.cargarSacerdotes = function()
	{
 			var user = Meteor.users.findOne(Meteor.userId());
 			
			if (rc.objeto.tipoSacerdote == "PARROQUIA")
			{
					rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
			}
			else if (rc.objeto.tipoSacerdote == "DIOCESIS")
			{
					rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
 			}		
	};
	
	
	this.agregarNotificacion = function()
	{
			rc.notificacion = {};
			rc.actionN = true;
			$("#modalNotificacion").modal('show');
			this.parroquias = Parroquias.find({_id: {$ne : Meteor.user().profile.parroquia_id }}).fetch();
			
	};
	
	this.editarNotificacion = function(objeto)
	{
			
			rc.actionN = false;
			this.parroquias = Parroquias.find({_id: {$ne : Meteor.user().profile.parroquia_id }}).fetch();
			//console.log(objeto);
			rc.notificacion = objeto;
			$("#modalNotificacion").modal('show');
			
	}
	
	this.guardarNotificacion = function(objeto, form)
	{
			if (form.$invalid){
		     toastr.error('Error al guardar los datos de la notificación .');
		     return;
		  }
		  
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
		  
			objeto.fecha								= new Date();
			objeto.fecha.setHours(14,0,0,0);
			objeto.estatus 							= 1;			//Pendiente
			objeto.usuario_id						= Meteor.userId();
			objeto.tipoNota		 					= "PRIMERA COMUNIÓN";
			objeto.sacramento_id				= $stateParams.id;
			objeto.parroquiaOrigen_id  	= Meteor.user().profile.parroquia_id;
			objeto.parroquiaOrigen	  	= Parroquias.findOne(Meteor.user().profile.parroquia_id).nombre;
			objeto.lugarOrigen			  	= Parroquias.findOne(Meteor.user().profile.parroquia_id).lugar;
			objeto.nombreCompleto				= rc.objeto.nombreCompleto;
			objeto.fechaSacramento			= rc.objeto.fecha;
			objeto.padre								= rc.objeto.padre;
			objeto.madre								= rc.objeto.madre;
						
			
			if (objeto.tipo == 'sistema')
			{
					var parroquia = Parroquias.findOne({_id: objeto.parroquiaDestino_id});
					objeto.parroquiaDestino = parroquia.nombre;
					objeto.lugarDestino = parroquia.lugar;
			}
			else if (objeto.tipo == 'carta')
			{						
					objeto.libroSacramento 			= rc.objeto.libro;
					objeto.fojaSacramento 			= rc.objeto.foja;
					objeto.noDeActaSacramento 	= rc.objeto.noDeActa;		
			}
			
			objeto.nota = objeto.parroquiaOrigen + ", LIBRO: " + rc.objeto.libro + 
																						 ", FOJA: " + rc.objeto.foja + 
																						 ", No ACTA: " + rc.objeto.noDeActa + 
																						 ", FECHA: " + formatDate(rc.objeto.fecha);
			
			
			
			
			
			objeto._id = Notificaciones.insert(objeto);
			this.notificaciones.push(objeto);
			rc.notificacion = {};
			
			$("#modalNotificacion").modal('hide');
			
					
	};
	
	this.actualizarNotificacion = function(objeto, form)
	{
			if (form.$invalid){
		     toastr.error('Error al actualizar los datos de la notificación .');
		     return;
		  }
		  
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
		  
		  objeto.fechaActualizacion		= new Date();
			objeto.usuarioActualizo_id	= Meteor.userId();
			objeto.sacramento_id				= $stateParams.id;
			objeto.parroquiaOrigen_id  	= Meteor.user().profile.parroquia_id;
			objeto.parroquiaOrigen	  	= Parroquias.findOne(Meteor.user().profile.parroquia_id).nombre;
			objeto.lugarOrigen			  	= Parroquias.findOne(Meteor.user().profile.parroquia_id).lugar;
			objeto.fechaSacramento			= rc.objeto.fecha;
						
			if (objeto.tipo == 'sistema')
			{
					var parroquia = Parroquias.findOne({_id: objeto.parroquiaDestino_id});
					objeto.parroquiaDestino = parroquia.nombre;
					objeto.lugarDestino = parroquia.lugar;
			}
			else if (objeto.tipo == 'carta')
			{						
					objeto.libroSacramento 			= rc.objeto.libro;
					objeto.fojaSacramento 			= rc.objeto.foja;
					objeto.noDeActaSacramento 	= rc.objeto.noDeActa;		
			}
			
			objeto.nota = objeto.parroquiaOrigen + ", LIBRO: " + rc.objeto.libro + 
																						 ", FOJA: " + rc.objeto.foja + 
																						 ", No ACTA: " + rc.objeto.noDeActa + 
																						 ", FECHA: " + formatDate(rc.objeto.fecha);
			
			objeto.nombreCompleto		= rc.objeto.nombreCompleto;
			
			objeto.padre								= rc.objeto.padre;
			objeto.madre								= rc.objeto.madre;
			
			var idTemp = objeto._id;
			delete objeto.$$hashKey;
			delete objeto._id;
			Notificaciones.update({_id: idTemp}, {$set:objeto});
			
			rc.notificacion = {};
			
			rc.notificaciones = Notificaciones.find().fetch();
			
			$("#modalNotificacion").modal('hide');
								
	};
	
	this.imprimirNotificacion = function(form)
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
					nombreReporte = 'NotificacionPrimeraComunion';
			}
			else
			{
					tieneFirma 		= "Si";
					firma			 		= sacerdote.profile.firma;
					nombreReporte = 'NotificacionPrimeraComunionFirma';
			}
			var datos = {};
			
			datos 								= rc.objetoImprimir;
			datos.fechaImpresion	= formatDate(new Date());
			
			datos.parroquia				= parroquia.nombre;
			datos.tipoParroquia		= parroquia.tipo;
			datos.parroquiaLugar	= parroquia.lugar;
			
			datos.nombreFirma			= sacerdote.profile.nombreCompleto;
			datos.cargoFirma			= sacerdote.profile.cargo;
			
			datos.fechaSacramentoImpresion	= formatDate(rc.objetoImprimir.fechaSacramento);
			

			loading(true);
			Meteor.call('report', {
	      templateNombre: nombreReporte,
	      reportNombre	: 'NotPComunionOut',
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
			
			rc.objetoImprimir = objeto;
			rc.sacerdotesFirma = Meteor.users.find({"profile.parroquia_id": Meteor.user().profile.parroquia_id,
																						   roles : ["Sacerdote"]}).fetch();
		
			$("#modalFirma").modal();
 	}	
	
	this.cargarSacerdotesParroquia = function()
	{
 			var user = Meteor.users.findOne(Meteor.userId());
			rc.sacerdotesConstancia = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
		
	};
	
	this.seleccionaSacerdotesParroquia = function()
	{
			 
			var sacerdoteParroco = Meteor.users.findOne(rc.objeto.sacerdoteParroco_id);
 			if (sacerdoteParroco != undefined)
		  		rc.objeto.parroco		 	 = sacerdoteParroco.profile.titulo + " " + sacerdoteParroco.profile.nombreCompleto;
	};
	
	this.seleccionaSacerdotesAsistio = function()
	{
			var sacerdote = Meteor.users.findOne(rc.objeto.sacerdote_id);
 			if (sacerdote != undefined)
		  		rc.objeto.sacerdoteNombre	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
	};
  

};