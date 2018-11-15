angular
.module("parroquias")
.controller("ImportarConfirmadosCtrl", ImportarConfirmadosCtrl);
function ImportarConfirmadosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

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
			if (rc.arreglo.CONFIRMADOS.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  rc.personas = [];
		  for (var i=0; i<rc.arreglo.CONFIRMADOS.length;i++)
		  {
			  	var objeto = {};
					
								
					/////////////////////////////////////////////////////////////////			
					objeto.apellidoPaterno 		= rc.arreglo.CONFIRMADOS[i].APP_CON == undefined ? "" : rc.arreglo.CONFIRMADOS[i].APP_CON;
					objeto.apellidoMaterno 		= rc.arreglo.CONFIRMADOS[i].APM_CON == undefined ? "" : rc.arreglo.CONFIRMADOS[i].APM_CON;
					objeto.nombre							= rc.arreglo.CONFIRMADOS[i].NOM_CON;

					var nombre 		= objeto.nombre != undefined ? objeto.nombre : "";
		      var apPaterno = objeto.apellidoPaterno != undefined ? objeto.apellidoPaterno + " " : "";
		      var apMaterno = objeto.apellidoMaterno != undefined ? objeto.apellidoMaterno + " " : "";
		      
		      objeto.nombreCompleto =  apPaterno + apMaterno + nombre;
 
 					objeto.fecha 							= new Date(rc.arreglo.CONFIRMADOS[i].FECHA_CON);
					objeto.hora								= "";
					objeto.libro		 					= rc.arreglo.CONFIRMADOS[i].LIBRO_CON;
					objeto.foja		 						= rc.arreglo.CONFIRMADOS[i].FOJA_CON;
					objeto.noDeActa 					= rc.arreglo.CONFIRMADOS[i].NACTA_CON;
					
					if (rc.arreglo.CONFIRMADOS[i].FECNAC_CON == undefined || rc.arreglo.CONFIRMADOS[i].FECNAC_CON == "")
						objeto.fechaNacimiento 	= ""
					else
						objeto.fechaNacimiento	= new Date(rc.arreglo.CONFIRMADOS[i].FECNAC_CON);
						
						
					if (rc.arreglo.CONFIRMADOS[i].FECBAU_CON == undefined || rc.arreglo.CONFIRMADOS[i].FECBAU_CON == "")
						objeto.fechaBautismo	 	= ""
					else
						objeto.fechaBautismo		= new Date(rc.arreglo.CONFIRMADOS[i].FECBAU_CON);	
 					
					objeto.lugarNacimiento		= "";
					objeto.parroquiaBautismo	= rc.arreglo.CONFIRMADOS[i].PARROQ_CON;
					objeto.parroquiaBautismo_id= "";
					
					objeto.tipoHijo						= rc.arreglo.CONFIRMADOS[i].HIJO_CON == 'N'? "NATURAL": "LEGÍTIMO";
					
					objeto.padre							= rc.arreglo.CONFIRMADOS[i].PADRE_CON;
					objeto.madre							= rc.arreglo.CONFIRMADOS[i].MADRE_CON;
 
 					objeto.padrino				  	= rc.arreglo.CONFIRMADOS[i].PADRI_CON;
  					
 					objeto.esHijo					  	= rc.arreglo.CONFIRMADOS[i].SEXO_CON == 1 ? "HIJO" : "HIJA";
 					
  			  objeto.lugarParroquia			= rc.arreglo.CONFIRMADOS[i].LUGPRQ_CON;
 					objeto.sacerdoteNombre		= rc.arreglo.CONFIRMADOS[i].SACER_CON == undefined ? "" : rc.arreglo.CONFIRMADOS[i].SACER_CON;
 					objeto.sacerdote_id				= "";
 					
 					objeto.parroco						= rc.arreglo.CONFIRMADOS[i].PARRO_CON;
 					
 					objeto.tipoSacerdote 			= "IMPORTADO"
					
					objeto.estatus 						= "confirmado";
		      objeto.fechaCreacion 			= new Date();
					objeto.usuarioInserto 		= Meteor.userId();
					objeto.parroquia_id 			= rc.parroquia_id;
					
					if (objeto.nombreCompleto !== "")
							rc.personas.push(objeto);
					
					rc.arreglo.CONFIRMADOS.splice(i, 1);
					i--;

									
		  }	  
		  
		  loading(true);
			Meteor.call ("setImportar", rc.personas, "Confirmación", function(error,result){
	
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



