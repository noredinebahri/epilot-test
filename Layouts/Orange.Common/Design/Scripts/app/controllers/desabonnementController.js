orangeCommonApp.app.controller('desabonnementController', function desabonnementController($scope, $controller, $uibModal, $rootScope, userService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;


    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    vm.initializePage = function () {
        userService.desabonnement()
            .then(function success(response) {
                if (response.status == 200) {

                    //alert('OK');
                    $uibModal.open({
                        animation: true,
                        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/infosPopup.html?version=EPilotCurrentVersion',
                        controller: 'infosPopupController',
                        controllerAs: 'vm',
                        resolve: {
                            titleToShow: function titleToShowResolve() { return undefined },
                            textToShow: function textToShowResolve() { return undefined; },
                            htmlToShow: function htmlToShowResolve() {
                                return 'Votre demande a bien été prise en compte. \n Vous ne recevrez plus les newsletters.';
                            }
                        }
                    });
                }
            });
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
