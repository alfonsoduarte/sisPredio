
angular
.module("sisPredios")
.controller("estadoCuentaCtrl", estadoCuentaCtrl);
function estadoCuentaCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	window.rc = rc;
	
	rc.estadocuentaContratante = {};
	//rc.movimientos = {}
 	
 	
 	this.subscribe('movimientos',()=>{
		return [{Icontid: Meteor.user().profile.Icontid}];
	});
 	
  
  this.helpers({
	  movimientos : () => {
		  m = Movimientos.find().fetch();
		  
		  
		  
		  if (m.length > 0)
		  {
			  
			  
		  	_.each(m, function(movimiento){
						
						//console.log("MOV:",movimiento);
				  					
				  	var clave = movimiento.Ipredid + movimiento.Imanz + movimiento.Ilote;			
				  		
				  	if(rc.estadocuentaContratante[clave] == undefined){
					 			
							rc.estadocuentaContratante[clave] = {};
					 		rc.estadocuentaContratante[clave].Icontid = movimiento.Icontid;
							rc.estadocuentaContratante[clave].Cnomcomp = movimiento.Cnomcomp.trim();
							rc.estadocuentaContratante[clave].Ipredid = movimiento.Ipredid;
							rc.estadocuentaContratante[clave].Nom_predio = movimiento.Nom_predio.trim();
							rc.estadocuentaContratante[clave].Nom_programa = movimiento.Nom_programa.trim();
							rc.estadocuentaContratante[clave].Imanz = movimiento.Imanz;
							rc.estadocuentaContratante[clave].Ilote = movimiento.Ilote;

							rc.estadocuentaContratante[clave].Icredid = movimiento.Icredid;
							rc.estadocuentaContratante[clave].Precio = movimiento.Precio;

							rc.estadocuentaContratante[clave].recibos = [];
							
							
							//rc.estadocuentaContratante[clave].importe = rc.estadocuentaContratante[clave].Precio - (movimiento.Capmov + movimiento.Camov + movimiento.Svmov + movimiento.Intmov + movimiento.Intmormov);
							
							//rc.estadocuentaContratante[clave].saldo = rc.estadocuentaContratante[clave].importe;
							
							
							//var claveML =  movimiento.Imanz + movimiento.Ilote;
							
							//if (rc.estadocuentaContratante[clave].recibos[claveML] == undefined)
							//{
									
									//rc.estadocuentaContratante[clave].recibos[claveML] = {};
									
									//rc.estadocuentaContratante[clave].recibos[claveML].cliente = movimiento.Cnomcomp.trim();
									//rc.estadocuentaContratante[clave].recibos[claveML].arreglo = [];
									
									rc.estadocuentaContratante[clave].recibos.push({recibo: movimiento.Irecibo, 
																																									 fechaPago : movimiento.Fpago, 
																																									 capital : movimiento.Capmov, 
																																									 administrativa : movimiento.Camov,
																																									 seguro : movimiento.Svmov,
																																									 interes : movimiento.Intmov,
																																									 interesMoratorio : movimiento.Intmormov});
																																									 //importe : rc.estadocuentaContratante[clave].importe});
									
							//}
				 			
			 			}else{
				 			
				 			//rc.estadocuentaContratante[clave].importe = rc.estadocuentaContratante[clave].Precio - (movimiento.Capmov + movimiento.Camov + movimiento.Svmov + movimiento.Intmov + movimiento.Intmormov);
				 			
				 			var claveML =  movimiento.Imanz + movimiento.Ilote;
				 			rc.estadocuentaContratante[clave].recibos.push({recibo: movimiento.Irecibo, 
																																									 fechaPago : movimiento.Fpago, 
																																									 capital : movimiento.Capmov, 
																																									 administrativa : movimiento.Camov,
																																									 seguro : movimiento.Svmov,
																																									 interes : movimiento.Intmov,
																																									 interesMoratorio : movimiento.Intmormov});
																																									 //importe : rc.estadocuentaContratante[clave].importe});
							
			 			}
			 			
			 			
			 			
			 	});	
			 	
			 	//console.log("Edo Cta:",rc.estadocuentaContratante.recibos.arreglo);
			 	
			 	//rc.estadocuentaContratante._toArray
			 	
			 	//$scope.$apply();
			 	
			 	return rc.estadocuentaContratante;
		  }	
	  },
	  /*
	  estadoCuenta : () => {
		  	//console.log("M:",rc.movimientos);
		  	
				_.each(rc.movimientos, function(movimiento){
						
						console.log("MOV:",movimiento);
				  					
				  	var clave = movimiento.Ipredid + movimiento.Imanz + movimiento.Ilote;			
				  		
				  	if(rc.estadocuentaContratante[clave] == undefined){
					 			

					 		rc.estadocuentaContratante[clave].Icontid = movimiento.Icontid;
							rc.estadocuentaContratante[clave].Cnomcomp = movimiento.Cnomcomp.trim();
							rc.estadocuentaContratante[clave].Ipredid = movimiento.Ipredid;
							rc.estadocuentaContratante[clave].Nom_predio = movimiento.Nom_predio.trim();
							rc.estadocuentaContratante[clave].Nom_programa = movimiento.Nom_programa.trim();
							rc.estadocuentaContratante[clave].Imanz = movimiento.Imanz;
							rc.estadocuentaContratante[clave].Ilote = movimiento.Ilote;
							rc.
							rc.estadocuentaContratante[clave].Icredid = movimiento.Icredid;
							rc.estadocuentaContratante[clave].Precio = movimiento.Precio;
							rc.estadocuentaContratante[clave].Irecibo = movimiento.Irecibo;
							rc.
				 			rc.estadocuentaContratante[clave] = {};
				 			rc.estadocuentaContratante[clave].credito = Creditos.findOne({_id: planPago.credito_id});
				 			rc.estadocuentaContratante[clave].cliente = Meteor.users.findOne({_id: planPago.cliente_id});
				 			rc.estadocuentaContratante[clave].importe = 0.00;
				 			rc.estadocuentaContratante[clave].importe = planPago.importeRegular;
				 			rc.estadocuentaContratante[clave].planPagos = [];			 			
				 			rc.estadocuentaContratante[clave].planPagos.push({numeroPago : planPago.numeroPago, fechaLimite : planPago.fechaLimite, classPago : classPago});
				 			rc.estadocuentaContratante[clave].multas = [];
				 			
				 			
				 			
			 			}else{
				 			
				 			arreglo[planPago.credito_id].importe += planPago.importeRegular;
				 			arreglo[planPago.credito_id].planPagos.push({numeroPago : planPago.numeroPago, fechaLimite : planPago.fechaLimite, classPago : classPago});
			 			}
			 			
			 			
			 			
			 	});	
			 	
			}, 		
	 		*/		
	 
  });
  
 
		
	
};



