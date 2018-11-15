Meteor.methods({
		
	setIntenciones: function (arreglo, tipo) {
	  	
			var user = Meteor.users.findOne({_id:  Meteor.userId()});
			var ids = [];
			var total = 0;
			
			_.each(arreglo, function(intencion){
					intencion.parroquia_id		= user.profile.parroquia_id;
					intencion.fechaCreacion	= new Date();
					intencion.usuario_id 		= Meteor.userId();
					delete intencion.$$hashKey;
					id = IntencionesMisa.insert(intencion);
					
					if (intencion.estatus == false)
					{
							ids.push(id);
							total += Number(parseFloat(intencion.pago).toFixed(2));
					}

			});
			
			var cobro = {};
			cobro.parroquia_id			= user.profile.parroquia_id;
			cobro.tipoServicio 			= "Intención Misa";
			cobro.servicio_id				= ids;
			cobro.fechaCobro 				= new Date();
			cobro.usuario_id 				= Meteor.userId();
			cobro.total 						= Number(parseFloat(total).toFixed(2));
			cobro.estatus						= 1; //Activo o Correcto
			
			//console.log(ids.length);
			
			if (ids.length > 0)
			{
					var id = Cobros.insert(cobro);  	
					return id;	
				
			}			
			else	
					return "pendiente";

	},

	setServicios: function (objeto, tipo) {
	  	
 	  	var id = "";
 	  	
	  	if (tipo == "Bautismo")
	  	{
		  	 id	= Bautismos.insert(objeto);
			}
	  	else if ( tipo == "Primera Comunión")
	  	{
		  	 id	= PrimerasComuniones.insert(objeto);	
	  	}
	  	else if ( tipo == "Confirmación")
	  	{
		  	 id	= Confirmaciones.insert(objeto);	
	  	}
	  	else if ( tipo == "Matrimonio")
	  	{
		  	 id	= Matrimonios.insert(objeto);	
	  	}
	  	
			return id;
			
	},
			
	setCobroEstipendio: function (arreglo, pago) {
	  	
	  	//Guardar el cobro Primero
	  	////------------------------------------------------------  	
	  	
	  	_.each(arreglo, function(objeto){
		  		delete objeto.$$hashKey;
		  });	
	  	
	  	
	  	var cobro = {};
			cobro.parroquia_id			= Meteor.user().profile.parroquia_id;
			cobro.fechaCobro 				= new Date();
			cobro.usuario_id 				= Meteor.userId();
			cobro.total 						= pago.total;
			cobro.cobro 						= pago.pagar;
			//cobro.cambio 						= Number(parseFloat(pago.pagar - pago.total).toFixed(2));
			cobro.esAbono						= pago.esAbono;
			//cobro.concepto					= objeto.concepto;
			cobro.estipendios				= arreglo;
			cobro.estatus						= 1; //Activo o Correcto
			
			
			var idCobro = Cobros.insert(cobro);
	  	
	  	_.each(arreglo, function(objeto){
		  		
		  		var estipendio = "";
		  		estipendio = Estipendios.findOne(objeto.estipendio_id).nombre;
		  		
		  		//hora
		  		
		  		
		  		if (objeto.tipo == "Intención de Misa")
		  		{
			  			var intencionMisa = {};
			  			
							var numeroMisas = 1;
			  			if (estipendio == "TRIDUO DE MISAS")		
									numeroMisas = 3;
							else if (estipendio == "NOVENARIOS DE MISAS")
									numeroMisas = 9;
							else if (estipendio == "MISAS GREGORIANAS")
				  				numeroMisas =30;
							
							var fechaSiguiente = "";
							for (i = 0; i < numeroMisas; i++)
							{
									var hora = new Date(objeto.fecha);
									hora.setHours(objeto.hora.getHours(), objeto.hora.getMinutes(),0,0);
									

									intencionMisa.fecha 				= objeto.fecha;
									intencionMisa.hora 					= hora;	
									intencionMisa.intencion 		= objeto.intencion;
									intencionMisa.tipo 					= estipendio;
									intencionMisa.concepto			= objeto.concepto;
									intencionMisa.parroquia_id	= pago.parroquia_id;
									intencionMisa.fechaCreacion = new Date();
									intencionMisa.usuario_id		= Meteor.userId();
									intencionMisa.cobro_id			= idCobro;
									
									
									intencionMisa.cobros 					= [];
									intencionMisa.cobros.push(idCobro);
									
									IntencionesMisa.insert(intencionMisa);
									
									fechaSiguiente = moment(objeto.fecha);
									fechaSiguiente = fechaSiguiente.add(1, 'days');
									
									objeto.fecha = new Date(fechaSiguiente);
							}
		  		}
		  		else if (objeto.tipo == "Celebración")
		  		{
			  			var celebracion = {};
			  			
			  			var hora = new Date(objeto.fecha);
							hora.setHours(objeto.hora.getHours(), objeto.hora.getMinutes(),0,0);
			  			
			  			celebracion.fecha 					= objeto.fecha;
							celebracion.hora 						= hora;
							celebracion.esAbono					= objeto.esAbono;
							celebracion.cobro						= objeto.importePagado;
							celebracion.total						= objeto.total;
			  			celebracion.estipendio 			= estipendio;
			  			celebracion.concepto	 			= objeto.concepto;
			  			celebracion.estipendio_id 	= objeto.estipendio_id;
			  			celebracion.parroquia_id		= pago.parroquia_id;
			  			celebracion.cobro_id				= idCobro;
			  			celebracion.celular					= objeto.celular;
			  			celebracion.correo					= objeto.correo;
			  			celebracion.usuario_id			= Meteor.userId();
			  			
			  			
			  			celebracion.cobros 					= [];
			  			celebracion.cobros.push(idCobro);
			  			
			  			Agenda.insert(celebracion);
			  			
			  			
			  	}
	  	});
	  		  	
	  	
	/*
  	
	  	var user = Meteor.users.findOne({_id: Meteor.userId()});
	  	
	  	//objeto.parroquia_id = user.profile.parroquia_id;
			
			////------------------------------------------------------  	
	  	var cobro = {};
			cobro.parroquia_id			= user.profile.parroquia_id;
			cobro.tipoServicio 			= objeto.tipoServicio;
			cobro.fechaServicio			= objeto.fechaServicio;
			cobro.horaServicio			= objeto.hora;
			cobro.fechaCobro 				= new Date();
			cobro.usuario_id 				= Meteor.userId();
			cobro.total 						= objeto.total;
			cobro.esAbono						= objeto.esAbono;
			cobro.concepto					= objeto.concepto;
			cobro.estatus						= 1; //Activo o Correcto
			
			
			var idCobro = Cobros.insert(cobro);
	  	
	  	////------------------------------------------------------
	  	
			var agenda =  {};
	  	
	  	agenda.fecha 				= objeto.fechaServicio;
	  	agenda.hora 				= objeto.hora;
	  	agenda.usuario_id		= Meteor.userId();
	  	agenda.tipo					= objeto.tipoServicio;
	  	agenda.concepto			= objeto.concepto;
	  	agenda.parroquia_id	= user.profile.parroquia_id;
	  	agenda.esAbono			= objeto.esAbono;
	  	agenda.esIndividual	= objeto.esIndividual;
	  	agenda.cobro				= objeto.total;
	  	agenda.celular			= objeto.celular;
	  	
	  	agenda.cobros = [];
	  	agenda.cobros.push(idCobro);
	  	
	  	Agenda.insert(agenda);
			
			
				
*/
			return idCobro;
			
	},
	
	setUpdateCobroServicio: function (objeto) {
	  	
	  	var user = Meteor.users.findOne({_id:  Meteor.userId()});
	  	
	  	//objeto.parroquia_id = user.profile.parroquia_id;
			
			////------------------------------------------------------  	
			
			var cobro = {};
			cobro.parroquia_id			= Meteor.user().profile.parroquia_id;
			cobro.fechaCobro 				= new Date();
			cobro.usuario_id 				= Meteor.userId();
			cobro.total 						= objeto.total;
			cobro.cobro 						= objeto.pagar;
			//cobro.cambio 						= Number(parseFloat(pago.pagar - pago.total).toFixed(2));
			cobro.esAbono						= objeto.esAbono;
			//cobro.concepto					= objeto.concepto;
			cobro.estipendios				= [];
			
			celebracion = {};
			
			//ir por apoyo y arancel
			
			var estipendio = Estipendios.findOne(objeto.estipendio_id);
			
			var apoyo 		 = ApoyoParroquia.findOne({parroquia_id: objeto.parroquia_id, estipendio_id: objeto.estipendio_id});
			
			celebracion.apoyo = 0;
			if (apoyo != undefined)
			{
					celebracion.apoyo = apoyo.apoyo;
			} 
			
			celebracion.tipo						= estipendio.tipo;
			celebracion.arancel					= estipendio.arancel;
			celebracion.fecha 					= objeto.fecha;
			celebracion.hora 						= objeto.hora;
			celebracion.esAbono					= objeto.esAbono;
			celebracion.importePagado 	= objeto.pagar;
			celebracion.total						= objeto.total;
			celebracion.estipendio 			= objeto.estipendio;
			celebracion.concepto	 			= objeto.concepto;
			celebracion.estipendio_id 	= objeto.estipendio_id;
			celebracion.parroquia_id		= objeto.parroquia_id;
			celebracion.celular					= objeto.celular;
			celebracion.correo					= objeto.correo;
			
			cobro.estipendios.push(celebracion);
			
			cobro.estatus						= 1; //Activo o Correcto
			
			//var agenda_id = objeto.agenda_id;
			
			var idCobro = Cobros.insert(cobro);
	  	
	  	////------------------------------------------------------
	  	
	  	//Buscar Agenda para actualizarla el estatus y cobro
	  	
			var agenda =  Agenda.findOne(objeto._id);
			
			agenda.cobros.push(idCobro);
			
			var cobro = agenda.cobro;
			cobro = cobro + objeto.pagar;
			cobro = Number(parseFloat(cobro).toFixed(2));
			
	  	
	  	Agenda.update({_id: objeto._id}, {$set: {cobro: cobro, cobros: agenda.cobros, esAbono: objeto.esAbono}});
			
			
			return idCobro;	
			
	},
	
	setRegistroEgresos: function (objeto) {
	  	
			_.each(objeto, function(egreso){
					delete egreso.$$hashKey;
					delete egreso.tipoEgreso;
					
					if (egreso.tipoEgresoDetalle_id)
						 delete egreso.tipoEgresoDetalle;
				
					RegistroEgresos.insert(egreso);
			});
			
			return true;
			
	},
	
	setImportar: function (arreglo, tipo) {
	  	
	  	var user = Meteor.users.findOne({_id:  Meteor.userId()});
	  	
	  	_.each(arreglo, function(objeto){
		  	
		  		if (tipo == "Bautismo")
			  	{
				  	 Bautismos.insert(objeto);
					}
			  	else if ( tipo == "Primera Comunión")
			  	{
				  	 PrimerasComuniones.insert(objeto);	
			  	}
			  	else if ( tipo == "Confirmación")
			  	{
				  	 Confirmaciones.insert(objeto);	
			  	}
			  	else if ( tipo == "Matrimonio")
			  	{
				  	 Matrimonios.insert(objeto);	
			  	}
	  	});
	  	
	  	return true;
			
	},
	
	setFolioBautismo: function (parroquia_id, folio) {
	  	
	  	Parroquias.update({_id: parroquia_id}, {$set: {folioBautismo: folio}});
	  	
 	  	return true;
			
	},
	
	setFolioConfirmacion: function (parroquia_id, folio) {
	  	
	  	Parroquias.update({_id: parroquia_id}, {$set: {folioConfirmacion: folio}});
	  	
 	  	return true;
			
	},
	
	//Usado en la Importación
	setNotasMarginales: function (arreglo) {
	  	
	  	var numero = 0;
	  	_.each(arreglo, function(nm){
		  		
		  		var bautizado = Bautismos.findOne({ parroquia_id: nm.parroquia_id, $and : [ { libro: nm.libro } , { foja: nm.foja }, { noDeActa: nm.noDeActa } ] });
					
		  		//Si lo encontró
		  		if (bautizado != undefined)
		  		{

			  			if (bautizado.notasMarginales == undefined)
			  			{
				  				bautizado.notasMarginales = [];

			  			}

			  			numero = bautizado.notasMarginales.length + 1;
			  				  			
			  			bautizado.notasMarginales.push({numero: numero, tipoNota: nm.tipoNota, fecha: nm.fecha, nota: nm.nota, lugar: nm.lugar});
			  			
			  			Bautismos.update({_id: bautizado._id}, {$set: {notasMarginales: bautizado.notasMarginales}} )
			  			
		  		}
	  	});
	  	
	  	
 	  	return true;
			
	},
	
	//
	setActualizaAgenda: function (objeto) {
	  	
	  	Agenda.update({_id: objeto._id}, {$set: {fecha: objeto.fecha, hora: objeto.hora}});
	  	
	  	var cobro = Cobros.findOne({_id: objeto.cobro_id});
	  		  	
	  	_.each(cobro.estipendios, function(estipendio){
		  		
		  		if (estipendio.estipendio_id == objeto.estipendio_id)
		  		{
			  			estipendio.fecha = objeto.fecha;
			  			estipendio.hora	 = objeto.hora;
		  		}
	  	});
	  	
	  	Cobros.update({_id: objeto.cobro_id}, {$set: {estipendios: cobro.estipendios}});
	  		  	
 	  	return true;
			
	},
	
	setCancelarPago: function (id) {
	  	
	  	Cobros.update({_id: id }, {$set: {estatus: 2}}); //2 Estatus Cancelado
	  		  	
 	  	return true;
			
	},
	
});


