orangeCommonApp.app.directive('overrideUser', function overrideUser($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/overrideUser.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #overrideuser').html = "";
            $('.com-topnav-alerts #overrideuser').append($('.overrideuser-top-button'));
        }
    };
});
