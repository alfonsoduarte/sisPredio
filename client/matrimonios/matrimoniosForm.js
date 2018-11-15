angular.module("parroquias")
.controller("MatrimoniosCtrl", MatrimoniosCtrl);
 function MatrimoniosCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams){
 	
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
  rc.notificacion = {};
  
  this.parroquias = [];
  this.notificaciones = [];
  
  $(".js-example-basic-single").select2();
  
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{	"profile.estatus"			: true,
							roles									: ["Sacerdote"]
						}]
	});
	
	this.subscribe('parroquias',()=>{
		return [{notificaciones: true}]
	});
	
	if($stateParams.id != undefined){
 
 	  	rc.action = false;
      this.subscribe('matrimonios', () => {
        return [{
          	_id : $stateParams.id
        }];
      });
      
      this.subscribe('notificaciones',()=>{
				return [{ sacramento_id: $stateParams.id}]
			});
  }
	
	 
	this.helpers({
		objeto : () => {
		  	var matrimonio = Matrimonios.findOne($stateParams.id);
 		  	
 		  	if (matrimonio != undefined)
		  	{		
			  		var user = Meteor.users.findOne(Meteor.userId());
 			
						if (matrimonio.tipoSacerdote == "PARROQUIA")
						{
								rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
						}
						else if (matrimonio.tipoSacerdote == "DIOCESIS")
						{
								rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
 						}
			  		
			  		if (matrimonio.tipoSacerdoteParroco != undefined)
 						{
	 							if (matrimonio.tipoSacerdoteParroco == "PARROQUIA")
								{
										rc.sacerdotesConstancia = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
								}	
 						}
 						else
 						{
	 							matrimonio.tipoSacerdoteParroco = "OTRO";
 						}
			  		
			  		if (matrimonio.estatus == "casados")
			  		{
				  			rc.estatus = false;
				  		
			  		}
			  		else if (matrimonio.estatus == "enTramite")
						{
								rc.estatus = true;
						}	
						
						this.notificaciones = Notificaciones.find({}).fetch();
 			  		
			  		return matrimonio;		
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
			
			if (objeto.apellidoPaternoEl 	 == undefined )  objeto.apellidoPaternoEl = "";
		  if (objeto.apellidoMaternoEl 	 == undefined )  objeto.apellidoMaternoEl = "";
		  if (objeto.apellidoPaternoElla 	 == undefined )  objeto.apellidoPaternoElla = "";
		  if (objeto.apellidoMaternoElla 	 == undefined )  objeto.apellidoMaternoElla = "";
			
			if (objeto.apellidoPaternoEl == "" && objeto.apellidoMaternoEl == "")
				objeto.nombreCompletoEl = objeto.nombreEl;
			else if (objeto.apellidoPaternoEl == "" && objeto.apellidoMaternoEl != "")
				objeto.nombreCompletoEl = objeto.apellidoMaternoEl + " " + objeto.nombreEl; 	 
			else if (objeto.apellidoPaternoEl != "" && objeto.apellidoMaternoEl == "")	
				objeto.nombreCompletoEl = objeto.apellidoPaternoEl + " " + objeto.nombreEl; 
			else
				objeto.nombreCompletoEl = objeto.apellidoPaternoEl + (objeto.apellidoMaternoEl == "" ? "": " " + objeto.apellidoMaternoEl) + " " + objeto.nombreEl;

			//objeto.nombreCompletoEl 	= objeto.apellidoPaternoEl + (objeto.apellidoMaternoEl == "" ? "": " " + objeto.apellidoMaternoEl) + " " + objeto.nombreEl;
			
			if (objeto.apellidoPaternoElla == "" && objeto.apellidoMaternoElla == "")
				objeto.nombreCompletoElla = objeto.nombreElla;
			else if (objeto.apellidoPaternoElla == "" && objeto.apellidoMaternoElla != "")
				objeto.nombreCompletoElla = objeto.apellidoMaternoElla + " " + objeto.nombreElla; 	 
			else if (objeto.apellidoPaternoElla != "" && objeto.apellidoMaternoElla == "")	
				objeto.nombreCompletoElla = objeto.apellidoPaternoElla + " " + objeto.nombreElla;
			else
				objeto.nombreCompletoElla = objeto.apellidoPaternoElla + (objeto.apellidoMaternoElla == "" ? "": " " + objeto.apellidoMaternoElla) + " " + objeto.nombreElla;	
			
			//objeto.nombreCompletoElla = objeto.apellidoPaternoElla + (objeto.apellidoMaternoElla == "" ? "": " " + objeto.apellidoMaternoElla) + " " + objeto.nombreElla;
			
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
 			
 			if (objeto.estatus == 'casados')
 			{
	 				if (rc.objeto.tipoSacerdoteParroco == "PARROQUIA"){
							var sacerdoteParroco = Meteor.users.findOne(objeto.sacerdoteParroco_id);
		  			  objeto.parroco		 	 = sacerdoteParroco.profile.titulo + " " + sacerdoteParroco.profile.nombreCompleto;
		 			}
					else
					{
		 					objeto.sacerdoteParroco_id			= "";
		 			}	
 			}
 			
 			objeto.fecha.setHours(14,0,0,0);
 			
 			if (objeto.fechaBautismoEl != undefined)
 					objeto.fechaBautismoEl.setHours(14,0,0,0);
 			
 			if (objeto.fechaBautismoElla != undefined)	
 					objeto.fechaBautismoElla.setHours(14,0,0,0);
			
			loading(true);
			Meteor.call ("setServicios", objeto, "Matrimonio", function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al guardar los datos.: ', error.details);
					 return
				}
				if (result)
				{
					 rc.objeto = {};
				 	 toastr.success('Guardado correctamente.');
				 	 loading(false);
					 $state.go('root.matrimoniosLista');						
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
		  
		  if (objeto.apellidoPaternoEl 	 == undefined )  objeto.apellidoPaternoEl = "";
		  if (objeto.apellidoMaternoEl 	 == undefined )  objeto.apellidoMaternoEl = "";
		  if (objeto.apellidoPaternoElla 	 == undefined )  objeto.apellidoPaternoElla = "";
		  if (objeto.apellidoMaternoElla 	 == undefined )  objeto.apellidoMaternoElla = "";
		  
		  if (objeto.apellidoPaternoEl == "" && objeto.apellidoMaternoEl == "")
				objeto.nombreCompletoEl = objeto.nombreEl;
			else if (objeto.apellidoPaternoEl == "" && objeto.apellidoMaternoEl != "")
				objeto.nombreCompletoEl = objeto.apellidoMaternoEl + " " + objeto.nombreEl; 	 
			else if (objeto.apellidoPaternoEl != "" && objeto.apellidoMaternoEl == "")	
				objeto.nombreCompletoEl = objeto.apellidoPaternoEl + " " + objeto.nombreEl; 
			else
				objeto.nombreCompletoEl = objeto.apellidoPaternoEl + (objeto.apellidoMaternoEl == "" ? "": " " + objeto.apellidoMaternoEl) + " " + objeto.nombreEl;

			//objeto.nombreCompletoEl 	= objeto.apellidoPaternoEl + (objeto.apellidoMaternoEl == "" ? "": " " + objeto.apellidoMaternoEl) + " " + objeto.nombreEl;
			
			if (objeto.apellidoPaternoElla == "" && objeto.apellidoMaternoElla == "")
				objeto.nombreCompletoElla = objeto.nombreElla;
			else if (objeto.apellidoPaternoElla == "" && objeto.apellidoMaternoElla != "")
				objeto.nombreCompletoElla = objeto.apellidoMaternoElla + " " + objeto.nombreElla; 	 
			else if (objeto.apellidoPaternoElla != "" && objeto.apellidoMaternoElla == "")	
				objeto.nombreCompletoElla = objeto.apellidoPaternoElla + " " + objeto.nombreElla;
			else
				objeto.nombreCompletoElla = objeto.apellidoPaternoElla + (objeto.apellidoMaternoElla == "" ? "": " " + objeto.apellidoMaternoElla) + " " + objeto.nombreElla;	
		  
		  //objeto.nombreCompletoEl 	= objeto.apellidoPaternoEl + (objeto.apellidoMaternoEl == "" ? "": " " + objeto.apellidoMaternoEl) + " " + objeto.nombreEl;
			//objeto.nombreCompletoElla = objeto.apellidoPaternoElla + (objeto.apellidoMaternoElla == "" ? "": " " + objeto.apellidoMaternoElla) + " " + objeto.nombreElla;
  		
  		  
		  if (rc.objeto.tipoSacerdote == "PARROQUIA" || rc.objeto.tipoSacerdote == "DIOCESIS"){
					var sacerdote = Meteor.users.findOne(objeto.sacerdote_id);
  			  objeto.sacerdoteNombre 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
 			}
			else
			{
 					objeto.sacerdote_id			= "";
 			}
 			
 			if (objeto.estatus == 'casados')
 			{
	 				if (rc.objeto.tipoSacerdoteParroco == "PARROQUIA"){
							var sacerdoteParroco = Meteor.users.findOne(objeto.sacerdoteParroco_id);
		  			  objeto.parroco		 	 = sacerdoteParroco.profile.titulo + " " + sacerdoteParroco.profile.nombreCompleto;
		 			}
					else
					{
		 					objeto.sacerdoteParroco_id			= "";
		 			}	
 			}
 			
 			
 			objeto.fecha.setHours(14,0,0,0);
 			
 			if (objeto.fechaBautismoEl != undefined)
 					objeto.fechaBautismoEl.setHours(14,0,0,0);
 			
 			if (objeto.fechaBautismoElla != undefined)	
 					objeto.fechaBautismoElla.setHours(14,0,0,0);
		   
 		  objeto.fechaActualizacion	= new Date();
			var idTemp = objeto._id;
			delete objeto._id;		
			objeto.usuarioActualizo = Meteor.userId(); 
			Matrimonios.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$state.go('root.matrimoniosLista');
			
	};

  this.cambiarEstatus = function()
	{
			if (rc.objeto.estatus == "casados")
			{
				 	rc.estatus = false;
			}
			else if (rc.objeto.estatus == "enTramite")
			{
					rc.estatus = true;
					rc.objeto.libro = 0;
					rc.objeto.foja = 0;
					rc.objeto.noDeActa = 0;
					rc.objeto.noExpediente = 0;
			
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
				objeto.tipoNota		 					= "MATRIMONIO";
				objeto.sacramento_id				= $stateParams.id;
				objeto.parroquiaOrigen_id  	= Meteor.user().profile.parroquia_id;
				objeto.parroquiaOrigen	  	= Parroquias.findOne(Meteor.user().profile.parroquia_id).nombre;
				objeto.lugarOrigen			  	= Parroquias.findOne(Meteor.user().profile.parroquia_id).lugar;
			  objeto.fechaSacramento			= rc.objeto.fecha;
			  
			  if (objeto.persona == undefined)
			  {
				  	toastr.warning("Seleccione el Él o Ella");
				  	return;
			  }	
			  
			  if (objeto.persona == 'El')
			  {
						objeto.nombreCompleto		= rc.objeto.nombreCompletoEl;  
						objeto.fechaBautismo		= rc.objeto.fechaBautismoEl;
						
						objeto.padre								= rc.objeto.padreEl;
						objeto.madre								= rc.objeto.madreEl;
						
						objeto.nota = objeto.parroquiaOrigen + ", LIBRO: " + rc.objeto.libro + 
																							 		 ", FOJA: " + rc.objeto.foja + 
																							 		 ", No ACTA: " + rc.objeto.noDeActa + 
																							 		 ", FECHA: " + formatDate(rc.objeto.fecha) +
																							 		 ", MATRIMONIO CON: " + rc.objeto.nombreCompletoElla; 
						
			  }
			  else if (objeto.persona == 'Ella')
				{
						objeto.nombreCompleto		= rc.objeto.nombreCompletoElla;
						objeto.fechaBautismo		= rc.objeto.fechaBautismoElla;
						
						objeto.padre								= rc.objeto.padreElla;
						objeto.madre								= rc.objeto.madreElla;
						
						objeto.nota = objeto.parroquiaOrigen + ", LIBRO: " + rc.objeto.libro + 
																									 ", FOJA: " + rc.objeto.foja + 
																									 ", No ACTA: " + rc.objeto.noDeActa + 
																									 ", FECHA: " + formatDate(rc.objeto.fecha) +
																									 ", MATRIMONIO CON: " + rc.objeto.nombreCompletoEl;
						
				}
							
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
				
				objeto.nombreCompletoEl		= rc.objeto.nombreCompletoEl;
				objeto.nombreCompletoElla	= rc.objeto.nombreCompletoElla;
				
				//objeto.nota = objeto.parroquiaOrigen + ", Libro: " + rc.objeto.libro + ", Foja: " + rc.objeto.foja + ", No Acta: " + rc.objeto.noDeActa;
				
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
		  
		  
		  if (objeto.persona == undefined)
		  {
			  	toastr.warning("Seleccione el Él o Ella");
			  	return;
		  }	
		  
		  if (objeto.persona == 'El')
		  {
					objeto.nombreCompleto				= rc.objeto.nombreCompletoEl; 
					
					objeto.padre								= rc.objeto.padreEl;
					objeto.madre								= rc.objeto.madreEl;
					
					objeto.nota = objeto.parroquiaOrigen + ", Libro: " + rc.objeto.libro + 
																						 		 ", Foja: " + rc.objeto.foja + 
																						 		 ", No Acta: " + rc.objeto.noDeActa + 
																						 		 ", Fecha: " + formatDate(rc.objeto.fecha) +
																						 		 ", Matrimonio con: " + rc.objeto.nombreCompletoElla; 
					
		  }
		  else if (objeto.persona == 'Ella')
			{
					objeto.nombreCompleto				= rc.objeto.nombreCompletoElla;
					
					objeto.padre								= rc.objeto.padreElla;
					objeto.madre								= rc.objeto.madreElla;
					
					objeto.nota = objeto.parroquiaOrigen + ", Libro: " + rc.objeto.libro + 
																								 ", Foja: " + rc.objeto.foja + 
																								 ", No Acta: " + rc.objeto.noDeActa + 
																								 ", Fecha: " + formatDate(rc.objeto.fecha) +
																								 ", Matrimonio con: " + rc.objeto.nombreCompletoEl;
			}
						
			if (objeto.tipo == 'sistema')
			{		
					var parroquia 							= Parroquias.findOne({_id: objeto.parroquiaDestino_id});
					objeto.parroquiaDestino 		= parroquia.nombre;
					objeto.lugarDestino 				= parroquia.lugar;
					
			}
			else if (objeto.tipo == 'carta')
			{
					
					objeto.libroSacramento 			= rc.objeto.libro;
					objeto.fojaSacramento 			= rc.objeto.foja;
					objeto.noDeActaSacramento 	= rc.objeto.noDeActa;
					
			}
			
			objeto.nombreCompletoEl		= rc.objeto.nombreCompletoEl;
			objeto.nombreCompletoElla	= rc.objeto.nombreCompletoElla;
			
			
			
			//console.log(objeto);
			
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
					nombreReporte = 'NotificacionMatrimonio';
			}
			else
			{
					tieneFirma 		= "Si";
					firma			 		= sacerdote.profile.firma;
					nombreReporte = 'NotificacionMatrimonioFirma';
			}
			var datos = {};
			
			datos 								= rc.objetoImprimir;
			datos.fechaImpresion	= formatDate(new Date());
			
			datos.parroquia				= parroquia.nombre;
			datos.tipo						= parroquia.tipo;
			datos.parroquiaLugar	= parroquia.lugar;
			
			datos.nombreFirma			= sacerdote.profile.nombreCompleto;
			datos.cargoFirma			= sacerdote.profile.cargo;
			
			datos.fechaSacramentoImpresion	= formatDate(rc.objetoImprimir.fechaSacramento);
			

			loading(true);
			Meteor.call('report', {
	      templateNombre: nombreReporte,
	      reportNombre	: 'NotMatrimonioOut',
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