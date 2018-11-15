angular
.module("parroquias")
.controller("ImportarNotasMarginalesCtrl", ImportarNotasMarginalesCtrl);
function ImportarNotasMarginalesCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

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
			if (rc.arreglo.Notas.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  rc.personas = [];
		  for (var i=0; i<rc.arreglo.Notas.length;i++)
		  {
			  	var objeto = {};
					
								
					/////////////////////////////////////////////////////////////////			
					var claveNota 						= rc.arreglo.Notas[i].CLAVE_NOTA;
					
					if (claveNota == '01')//Confirmación
					{
							objeto.tipoNota = 'CONFIRMACIÓN';
						
					}
					else if (claveNota == '03'/*  || claveNota == '05' */)
					{
							objeto.tipoNota = 'MATRIMONIO';
					}
/*
					else if (claveNota == '03')
					{
							objeto.tipoNota = 'DISOLVER O ANULAR MATRIMONIO';
						
					}
*/
					else if (claveNota == '04')
					{
							objeto.tipoNota = 'DECRETO DE CORRECCIÓN';
					}
					else if (claveNota == '02')
					{
							objeto.tipoNota = 'PRIMERA COMUNIÓN';
					}
/*
					else if (claveNota == '08')
					{
							objeto.tipoNota = '';
					}
*/
					
					
					objeto.fecha				= new Date(rc.arreglo.Notas[i].FECHA_NOTA);
					objeto.nota 				= rc.arreglo.Notas[i].DESC1_NOTA;
					
					objeto.lugar 				= rc.arreglo.Notas[i].DESC2_NOTA == undefined ? "" : rc.arreglo.Notas[i].DESC2_NOTA;
					
					
					var libro		 				= Number(rc.arreglo.Notas[i].LIBRO_NOTA);
					objeto.libro				= libro.toString();
					objeto.foja 				= rc.arreglo.Notas[i].FOJA_NOTA;
					objeto.noDeActa   	= rc.arreglo.Notas[i].NACTA_NOTA;
					
					objeto.parroquia_id = rc.parroquia_id;
					
					
					if (objeto.libro !== "")
							rc.personas.push(objeto);
					
					rc.arreglo.Notas.splice(i, 1);
					i--;

									
		  }	  
		  
		  loading(true);
			Meteor.call ("setNotasMarginales", rc.personas, function(error,result){
	
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



