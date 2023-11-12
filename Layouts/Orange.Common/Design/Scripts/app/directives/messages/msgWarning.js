orangeCommonApp.app.directive('alertWarning', function alertSuccess() {
    return {
        restrict: 'E',
        replace: true,
        template: ' <div class="alert alert-warning fade in" id="warning-alert" ng-if="warningMessagePart1 || warningMessagePart2" style="margin-bottom:2px;"> \
                        <a href="#" class="close" ng-click="closeWarning()">&times;</a> \
                        <strong> {{warningMessagePart1}} </strong> \
                            {{warningMessagePart2}} \
                    </div>'
    };
});