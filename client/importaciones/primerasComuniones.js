angular
.module("parroquias")
.controller("ImportarPrimerasComunionesCtrl", ImportarPrimerasComunionesCtrl);
function ImportarPrimerasComunionesCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

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
			if (rc.arreglo.PRIMERAS.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  rc.personas = [];
		  for (var i=0; i<rc.arreglo.PRIMERAS.length;i++)
		  {
			  	var objeto = {};
					
								
					/////////////////////////////////////////////////////////////////			
					objeto.apellidoPaterno 		= rc.arreglo.PRIMERAS[i].APP_PRC == undefined ? "" : rc.arreglo.PRIMERAS[i].APP_PRC;
					objeto.apellidoMaterno 		= rc.arreglo.PRIMERAS[i].APM_PRC == undefined ? "" : rc.arreglo.PRIMERAS[i].APM_PRC;
					objeto.nombre							= rc.arreglo.PRIMERAS[i].NOM_PRC;

					var nombre 		= objeto.nombre != undefined ? objeto.nombre : "";
		      var apPaterno = objeto.apellidoPaterno != undefined ? objeto.apellidoPaterno + " " : "";
		      var apMaterno = objeto.apellidoMaterno != undefined ? objeto.apellidoMaterno + " " : "";
		      
		      //objeto.nombreCompleto =  apPaterno + apMaterno + nombre;
		      
		      if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno == "")
						objeto.nombreCompleto = objeto.nombre;
					else if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno != "")
						objeto.nombreCompleto = objeto.apellidoMaterno + " " + objeto.nombre; 	 
					else if (objeto.apellidoPaterno != "" && objeto.apellidoMaterno == "")	
						objeto.nombreCompleto = objeto.apellidoPaterno + " " + objeto.nombre; 
					else
						objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
		      
		      
 
 					objeto.fecha 							= new Date(rc.arreglo.PRIMERAS[i].FECHA_PRC);
					//objeto.hora								= "";
					objeto.libro		 					= rc.arreglo.PRIMERAS[i].LIBRO_PRC;
					objeto.foja		 						= rc.arreglo.PRIMERAS[i].FOJA_PRC;
					objeto.noDeActa 					= rc.arreglo.PRIMERAS[i].NACTA_PRC;
					
/*
					if (rc.arreglo.PRIMERAS[i].FECNAC_CON == undefined || rc.arreglo.PRIMERAS[i].FECNAC_CON == "")
						objeto.fechaNacimiento 	= ""
					else
						objeto.fechaNacimiento	= new Date(rc.arreglo.PRIMERAS[i].FECNAC_CON);
*/
						
/*
						
					if (rc.arreglo.PRIMERAS[i].FECHA_PRC == undefined || rc.arreglo.PRIMERAS[i].FECHA_PRC == "")
						objeto.fechaBautismo	 	= ""
					else
						objeto.fechaBautismo		= new Date(rc.arreglo.PRIMERAS[i].FECHA_PRC);	
 					
*/
					//objeto.lugarNacimiento		= "";
					objeto.parroquiaBautismo	= "";
					objeto.parroquiaBautismo_id= "";
					
					//objeto.tipoHijo						= rc.arreglo.PRIMERAS[i].HIJO_CON == 'N'? "NATURAL": "LEGÍTIMO";
					
					objeto.padre							= rc.arreglo.PRIMERAS[i].PADRE_PRC;
					objeto.madre							= rc.arreglo.PRIMERAS[i].MADRE_PRC;
 
 					objeto.padrino				  	= rc.arreglo.PRIMERAS[i].PADRI_PRC;
 					objeto.madrina				  	= rc.arreglo.PRIMERAS[i].MADRI_PRC;
 					
  			  objeto.lugarParroquia			= "";
 					objeto.sacerdoteNombre		= rc.arreglo.PRIMERAS[i].SACER_PRC == undefined ? "" : rc.arreglo.PRIMERAS[i].SACER_PRC;
 					objeto.sacerdote_id				= "";
 					
 					objeto.parroco						= rc.arreglo.PRIMERAS[i].PARRO_PRC;
 					
 					objeto.tipoSacerdote 			= "IMPORTADO"
					
					objeto.estatus 						= "primeraComunion";
		      objeto.fechaCreacion 			= new Date();
					objeto.usuarioInserto 		= Meteor.userId();
					objeto.parroquia_id 			= rc.parroquia_id;
					
					if (objeto.nombreCompleto !== "")
							rc.personas.push(objeto);
					
					rc.arreglo.PRIMERAS.splice(i, 1);
					i--;

									
		  }	  
		  
		  loading(true);
			Meteor.call ("setImportar", rc.personas, "Primera Comunión", function(error,result){
	
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



