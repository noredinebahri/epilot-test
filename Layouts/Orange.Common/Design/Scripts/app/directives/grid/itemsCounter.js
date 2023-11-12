orangeCommonApp.app.directive('itemsCounter', function itemsCounter() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-result fr">\
                       <span class="ng-binding" ng-if="nbSiren" ng-bind="nbSiren"></span>\
                       <span class="ng-binding" ng-if="Grid.Options && Grid.Options.totalItems" ng-bind="Grid.Options.totalItems"></span>\
                        <p ng-if="nbSiren">SIREN</p>\
                        <p ng-if="Grid.Options && Grid.Options.totalItems">résultats</p>\
                    <span class="ng-binding" ng-if="!Grid.Options || !Grid.Options.totalItems">Aucun <p>résultats<p></span>\
                   </div>'
    };
});