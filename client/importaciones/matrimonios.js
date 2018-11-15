angular
.module("parroquias")
.controller("ImportarMatrimoniosCtrl", ImportarMatrimoniosCtrl);
function ImportarMatrimoniosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	window.rc = rc;
	
  rc.action = true;
  rc.clientes = {};
  rc.parroquia_id = "";
  
  rc.arreglo = [];
  
  rc.personas = [];
  	
	this.subscribe('parroquias',()=>{
		return [{estatus: true}]
	});

  this.helpers({
	  parroquias : () => {
		  return Parroquias.find({});
	  }
  });
  

	this.guardar = function()
	{	
			if (rc.arreglo.MATRIMONIO.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  rc.personas = [];
		  for (var i=0; i<rc.arreglo.MATRIMONIO.length;i++)
		  {
			  	var objeto = {};
					
								
					/////////////////////////////////////////////////////////////////			
					objeto.apellidoPaternoEl 		= rc.arreglo.MATRIMONIO[i].APPH_MAT == undefined ? "" : rc.arreglo.MATRIMONIO[i].APPH_MAT;
					objeto.apellidoMaternoEl 		= rc.arreglo.MATRIMONIO[i].APMH_MAT == undefined ? "" : rc.arreglo.MATRIMONIO[i].APMH_MAT;
					objeto.nombreEl							= rc.arreglo.MATRIMONIO[i].NOMH_MAT;
					
					objeto.apellidoPaternoElla 		= rc.arreglo.MATRIMONIO[i].APPM_MAT == undefined ? "" : rc.arreglo.MATRIMONIO[i].APPM_MAT;
					objeto.apellidoMaternoElla 		= rc.arreglo.MATRIMONIO[i].APMM_MAT == undefined ? "" : rc.arreglo.MATRIMONIO[i].APMM_MAT;
					objeto.nombreElla							= rc.arreglo.MATRIMONIO[i].NOMM_MAT;

					var nombreEl 		= objeto.nombreEl != undefined ? objeto.nombreEl : "";
		      var apPaternoEl = objeto.apellidoPaternoEl != undefined ? objeto.apellidoPaternoEl + " " : "";
		      var apMaternoEl = objeto.apellidoMaternoEl != undefined ? objeto.apellidoMaternoEl + " " : "";
		      
		      var nombreElla 		= objeto.nombreElla != undefined ? objeto.nombreElla : "";
		      var apPaternoElla = objeto.apellidoPaternoElla != undefined ? objeto.apellidoPaternoElla + " " : "";
		      var apMaternoElla = objeto.apellidoMaternoElla != undefined ? objeto.apellidoMaternoElla + " " : "";
		      
		      if (objeto.apellidoPaternoEl == "" && objeto.apellidoMaternoEl == "")
						objeto.nombreCompletoEl = objeto.nombreEl;
					else if (objeto.apellidoPaternoEl == "" && objeto.apellidoMaternoEl != "")
						objeto.nombreCompletoEl = objeto.apellidoMaternoEl + " " + objeto.nombreEl; 	 
					else if (objeto.apellidoPaternoEl != "" && objeto.apellidoMaternoEl == "")	
						objeto.nombreCompletoEl = objeto.apellidoPaternoEl + " " + objeto.nombreEl; 
					else
						objeto.nombreCompletoEl = objeto.apellidoPaternoEl + (objeto.apellidoMaternoEl == "" ? "": " " + objeto.apellidoMaternoEl) + " " + objeto.nombreEl;
						
					if (objeto.apellidoPaternoElla == "" && objeto.apellidoMaternoElla == "")
						objeto.nombreCompletoElla = objeto.nombreElla;
					else if (objeto.apellidoPaternoElla == "" && objeto.apellidoMaternoElla != "")
						objeto.nombreCompletoElla = objeto.apellidoMaternoElla + " " + objeto.nombreElla; 	 
					else if (objeto.apellidoPaternoElla != "" && objeto.apellidoMaternoEl == "")	
						objeto.nombreCompletoElla = objeto.apellidoPaternoElla + " " + objeto.nombreElla; 
					else
						objeto.nombreCompletoElla = objeto.apellidoPaternoElla + (objeto.apellidoMaternoElla == "" ? "": " " + objeto.apellidoMaternoElla) + " " + objeto.nombreElla;	
		      

 					objeto.fecha 							= new Date(rc.arreglo.MATRIMONIO[i].FECHA_MAT);
					//objeto.hora								= "";
					objeto.libro		 					= rc.arreglo.MATRIMONIO[i].LIBRO_MAT;
					objeto.foja		 						= rc.arreglo.MATRIMONIO[i].FOJA_MAT;
					objeto.noDeActa 					= rc.arreglo.MATRIMONIO[i].NACTA_MAT;
											
 					
					//objeto.lugarNacimiento		= "";
					objeto.parroquiaBautismo	= "";
					objeto.parroquiaBautismo_id= "";
										
					objeto.testigo1El					= rc.arreglo.MATRIMONIO[i].TESTIG1_MA == undefined ? "" : rc.arreglo.MATRIMONIO[i].TESTIG1_MA;
					objeto.testigo2El					= "";
					
					objeto.testigo1Ella				= rc.arreglo.MATRIMONIO[i].TESTIG2_MA == undefined ? "" : rc.arreglo.MATRIMONIO[i].TESTIG2_MA;
					objeto.testigo2Ella				= "";
 
 					objeto.padrinoEl			  	= rc.arreglo.MATRIMONIO[i].PADRI1_MAT == undefined ? "" : rc.arreglo.MATRIMONIO[i].PADRI1_MAT;
 					objeto.madrinaEl			  	= "";
 					
 					objeto.padrinoElla		  	= rc.arreglo.MATRIMONIO[i].PADRI2_MAT == undefined ? "" : rc.arreglo.MATRIMONIO[i].PADRI2_MAT;
 					objeto.madrinaElla			 	= "";
 					
  			  objeto.lugarParroquia			= "";
 					objeto.sacerdoteNombre		= rc.arreglo.MATRIMONIO[i].SACER_PRC == undefined ? "" : rc.arreglo.MATRIMONIO[i].SACERC_MAT;
 					objeto.sacerdote_id				= "";
 					
 					objeto.parroco						= rc.arreglo.MATRIMONIO[i].PARRO_MAT;
 					
 					objeto.tipoSacerdote 			= "IMPORTADO"
					
					objeto.estatus 						= "casados";
		      objeto.fechaCreacion 			= new Date();
					objeto.usuarioInserto 		= Meteor.userId();
					objeto.parroquia_id 			= rc.parroquia_id;
					
					if (objeto.nombreCompleto !== "")
							rc.personas.push(objeto);
					
					rc.arreglo.MATRIMONIO.splice(i, 1);
					i--;

									
		  }	  
		  
		  loading(true);
			Meteor.call ("setImportar", rc.personas, "Matrimonio", function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al guardar los datos.: ', error.details);
					 loading(false);
					 return;
				}
				if (result)
				{
						rc.arreglo = [];
				 		toastr.success('Guardado correctamente.');
				 		loading(false);
											
				}
			});
		  
		  rc.clientes = {};

	};
			
	var X = XLSX;
	
	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if(roa.length > 0){
				result[sheetName] = roa;
			}
		});
		return result;
	}
		
	function process_wb(wb) {
		loading(true);
		var output = {};
		output = JSON.stringify(to_json(wb), 2, 2);										
		rc.arreglo = JSON.parse(output);
		$scope.$apply();
		loading(false);
	}
	
	var xlf = document.getElementById('xlf');
	
	function handleFile(e) {
		
		var files = e.target.files;
		var f = files[0];
		{
			var reader = new FileReader();
			var name = f.name;
			reader.onload = function(e) {
				var data = e.target.result;
				var wb;
				wb = X.read(data, {type: 'binary'});
				process_wb(wb);
			};
			reader.readAsBinaryString(f);
		}
	}
	
	if(xlf.addEventListener) xlf.addEventListener('change', handleFile, false);
	
	
};



