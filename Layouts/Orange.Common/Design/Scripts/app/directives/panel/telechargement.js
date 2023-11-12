orangeCommonApp.app.directive('telechargement', function telechargement($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/telechargement.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #telechargement').html = "";
            $('.com-topnav-alerts #telechargement').append($('.telechargement-top-button'));
        }
    };
});
