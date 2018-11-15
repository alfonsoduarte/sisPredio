
angular.module("parroquias")
.controller("BautismosCtrl", BautismosCtrl);
 function BautismosCtrl($scope, $meteor, $reactive, $state, toastr, $stateParams){
 	
 	let rc = $reactive(this).attach($scope);
 	window.rc = rc;
 	
  rc.action 		 		= true;
  rc.actionArreglo 	= true;
  
  rc.nuevo = true;	 
  rc.objeto = {};
  rc.notaMarginal = {};
  rc.objeto.notasMarginales = [];
	rc.estatus = true;
	
	rc.notasMarginales = [];
	rc.num = 0;
	
  //rc.objeto.tipoSacerdote = "PARROQUIA";
  rc.sacerdotes = [];
  
   
  $(".js-example-basic-single").select2();
  
  
  //Condición del Parametro
  if($stateParams.id != undefined){
	  	
	  	//console.log($stateParams.id)
	  	rc.action = false;
      this.subscribe('bautismos', () => {
        return [{
          	_id : $stateParams.id
        }];
      });
  }
  
  //Sacerdotes
	this.subscribe('usuarios',()=>{
		var usuario = Meteor.users.findOne(Meteor.userId());
		return [{ "profile.estatus"			: true,
						 	roles									: {$in: ["Sacerdote", "Diacono"]}
						}]
	});
	
	
	 
	this.helpers({
 	  objeto : () => {
		  	var bautizado = Bautismos.findOne($stateParams.id);
		  	
		  	if (bautizado != undefined)
		  	{		
			  	
			  		var user = Meteor.users.findOne(Meteor.userId());
 			
						if (bautizado.tipoSacerdote == "PARROQUIA")
						{
								if (bautizado.tipo == undefined || bautizado.tipo == 'SACERDOTE')
								{
					 				 rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
					 				 bautizado.tipo = "SACERDOTE";
					 			}	 
					 			else
					 			   rc.diaconos = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Diacono"]}, {sort:{"profile.nombreCompleto":1}}).fetch();	 
					 				 
						}
						else if (bautizado.tipoSacerdote == "DIOCESIS")
						{
								if (bautizado.tipo == undefined || bautizado.tipo == 'SACERDOTE')
								{
										rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
										bautizado.tipo = "SACERDOTE";
								}		
								else
										rc.diaconos = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Diacono"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
 						}
 						else if(bautizado.tipoSacerdote == "IMPORTADO")
 								bautizado.tipo = "SACERDOTE";
 						
 						
 						if (bautizado.tipoSacerdoteParroco != undefined)
 						{
	 							if (bautizado.tipoSacerdoteParroco == "PARROQUIA")
								{
										rc.sacerdotesConstancia = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
								}	
 						}
 						else
 						{
	 							bautizado.tipoSacerdoteParroco = "OTRO";
 						}
 						
			  		
			  		if (bautizado.estatus == "bautizado")
			  		{
				  			rc.estatus = false;
				  		
			  		}
			  		else if (bautizado.estatus == "enTramite")
						{
								rc.estatus = true;
						}	
 						if (bautizado.notasMarginales == undefined)
								rc.notasMarginales = [];
						else
								rc.notasMarginales = bautizado.notasMarginales;
 			  		
			  		return bautizado;		
		  	}
		  	
	  },
  });

  this.guardar = function(objeto,form)
	{
		
			if (form.$invalid){
		     toastr.error('Error al guardar los datos.');
		     return;
		  }
			
			
			objeto.apellidoPaterno = objeto.apellidoPaterno == undefined ? "" : objeto.apellidoPaterno;
			objeto.apellidoMaterno = objeto.apellidoMaterno == undefined ? "" : objeto.apellidoMaterno;
			objeto.padre					 = objeto.padre == undefined ? "" : objeto.padre;
			objeto.madre					 = objeto.madre == undefined ? "" : objeto.madre;
			
			objeto.usuario_id = Meteor.userId();
			
			if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno == "")
				objeto.nombreCompleto = objeto.nombre;
			else if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno != "")
				objeto.nombreCompleto = objeto.apellidoMaterno + " " + objeto.nombre; 	 
			else if (objeto.apellidoPaterno != "" && objeto.apellidoMaterno == "")	
				objeto.nombreCompleto = objeto.apellidoPaterno + " " + objeto.nombre; 
			else
				objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
  			
			var user = Meteor.users.findOne({_id:  Meteor.userId()});
			objeto.parroquia_id 		= user.profile.parroquia_id;
			objeto.fechaCreacion	= new Date(); 	 
			 			
			if (rc.objeto.tipoSacerdote == "PARROQUIA" || rc.objeto.tipoSacerdote == "DIOCESIS"){
					var sacerdote = Meteor.users.findOne(objeto.sacerdote_id);
  			  objeto.sacerdoteNombre 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
 			}
			else
			{
 					objeto.sacerdote_id			= "";
 			}
 			
 			if (objeto.estatus == 'bautizado')
 			{
	 				if (rc.objeto.tipoSacerdoteParroco == "PARROQUIA"){
							var sacerdoteParroco = Meteor.users.findOne(objeto.sacerdoteParroco_id);
		  			  objeto.parroco		 	 = sacerdoteParroco.profile.titulo + " " + sacerdoteParroco.profile.nombreCompleto;
		 			}
					else
					{
		 					objeto.sacerdoteParroco_id			= "";
		 			}	
 			}
 			
 			objeto.fecha.setHours(14,0,0,0);
 			objeto.fechaNacimiento.setHours(14,0,0,0);
 			
 			objeto.notasMarginales = rc.notasMarginales;
			
			_.each(objeto.notasMarginales, function(nota){
 					delete nota.$$hashKey;
 			})
 			
			loading(true);
			Meteor.call ("setServicios", objeto, "Bautismo", function(error,result){
	
				if (error){
					 console.log(error);
					 toastr.error('Error al guardar los datos.: ', error.details);
					 
					 return;
				}
				if (result)
				{
				 		rc.objeto = {};
				 		toastr.success('Guardado correctamente.');
				 		$state.go('root.bautismosLista'); 
 				}
			});
			loading(false);
	};
	
	this.actualizar = function(objeto,form)
	{
			if(form.$invalid){
		        toastr.error('Error al actualizar los datos.');
		        return;
		  }
		  
		  objeto.apellidoPaterno = objeto.apellidoPaterno == undefined ? "" : objeto.apellidoPaterno;
			objeto.apellidoMaterno = objeto.apellidoMaterno == undefined ? "" : objeto.apellidoMaterno;
			objeto.padre					 = objeto.padre == undefined ? "" : objeto.padre;
			objeto.madre					 = objeto.madre == undefined ? "" : objeto.madre;
		  
		  if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno == "")
				objeto.nombreCompleto = objeto.nombre;
			else if (objeto.apellidoPaterno == "" && objeto.apellidoMaterno != "")
				objeto.nombreCompleto = objeto.apellidoMaterno + " " + objeto.nombre; 	 
			else if (objeto.apellidoPaterno != "" && objeto.apellidoMaterno == "")	
				objeto.nombreCompleto = objeto.apellidoPaterno + " " + objeto.nombre; 
			else
				objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
		  
		  objeto.usuario_id = Meteor.userId();
		  //objeto.nombreCompleto = objeto.apellidoPaterno + (objeto.apellidoMaterno == "" ? "": " " + objeto.apellidoMaterno) + " " + objeto.nombre;
  		  
		  if (rc.objeto.tipoSacerdote == "PARROQUIA" || rc.objeto.tipoSacerdote == "DIOCESIS"){
					var sacerdote = Meteor.users.findOne(objeto.sacerdote_id);
  			  objeto.sacerdoteNombre 	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
 			}
			else
			{
 					objeto.sacerdote_id			= "";
 			}
 			
 			if (objeto.estatus == 'bautizado')
 			{
	 				if (rc.objeto.tipoSacerdoteParroco == "PARROQUIA"){
							var sacerdoteParroco = Meteor.users.findOne(objeto.sacerdoteParroco_id);
		  			  objeto.parroco		 	 = sacerdoteParroco.profile.titulo + " " + sacerdoteParroco.profile.nombreCompleto;
		 			}
					else
					{
		 					objeto.sacerdoteParroco_id			= "";
		 			}	
 			}
 			
 			objeto.fecha.setHours(14,0,0,0);
 			objeto.fechaNacimiento.setHours(14,0,0,0);
		  
		  objeto.notasMarginales = rc.notasMarginales;
			
			_.each(objeto.notasMarginales, function(nota){
 					delete nota.$$hashKey;
 			})
 
 		  objeto.fechaActualizacion	= new Date();
			var idTemp = objeto._id;
			delete objeto._id;		
			objeto.usuarioActualizo = Meteor.userId(); 
			Bautismos.update({_id:idTemp},{$set : objeto});
			toastr.success('Actualizado correctamente.');
			$state.go('root.bautismosLista');
			
	};
	//-----------------------------------------------------------//
 	
	this.agregar = function(objeto)
	{
  		if (objeto.tipoNota == undefined)
			{ 
					toastr.warning('Seleccione el Tipo de Nota.');
					return;
			}
			if (objeto.fecha == undefined)
			{ 
					toastr.warning('Seleccione la Fecha Nota Marginal.');
					return;
			}
			if (objeto.nota == undefined)
			{ 
					toastr.warning('Escbriba la Nota.');
					return;
			}
			if (objeto.lugar == undefined)
			{ 
					toastr.warning('Escbriba el Lugar.');
					return;
			}
			
			
			objeto.fecha.setHours(14,0,0,0);
			
   		rc.num +=1;
 			objeto.numero = rc.num;
 			rc.notasMarginales.push(objeto);
 			
 			rc.notaMarginal = {}; 
 
 	}	  
	
	this.quitar = function(numero)
	{
			pos = functiontofindIndexByKeyValue(rc.notasMarginales, "numero", numero);
      rc.notasMarginales.splice(pos, 1);
      if (rc.notasMarginales.length == 0) rc.num = 0;
      //reorganiza el consecutivo     
      functiontoOrginiceNum(rc.notasMarginales, "numero");
       
	   
	}
	
	this.editar = function(objeto)
	{
      rc.notaMarginal.tipoNota		 		= objeto.tipoNota;
      rc.notaMarginal.fecha 					= objeto.fecha;
      rc.notaMarginal.nota					  = objeto.nota;
      rc.notaMarginal.lugar					 	= objeto.lugar; 
      rc.notaMarginal.numero					= objeto.numero;
 			
      rc.actionArreglo = false;
	}
	
	this.actualizarNotaMarginal = function(objeto)
	{
 			if (objeto.tipoNota == undefined)
			{ 
					toastr.warning('Seleccione el Tipo de Nota.');
					return;
			}
			if (objeto.fecha == undefined)
			{ 
					toastr.warning('Seleccione la Fecha Nota Marginal.');
					return;
			}
			if (objeto.nota == undefined)
			{ 
					toastr.warning('Escbriba la Nota.');
					return;
			}
			if (objeto.lugar == undefined)
			{ 
					toastr.warning('Escbriba el Lugar.');
					return;
			}
 			
 			objeto.fecha.setHours(14,0,0,0);
 				
  			//objeto.numero = rc.num;
      _.each(rc.notasMarginales, function(nota){
	      	
              if (nota.numero == objeto.numero)
              {
                  nota.tipoNota	 = objeto.tipoNota;
						      nota.fecha 		 = objeto.fecha;
						      nota.nota			 = objeto.nota;
						      nota.lugar		 = objeto.lugar;
						      nota.numero		 = objeto.numero;
              }
   
      });
      
      rc.notaMarginal = {};
      //rc.num = 0;
      rc.actionArreglo = true;
  
	}
	
	this.cancelarNotaMarginal = function()
	{
			rc.notaMarginal 	= {};
      rc.num 						= -1;
      rc.actionArreglo 	= true;
 	}
 	
	
	//busca un elemento en el arreglo
  function functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
      for (var i = 0; i < arraytosearch.length; i++) {
        if (arraytosearch[i][key] == valuetosearch) {
        return i;
      }
      
    }
      return null;
  };
    
    //Obtener el mayor
  function functiontoOrginiceNum(arraytosearch, key) {
    var mayor = 0;
      for (var i = 0; i < arraytosearch.length; i++) {
        arraytosearch[i][key] = i + 1;  
      }
  };
	
	//-----------------------------------------------------------//
 	
	this.cambiarEstatus = function()
	{
			if (rc.objeto.estatus == "bautizado")
			{
				 	rc.estatus = false;
			}
			else if (rc.objeto.estatus == "enTramite")
			{
					rc.estatus = true;
					rc.objeto.libro = 0;
					rc.objeto.foja = 0;
					rc.objeto.noDeActa = 0;
			
			}		
	};

	
	this.cargarSacerdotes = function()
	{
 			var user = Meteor.users.findOne(Meteor.userId());
 			
			if (rc.objeto.tipoSacerdote == "PARROQUIA")
			{
					rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
					rc.diaconos = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Diacono"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
			}
			else if (rc.objeto.tipoSacerdote == "DIOCESIS")
			{
					rc.sacerdotes = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
					rc.diaconos = Meteor.users.find({"profile.parroquia_id": {$ne: user.profile.parroquia_id},roles: ["Diacono"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
 			}		
	};
		
	this.cargarSacerdotesParroquia = function()
	{
 			var user = Meteor.users.findOne(Meteor.userId());
			
			rc.sacerdotesConstancia = Meteor.users.find({"profile.parroquia_id": user.profile.parroquia_id, roles: ["Sacerdote"]}, {sort:{"profile.nombreCompleto":1}}).fetch();
		
	};
	
	this.seleccionaSacerdotesParroquia = function()
	{
			 
			var sacerdoteParroco = Meteor.users.findOne(rc.objeto.sacerdoteParroco_id);
 			if (sacerdoteParroco != undefined)
		  		rc.objeto.parroco		 	 = sacerdoteParroco.profile.titulo + " " + sacerdoteParroco.profile.nombreCompleto;
	};
   
	this.seleccionaSacerdotesAsistio = function()
	{
			var sacerdote = Meteor.users.findOne(rc.objeto.sacerdote_id);
 			if (sacerdote != undefined)
		  		rc.objeto.sacerdoteNombre	= sacerdote.profile.titulo + " " + sacerdote.profile.nombreCompleto;
	};
   
};