orangeCommonApp.app.directive('addButton', function addButton() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-action" ng-disabled="!Page.IsEditable()" ng-click="Page.IsEditable() && EditPopup.OpenAdd()">\
                        <a href="#">\
                            <i class="fa fa-plus" aria-hidden="true"></i> <p> Ajouter </p></a>\
                    </div>'
    };
});