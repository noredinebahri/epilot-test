orangeCommonApp.app.controller('rechercheClientController', function rechercheClientController($scope, $controller,
    $rootScope, moduleApp, statistiqueService, rechercheClientService, userService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'recherche-client';
    vm.Panel.Open = false;

    $controller('displayTopController', {
        $scope: vm
    });

    vm.siren, vm._siren, vm.selectedActeur, vm.selectedProduit, vm.selectedClient;
    vm.niveau = '';
    vm.domaines = [];
    vm.canAccess = false;
    vm.isCapa = false;
    vm.isClientNew = false;
    vm.idCapa;

    vm.acteur = {};
    vm.produit = {};
    vm.client = {};
    vm.isClient = true;
    vm.isActeur = false;
    vm.isProduit = false;
    vm.isVendeur = false;
    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    vm.toggleBtn = function(type) {
        if (type == 1) {
            vm.isClient = true;
            vm.isActeur = false;
            vm.isProduit = false;
        }
        if (type == 2) {
            vm.isClient = false;
            vm.isActeur = true;
            vm.isProduit = false;
        }
        if (type == 3) {
            vm.isClient = false;
            vm.isActeur = false;
            vm.isProduit = true;
        }
    }
    vm.initializePage = function () {
        userService.getUser()
            .then(function success(response) {
                if (response.status == 200) {
                    if (response.data) {
                        if (response.data.PopulationCode == 'IC' ||
                            response.data.PopulationCode == 'RCT' ||
                            response.data.PopulationCode == 'AM' ||
                            response.data.PopulationCode == 'AUTRES-VENDEURS' ||
                            response.data.PopulationCode == 'ICS') {
                            vm.isVendeur = true;
                        } else {
                            vm.isVendeur = false;
                        }
                        var restrictedAccess = $('#PropertyFicheClientRestrictedAccess').text().split(';').filter(Boolean);
                        if (restrictedAccess.indexOf(response.data.PopulationCode) == -1) {
                            //vm.canAccess = true;
                            $('#recherche-client').show();
                        } else {
                            //vm.canAccess = false;
                            $('#recherche-client').hide();
                        }
                    }

                }
            });
    }

    
    vm.Panel.Display = function () {

        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;
        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };

        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            //notificationCommonService.getAllActives(moduleApp).then(function getAllSuccess(result) {
            //    vm.notifications = result.data;
            //    vm.nbNotification = 0;
            //});

            statistiqueService.trackEvent("Global - Onglets - Ouverture recherche client");
        }
        
    }

    // ==========================================
    // Client
    // ==========================================
    vm.onSelect = function ($item, $model, $label) {
        vm.client = $item;
        vm.niveau = $item.Niveau;
        vm.isClientNew = $item.IsClientNew;
        vm.isCapa = $item.IsClientCapa;
        vm.idCapa = $item.IdClientCapa;
        vm._siren = $item.Siren;
        if (vm.isCapa) {
            sessionStorage.setItem('Epilot.RechercheClientCapaId', JSON.stringify($item.IdClientCapa));
        }
        if (vm.isClientNew) {
            sessionStorage.setItem('Epilot.RechercheClientCodeClientSommet', JSON.stringify($item.CodeClient));
        }
        rechercheClientService.getDomaines($item.Siren, vm.niveau)
           .then(function success(response) {
               if (response.status == 200) {
                   vm.domaines = response.data;
                   if (response.data.length > 0) {
                       vm.parcNotExist = false;
                   } else {
                       vm.parcNotExist = true;
                   }
               }
           });
    };

    vm.export = function(id) {
        console.log(id);
        var exportUrl = epilotproperties.getWebServiceUrl() + "/RechercheClient/ExportParc/"
            + vm._siren + "/" + vm.niveau + "/" + id;
        window.open(exportUrl, '_blank');
    }

    vm.searchClient = function(searchInput) {
        if (!searchInput) {
            return [];
        }
        if (vm.isGroupe) {
            vm.niveau = 'G';
        } else {
            vm.niveau = 'E';
        }
        return rechercheClientService.getClients(vm.niveau, searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }

    vm.openCaParc = function () {
        if (vm.isCapa) {
            var url = window.location.protocol +
                "//" +
                window.location.host +
                "/" +
                "perfco/_layouts/15/Orange.EPilot/Pages/RechercheClientCaParc.aspx";
            window.open(url, '_blank');
        }
    }

    vm.openFicheClient = function () {
        if (vm.isClientNew) {
            var url = window.location.protocol +
                "//" +
                window.location.host +
                "/" +
                "perfco/_layouts/15/Orange.EPilot/Pages/RechercheClient.aspx" ;
            window.open(url, '_blank');
        }
    }

    vm.onChange = function() {
        vm.domaines = [];
        vm.isCapa = false;
        vm.parcNotExist = false;
    }

    vm.openPmdLink = function () {
        statistiqueService.trackEvent("Global - Onglets - Ouverture lien PMD");
        var codeClient = JSON.parse(sessionStorage.getItem("Epilot.RechercheClientCodeClientSommet"));
        if (codeClient.startsWith('E')) {
            var url = $('#PropertyPmdReportUrl').text() + "&filter=VM_TIERS%2fENTRPRS_ID%20eq '" + codeClient.substring(1) + "'";
            window.open(url, '_blank');
        }
        if (codeClient.startsWith('G')) {
            var url = $('#PropertyPmdReportUrl').text() + "&filter=VM_TIERS%2fGROUPE_ID%20eq '" + codeClient.substring(1) + "'";
            window.open(url, '_blank');
        }
    }

    // ==========================================
    // Acteur
    // ==========================================
    vm.onSelectActeur = function ($item, $model, $label) {
        vm.acteur = $item;
        sessionStorage.setItem('Epilot.RechercheActeurCodeAlliance', JSON.stringify($item.CodeActeur));
    };

    vm.searchActeur = function (searchInput) {
        if (!searchInput) {
            return [];
        }
        return rechercheClientService.getActeurs(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }
    vm.openFicheActeur = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/RechercheActeur.aspx";
        window.open(url, '_blank');
    }

    vm.openBenchClient = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/BenchClient.aspx";
        window.open(url, '_blank');
    }

    vm.openBenchVendeur = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/BenchVendeur.aspx";
        window.open(url, '_blank');
    }
    vm.onChangeActeur = function () {

    }

    // ==========================================
    // Produit
    // ==========================================
    vm.onSelectProduit = function ($item, $model, $label) {
        vm.produit = $item; 
        sessionStorage.setItem('Epilot.RechercheProduitCode', JSON.stringify($item.CodeProduit));
    };

    vm.searchProduit = function (searchInput) {
        if (!searchInput) {
            return [];
        }
        return rechercheClientService.getProduits(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }
    vm.openFicheProduit = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/RechercheProduit.aspx";
        window.open(url, '_blank');
    }
    vm.onChangeProduit = function () {

    }

    // ==========================================
    // INIT
    // ==========================================
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };


    vm.initializePage();
});