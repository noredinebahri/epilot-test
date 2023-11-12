orangeCommonApp.app.directive('itemsPerPage', function itemsPerPage() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="col-md-2 item-per-page">\
                       <ul class="pagination pagination-sm">\
                           <li ng-repeat="value in Grid.Options.paginationPageSizes track by $index" >\
                               <a href="#" ng-click="Grid.Resize(value)"  \
                                    ng-class="{\'item-per-page-selected\': value == Grid.Options.paginationPageSize }" \
                                    ng-bind="value"></a>\
                           </li>\
                       </ul>\
                   </div>'
    };
});