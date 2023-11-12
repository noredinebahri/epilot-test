orangeCommonApp.app.controller('overrideUserController', function overrideUserController($scope, $controller, $rootScope, userService, statistiqueService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'overrideUser';
    vm.Panel.Open = false;

    //CURRENT USER
    vm.CurrentUser = vm.CurrentUser || {};
    vm.CurrentUser.IsAdmin = false;

    //OVERRIDE USER
    vm.OverrideUser = vm.OverrideUser || {};
    vm.OverrideUser.Selected = null;
    vm.OverrideUser.SearchText;


    $controller('displayTopController', {
        $scope: vm
    });

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    vm.initializePage = function () {
        var sessionValue = sessionStorage.getItem('Epilot.OverrideCodeAlliance');
        if (sessionValue) {
            vm.OverrideUser.Selected = JSON.parse(sessionValue);
        }
        vm.CurrentUser.GetUser();
    }

    vm.CurrentUser.GetUser = function () {
        userService.getUser()
            .then(function success(response) {
                if (response.status == 200) {
                    if (response.data) {
                        if (response.data.IsAdmin) {
                            vm.CurrentUser.IsAdmin = true;
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
            statistiqueService.trackEvent("Global - Onglets - Ouverture override");
        }
    }

    vm.OverrideUser.Save = function () {
        sessionStorage.clear();
        vm.Panel.Display();
        sessionStorage.setItem('Epilot.OverrideCodeAlliance', JSON.stringify(vm.OverrideUser.Selected));
        location.reload();
    }

    vm.OverrideUser.Delete = function () {
        vm.OverrideUser.Selected = null;
        sessionStorage.clear();
        vm.Panel.Display();
        location.reload();
    }

    vm.OverrideUser.Search = function (searchInput) {
        if (!searchInput) {
            return [];
        }

        return userService.getAllUsers(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }

    vm.OverrideUser.Select = function (item) {
        vm.OverrideUser.Selected = item;
        vm.OverrideUser.Save();
    }

    // ==========================================
    // INIT
    // ==========================================

    vm.initializePage();
});