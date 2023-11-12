orangeCommonApp.app.directive('rechercheClient', function blocNote($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/rechercheClient.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #recherche-client').html = "";
            $('.com-topnav-alerts #recherche-client').append($('.recherche-client-top-button'));
        }
    };
});
