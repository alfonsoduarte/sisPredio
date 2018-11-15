angular.module("parroquias")
.controller("IntensionesMisaCtrl", IntensionesMisaCtrl);
 function IntensionesMisaCtrl($scope, $meteor, $reactive, $state, toastr){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;

  rc.action = true;
  rc.objeto = {}; 
  rc.objeto.pago = 0;
  rc.hora = "";
  
  rc.objetoEditar = {}; 
  
  rc.arreglo = [];
  rc.horas	 = [];
    
  rc.fecha = new Date();
  rc.cantidad = 1;
    
  rc.num = 0;
  rc.porPagar = false;
		
	this.subscribe('tiemposLiturgicos', () => {

			this.fechaInicial = rc.getReactively("fecha");
		  this.fechaInicial.setHours(0,0,0,0);
		  this.fechaFinal = new Date(rc.getReactively("fecha"));
		  this.fechaFinal.setHours(23,0,0,0,999);
			
		  return [{	fecha: {$gte: this.fechaInicial, $lte: this.fechaFinal}} ];
	
	});
	
	this.subscribe('santorales', () => {
			var mes = rc.getReactively("fecha").getMonth() + 1;
			var dia = rc.getReactively("fecha").getDate();
			
		  return [{	numeroMes: mes,
								numeroDia: dia} ];
	
	});
	 
  this.subscribe('intencionesMisa', () => {
			this.fechaInicial = rc.getReactively("fecha");
		  this.fechaInicial.setHours(0,0,0,0);
		  this.fechaFinal = new Date(rc.getReactively("fecha"));
		  this.fechaFinal.setHours(23,0,0,0,999);			
			var parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
			return [{	parroquia_id: parroquia_id,
								fecha: {$gte: this.fechaInicial, $lte: this.fechaFinal}}];
  });
  
  this.subscribe('agenda', () => {
			this.fechaInicial = rc.getReactively("fecha");
		  this.fechaInicial.setHours(0,0,0,0);
		  this.fechaFinal = new Date(rc.getReactively("fecha"));
		  this.fechaFinal.setHours(23,0,0,0,999);			
			var parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
			return [{	parroquia_id: parroquia_id,
								fecha: {$gte: this.fechaInicial, $lte: this.fechaFinal}}];
  });
  
  this.helpers({
		cargar : () => {
			
			var horas	 = [];
			
			
			rc.arreglo = IntencionesMisa.find({},{sort : {hora : 1, intencion: 1}}).fetch();
			
			if (rc.arreglo != undefined)
			{
					_.each(rc.arreglo, function(intencion){
							if (intencion.estatus == true)
								intencion.porPagar = false;	
							//revisar si ya esta dentro del arreglo
							var buscar = false;
							_.each(horas, function(h){
								if (h != "Todas" && intencion.hora.getHours() === h.getHours())
									 buscar = true;
							});
							
							if (buscar == false)
									horas.push(new Date( intencion.hora));
					});
					
					var san = Santorales.findOne();
					if (san != undefined)
							rc.santoral = san.nombre;
					else	
							rc.santoral = "";
							
							
					var tt = TiemposLiturgicos.findOne();
					if (tt != undefined)
							rc.tiempoLiturgico = tt.nombre;
					else	
							rc.tiempoLiturgico = "";									

					//return intenciones;
			}	
			
			
			rc.agenda = Agenda.find({},{sort : {hora : 1, estipendio: 1}}).fetch();
			
			if (rc.agenda != undefined)
			{

					_.each(rc.agenda, function(agenda){
							if (agenda.estatus == true)
								agenda.porPagar = false;	
 							//console.log(rc.horas);
							//revisar si ya esta dentro del arreglo
							var buscar = false;
							_.each(horas, function(h){
								if (h != "Todas" && agenda.hora.getHours() === h.getHours())
									 buscar = true;
							});
							
							if (buscar == false)
								 horas.push(new Date(agenda.hora));
							
															
					});

			}		
			//console.log("ver");
			
			rc.horas = horas.sort();
			rc.horas.push("Todas");
			rc.hora = "Todas";
			
		},
	});
	  
  this.porHora = function(h)
  {
	 		
	 		if (h == "Todas")
	 		{
		 			rc.arreglo = IntencionesMisa.find({},{sort : {hora : 1, intencion : 1}}).fetch();	
		 			rc.agenda  = Agenda.find({},{sort : {hora : 1, estipendio: 1}}).fetch(); 
 	 		}
 	 		else
 	 		{
	 	 			var dateObj = moment(h, "YYYY-MM-DDTHH:mm:ssZ").toDate(); 
	 	 			var fecha = new Date(dateObj);
	 	 			rc.arreglo = IntencionesMisa.find({hora : dateObj},{sort : {intencion : 1}}).fetch();	
	 	 			rc.agenda  = Agenda.find({hora : dateObj},{sort : {hora : 1, estipendio: 1}}).fetch();
 	 		}
	 		
	}
	
	this.imprimir = function()
  {
	 		if (rc.arreglo.length == 0 && rc.agenda.length == 0)
	 		{
		 			toastr.warning("No hay nada para imprimir");
		 			return;
	 		}
	 		
	 		var archivoImprimir = "";
	 		
	 		if (rc.arreglo.length > 0 && rc.agenda.length == 0)
		 			archivoImprimir = "intensionesMisaIM";	
		 	else if (rc.arreglo.length == 0 && rc.agenda.length > 0)		
		 			archivoImprimir = "intensionesMisaC";	
		 	else if (rc.arreglo.length > 0 && rc.agenda.length > 0)		
	 				archivoImprimir = "intensionesMisaAmbos";
	 				
	 				
	 		var datos = {};
	 		datos.intenciones = [];
 	 		
	 		fechas = function (fecha){
 
			 //var year = fecha.getFullYear();//el año se puede quitar de este ejemplo
			 //var mes = fecha.getMonth();//pero ya que estamos lo ponemos completo
			 //var dia = fecha.getDate();
			 var hora = fecha.getHours();
			 var minutos = fecha.getMinutes();
			 //var segundos = fecha.getSeconds();
			 //aquí se hace lo 'importante'
			 //if(mes<10){mes='0'+mes}
			 //if(dia<10){dia='0'+dia}
			 if(hora<10){hora='0'+hora}
			 if(minutos<10){minutos='0'+minutos}
			 //if(segundos<10){segundos='0'+segundos} 
			 return hora + ":" + minutos;
			 
			};

 	 		_.each(rc.arreglo, function(intencion){
  
		 			var buscar =  false;
					_.each(datos.intenciones, function(h){
 
						if (fechas(intencion.hora) ===  h.hora )
							 buscar = true;
					});
					
					if (buscar == false)
					{
							var hora = {};
							hora.hora = fechas(intencion.hora);
							hora.horas = [];
							hora.horas.push({intencion: intencion.intencion, texto: intencion.concepto});
							
							datos.intenciones.push(hora);
 					}
					else
					{
							//buscar el arreglo para meterlo 
							_.each(datos.intenciones, function(h){
									if (fechas(intencion.hora) === h.hora)
									{
											h.horas.push({intencion: intencion.intencion, texto: intencion.concepto});
							    }
 
							});
 					}
 	 		});
	 		
	 		datos.agenda = [];
	 		
	 		_.each(rc.agenda, function(agenda){
  
		 			var buscar =  false;
					_.each(datos.agenda, function(h){
 
						if (fechas(agenda.hora) ===  h.hora )
							 buscar = true;
					});
					
					if (buscar == false)
					{
							var hora = {};
							hora.hora = fechas(agenda.hora);
							hora.horas = [];
							hora.horas.push({celebracion: agenda.estipendio, texto: agenda.concepto});
							
							datos.agenda.push(hora);
 					}
					else
					{
							//buscar el arreglo para meterlo 
							_.each(datos.agenda, function(h){
									if (fechas(agenda.hora) === h.hora)
									{
											h.horas.push({celebracion: agenda.estipendio, texto: agenda.concepto});
							    }
							});
 					}
 	 		});
	 		
	 		
	 		var parroquia_id = Meteor.users.findOne(Meteor.userId()).profile.parroquia_id;
	 		
	 		loading(true);
 	 		Meteor.call('getParroquia',  parroquia_id 
		     , function(err, file) {
		      if(!err){
		         	
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
		          
		          datos.santoral	= rc.santoral;
		          datos.tiempoLiturgico = rc.tiempoLiturgico;
		          datos.fecha 		= formatDate(rc.fecha);
		         	datos.parroquia = file.nombre;
		          
					 		Meteor.call('report', {
					      templateNombre: archivoImprimir,
					      reportNombre: 'Intenciones',
					      type: 'pdf',  
					      datos: datos,
						    }, function(err, file) {
						      if(!err){
						        downloadFile(file);
						      }else{
						        toastr.warning("Error al generar el reporte");
						      }
						  });					
							
		         
		         
		      }else{
		        toastr.warning("Error al obtener parroquia");
		      }
		  });			 
			loading(false);
			
	}
	
	this.modificarIntencion = function(intencion)
  {
	 		rc.objetoEditar = intencion;
	 		$("#modalintencionesMisa").modal(); 
	 		
	}
	
	this.ActualizarIntencion = function(objeto, form)
  {
			
			if(form.$invalid){
		        toastr.error('Error al actualizar los datos.');
		        return;
		  }
			
			var hora = new Date(objeto.fecha);
		  hora.setHours(objeto.hora.getHours(), objeto.hora.getMinutes(),0,0);
			
			IntencionesMisa.update({_id: objeto._id}, {$set: {fecha: objeto.fecha, hora: hora, intencion: objeto.intencion, concepto: objeto.concepto }});
			toastr.success('Actualizado correctamente.');
	 		$("#modalintencionesMisa").modal('hide'); 
	 		
	 		rc.objetoEditar = {};
	 		
	}
  
  this.ordenarArreglo = function()
	{
			if (rc.horas.length > 0){
				
				
			}
				
			
	}
	
  	
  
};