orangeCommonApp.app.directive('moduleSelector', function moduleSelector() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-group fl btn-agency common-content module-selector" title="{{selectedModuleName}}">\
                            <button type="button" class="dropdown-toggle btn-agency-selector" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                <div>\
                                    <i class="fa fa-crosshairs" aria-hidden="true"></i>\
                                    <span class="glyphicon glyphicon-chevron-down"></span>\
                                </div>\
                                <div class="agencyName" >{{selectedModuleName | limitTo:9}} \
                                    <span ng-if="selectedModuleName.length > 9">...</span>\
                                </div>\
                            </button>\
                            <ul class="dropdown-menu">\
                                <li ng-repeat="item in listeModules">\
                                    <a href="#" title="Selectionner cette agence" ng-click="changeModule(item.value);"><i class="fa fa-home"></i>{{item.name}}</a>\
                                </li>\
                            </ul>\
                        </div>'
    };
});