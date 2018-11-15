angular.module("parroquias").run(function ($rootScope, $state, toastr) {
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    switch(error) {
      case "AUTH_REQUIRED":
        $state.go('anon.login');
        break;
      case "FORBIDDEN":
        //$state.go('root.home');
        break;
      case "UNAUTHORIZED":
      	toastr.error("Acceso Denegado");
				toastr.error("No tiene permiso para ver esta opción");
        break;
      default:
        $state.go('internal-client-error');
    }
  });
});

angular.module('parroquias').config(['$injector', function ($injector) {
  var $stateProvider = $injector.get('$stateProvider');
  var $urlRouterProvider = $injector.get('$urlRouterProvider');
  var $locationProvider = $injector.get('$locationProvider');

  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');

  /***************************
   * Anonymous Routes
   ***************************/
  $stateProvider
    .state('anon', {
      url: '',
      abstract: true,
      template: '<ui-view/>'
    })
    .state('anon.login', {
      url: '/login',
      templateUrl: 'client/login/login.ng.html',
      controller: 'LoginCtrl',
      controllerAs: 'lc'
    })
    .state('anon.logout', {
      url: '/logout',
      resolve: {
        'logout': ['$meteor', '$state', 'toastr', function ($meteor, $state, toastr) {
          return $meteor.logout().then(
            function () {
	            toastr.success("Vuelva pronto.");
              $state.go('anon.login');
            },
            function (error) {
              toastr.error(error.reason);
            }
          );
        }]
      }
    });

  /***************************
   * Login Users Routes
   ***************************/
  $stateProvider
    .state('root', {
      url: '',
      abstract: true,
      templateUrl: 'client/layouts/root.ng.html',
      controller: 'RootCtrl as ro',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.home', {
      url: '/',
      templateUrl: 'client/home/home.ng.html',      
      controller: 'HomeCtrl as ho',
      ncyBreadcrumb: {
		    label: "Home"
		  },
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    },
    })
    //******************Super Administrador**********************
    .state('root.diocesis', {
      url: '/diocesis',
      templateUrl: 'client/diocesis/diocesis.html',
      controller: 'DiocesisCtrl as dio',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.zonasPastorales', {
      url: '/zonasPastorales',
      templateUrl: 'client/zonasPastorales/zonasPastorales.html',
      controller: 'ZonasPastoralesCtrl as zp',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.decanatos', {
      url: '/decanatos',
      templateUrl: 'client/decanatos/decanatos.html',
      controller: 'DecanatosCtrl as dec',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.parroquias', {
      url: '/parroquias',
      templateUrl: 'client/parroquias/parroquias.html',
      controller: 'ParroquiasCtrl as par',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.sacerdotes', {
      url: '/sacerdotes',
      templateUrl: 'client/sacerdotes/sacerdotes.html',
      controller: 'SacerdotesCtrl as sac',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.diaconos', {
      url: '/diaconos',
      templateUrl: 'client/diaconos/diaconos.html',
      controller: 'DiaconosCtrl as dia',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.administradores', {
      url: '/administradores',
      templateUrl: 'client/administradores/administradores.html',
      controller: 'AdministradoresCtrl as adm',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.santorales', {
      url: '/santorales',
      templateUrl: 'client/agendas/santorales.html',
      controller: 'SantoralesCtrl as san',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.tiemposLiturgicos', {
      url: '/tiemposLiturgicos',
      templateUrl: 'client/agendas/tiemposLiturgicos.html',
      controller: 'TiemposLiturgicosCtrl as tlit',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.agendaDiocesana', {
      url: '/agendaDiocesana',
      templateUrl: 'client/agendas/agendaDiocesana.html',
      controller: 'AgendaDiocesanaCtrl as aged',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    //******************Parroquia**********************
    .state('root.usuarios', {
      url: '/usuarios',
      templateUrl: 'client/usuarios/usuarios.html',
      controller: 'UsuariosCtrl as usu',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.bautismos', {
      url: '/bautismos',
      templateUrl: 'client/bautismos/bautismosForm.html',
      controller: 'BautismosCtrl as bau',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.editarBautismos', {
      url: '/bautismos/:id',
      templateUrl: 'client/bautismos/bautismosForm.html',
      controller: 'BautismosCtrl as bau',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.bautismosLista', {
      url: '/bautismosLista',
      templateUrl: 'client/bautismos/bautismosLista.html',
      controller: 'BautismosListaCtrl as baul',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.primerasComuniones', {
      url: '/primerasComuniones',
      templateUrl: 'client/primerasComuniones/primerasComunionesForm.html',
      controller: 'PrimerasComunionesCtrl as pcom',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.editarPrimerasComuniones', {
      url: '/primerasComuniones/:id',
      templateUrl: 'client/primerasComuniones/primerasComunionesForm.html',
      controller: 'PrimerasComunionesCtrl as pcom',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.primerasComunionesLista', {
      url: '/primerasComunionesLista',
      templateUrl: 'client/primerasComuniones/primerasComunionesLista.html',
      controller: 'PComunionesListaCtrl as pcoml',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.confirmaciones', {
      url: '/confirmaciones',
      templateUrl: 'client/confirmaciones/confirmacionesForm.html',
      controller: 'ConfirmacionesCtrl as con',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.editarConfirmaciones', {
      url: '/confirmaciones/:id',
      templateUrl: 'client/confirmaciones/confirmacionesForm.html',
      controller: 'ConfirmacionesCtrl as con',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.confirmacionesLista', {
      url: '/confirmacionesLista',
      templateUrl: 'client/confirmaciones/confirmacionesLista.html',
      controller: 'ConfirmacionesListaCtrl as conl',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.matrimonios', {
      url: '/matrimonios',
      templateUrl: 'client/matrimonios/matrimoniosForm.html',
      controller: 'MatrimoniosCtrl as mat',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.editarMatrimonios', {
      url: '/matrimonios/:id',
      templateUrl: 'client/matrimonios/matrimoniosForm.html',
      controller: 'MatrimoniosCtrl as mat',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.matrimoniosLista', {
      url: '/matrimoniosLista',
      templateUrl: 'client/matrimonios/matrimoniosLista.html',
      controller: 'MatrimoniosListaCtrl as matl',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.intensionesMisa', {
      url: '/intensionesMisa',
      templateUrl: 'client/intensionesMisa/intensionesMisa.html',
      controller: 'IntensionesMisaCtrl as intM',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('anon.cobroTicket', {
      url: '/cobroTicket/:cobro_id',
      templateUrl: 'client/cobroTicket/cobroTicket.html',
      controller: 'CobroTicketCtrl as ctick',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.agenda', {
      url: '/agenda',
      templateUrl: 'client/agenda/agenda.html',
      controller: 'AgendaCtrl as age',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.cobroEstipendio', {
      url: '/cobroEstipendio',
      templateUrl: 'client/cobroEstipendio/cobroEstipendio.html',
      controller: 'CobroEstipendioCtrl as cest',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    //******************Economia**********************
    .state('root.egresos', {
      url: '/egresos',
      templateUrl: 'client/egresos/egresos.html',
      controller: 'EgresosCtrl as egre',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.egresosDetalle', {
      url: '/egresosDetalle',
      templateUrl: 'client/egresosDetalle/egresosDetalle.html',
      controller: 'EgresosDetalleCtrl as egred',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.registroEgreso', {
      url: '/registroEgreso',
      templateUrl: 'client/egresos/registroEgreso.html',
      controller: 'RegistroEgresoCtrl as regre',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.estipendios', {
      url: '/estipendios',
      templateUrl: 'client/estipendios/estipendios.html',
      controller: 'EstipendiosCtrl as est',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.apoyoParroquia', {
      url: '/apoyoParroquia',
      templateUrl: 'client/apoyoParroquia/apoyoParroquia.html',
      controller: 'ApoyoParroquiaCtrl as apo',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    //************************************************
    .state('root.importarBautizados', {
      url: '/importarBautizados',
      templateUrl: 'client/importaciones/bautizados.html',
      controller: 'ImportarBautizadosCtrl as ibau',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.importarConfirmados', {
      url: '/importarConfirmados',
      templateUrl: 'client/importaciones/confirmados.html',
      controller: 'ImportarConfirmadosCtrl as icon',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.importarPrimerasComuniones', {
      url: '/importarPrimerasComuniones',
      templateUrl: 'client/importaciones/primerasComuniones.html',
      controller: 'ImportarPrimerasComunionesCtrl as ipcom',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.importarMatrimonios', {
      url: '/importarMatrimonios',
      templateUrl: 'client/importaciones/matrimonios.html',
      controller: 'ImportarMatrimoniosCtrl as imat',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    .state('root.importarNotasMarginales', {
      url: '/importarNotasMarginales',
      templateUrl: 'client/importaciones/notasMarginales.html',
      controller: 'ImportarNotasMarginalesCtrl as inmar',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    //************************************************
    .state('root.cobranza', {
      url: '/cobranza',
      templateUrl: 'client/reportes/cobranza.html',
      controller: 'CobranzaCtrl as cob',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    //************************************************
    .state('root.cartaInexistencia', {
      url: '/cartaInexistencia',
      templateUrl: 'client/tramites/cartaInexistencia.html',
      controller: 'CartaInexistenciaCtrl as cine',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
    //************************************************
    .state('root.notificaciones', {
      url: '/notificaciones',
      templateUrl: 'client/notificaciones/notificaciones.html',
      controller: 'NotificacionesCtrl as not',
      resolve: {
	      "currentUser": ["$meteor", function($meteor){
	        return $meteor.requireUser();
	      }]
	    }
    })
}]);     


function irArriba(){
	$("html, body").animate({ scrollTop: 0 }, "slow");
}
