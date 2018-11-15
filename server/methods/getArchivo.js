Meteor.methods({
  
	report: function(params) {
 
    var Docxtemplater = require('docxtemplater');
    var ImageModule = require('docxtemplater-image-module');
    var JSZip = require('jszip');
    var unoconv = require('better-unoconv');
    var future = require('fibers/future');
    var fs = require('fs');
    
    var objParse = function(datos, obj, prof) {
      if (!obj) {
        obj = {};
      }
      _.each(datos, function(d, dd) {
        var i = prof ? prof + dd : dd;
        if (_.isDate(d)) {
          obj[i] = moment(d).format('DD-MM-YYYY');
        } else if (_.isArray(d)) {
          obj[i] = arrParse(d, []);
        } else if (_.isObject(d)) {
          objParse(d, obj, i + '.');
        } else {
          obj[i] = d;
        }
      });
      return obj
    };

    var arrParse = function(datos, arr) {
      _.each(datos, function(d) {
        if (_.isArray(d)){
          arr.push(arrParse(d, []));
        }else if (_.isObject(d)){
          var obj = objParse(d, {});
          arr.push(obj);
        } else {
          arr.push(!_.isDate(d) ? d : moment(d).format('DD-MM-YYYY'));
        }
      });
      return arr
    };
		
    params.datos = objParse(params.datos);
    params.datos.fechaReporte = moment().format('DD-MM-YYYY');  
    var templateType = (params.type === 'pdf') ? '.docx' : (params.type === 'excel' ? '.xlsx' : '.docx');
    if(Meteor.isDevelopment){
      var path = require('path');
      var publicPath = path.resolve('.').split('.meteor')[0];
      var templateRoute = publicPath + "public/templates/" + params.templateNombre + templateType;
    }else{
      var publicPath = '/var/www/parroquias/';
      var templateRoute = publicPath + "archivos/" + params.templateNombre + templateType;
    }
		
		var opts = {};
		if (params.datos.tieneFirma != undefined && params.datos.tieneFirma == 'Si' )
		{
 				opts.centered = false;
				
				opts.getImage=function(tagValue, tagName) {
							var binaryData =  fs.readFileSync(tagValue,'binary');
							return binaryData;
				}
				
				opts.getSize=function(img,tagValue, tagName) {
				    return [400,60];
				}
				
				var f = String(params.datos.firma);
				var tipo = f.substr(11,4);	
				if (tipo == 'jpeg')
				{						
						params.datos.firma = f.replace('data:image/jpeg;base64,', '');					
				    var bitmap = new Buffer(params.datos.firma, 'base64');
						fs.writeFileSync(publicPath + (Meteor.isDevelopment ? ".outputs/" : "descargas/") + params.datos.nombreFirma + ".jpeg", bitmap);
						params.datos.firma = publicPath + (Meteor.isDevelopment ? ".outputs/" : "descargas/") + params.datos.nombreFirma + ".jpeg";	
				}
				else if (tipo == 'png;')
				{
						params.datos.firma = f.replace('data:image/jpeg;base64,', '');					
				    var bitmap = new Buffer(params.datos.firma, 'base64');
						fs.writeFileSync(publicPath + (Meteor.isDevelopment ? ".outputs/" : "descargas/") + params.datos.nombreFirma + ".jpeg", bitmap);
						params.datos.firma = publicPath + (Meteor.isDevelopment ? ".outputs/" : "descargas/") + params.datos.nombreFirma + ".jpeg";						
				}
 
 				var imageModule = new ImageModule(opts);
 		
		    var content = fs.readFileSync(templateRoute, "binary");
		    var res = new future();
		    var zip = new JSZip(content);
		    var doc = new Docxtemplater().attachModule(imageModule).loadZip(zip).setOptions({
		      nullGetter: function(part) {
		        if (!part.module) {
		          return "";
		        }
		        if (part.module === "rawxml") {
		          return "";
		        }
		        return "";
		      }
		    });
				
   	}
   	else
   	{
 
 		    var content = fs.readFileSync(templateRoute, "binary");
		    var res = new future();
		    var zip = new JSZip(content);
		    var doc = new Docxtemplater().loadZip(zip).setOptions({
		      nullGetter: function(part) {
		        if (!part.module) {
		          return "";
		        }
		        if (part.module === "rawxml") {
		          return "";
		        }
		        return "";
		      }
		    });
	   	
   	}
 		
    doc.setData(params.datos);
    doc.render();
    var buf = doc.getZip().generate({ type: "nodebuffer" });
    if (params.type == 'pdf') {
      var rutaOutput = publicPath + (Meteor.isDevelopment ? ".outputs/" : "descargas/") + params.reportNombre + moment().format('x') + templateType;
      fs.writeFileSync(rutaOutput, buf);
      unoconv.convert(rutaOutput, 'pdf', function(err, result) {
        if(!err){
          fs.unlink(rutaOutput, (error) => { /* handle error */ });
          res['return']({ uri: 'data:application/pdf;base64,' + result.toString('base64'), nombre: params.reportNombre + '.pdf' });
        }else{
          res['return']({err: err});
        }
      });
    } else {
      var mime;
      if (templateType === '.xlsx') {
        mime = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else {
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
      res['return']({ uri: 'data:application/' + mime + ';base64,' + buf.toString('base64'), nombre: params.reportNombre + templateType });
    }
    return res.wait()
  },
	
	getCobranzaArchivo: function(params) {
 
    var Docxtemplater = require('docxtemplater');
    var ImageModule = require('docxtemplater-image-module');
    var JSZip = require('jszip');
    var unoconv = require('better-unoconv');
    var future = require('fibers/future');
    var fs = require('fs');
    const formatCurrency = require('format-currency');
    
    //Ir por los datos----------------------------
    
    var cobranzaFecha = Cobros.find({parroquia_id: params.datos.parroquia_id, fechaCobro : { $gte : params.datos.fechaInicial, $lte : params.datos.fechaFinal}, estatus: 1}).fetch();
			
 		var datos = {};
			
		datos.cobranza 					= [];
		estipendios	 						= {};
		datos.sumaTramites 			= 0;
		datos.sumaCelebraciones = 0;
		datos.sumaIntenciones	 	= 0;
		
		datos.cantidadTramites 			= 0;
		datos.cantidadCelebraciones = 0;
		datos.cantidadIntenciones	 	= 0;
		
		_.each(cobranzaFecha, function(cd){
				_.each(cd.estipendios, function(estipendio){
					
						estipendio.fechaCobro 		= cd.fechaCobro;
							estipendio.esAbono		 		= cd.esAbono;
							var cajero = Meteor.users.findOne({"_id" : cd.usuario_id}, {fields: {"profile.nombre": 1}});											
	  					estipendio.cajero = cajero.profile.nombre;
	  					
	  					estipendio.estipendioNombre = Estipendios.findOne(estipendio.estipendio_id).nombre;
	  					
	  					if (estipendio.tipo == "Trámite")
	  					{
	  							datos.sumaTramites += Number(estipendio.importePagado);
	  							datos.cantidadTramites += 1;
	  					}
	  					else if (estipendio.tipo == "Celebración")
	  					{
		  						datos.sumaCelebraciones += Number(estipendio.importePagado);
		  						datos.cantidadCelebraciones += 1;
		  						if (estipendios[estipendio.estipendio_id] == undefined)
			  					{
				  						estipendios[estipendio.estipendio_id] = {};
				  						estipendios[estipendio.estipendio_id].estipendioNombre = estipendio.estipendioNombre;
				  						estipendios[estipendio.estipendio_id].total						 = 0;
				  						estipendios[estipendio.estipendio_id].total						 = estipendio.importePagado;
				  						estipendios[estipendio.estipendio_id].cantidad				 = 1;
			  					}
			  					else
			  					{
				  						estipendios[estipendio.estipendio_id].total						 += Number(estipendio.importePagado);
				  						estipendios[estipendio.estipendio_id].cantidad				 += 1;
			  					}	
	  					}				
							else if (estipendio.tipo == "Intención de Misa")
							{
									datos.sumaIntenciones += Number(estipendio.importePagado);
									datos.cantidadIntenciones	 	+= 1;
							}
	  					
							datos.cobranza.push(estipendio);
	 				})
 		});
		
		params.datos.estipendios 				= _.toArray(estipendios);
		
		_.each(params.datos.estipendios, function(estipendio){
				estipendio.total 						= formatCurrency(parseFloat(estipendio.total).toFixed(2));
		});
		
    params.datos.sumaTramites 			= formatCurrency(parseFloat(datos.sumaTramites).toFixed(2));
    params.datos.sumaCelebraciones 	= formatCurrency(parseFloat(datos.sumaCelebraciones).toFixed(2));
    params.datos.sumaIntenciones	  = formatCurrency(parseFloat(datos.sumaIntenciones).toFixed(2));
    
    params.datos.cantidadTramites 			= datos.cantidadTramites;
    params.datos.cantidadCelebraciones 	= datos.cantidadCelebraciones;
    params.datos.cantidadIntenciones	  = datos.cantidadIntenciones;
    
    params.datos.sumaTotal				  = formatCurrency(parseFloat(datos.sumaTramites + datos.sumaCelebraciones + datos.sumaIntenciones).toFixed(2));
    params.datos.cobranza 	  			= datos.cobranza; 
    
		params.datos.nombreParroquia		= Parroquias.findOne(params.datos.parroquia_id).nombre;
		
		var hora = moment(new Date()).format("hh:mm:ss a");
		
		params.datos.hora								= hora;
		
		var dia = params.datos.fechaInicial.getDate();
    var mes = params.datos.fechaInicial.getMonth() + 1;
    params.datos.inicial = (Number(dia) < 10 ? "0" + dia: dia) + "-" + (Number(mes) < 10 ? "0" + mes: mes) + "-" + params.datos.fechaInicial.getFullYear();
    
    dia = params.datos.fechaFinal.getDate();
    mes = params.datos.fechaFinal.getMonth() + 1;
    params.datos.final = (Number(dia) < 10 ? "0" + dia: dia) + "-" + (Number(mes) < 10 ? "0" + mes: mes) + "-" + params.datos.fechaFinal.getFullYear();
    
    var fecha = new Date();
		dia = fecha.getDate();
    mes = fecha.getMonth() + 1;
    params.datos.fecha = (Number(dia) < 10 ? "0" + dia: dia) + "-" + (Number(mes) < 10 ? "0" + mes: mes) + "-" + fecha.getFullYear();
     
    //--------------------------------------------
    var objParse = function(datos, obj, prof) {
      if (!obj) {
        obj = {};
      }
      _.each(datos, function(d, dd) {
        var i = prof ? prof + dd : dd;
        if (_.isDate(d)) {
          obj[i] = moment(d).format('DD-MM-YYYY');
        } else if (_.isArray(d)) {
          obj[i] = arrParse(d, []);
        } else if (_.isObject(d)) {
          objParse(d, obj, i + '.');
        } else {
          obj[i] = d;
        }
      });
      return obj
    };

    var arrParse = function(datos, arr) {
      _.each(datos, function(d) {
        if (_.isArray(d)){
          arr.push(arrParse(d, []));
        }else if (_.isObject(d)){
          var obj = objParse(d, {});
          arr.push(obj);
        } else {
          arr.push(!_.isDate(d) ? d : moment(d).format('DD-MM-YYYY'));
        }
      });
      return arr
    };
		
    params.datos = objParse(params.datos);
    params.datos.fechaReporte = moment().format('DD-MM-YYYY');  
    var templateType = (params.type === 'pdf') ? '.docx' : (params.type === 'excel' ? '.xlsx' : '.docx');
    if(Meteor.isDevelopment){
      var path = require('path');
      var publicPath = path.resolve('.').split('.meteor')[0];
      var templateRoute = publicPath + "public/templates/" + params.templateNombre + templateType;
    }else{
      var publicPath = '/var/www/parroquias/';
      var templateRoute = publicPath + "archivos/" + params.templateNombre + templateType;
    }
		
		var opts = {};
		
		var content = fs.readFileSync(templateRoute, "binary");
    var res = new future();
    var zip = new JSZip(content);
    var doc = new Docxtemplater().loadZip(zip).setOptions({
      nullGetter: function(part) {
        if (!part.module) {
          return "";
        }
        if (part.module === "rawxml") {
          return "";
        }
        return "";
      }
    });
		
    doc.setData(params.datos);
    doc.render();
    var buf = doc.getZip().generate({ type: "nodebuffer" });
    if (params.type == 'pdf') {
      var rutaOutput = publicPath + (Meteor.isDevelopment ? ".outputs/" : "descargas/") + params.reportNombre + moment().format('x') + templateType;
      fs.writeFileSync(rutaOutput, buf);
      unoconv.convert(rutaOutput, 'pdf', function(err, result) {
        if(!err){
          fs.unlink(rutaOutput, (error) => { /* handle error */ });
          res['return']({ uri: 'data:application/pdf;base64,' + result.toString('base64'), nombre: params.reportNombre + '.pdf' });
        }else{
          res['return']({err: err});
        }
      });
    } else {
      var mime;
      if (templateType === '.xlsx') {
        mime = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      } else {
        mime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      }
      res['return']({ uri: 'data:application/' + mime + ';base64,' + buf.toString('base64'), nombre: params.reportNombre + templateType });
    }
    return res.wait()
  },
	
	getExcel: function () {
	  		
	  		var bautismos = Bautismos.find({}).fetch();
	  		
	  		var arreglo = [];
				arreglo.push(["LIBRO", "FOJA", "NO ACTA","Id", "NOMBRE"]);
	  		
	 
	 			_.each(bautismos, function(b){
						arreglo.push([b.libro, b.foja, b.noDeActa, b._id, b.nombreCompleto])
 				})	
	  		
 	  		var fs = require('fs');
 	  		var future = require('fibers/future');
				var ws_name = "SheetJS";
				
				var produccion = "";
				
				if(Meteor.isDevelopment){
					var path = require('path');
					var publicPath = path.resolve('.').split('.meteor')[0];
					produccion = publicPath + "public/templates/";
 
		    }else{
		      produccion = "/var/www/parroquias/archivos/";
		    }

				var wscols = [
					{wch:10},
					{wch:10},
					{wch:10},
					{wch:20},
					{wch:40}
				];
				
				if(typeof require !== 'undefined') 
						XLSX = require('xlsx');
				
				var JSZip = require('jszip');
				
				function Workbook() {
					if(!(this instanceof Workbook)) return new Workbook();
					this.SheetNames = [];
					this.Sheets = {};
				}
				var wb = new Workbook();
				
				function datenum(v, date1904) {
					if(date1904) v+=1462;
					var epoch = Date.parse(v);
					return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
				}
				
				/* convert an array of arrays in JS to a CSF spreadsheet */
				function sheet_from_array_of_arrays(data, opts) {
					var ws = {};
					var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
					for(var R = 0; R != data.length; ++R) {

						for(var C = 0; C != data[R].length; ++C) {
							if(range.s.r > R) range.s.r = R;
							if(range.s.c > C) range.s.c = C;
							if(range.e.r < R) range.e.r = R;
							if(range.e.c < C) range.e.c = C;
							var cell = {v: data[R][C] };
							if(cell.v == null) continue;
							var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
				
							/* TEST: proper cell types and value handling */
							if(typeof cell.v === 'number') cell.t = 'n';
							else if(typeof cell.v === 'boolean') cell.t = 'b';
							else if(cell.v instanceof Date) {
								cell.t = 'n'; cell.z = XLSX.SSF._table[14];
								cell.v = datenum(cell.v);
							}
							else cell.t = 's';
							ws[cell_ref] = cell;
						}
					}
				
					/* TEST: proper range */
					if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
					return ws;
				}
				
				
				var ws = sheet_from_array_of_arrays(arreglo);

				
				/* TEST: add worksheet to workbook */
				wb.SheetNames.push(ws_name);
				wb.Sheets[ws_name] = ws;
				
				/* TEST: column widths */
				ws['!cols'] = wscols;
				
				/* write file */
				XLSX.writeFile(wb, produccion+"sheetjs.xlsx");
								
				
				var res = new future();
		    var bitmap = fs.readFileSync(produccion+"sheetjs.xlsx");
		    res['return']({ uri: 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + bitmap.toString('base64'), nombre: "bautizados" + '.xlsx' });
		    return res.wait();
				
	  		
	},
	
	
});			