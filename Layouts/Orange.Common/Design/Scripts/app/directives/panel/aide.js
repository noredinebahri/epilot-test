orangeCommonApp.app.directive('aide', function aide($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/aide.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #aide').html = "";
            $('.com-topnav-alerts #aide').append($('.aide-top-button'));
        }
    };
});
