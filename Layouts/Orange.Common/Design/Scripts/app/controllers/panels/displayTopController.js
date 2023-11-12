orangeCommonApp.app.controller('displayTopController', function displayTopController($scope, $rootScope, moduleApp) {

    // ==========================================
    // VARIABLES
    // ==========================================

    $scope.Panel = $scope.Panel || {};
    $scope.Panel.SessionStorageKey = "EPilot.Common.Panel.Selected";

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    $scope.Panel.Change = function (item) {
        if (!item) {
            item = $scope.Panel.GetDefaultPanel();
        } else {
            // On sauvegarde le dernier element selectionnée
            // Pour le rafraichissement rafraichissement => panel fermé
            let temp = angular.copy(item);
            temp.statut = false;
            sessionStorage.setItem($scope.Panel.SessionStorageKey, JSON.stringify(temp));
        }

        $scope.panelCurrent = item.panel;
        $scope.panelOpen = item.statut;
    }

    $scope.Panel.GetDefaultPanel = function () {
        var lastSelectedPanel = sessionStorage.getItem($scope.Panel.SessionStorageKey);

        if (!lastSelectedPanel) {
            return { panel: 'notification', statut: false }
        }

        // Cas hierarchie sur des modules n'ayant pas hierarchie
        if (lastSelectedPanel.panel == 'hierarchie' && moduleApp != 1 && moduleApp != 2) {
            return { panel: 'notification', statut: false }
        } else if (lastSelectedPanel) {
            var item = JSON.parse(lastSelectedPanel);
            item.statut = false; // On le ferme à l'ouverture de la page
            return item;
        }
    }

    $scope.Panel.AutoClose = function () {
        $scope.Panel.Open = false;
        $scope.panelOpen = false;
        $rootScope.$apply();
    }

    // ==========================================
    // WATCH
    // ==========================================

    $rootScope.$watch(
        function displayTopWatchExpression() {
            return $rootScope.topPanel;
        },
        function navigationActorListener(newValue, oldValue) {
            $scope.Panel.Change(newValue);
        }, true);

    $rootScope.$watch(
        function () {
            return document.getElementsByClassName('hierarchie-top-button');
        },
        function (newValue) {
            if (newValue.length == 0) {
                $(".button-topnav#hierarchie").css("display", "none");
            } else {
                $(".button-topnav#hierarchie").css("display", "inline-block");
            }
        });

    $rootScope.$watch(
        function () {
            return document.getElementsByClassName('bloc-note-top-button');
        },
        function (newValue) {
            if (newValue.length == 0) {
                $(".button-topnav#bloc-note").css("display", "none");
            } else {
                $(".button-topnav#bloc-note").css("display", "inline-block");
            }
        });


    $("#page-body").on("click", function () {
        $scope.Panel.AutoClose();
    });

    $("#suiteBarLeft").on("click", function () {
        $scope.Panel.AutoClose();
    });

    $("#overlay-iframe").on("click", function () {
        $scope.Panel.AutoClose();
    });

});