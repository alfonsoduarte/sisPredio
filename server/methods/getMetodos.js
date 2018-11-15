	Meteor.methods({
		
	getParroquia: function (parroquia_id) {
    var parroquia = Parroquias.findOne({_id : parroquia_id});	 
		return parroquia;		
	},
	
	getDecanato: function (decanato_id) {
	  var decanato = Decanatos.findOne({_id : decanato_id});	 
		return decanato;		
	},
	
	getCobro: function (ids){
		var cobros = Cobros.find({_id: {$in: ids }}).fetch();
		return cobros;
	},
	
	getDatosBoleta: function (parroquia_id, sacerdote_id) {
		
		var objeto = {};
		
		if (sacerdote_id != undefined)
		{	
				var sacerdote = Meteor.users.findOne(sacerdote_id);
				objeto.sacerdote = sacerdote.profile.nombreCompleto; 
		}
 	  var parroquia = Parroquias.findOne({_id : parroquia_id});	 
	  objeto.parroquia = parroquia; 
	  
		return objeto;		
	},
	
	getBautismosFecha: function (parroquia_id, fechaInicial, fechaFinal, s, l){
 		 return Bautismos.find({parroquia_id: parroquia_id, fecha: {$gte: fechaInicial, $lte: fechaFinal}}, {skip: s, 
	 		 																																																	 limit: l,
	 		 																																																	 fields	: { nombreCompleto	: 1,
																																																									  fecha						: 1, 
																																																									  libro						: 1, 
																																																									  foja						: 1,
																																																									  noDeActa				: 1,
																																																									  estatus					: 1 }}).fetch();
 	},
 	 	
 	getBautismosId: function (id){
	 	
	 	var objeto = Bautismos.findOne({ _id: id });	
	 	 
	 	var parroquia = Parroquias.findOne({_id: objeto.parroquia_id});
	 	 
	 	objeto.parroquiaNombre 		= parroquia.nombre;
		objeto.parroquiaDomicilio = parroquia.domicilio;
		objeto.parroquiaTelefono 	= parroquia.telefono;
	 	 
	 	
 		return objeto;
 	},
 	
 	getConfirmacionesFecha: function (parroquia_id, fechaInicial, fechaFinal, s, l){
 		 
 		 return Confirmaciones.find({parroquia_id: parroquia_id, fecha: {$gte: fechaInicial, $lte: fechaFinal}}, {skip		: s, 
			 		 																																																	  limit		: l,
			 		 																																																	  fields	: { nombreCompleto	: 1,
																																																												  fecha						: 1, 
																																																												  libro						: 1, 
																																																												  foja						: 1,
																																																												  noDeActa				: 1,
																																																												  estatus					: 1 }}).fetch();
 	},
 	
 	getConfirmacionesId: function (id){
	 	
	 	var objeto = Confirmaciones.findOne({ _id: id });	
	 	
	 	var parroquia = Parroquias.findOne({_id: objeto.parroquia_id});
	 	 
	 	objeto.parroquiaNombre 		= parroquia.nombre;
	 	objeto.parroquiaDomicilio = parroquia.domicilio;
		objeto.parroquiaTelefono 	= parroquia.telefono;
	 	 
	 	
 		return objeto;
 	},
 	
 	getPrimerasComunionesFecha: function (parroquia_id, fechaInicial, fechaFinal){
 		 return PrimerasComuniones.find({parroquia_id: parroquia_id, fecha: {$gte: fechaInicial, $lte: fechaFinal} }, {limit:100}).fetch();
 	},
 	
 	getMatrimoniosFecha: function (parroquia_id, fechaInicial, fechaFinal){
 		 return Matrimonios.find({parroquia_id: parroquia_id, fecha: {$gte: fechaInicial, $lte: fechaFinal} }, {limit:100}).fetch();
 	},
 	
 	getCobranza:function(fechaInicial, fechaFinal, parroquia_id){
			
			var cobranzaFecha = Cobros.find({parroquia_id: parroquia_id, fechaCobro : { $gte : fechaInicial, $lte : fechaFinal}, estatus: 1}).fetch();
			
 			var datos = {};
			
			datos.cobranza 					= [];
			datos.sumaPorEstipendio	= [];
			datos.sumaTramites 			= 0;
			datos.sumaCelebraciones = 0;
			datos.sumaIntenciones	 	= 0;
			
			_.each(cobranzaFecha, function(cd){
					_.each(cd.estipendios, function(estipendio){
						
							estipendio.fechaCobro 		= cd.fechaCobro;
 							estipendio.esAbono		 		= cd.esAbono;
 							var cajero = Meteor.users.findOne({"_id" : cd.usuario_id}, {fields: {"profile.nombre": 1}});											
 	  					estipendio.cajero = cajero.profile.nombre;
 	  					
 	  					if (estipendio.tipo == "Trámite")
 	  							datos.sumaTramites += Number(estipendio.importePagado);
 	  					else if (estipendio.tipo == "Celebración")
 	  							datos.sumaCelebraciones += Number(estipendio.importePagado);		
 							else if (estipendio.tipo == "Intención de Misa")
 	  							datos.sumaIntenciones += Number(estipendio.importePagado);			  							
 	  					
 	  					estipendio.estipendioNombre = Estipendios.findOne(estipendio.estipendio_id).nombre;
 	  					
 	  					estipendio.cobro_id = cd._id;
 	  					
 							datos.cobranza.push(estipendio);
 	 				})
	 		});
 						
			return datos;
			
	},
 	
 	getAgendaCelebracionesDiocesis:function(fechaInicial, fechaFinal, parroquia_id, diocesis_id){
			
			var agendaCelebraciones = Agenda.find({parroquia_id: parroquia_id, fecha: {$gte: fechaInicial, $lte: fechaFinal}}).fetch();
			
			var eventos = [];
			
			_.each(agendaCelebraciones, function(celebracion){
					
					var evento = {};
					evento.objeto	= celebracion;
					evento.title 	= celebracion.estipendio + " " + celebracion.concepto;	
					evento.start  = new Date(celebracion.fecha.getFullYear(), 
																	 celebracion.fecha.getMonth(), 
																	 celebracion.fecha.getDate(), 
																	 celebracion.hora.getHours(), 
																	 celebracion.hora.getMinutes());
					evento.end  	= new Date(celebracion.fecha.getFullYear(), 
																	 celebracion.fecha.getMonth(), 
																	 celebracion.fecha.getDate(), 
																	 celebracion.hora.getHours() + 1, 
																	 celebracion.hora.getMinutes());	
					
					evento.tipo		= 'Celebracion';
																	 
					if (celebracion.esAbono == false)
					{
							evento.color 			= 'green';     
							evento.textColor	= 'white';		 
							
					}
					else
					{
							evento.color 			= 'yellow';    
							evento.textColor	= 'red';	
							
					}												 
					
					eventos.push(evento);
			});
			
			
			var agendaDiocesana = AgendaDiocesana.find({diocesis_id: diocesis_id, fecha: {$gte: fechaInicial, $lte: fechaFinal}}).fetch();
			
			_.each(agendaDiocesana, function(agenda){
					
					var evento = {};
					evento.objeto	= agenda;
					evento.title 	= agenda.nombre	
					evento.start  = new Date(agenda.fecha.getFullYear(), 
																	 agenda.fecha.getMonth(), 
																	 agenda.fecha.getDate(), 
																	 agenda.fecha.getHours(), 
																	 agenda.fecha.getMinutes());
					evento.end  	= new Date(agenda.fecha.getFullYear(), 
																	 agenda.fecha.getMonth(), 
																	 agenda.fecha.getDate(), 
																	 agenda.fecha.getHours() + 1, 
																	 agenda.fecha.getMinutes());	
					
					evento.tipo		= 'Agenda';												 
					evento.color 			= 'blue';     
					evento.textColor	= 'white';		
					
					eventos.push(evento);
			});

			return eventos;
			
	},
 	
 	getAgendaCelebracionesById:function(celebracion_id){
			var celebracion = Agenda.findOne({_id: celebracion_id});		 						
			return celebracion;
	},
 	
 	getNotificaciones:function(fechaInicial, fechaFinal, parroquia_id){
			
			var arreglo = Notificaciones.find({parroquiaOrigen_id: parroquia_id, fecha : { $gte : fechaInicial, $lte : fechaFinal}, estatus: 2}).fetch();
			return arreglo;
			
	},
	
});
