orangeCommonApp.app.controller('notificationCommonController', function notificationCommonController($scope, $uibModal, $controller, $rootScope, moduleApp, statistiqueService, notificationCommonService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.nbNotification = 0;
    vm.notifications = [];

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'notification';
    vm.Panel.Open = false;

    $controller('displayTopController', {
        $scope: vm
    });

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    vm.initializePage = function () {
        notificationCommonService.count(moduleApp)
            .then(function getAllSuccess(result) {
                vm.nbNotification = result.data;
            });

        notificationCommonService.getAllPopupNotificationActives().then(function getAllSuccess(result) {
            for (var i = 0; i < result.data.length; i++) {

                $uibModal.open({
                    animation: true,
                    templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/notificationPopup.html?version=EPilotCurrentVersion',
                    controller: 'notificationCommonPopupController',
                    controllerAs: 'vm',
                    resolve: {
                        item: function item() { return result.data[i]; }
                    }
                });
            }
        });
    }

    
    vm.Panel.Display = function () {

        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;
        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };

        vm.Panel.Open = !vm.Panel.Open;

        if (vm.notifications.length != 0)
            return;

        if (vm.Panel.Open) {
            notificationCommonService.getAllActives(moduleApp).then(function getAllSuccess(result) {
                vm.notifications = result.data;
                vm.nbNotification = 0;
            });

            statistiqueService.trackEvent("Global - Onglets - Ouverture notification");
        }
        
    }

    vm.enSavoirPlus = function(index) {
        vm.notifications.forEach(function (item) {
            item.Limite = 70;
        });
        vm.notifications[index].Lu = true;
        vm.notifications[index].Limite = 300;
    }

    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // INIT
    // ==========================================
    vm.initializePage();
});