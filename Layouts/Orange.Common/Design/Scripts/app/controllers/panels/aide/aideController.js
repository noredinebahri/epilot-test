orangeCommonApp.app.controller('aideController', function aideController($scope, $controller, $rootScope, $uibModal, $filter, statistiqueService, moduleApp) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;
    vm.nbNotification = 0;
    vm.tutoriels = [];
    vm.tutorielsVideos = [];
    vm.modesOperatoires = [];

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'aide';
    vm.Panel.Open = false;

    $controller('displayTopController', {
        $scope: vm
    });

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    vm.Panel.Display = function () {
        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;

        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };
        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            statistiqueService.trackEvent("Global - Onglets - Ouverture aide");
        }
    }

    vm.jouerTutoriel = function (tuto) {
        statistiqueService.trackEvent("Global - Aide - Didactitiel", {Tutoriel_Nom: tuto.nom });
        playTuto(tuto);
    }

    vm.jouerTutorielVideo = function (tuto) {
        statistiqueService.trackEvent("Global - Aide - Tutoriel", { Tutoriel_Nom: tuto.nom });
        //Ouverture de la modale video
        var detailModal = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/aide/aide-video.html?version=EPilotCurrentVersion',
            controller: 'aideVideoPopupController',
            controllerAs: 'vm',
            resolve: {
                videoTitre: function () { return tuto.nom; },
                videoUrl: function () { return tuto.url; },
                videoDuree: function () { return tuto.duree; }
            }
        });
    }

    vm.openModeOperatoire = function(item) {
        window.open(item.url,'_blank');
    }

    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // INIT
    // ==========================================
    vm.initializePage = function () {
        if (!tutoriels)
            return;

        tutoriels.forEach(function (tuto) {
            if (hasPattern(tuto)) {
                vm.tutoriels.push(tuto);
            }
        });

        // Tutoriels vidéos
        var tutorielsVideos = [
            //{ ordre: 1, episode: 'Episode 1', nom: 'Tutooc avril', url: '/SiteCollectionDocuments/episode1.mp4', duree: '4min 40s' },
            //{ ordre: 2, episode: 'Episode 2', nom: 'Tutooc juillet', url: '/SiteCollectionDocuments/episode2.mp4', duree: '4min 17s' },
            { ordre: 1, episode: 'Tuto#1', nom: 'Prendre la place de...', url: '/SiteCollectionDocuments/tuto1.mp4', duree: '55s', pattern: 'perfco' },
            { ordre: 2, episode: 'Tuto#2', nom: 'CAP pour les ICS', url: '/SiteCollectionDocuments/tuto2.mp4', duree: '2 min 56s', pattern: 'perfco/_layouts/15/Orange.EPilot/Pages/PlanAction.aspx' },
            { ordre: 3, episode: 'Tuto#3', nom: 'CAP pour les VRC', url: '/SiteCollectionDocuments/tuto3.mp4', duree: '3 min 25s', pattern: 'perfco/_layouts/15/Orange.EPilot/Pages/PlanAction.aspx' },
            { ordre: 4, episode: 'Tuto#4', nom: 'Saisir ses engagements PO', url: '/SiteCollectionDocuments/tuto4.mp4', duree: '1 min 4s', pattern: 'perfco/_layouts/15/Orange.EPilot/Pages/PrevisionSaisie.aspx' },
            { ordre: 5, episode: 'Tuto#5', nom: 'Centre de téléchargement', url: '/SiteCollectionDocuments/tuto5.mp4', duree: '1 min 39s', pattern: 'pvv' },
            { ordre: 6, episode: 'Tuto#6', nom: 'Bloc-notes', url: '/SiteCollectionDocuments/tuto6.mp4', duree: '2 min 05s', pattern: 'perfco' },
            { ordre: 7, episode: 'Tuto#7', nom: 'La nouvelle TPS', url: '/SiteCollectionDocuments/tutoTPS1.mp4', duree: '5 min 26s', pattern: 'tps' }
        ];

        tutorielsVideos.forEach(function (tuto) {
            if (!tuto.pattern) {
                vm.tutorielsVideos.push(tuto);
            } else if (hasPattern(tuto)) {
                vm.tutorielsVideos.push(tuto);
            }
        });

        vm.tutorielsVideos = $filter('orderBy')(vm.tutorielsVideos, 'ordre', true);

        // Modes opératoires
        var modesOperatoires = [
            { order: 1, nom: 'Pôle contrats', url: '/SiteCollectionDocuments/ModOp Epilot PC - 20190415.pptx', date: '17/06/2019', pattern: 'perfco/Pages/PoleContrat.aspx' },
            { order: 2, nom: 'La nouvelle TPS ', url: '/SiteCollectionDocuments/ModeOp_Nouvelle_TPS_Online.pdf', date: '10/07/2019', pattern: 'tps' },
            { order: 3, nom: 'Avant Vente', url: '/SiteCollectionDocuments/ModOpEpilotAVV.pptx', date: '26/02/2020', pattern: 'perfco/Pages/Avv.aspx' },
            { order: 4, nom: 'Avant Vente', url: '/SiteCollectionDocuments/ModOpEpilotAVV_IAV.pptx', date: '26/02/2020', pattern: 'perfco/Pages/AvvIAV.aspx' },
            { order: 5, nom: 'E-conformité', url: '/SiteCollectionDocuments/E-CONFORMITE_V2_Final.pdf', date: '29/04/2020', pattern: 'perfco/Pages/E-conformite.aspx' }

        ];

        modesOperatoires.forEach(function (tuto) {
            if (!tuto.pattern) {
                vm.modesOperatoires.push(tuto);
            } else if (hasPattern(tuto)) {
                vm.modesOperatoires.push(tuto);
            }
        });

        vm.modesOperatoires = $filter('orderBy')(vm.modesOperatoires, 'ordre', true);

        function hasPattern(tuto) {
            return document.URL.toString().toLowerCase().indexOf(tuto.pattern.toLowerCase()) !== -1;
        }
    }

    vm.initializePage();
});