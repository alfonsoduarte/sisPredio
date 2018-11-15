angular.module("parroquias")
.controller("CobranzaCtrl", CobranzaCtrl);
 function CobranzaCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	  
  this.fechaInicial = new Date();
  this.fechaInicial.setHours(0,0,0,0);
  this.fechaFinal = new Date();
  this.fechaFinal.setHours(23,59,59,999);
  
  rc.sumaTramites 			= 0;
	rc.sumaCelebraciones 	= 0;
	rc.sumaIntenciones 		= 0;
 	
	rc.totalCobranza 			= 0;
	
	rc.cobranza = [];
 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	this.diarioCobranza = function(){

		var usuario = Meteor.user();
				
	  rc.fechaInicial.setHours(0,0,0,0);
		rc.fechaFinal.setHours(23,59,59,999);
		
		rc.sumaTramites 			= 0;
		rc.sumaCelebraciones 	= 0;
		rc.sumaIntenciones 		= 0;
 	
		rc.totalCobranza 			= 0;
    
    rc.cobranza = [];
 		
		loading(true);		
		Meteor.call("getCobranza", this.fechaInicial, this.fechaFinal, usuario.profile.parroquia_id, function(error, result){
				if  (result)
				{

						rc.cobranza 			 		= result.cobranza;
						rc.sumaTramites 			= result.sumaTramites;
						rc.sumaCelebraciones 	= result.sumaCelebraciones;
						rc.sumaIntenciones 		= result.sumaIntenciones;
						
						rc.totalCobranza			= rc.sumaTramites + rc.sumaCelebraciones + rc.sumaIntenciones;
/*
						_.each(rc.datos.cobranza, function(plan){
							//console.log(plan);
							//if (plan.tipoCuenta == "Consignia")
							//{							
								if (plan.sumaTramites == undefined) plan.pagoInteres = 0;
								rc.sumaInteres += Number(parseFloat(plan.pagoInteres).toFixed(2));
								if (plan.pagoSeguro == undefined) plan.pagoSeguro = 0;
								rc.sumaSeguro += Number(parseFloat(plan.pagoSeguro).toFixed(2));
								if (plan.pagoIva == undefined) plan.pagoIva = 0;
								rc.sumaIva += Number(parseFloat(plan.pagoIva).toFixed(2));
								if (plan.pagoCapital == undefined) plan.pagoCapital = 0;
								rc.sumaCapital += Number(parseFloat(plan.pagoCapital).toFixed(2));
								
								rc.totalCobranza += Number(parseFloat(plan.totalPago).toFixed(2));
 								
							//}
								
						});
*/
 						
						loading(false);
						$scope.$apply();
				}
		});
			
	};
 	
	this.imprimirReporteCobranza = function(){

		
		if (rc.cobranza.length == 0)
		{
				toastr.warning("No hay registros por imprimir");
				return;
		}
		
		var datos = {};
		
		var usuario = Meteor.user();
				
	  rc.fechaInicial.setHours(0,0,0,0);
		rc.fechaFinal.setHours(23,59,59,999);
		
		datos.parroquia_id = usuario.profile.parroquia_id;
		datos.fechaInicial = rc.fechaInicial;
		datos.fechaFinal 	 = rc.fechaFinal;

		loading(true);
 		Meteor.call('getCobranzaArchivo', {
      templateNombre: 'reporteCobranza',
      reportNombre: 'reporteCobranza',
      type: 'pdf',  
      datos: datos,
	    }, function(err, file) {
	      if(!err){
	        downloadFile(file);
	        loading(false);
	      }else{
	        toastr.warning("Error al generar el reporte");
	        loading(false);
	      }
	  });					
		
	}
	
	this.cancelarCobro = function(objeto){
			
			customConfirm('¿Estás seguro de cancelar el pago de ' + objeto.concepto + '?', function() {
					Meteor.call("setCancelarPago", objeto.cobro_id, function(error, result){
						if  (result)
						{
								rc.diarioCobranza();
								$scope.$apply();
						}
					});								
			});		
	}	
	 
};