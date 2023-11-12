orangeCommonApp.app.directive('notification', function notification($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/notification.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #notification').html = "";
            $('.com-topnav-alerts #notification').append($('.notification-top-button'));
        }
    };
});
