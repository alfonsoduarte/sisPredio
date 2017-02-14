
angular
.module("sisPredios")
.controller("ImportarMovimientosCtrl", ImportarMovimientosCtrl);
function ImportarMovimientosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);

	
	
  this.movimientosArreglo = {};
 	
  this.helpers({
  });
  
 
	this.cargar = function()
	{	
			//console.log("movimientos:",robj.movimientosArreglo);
					 
	};
	
	this.guardar = function()
	{	
			
			if (rc.movimientosArreglo.Hoja1.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  
			Meteor.call('removeAllMovimientos');
			
			Meteor.call('insertarMovimientos',rc.movimientosArreglo.Hoja1, function(e, r) { 
											console.log(r);
											if (e)
											{
													console.log("Error:", e);
											}
											else if (r)
											{
												console.log(r);

												rc.movimientosArreglo = {};
												toastr.success('Proceso Terminado.');											
											}		
			});		  
		  
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

		var output = {};
		output = JSON.stringify(to_json(wb), 2, 2);
		
		rc.movimientosArreglo = JSON.parse(output);
					
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



