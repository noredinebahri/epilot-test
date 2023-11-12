orangeCommonApp.app.directive('exportButton', function exportButton() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-action" ng-click="Boutons.AreActive() && exportToExcel()" ng-disabled="!Boutons.AreActive()">\
                        <a href="#">\
                            <i class="fa fa-download" aria-hidden="true"></i> <p>Exporter</p>\
                        </a>\
                    </div>'
    };
});