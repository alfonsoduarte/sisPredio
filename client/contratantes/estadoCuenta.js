
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
							
					
									
							rc.estadocuentaContratante[clave].recibos.push({recibo: movimiento.Irecibo, 
																																	fechaPago : movimiento.Fpago, 
																																	saldoCapital : movimiento.Saldo_capital,
																																	capital : movimiento.Capmov, 
																																	administrativa : movimiento.Camov,
																																	seguro : movimiento.Svmov,
																																	interes : movimiento.Intmov,
																																	interesMoratorio : movimiento.Intmormov,
																																	total: movimiento.Capmov,
																																	saldo : movimiento.Saldo});
									
				 			
			 			}else{
				 			
	
				 			
				 			var claveML =  movimiento.Imanz + movimiento.Ilote;
				 			rc.estadocuentaContratante[clave].recibos.push({recibo: movimiento.Irecibo, 
																															fechaPago : movimiento.Fpago, 
																															saldoCapital : movimiento.Saldo_capital,
																															capital : movimiento.Capmov, 
																															administrativa : movimiento.Camov,
																															seguro : movimiento.Svmov,
																															interes : movimiento.Intmov,
																															interesMoratorio : movimiento.Intmormov,
																															total: movimiento.Capmov,
																															saldo : movimiento.Saldo});
							
			 			}
			 			
			 			
			 			
			 	});	
			 	
			 	
			 	return rc.estadocuentaContratante;
		  }	
	  },
	  
	 
  });
  
 
		
	
};



