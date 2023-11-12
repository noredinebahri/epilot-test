orangeCommonApp.app.directive('anneeSelector', function anneeSelector() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-group fl com-top-selector common-content">\
                            <button type="button" class="dropdown-toggle btn-annee-selector" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                <div>\
                                    <i class="fa fa-calendar" aria-hidden="true"></i>\
                                    <span class="glyphicon glyphicon-chevron-down"></span>\
                                </div>\
                                <div class="anneeName">{{selectedAnneeName}}</div>\
                            </button>\
                            <ul class="dropdown-menu">\
                                <li ng-repeat="item in Annee.AllFormattedCopy">\
                                    <a href="#" title="Selectionner cette année" ng-click="Annee.Change(item.value);"><i class="fa fa-calendar"></i>{{item.name}}</a>\
                                </li>\
                            </ul>\
                        </div>'
    };
});