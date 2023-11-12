orangeCommonApp.app.directive('importButton', function importButton() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-action" ng-disabled="!Page.IsEditable() || !Boutons.Import.IsActive() || !Boutons.AreActive()" ng-click="Page.IsEditable() && Boutons.Import.IsActive() && Boutons.AreActive() && ImportPopup.Open()">\
                        <a href="#">  \
                            <i class="fa fa-upload" aria-hidden="true"></i>\<p>{{Boutons.Import.Name}}</p>\
                        </a>\
                    </div>'
    };
});