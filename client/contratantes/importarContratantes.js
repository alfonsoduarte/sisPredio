
angular
.module("sisPredios")
.controller("ImportarContratantesCtrl", ImportarContratantesCtrl);
function ImportarContratantesCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	this.cuenta = {};
	this.cuenta.username = "";
	this.cuenta.password = "";
	
	
  this.contratantesArreglo = {};
 	
  this.helpers({
  });
  
 
	this.cargar = function()
	{	
			//console.log("contratantes:",rc.contratantesArreglo);
					 
	};
	
	this.guardar = function()
	{	
			
			if (rc.contratantesArreglo.Hoja1.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  
		  $( "#guardar" ).prop( "disabled", true );
			
			Meteor.call('insertarContratantes',rc.contratantesArreglo.Hoja1, function(e, r) { 
											console.log(r);
											if (e)
											{
													console.log("Error:", e);
													$( "#guardar" ).prop( "disabled", false );
											}
											else if (r)
											{
												console.log("Exito:", r);

												rc.contratantesArreglo = {};
												toastr.success('Proceso Terminado.');
												$( "#guardar" ).prop( "disabled", false );									
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
		
		rc.contratantesArreglo = JSON.parse(output);
					
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



