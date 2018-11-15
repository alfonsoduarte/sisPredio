angular
.module("parroquias")
.controller("CobroTicketCtrl", CobroTicketCtrl);
function CobroTicketCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {
	
	let rc = $reactive(this).attach($scope);
	window.rc = rc;
	
	rc.cobro = {};
	rc.usuario = {};
	rc.parroquia = {};
	
	rc.servicios = [];
	
		
	this.subscribe('cobros',()=>{
		return [{
			_id : $stateParams.cobro_id
		}]
	},
	{
		onReady: function () {
			
			rc.cobro = Cobros.findOne($stateParams.cobro_id);
			//rc.cobro = rc.cobro? rc.cobro:{};
			
			rc.subscribe('estipendios',()=>{
				return[{}]
			},
			{
				onReady: function () {
						
						if (rc.cobro != undefined)
						{
								
								rc.cobro.movimiento	= rc.cobro.esAbono == false? "LA LIQUIDACIÓN": "EL ABONO"
						
								Meteor.call('getUsuario', rc.cobro.usuario_id ,function(err, res){
									rc.usuario = res;
									$scope.$apply();
								});
								
								_.each(rc.cobro.estipendios, function(estipendio){
										estipendio.nombreEstipendio = Estipendios.findOne({_id: estipendio.estipendio_id}).nombre;
								});	
						}
				}
			});	
			

/*
			if (rc.cobro.tipoServicio == "Intención Misa")
			{
					rc.subscribe('intencionesMisa',()=>{
						return[{
							_id : { $in: rc.cobro.servicio_id }
						}]
					},
					{
						onReady: function () {
							rc.servicios = IntencionesMisa.find().fetch();
						}
					});	
			}
			else
			{
					rc.servicios.push({tipoServicio	: rc.cobro.tipoServicio, 
														 fecha				: rc.cobro.fechaServicio, 
														 hora					: rc.cobro.horaServicio,
														 pago					: rc.cobro.total})
					
			}
*/
			/*
else if (rc.cobro.tipoServicio == "Bautismo")
			{
					rc.subscribe('bautismos',()=>{
						return[{
							_id : rc.cobro.servicio_id
						}]
					},
					{
						onReady: function () {
							rc.servicios = Bautismos.find().fetch();
						}
					});	
			}
			else if (rc.cobro.tipoServicio == "Primera Comunión")
			{
					rc.subscribe('primerasComuniones',()=>{
						return[{
							_id : rc.cobro.servicio_id
						}]
					},
					{
						onReady: function () {
							rc.servicios = PrimerasComuniones.find().fetch();
						}
					});	
			}
			else if (rc.cobro.tipoServicio == "Confirmación")
			{
					rc.subscribe('confirmaciones',()=>{
						return[{
							_id : rc.cobro.servicio_id
						}]
					},
					{
						onReady: function () {
							rc.servicios = Confirmaciones.find().fetch();
						}
					});	
			}
			else if (rc.cobro.tipoServicio == "Matrimonio")
			{
					rc.subscribe('matrimonios',()=>{
						return[{
							_id : rc.cobro.servicio_id
						}]
					},
					{
						onReady: function () {
							rc.servicios = Matrimonios.find().fetch();
						}
					});	
			}
*/
			
			
			//------------------------------------------------------------------------------------------------------------
			rc.subscribe('parroquias',()=>{
				return[{
					_id : rc.cobro.parroquia_id
				}]
			},
			{
				onReady: function () {
					rc.parroquia = Parroquias.findOne();
				}
			});
			
			function Unidades(num){

		        switch(num)
		        {
		            case 1: return 'UN';
		            case 2: return 'DOS';
		            case 3: return 'TRES';
		            case 4: return 'CUATRO';
		            case 5: return 'CINCO';
		            case 6: return 'SEIS';
		            case 7: return 'SIETE';
		            case 8: return 'OCHO';
		            case 9: return 'NUEVE';
		        }
		
		        return '';
		    
    }//Unidades()
			function Decenas(num){
			
			        let decena = Math.floor(num/10);
			        let unidad = num - (decena * 10);
			
			        switch(decena)
			        {
			            case 1:
			                switch(unidad)
			                {
			                    case 0: return 'DIEZ';
			                    case 1: return 'ONCE';
			                    case 2: return 'DOCE';
			                    case 3: return 'TRECE';
			                    case 4: return 'CATORCE';
			                    case 5: return 'QUINCE';
			                    default: return 'DIECI' + Unidades(unidad);
			                }
			            case 2:
			                switch(unidad)
			                {
			                    case 0: return 'VEINTE';
			                    default: return 'VEINTI' + Unidades(unidad);
			                }
			            case 3: return DecenasY('TREINTA', unidad);
			            case 4: return DecenasY('CUARENTA', unidad);
			            case 5: return DecenasY('CINCUENTA', unidad);
			            case 6: return DecenasY('SESENTA', unidad);
			            case 7: return DecenasY('SETENTA', unidad);
			            case 8: return DecenasY('OCHENTA', unidad);
			            case 9: return DecenasY('NOVENTA', unidad);
			            case 0: return Unidades(unidad);
			        }
			    }//Unidades()
		  function DecenasY(strSin, numUnidades) {
		      if (numUnidades > 0)
		          return strSin + ' Y ' + Unidades(numUnidades)
		
		      return strSin;
		  }//DecenasY()
		  function Centenas(num) {
			        let centenas = Math.floor(num / 100);
			        let decenas = num - (centenas * 100);
			
			        switch(centenas)
			        {
			            case 1:
			                if (decenas > 0)
			                    return 'CIENTO ' + Decenas(decenas);
			                return 'CIEN';
			            case 2: return 'DOSCIENTOS ' + Decenas(decenas);
			            case 3: return 'TRESCIENTOS ' + Decenas(decenas);
			            case 4: return 'CUATROCIENTOS ' + Decenas(decenas);
			            case 5: return 'QUINIENTOS ' + Decenas(decenas);
			            case 6: return 'SEISCIENTOS ' + Decenas(decenas);
			            case 7: return 'SETECIENTOS ' + Decenas(decenas);
			            case 8: return 'OCHOCIENTOS ' + Decenas(decenas);
			            case 9: return 'NOVECIENTOS ' + Decenas(decenas);
			        }
			
			        return Decenas(decenas);
			    }//Centenas()
		  function Seccion(num, divisor, strSingular, strPlural) {
		      let cientos = Math.floor(num / divisor)
		      let resto = num - (cientos * divisor)
		
		      let letras = '';
		
		      if (cientos > 0)
		          if (cientos > 1)
		              letras = Centenas(cientos) + ' ' + strPlural;
		          else
		              letras = strSingular;
		
		      if (resto > 0)
		          letras += '';
		
		      return letras;
		  }//Seccion()
		  function Miles(num) {
		      let divisor = 1000;
		      let cientos = Math.floor(num / divisor)
		      let resto = num - (cientos * divisor)
		
		      let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
		      let strCentenas = Centenas(resto);
		
		      if(strMiles == '')
		          return strCentenas;
		
		      return strMiles + ' ' + strCentenas;
		  }//Miles()
		  function Millones(num) {
		      let divisor = 1000000;
		      let cientos = Math.floor(num / divisor)
		      let resto = num - (cientos * divisor)
		
		      let strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
		      let strMiles = Miles(resto);
		
		      if(strMillones == '')
		          return strMiles;
		
		      return strMillones + ' ' + strMiles;
		  }//Millones()
			function NumeroALetras(num, currency) {
		      currency = currency || {};
		      let data = {
		          numero: num,
		          enteros: Math.floor(num),
		          centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
		          letrasCentavos: '',
		          letrasMonedaPlural: currency.plural || '',//'PESOS', 'Dólares', 'Bolívares', 'etcs'
		          letrasMonedaSingular: currency.singular || '', //'PESO', 'Dólar', 'Bolivar', 'etc'
		          letrasMonedaCentavoPlural: currency.centPlural || '',
		          letrasMonedaCentavoSingular: currency.centSingular || ''
		
		      };
		
		      if (data.centavos > 0) {
		          data.letrasCentavos = 'CON ' + (function () {
		                  if (data.centavos == 1)
		                      return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
		                  else
		                      return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
		              })();
		      };
		
		      if(data.enteros == 0)
		          return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
		      if (data.enteros == 1)
		          return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
		      else
		          return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
		  };	
			

			var valores = (rc.cobro.cobro).toString().split('.');
			
			if ( valores[1] == undefined)
				rc.cobro.centavos = "00";
			else
				rc.cobro.centavos = valores[1];
			rc.cobro.letra = NumeroALetras(valores[0]);


		}
	});

	this.borrarBotonImprimir= function()
	{
		var printButton = document.getElementById("printpagebutton");
	 	printButton.style.visibility = 'hidden';
	 	window.print()
	 	printButton.style.visibility = 'visible';
	};
	
	

	
	
};