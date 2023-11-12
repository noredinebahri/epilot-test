orangeCommonApp.app.directive('pagination', function pagination() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="col-md-10 pagination-item">\
                       <div ng-show="Grid.Options.totalItems > Grid.Options.paginationPageSize">\
                           <ul uib-pagination class="pagination-sm" max-size="5" boundary-link-numbers="true" rotate="true" total-items="Grid.Options.totalItems" items-per-page="Grid.Options.paginationPageSize" \
                                           ng-model="Grid.Options.paginationCurrentPage" previous-text="&lsaquo;" next-text="&rsaquo;">\
                           </ul>\
                       </div>\
                   </div>'
    };
});