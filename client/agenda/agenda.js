

angular.module("parroquias")
.controller("AgendaCtrl", AgendaCtrl);
 function AgendaCtrl($scope, $meteor, $reactive, $state, toastr, uiCalendarConfig){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
  rc.arreglo = [];
  rc.cobros  = [];
  rc.eventos = [];
  rc.eventos.slice(0, rc.eventos.length);
  
  rc.liquidacion = {};
  rc.puedeCobrar = true;
  
  rc.fecha = new Date();
  var d = rc.fecha.getDate();
  var m = rc.fecha.getMonth();
  var y = rc.fecha.getFullYear();
  
  rc.uiConfig = {};  
  rc.uiConfig = {
    calendar: {

      height: '80%',
      editable: false,
      header: {
         	left: 'title',
				 	//center: 'month,agendaWeek,agendaDay',
		      right: 'prev,next'
      },
      /*
dayClick		: this.alertEventOnClick,
      eventDrop		: this.alertOnDrop,
      eventResize	: this.alertOnResize,
      eventRender	: this.eventRender,
*/
      eventClick	: function(calEvent, jsEvent, view) {

		    //alert('Event: ' + calEvent.title);
		    //alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
		    //alert('View: ' + view.name);
				
				if (calEvent.tipo == "Celebracion")
	 				 rc.mostrarCelebracion(calEvent.objeto);
				
	 			
	 				 
		  },
    }
  }; 
  
  rc.uiConfig.calendar.dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sabado"];
  rc.uiConfig.calendar.dayNamesShort = ["Dom","Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  rc.uiConfig.calendar.monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  rc.uiConfig.calendar.monthNamesShort = ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."];
	
	$('#myCalendar').fullCalendar('removeEvents');
	$('#myCalendar').fullCalendar('addEventSource');
  $('#myCalendar').fullCalendar('refetchEvents');
  
  //console.log(uiCalendarConfig);
	  	
  this.subscribe('agenda', () => {
			
			rc.eventos = [];
			
			this.fechaInicial = "";
			this.fechaFinal		= "";
				
			this.fechaInicial = rc.getReactively("fecha");
		  this.fechaInicial.setHours(0,0,0,0);
		  			
			var anio = this.fechaInicial.getFullYear();
	    var mes  = this.fechaInicial.getMonth();
	    
	    var startDate = moment([anio, mes]);
      var endDate = moment(startDate).endOf('month');
	    
	    this.fechaInicial = startDate.toDate();
	    this.fechaFinal 	= endDate.toDate();
	    this.fechaFinal.setHours(23,0,0,0);
			
			return [{parroquia_id: Meteor.user().profile.parroquia_id,
							 fecha: {$gte: this.fechaInicial, $lte: this.fechaFinal}}];

	});
	
	this.subscribe('agendaDiocesana', () => {
			
			rc.eventos = [];
			
			this.fechaInicial = "";
			this.fechaFinal		= "";
				
			this.fechaInicial = rc.getReactively("fecha");
		  this.fechaInicial.setHours(0,0,0,0);
		  			
			var anio = this.fechaInicial.getFullYear();
	    var mes  = this.fechaInicial.getMonth();
	    
	    var startDate = moment([anio, mes]);
      var endDate = moment(startDate).endOf('month');
	    
	    this.fechaInicial = startDate.toDate();
	    this.fechaFinal 	= endDate.toDate();
	    this.fechaFinal.setHours(23,0,0,0);
						
			return [{diocesis_id: Meteor.user().profile.diocesis_id,
							 fecha: {$gte: this.fechaInicial, $lte: this.fechaFinal}}];

	});
  
  this.helpers({
		arreglo : () => {

			this.fechaInicial = rc.getReactively("fecha");
			this.fechaFinal		= "";
				
			this.fechaInicial = rc.fecha;
		  this.fechaInicial.setHours(0,0,0,0);
			
			var anio = this.fechaInicial.getFullYear();
	    var mes  = this.fechaInicial.getMonth();
	    
	    var startDate = moment([anio, mes]);
      var endDate = moment(startDate).endOf('month');
	    
	    this.fechaInicial = startDate.toDate();
	    this.fechaFinal 	= endDate.toDate();
	    this.fechaFinal.setHours(23,0,0,0);

			
			var agenda 					= Agenda.find({fecha: {$gte: this.fechaInicial, $lte: this.fechaFinal}},{sort: {hora: 1}}).fetch();
			
			var agendaDiocesana = AgendaDiocesana.find({fecha: {$gte: this.fechaInicial, $lte: this.fechaFinal}},{sort: {hora: 1}}).fetch();
			
			if (agenda != undefined || agendaDiocesana != undefined)
			{
					//console.log("Agenda:", agenda.length);
										
					_.each(agenda, function(e){
							var evento = {};
							
							evento.objeto	= e;
							evento._id		= e._id;
							evento.title 	= e.estipendio + " " + e.concepto;	
							evento.start  = new Date(e.fecha.getFullYear(), e.fecha.getMonth(), e.fecha.getDate(), e.hora.getHours(), e.hora.getMinutes());
							evento.end  	= new Date(e.fecha.getFullYear(), e.fecha.getMonth(), e.fecha.getDate(), e.hora.getHours() + 1, e.hora.getMinutes());	
							evento.tipo		= 'Celebracion';
							
							
							if (e.esAbono == false)
							{
									evento.color 			= 'green';  
									evento.textColor	= 'white';	
									
							}
							else
							{
									evento.color 			= 'yellow'; 
									evento.textColor	= 'red';		
									evento.allDay 		= 'true';		
							}
							
							rc.eventos.push(evento);
							
					});
					
					_.each(agendaDiocesana, function(e){
							
							var evento = {};
							evento.objeto	= e;
							evento._id		= e._id;
							evento.title 	= e.nombre;	
							evento.start  = new Date(e.fecha.getFullYear(), e.fecha.getMonth(), e.fecha.getDate(), e.fecha.getHours(), e.fecha.getMinutes());
							evento.end  	= new Date(e.fecha.getFullYear(), e.fecha.getMonth(), e.fecha.getDate(), e.fecha.getHours() + 1, e.fecha.getMinutes());	
							evento.tipo		= 'Agenda';
							
							evento.color 			= 'blue';     
							evento.textColor	= 'white';		
							
							rc.eventos.push(evento);
					});	
					
					
					$('#myCalendar').fullCalendar('removeEvents');
					rc.eventSources = [rc.getReactively("eventos")];
					$('#myCalendar').fullCalendar('addEventSource', rc.eventSources );
					$('#myCalendar').fullCalendar('refetchEvents');

			}
			
		},
				
	});
	
	/*
this.mostrarCobros = function(idsCobros)
	{
			rc.cobros = [];
			
			loading(true);
			Meteor.call ("getCobro", idsCobros, function(error,result){
				if(error){
					toastr.error('Error al recuperar los cobros.: ', error.details);
					loading(false);
					return;
				}
				if (result)
				{
						rc.cobros = result;
						$scope.$apply();
						$("#modalCobros").modal('show');
						loading(false);
				}
			});
	};
*/
	/*

	this.mostrarModalLiquidacion = function(objeto)
	{
			rc.liquidacion = {};
			
			//Get Evento Agenda
			//console.log(objeto);
			
			Meteor.call('getAgendaCelebracionesById', objeto._id, function(error, result) {
			    if (result)
				  {	
							//console.log(result);				
						 	rc.liquidacion = result; 			
						 	rc.liquidacion.pagar = 0;
							$("#modalCelebracion").modal('show');
							$scope.$apply();
							
					}
	    });
			
			
				
			rc.liquidacion = objeto;
			
			rc.liquidacion.pagar = 0;
			$("#modalLiquidacion").modal('show');
	
	};
	
*/
	
	this.mostrarCelebracion = function(objeto)
	{
				
			rc.liquidacion = {};
			rc.cobros = [];
			
			
			Meteor.call('getAgendaCelebracionesById', objeto._id, function(error, result) {
			    if (result)
				  {	
							//console.log(result);				
						 	rc.liquidacion = result; 			
						 	rc.liquidacion.pagar = 0;
						 	
						 	if (rc.liquidacion.total - rc.liquidacion.cobro > 0 )
						 			rc.puedeCobrar = false;
						 	else	
						 			rc.puedeCobrar = true;		
						 	
						 	
						 	Meteor.call ("getCobro", rc.liquidacion.cobros, function(error,result){
								if(error){
									toastr.error('Error al recuperar los cobros.: ', error.details);
									return;
								}
								if (result)
								{
										rc.cobros = result;
										$scope.$apply();
								}
							});
						 	
						 	
						 	
							//$scope.$apply();
							
					}
	    });
	    
	    
			
						
	    
			$("#modalCelebracion").modal('show');
			
		
	}
	
	this.cobrar = function(objeto, form)
	{
		
			if (form.$invalid){
		     toastr.error('Error al cobrar.');
		     return;
		  }
			
			
			if (objeto.pagar < (objeto.total - objeto.cobro))
			{
					objeto.esAbono = true;
			}
			else
					objeto.esAbono = false;
			
			
			if (objeto.pagar == 0)
			{
					toastr.warning('Proporcione una cantidad.: ');
					return;
			}
						
			loading(true);
			Meteor.call ("setUpdateCobroServicio", objeto, function(error,result){
	
				if(error){
					console.log(error);
					toastr.error('Error al guardar los datos.: ', error.details);
					loading(false);
					return;
				}
				if (result)
				{
						$("#modalCelebracion").modal('hide');
						
						var cobro_id = result;
						toastr.success('Guardado correctamente.');
						var url = $state.href("anon.cobroTicket", { cobro_id: cobro_id }, { newTab: true });
						window.open(url, '_blank');	

						loading(false);
											
				}
			});
	};
	
	this.imprimirTicket = function(id)
	{
			//console.log(id)
			var url = $state.href("anon.cobroTicket", { cobro_id: id }, { newTab: true });
			window.open(url, '_blank');	

	};
	
	this.actualizar = function(objeto, form)
	{
			//console.log(objeto);
			if (form.$invalid){
		     toastr.error('Error al actualizar.');
		     return;
		  }
		  
		 //Agenda.update({_id: objeto._id}, {$set: {fecha: objeto.fecha, hora: objeto.hora}});
		 
		 //hora
  		var hora = new Date(objeto.fecha);
  		hora.setHours(objeto.hora.getHours(), objeto.hora.getMinutes(),0,0);
  		objeto.hora = hora;
		 
		 
		 	Meteor.call ("setActualizaAgenda", objeto, function(error,result){
			
						if (result){
							 toastr.success('Actualizado coreectamente.');
							 $("#modalCelebracion").modal('hide');
							 
							 var fecha = new Date();		 
							 rc.cambioFecha(fecha);
						}
		 
		 });
		 
		
			

	};
	
	
	this.changeView = function(view) {
			$('#calendar').fullCalendar('changeView', view);
  };
  
  this.cambioFecha = function(fecha){
	  	
	  	rc.fecha = fecha;

	    this.fechaInicial = rc.fecha;
			this.fechaFinal		= "";
				
			this.fechaInicial = rc.fecha;
		  this.fechaInicial.setHours(0,0,0,0);
			
			var anio = this.fechaInicial.getFullYear();
	    var mes  = this.fechaInicial.getMonth();
	    
	    var startDate = moment([anio, mes]);
      var endDate = moment(startDate).endOf('month');
	    
	    this.fechaInicial = startDate.toDate();
	    this.fechaFinal 	= endDate.toDate();
	    this.fechaFinal.setHours(23,0,0,0);
	  	
	  	
	  	Meteor.call('getAgendaCelebracionesDiocesis', this.fechaInicial, this.fechaFinal, Meteor.user().profile.parroquia_id, Meteor.user().profile.diocesis_id,function(error, result) {
			    if (result)
				  {	
							var calendar = jQuery("#calendar").fullCalendar({ events: result });							
							calendar.fullCalendar('removeEvents');
							calendar.fullCalendar('addEventSource', result);
							calendar.fullCalendar('refetchEvents');
					}
	    });
	  
  
}
	
		
	$(document).ready(function() {
			$('body').on('click', 'button.fc-prev-button', function() {
				var b = $('#calendar').fullCalendar('getDate');
			  rc.fecha = new Date(b.format('L'));
			  rc.cambioFecha(rc.fecha);
			});
			
			$('body').on('click', 'button.fc-next-button', function() {
				var b = $('#calendar').fullCalendar('getDate');
				rc.fecha = new Date(b.format('L'));
				rc.cambioFecha(rc.fecha);	
			});
	});	
	
	
	  
};