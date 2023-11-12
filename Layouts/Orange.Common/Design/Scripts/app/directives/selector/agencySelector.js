orangeCommonApp.app.directive('agencySelector', function agencySelector() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-group fl com-top-selector common-content">\
                            <button type="button" class="dropdown-toggle btn-agency-selector" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                <div>\
                                    <i class="fa fa-home" aria-hidden="true"></i>\
                                    <span class="glyphicon glyphicon-chevron-down"></span>\
                                </div>\
                                <div class="periodName">{{selectedAgencyName}}</div>\
                            </button>\
                            <ul class="dropdown-menu">\
                                <li ng-repeat="item in Agence.AllFormattedCopy">\
                                    <a href="#" title="Selectionner cette agence" ng-click="Agence.Change(item.value);"><i class="fa fa-home"></i>{{item.name}}</a>\
                                </li>\
                            </ul>\
                        </div>'
    };
});