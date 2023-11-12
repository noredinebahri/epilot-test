orangeCommonApp.app.directive('blocNote', function blocNote($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/blocNote.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #bloc-note').html = "";
            $('.com-topnav-alerts #bloc-note').append($('.bloc-note-top-button'));
        }
    };
});
