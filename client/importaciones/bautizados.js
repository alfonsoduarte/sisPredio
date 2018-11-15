angular
.module("parroquias")
.controller("ImportarBautizadosCtrl", ImportarBautizadosCtrl);
function ImportarBautizadosCtrl($scope, $meteor, $reactive,  $state, $stateParams, toastr) {

	let rc = $reactive(this).attach($scope);
	window.rc = rc;
	
  rc.action = true;
  rc.clientes = {};
  rc.parroquia_id = "";
  
  rc.arreglo = [];
  
  rc.bautizados = [];
  	
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
			if (rc.arreglo.BAUTISMOS.length == 0){
					 toastr.error('Error al guardar los datos.');
		       return;
		  }
		  rc.bautizados = [];
		  for (var i=0; i<rc.arreglo.BAUTISMOS.length;i++)
		  {
			  	var objeto = {};
					
					objeto.apellidoPaterno 		= "";
					objeto.apellidoMaterno 		= "";
					objeto.nombre							= "";
					objeto.nombreCompleto			= "";
					objeto.fecha 							= "";
					objeto.hora								= "";
					objeto.libro		 					= "";
					objeto.foja		 						= "";
					objeto.noDeActa 					= "";
					objeto.fechaNacimiento 		= "";
					objeto.lugarNacimiento		= "";
					objeto.hijoNatural				= "";
					objeto.padre							= "";
					objeto.madre							= "";
					objeto.abueloPaterno	  	= "";
					objeto.abuelaPaterno	  	= "";
					objeto.abueloMaterno	  	= "";
					objeto.abuelaMaterno	  	= "";
					objeto.padrino				  	= "";
					objeto.madrina				  	= "";
 					objeto.registroCivil	  	= "";
 					objeto.lugar					  	= "";
 					objeto.esHijo					  	= "";
 					objeto.fechaRegistro 			= "";
 					objeto.lugarParroquia			= "";
 					objeto.sacerdoteNombre	 	= "";
					objeto.parroco				 		= "";
								
					/////////////////////////////////////////////////////////////////			
					objeto.apellidoPaterno 		= rc.arreglo.BAUTISMOS[i].APP_BAU == undefined ? "" : rc.arreglo.BAUTISMOS[i].APP_BAU;
					objeto.apellidoMaterno 		= rc.arreglo.BAUTISMOS[i].APM_BAU == undefined ? "" : rc.arreglo.BAUTISMOS[i].APM_BAU;
					objeto.nombre							= rc.arreglo.BAUTISMOS[i].NOM_BAU;
					var nombre 		= objeto.nombre != undefined ? objeto.nombre : "";
		      var apPaterno = objeto.apellidoPaterno != undefined ? objeto.apellidoPaterno + " " : "";
		      var apMaterno = objeto.apellidoMaterno != undefined ? objeto.apellidoMaterno + " " : "";
		      
		      objeto.nombreCompleto =  apPaterno + apMaterno + nombre;
 					
					objeto.fecha 							= new Date(rc.arreglo.BAUTISMOS[i].FECHA_BAU);
					objeto.hora								= "";
					objeto.libro		 					= rc.arreglo.BAUTISMOS[i].LIBRO_BAU;
					objeto.foja		 						= rc.arreglo.BAUTISMOS[i].FOJA_BAU;
					objeto.noDeActa 					= rc.arreglo.BAUTISMOS[i].NACTA_BAU;
					
					if (rc.arreglo.BAUTISMOS[i].FECNAC_BAU == undefined || rc.arreglo.BAUTISMOS[i].FECNAC_BAU == "")
						objeto.fechaNacimiento 	= ""
					else
						objeto.fechaNacimiento	= new Date(rc.arreglo.BAUTISMOS[i].FECNAC_BAU);
					
					objeto.lugarNacimiento		= rc.arreglo.BAUTISMOS[i].LUGNAC_BAU;
					objeto.tipoHijo						= rc.arreglo.BAUTISMOS[i].HIJO_BAU == 'N'? "NATURAL": "LEGÍTIMO";
					
					objeto.padre							= rc.arreglo.BAUTISMOS[i].PADRE_BAU;
					objeto.madre							= rc.arreglo.BAUTISMOS[i].MADRE_BAU;
					
					objeto.abueloPaterno	  	= rc.arreglo.BAUTISMOS[i].APAT_BAU;
					objeto.abuelaPaterna	  	= "";
					
					objeto.abueloMaterno	  	= rc.arreglo.BAUTISMOS[i].AMAT_BAU;
					objeto.abuelaMaterna	  	= "";
					
					objeto.padrino				  	= rc.arreglo.BAUTISMOS[i].PADRI_BAU;
					objeto.madrina				  	= "";
					
 					objeto.registroCivil	  	= rc.arreglo.BAUTISMOS[i].NOREG_BAU;
 					objeto.lugar					  	= rc.arreglo.BAUTISMOS[i].LUGREG_BAU;
 					
 					objeto.esHijo					  	= rc.arreglo.BAUTISMOS[i].SEXO_BAU == 1 ? "HIJO" : "HIJA";
 					
					
 					if (rc.arreglo.BAUTISMOS[i].FECREG_BAU == undefined || rc.arreglo.BAUTISMOS[i].FECREG_BAU == "")
						objeto.fechaRegistro 	= ""
					else
						objeto.fechaRegistro	= new Date(rc.arreglo.BAUTISMOS[i].FECREG_BAU);
 					
 					
 					objeto.lugarParroquia			= rc.arreglo.BAUTISMOS[i].LUGPRQ_BAU;
 					objeto.sacerdoteNombre		= rc.arreglo.BAUTISMOS[i].SACER_BAU == undefined ? "" : rc.arreglo.BAUTISMOS[i].SACER_BAU;
 					objeto.sacerdote_id				= "";
 					
 					objeto.parroco						= rc.arreglo.BAUTISMOS[i].PARRO_BAU;
 					
 					objeto.tipoSacerdote 			= "IMPORTADO"
					
					objeto.estatus = "bautizado";
		      objeto.fechaCreacion = new Date();
					objeto.usuarioInserto = Meteor.userId();
					objeto.parroquia_id = rc.parroquia_id;
					
					if (objeto.nombreCompleto !== "")
							rc.bautizados.push(objeto);
					
					rc.arreglo.BAUTISMOS.splice(i, 1);
					i--;

									
		  }	  
		  
		  loading(true);
			Meteor.call ("setImportar", rc.bautizados, "Bautismo", function(error,result){
	
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
	
	this.exportar = function(){
		loading(true);
			Meteor.call ("getExcel", function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al guardar los datos.: ', error.details);
					 loading(false);
					 return;
				}
				if (result)
				{

					 	downloadFile(result);
				 		toastr.success('Exportado correctamente.');
				 		loading(false);
											
				}
			});
		
	}
	
};



