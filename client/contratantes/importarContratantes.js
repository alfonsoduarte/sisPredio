
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
		  
			Meteor.call('removeAllContratantes');		  
			
			_.each(rc.contratantesArreglo.Hoja1, function(contratante){
		  					
					var c = {Icontid:"",Cnomcomp:"",Cnombres:"",Capellidos:"",Crfc:"",Cdomicilio:"",Ctel1:"",Ctel2:"",Ctel3:"",Ccorreo:"",Ccorreo2:"",Icontacid:"",Nom_contacto:""};
					c.Icontid = contratante.Icontid;
					c.Cnomcomp = contratante.Cnomcomp.trim();
							
					c.Cnombres = contratante.Cnombres.trim();
					c.Capellidos = contratante.Capellidos.trim();
					c.Crfc = contratante.Crfc.trim();
					c.Cdomicilio = contratante.Cdomicilio.trim();
					c.Ctel1 = contratante.Ctel1.trim();
					c.Ctel2 = contratante.Ctel2.trim();
					c.Ctel3 = contratante.Ctel3.trim();
					
					c.Ccorreo = contratante.Ccorreo.trim();
					c.Ccorreo2 = contratante.Ccorreo2.trim();
					c.Icontacid = contratante.Icontacid;
					c.Nom_contacto = contratante.Nom_contacto.trim();
					//Preguntar si existe el contratante	
					
					var buscar = contratante.Ccorreo.trim();
					buscar = contratante.Ccorreo.trim().replace("@", ".");//Reemplazar @ por .
					Meteor.call('getContratante', buscar, function(error, result) {
					   if(error)
					   {
						    console.log('ERROR :', error);
						    return;
					   }
					   else if (result)//Ya existe
					   {
						   	//agregarlo a la colección Contratante
						   	c.cuenta_id = result;	
								Contratantes.insert(c);
			  
					   }
					   else if (result===null)
					   {

						   	var cuentaUsuario = {};
						   	cuentaUsuario.profile = {};
						   	
						   	cuentaUsuario.username = contratante.Ccorreo.trim().replace("@", ".");;
						   	cuentaUsuario.password = '123qwe';
						   	cuentaUsuario.profile.Icontid = contratante.Icontid;
						   	
								Meteor.call('createUsuario', cuentaUsuario, "Contratante", function(e, r) { 
											if (e)
											{
													console.log("Error:", e);
											}
											else if (r)
											{
												c.cuenta_id = r;	
												console.log(c);
												console.log("a grabar contratante",c);
												Contratantes.insert(c);	
											}		
								});
								
					   }
					});
		  });	  
		  
		  this.contratantesArreglo = {};
		  toastr.success('Proceso Terminado.');
		  
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



