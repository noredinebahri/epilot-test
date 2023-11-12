orangeCommonApp.app
               .directive('loadingSpinner', function loadingSpinner() {
                   return {
                       bindings: {
                           activeCalls: "<"
                       },
                       restrict: 'E',
                       replace: true,
                       template: '<div ng-show="activeCalls" id="loading-mask" style="display:block;">\
                            <div id="loading-mask-inner">\
                                <img src="/_layouts/15/Orange.Common/Design/Images/ajax-loader.gif">\
                                <br />\
                                <span>Chargement en cours...</span>\
                            </div>\
                         </div>'
                   };
               });