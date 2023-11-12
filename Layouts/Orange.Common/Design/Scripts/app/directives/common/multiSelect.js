orangeCommonApp.app
               .directive('multiSelect', function multiSelect() {
                   return {
                       restrict: 'A',
                       link: function (scope, element, attrs) {
                           scope.$watchGroup([attrs.multiSelectData, 'reloadMultiSelect'], function (newValues, oldValues, scope) {
                               if (!attrs.multiSelectInitialized && newValues[0] && newValues[0].length) {
                                   element.multiselect(scope.$eval(attrs.multiSelect));
                                   attrs.multiSelectInitialized = true;
                               }
                               else if (attrs.multiSelectInitialized || newValues[1]) {
                                   element.multiselect('refresh');
                               }
                           });
                       }
                   };
               });