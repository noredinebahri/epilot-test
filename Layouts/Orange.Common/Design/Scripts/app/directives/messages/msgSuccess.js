orangeCommonApp.app.directive('alertSuccess', function alertSuccess() {
    return {
        restrict: 'E',
        replace: true,
        template: ' <div class="alert alert-success fade in" id="success-alert" ng-if="successMessagePart1 || successMessagePart2" style="margin-bottom:2px;"> \
                        <a href="#" class="close" ng-click="closeAlert()">&times;</a> \
                        <strong> {{successMessagePart1}} </strong> \
                            {{successMessagePart2}} \
                    </div>'
    };
});