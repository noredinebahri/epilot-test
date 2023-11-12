orangeCommonApp.app.directive('messageInfoAdmin', function messageInfoAdmin() {
    return {
        restrict: 'E',
        replace: true,
        template: ' <div>\
                        <div class="com-message-info-admin col-xs-12">\
                            <div class="message_texte">\
                                <span ng-bind-html="message"></span>\
                            </div>\
                        <div class="message_picto">\
                            <img ng-src="{{image}}"></img>\
                        </div>\
                    </div>\
                </div>',
        link: function (scope, element, attrs) {
        },
        scope: {
            message: '@',
            image: '@'
        },
        bindToController: true,
        controller: function ($element, $scope, $controller, $rootScope, $attrs) {
            $scope.defaultMessage = "Vous pouvez cliquer sur une <o>injection</o>, la <o>modifier, l'exporter</o> ou en <o>importer</o> une nouvelle en haut à droite";
            $scope.defaultImage = "seringue.png";

            if (!$attrs.message)
                $attrs.message = $scope.defaultMessage;

            if (!$attrs.image)
                $attrs.image = $scope.defaultImage;

            $scope.message = $attrs.message.replace(new RegExp('<o>', 'g'), '<span class="orange-bold">');
            $scope.message = $scope.message.replace(new RegExp('</o>', 'g'), '</span>');

            $scope.image = "/_layouts/15/Orange.Common/Design/Images/Aide/" + $attrs.image;
        }

    }
});