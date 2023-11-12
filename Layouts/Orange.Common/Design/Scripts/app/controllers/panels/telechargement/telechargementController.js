orangeCommonApp.app.controller('telechargementController', function telechargementController($scope, $controller, $rootScope, $uibModal, statistiqueService, telechargementService, $cookies) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'telechargement';
    vm.Panel.Open = false;

    //Filtres
    vm.Filtres = vm.Filtres || {};

    //Telechargements
    vm.telechargements = [];

    //Timer
    vm.timer = 120000;

    $controller('displayTopController', {
        $scope: vm
    });


    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    //Panel
    vm.Panel.Display = function () {
        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;

        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };
        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            statistiqueService.trackEvent("Global - Onglets - Ouverture telechargement");
        }
    }

    vm.openTelechargement = function (item) {
        if (item.StatusId == 2) {
            if (item.FichierUrl) {
                statistiqueService.trackEvent("Global - Telechargement - Ouverture fichier");
                window.open(item.FichierUrl, "_blank");
            }
            else {
                statistiqueService.trackEvent("Global - Telechargement - Fichier introuvable");
                alert('Le fichier est introuvable');
            }
        }
        else {
            if (confirm("Une erreur est survenue lors de la génération du fichier. \r\nVoulez-vous le recharger ?")) {
                // Rechargement du fichier
                statistiqueService.trackEvent("Global - Telechargement - Regeneration fichier");
                telechargementService.updateStatus(item.Id, 1).then(function sucess(result) {
                    vm.initializePage();
                });
            }
        }
    }

    vm.getTelechargements = function () {
        telechargementService.get().then(function sucess(result) {
            vm.telechargements = result;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }

    vm.delete = function (item, modal) {
        if (modal) {
            var confirmModalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/confirmPopup.html?version=EPilotCurrentVersion',
                controller: 'confirmPopupController',
                controllerAs: 'vm',
                resolve: {
                    titleToShow: function titleToShowResolve() { return undefined; },
                    textToShow: function textToShowResolve() { return undefined; },
                    htmlToShow: function htmlToShowResolve() {
                        return "Vous allez supprimer un téléchargement en cours?";
                    }
                }
            });
            confirmModalInstance.result.then(function () {
                telechargementService.updateStatus(item.Id, 4).then(function sucess(result) {
                    vm.initializePage();
                });
            });
        } else {
            telechargementService.updateStatus(item.Id, 4).then(function sucess(result) {
                vm.initializePage();
            });
        }

    }

    //Filtres

    vm.Filtres.StatusEnAttente = function (item) {
        return item.StatusId == 1 && item.IsStarted == false;
    }

    vm.Filtres.StatusEnCours = function (item) {
        return item.StatusId == 1 && item.IsStarted == true;
    }

    vm.Filtres.StatusDisponible = function (item) {
        return (item.StatusId == 2 || item.StatusId == 3);
    }

    //Scrollbar
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // INIT
    // ==========================================

    setInterval(function () {
        if ($cookies.get("EPilot.Telechargement.Update") &&
            ($cookies.get("EPilot.Telechargement.Update") == true || $cookies.get("EPilot.Telechargement.Update") == "true")) {
            vm.initializePage();
            $cookies.put("EPilot.Telechargement.Update", false, { path: '/' });
            if (!vm.Panel.Open)
                $('.telechargement-top-button').click();
        }
    },
    2000);

    setInterval(
    function () {
        telechargementService.refresh().then(function sucess(result) {
            if (result.refreshLocalStorage &&
                (!$cookies.get('Epilot.LocalStorage.Refresh') || $cookies.get('Epilot.LocalStorage.Refresh') != moment().format('DD-MM-YYYY'))) {
    
                //window.sessionStorage.clear();
                //var expireDate = new Date();
                //expireDate.setDate(expireDate.getDate() + 2);
                //$cookies.put('Epilot.LocalStorage.Refresh', moment().format('DD-MM-YYYY'), { path: '/', expires: expireDate });
                //window.location.reload();
                //console.log("refresh");
            }
            loop1:
                for (var i = 0; i < vm.telechargements.length; i++) {
                    for (var j = 0; j < result.telechargements.length; j++) {
    
                        if (vm.telechargements[i].Id === result.telechargements[j].Id &&
                        vm.telechargements[i].StatusId != result.telechargements[j].StatusId &&
                        (result.telechargements[j].StatusId == 2 || result.telechargements[j].StatusId == 3)) {
                            $uibModal.open({
                                animation: true,
                                templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/infosPopup.html?version=EPilotCurrentVersion',
                                controller: 'infosPopupController',
                                controllerAs: 'vm',
                                resolve: {
                                    titleToShow: function titleToShowResolve() { return undefined },
                                    textToShow: function textToShowResolve() { return undefined; },
                                    htmlToShow: function htmlToShowResolve() {
                                        return 'Un ou plusieurs téléchargements sont disponibles';
                                    }
                                }
                            });
                            break loop1;
                        }
                    }
                }
            vm.telechargements = result.telechargements;
            $scope.$apply();
           // vm.initializePage();
        }, function error(err) {
            console.log(err);
        });
    },
    vm.timer);

    vm.initializePage = function () {

        vm.getTelechargements();
    }


    vm.initializePage();

});