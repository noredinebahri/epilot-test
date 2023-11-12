orangeCommonApp.app.controller('homeController', function homeController($scope, $controller, $rootScope, moduleApp, homeService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    $scope.moduleId;
    $scope.homePage;
    $scope.message = 'Redirection en cours de chargement...';

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    $scope.initializePage = function (id) {

        //Recupération de la page d'accueil de l'utilisateur
        homeService.getByModule(id).then(function (result) {
            $scope.homePage = result.data.PageUrl;

            if ($scope.homePage != null & $scope.homePage != 'undefined') {
                //Redirection vers la page d'accueil de l'utilisateur
                window.location.replace($scope.homePage);
            }
            else {
                $scope.message = 'Aucune redirection configurée. Séléectionner un menu sur la gauche.';
            }

        });


    }
    
});