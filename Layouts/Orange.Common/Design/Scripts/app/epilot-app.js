///#source 1 1 /Layouts/Orange.Common/Design/Scripts/app/orangeCommonApp.js
var orangeCommonApp = orangeCommonApp || {};
orangeCommonApp.app = angular.module('orangeCommonApp', []);

orangeCommonApp.app
               .config(['$httpProvider', function ($httpProvider) {
                   $httpProvider.interceptors.push(function ($q, $rootScope) {
                       if ($rootScope.activeCalls == undefined) {
                           $rootScope.activeCalls = 0;
                       }

                       return {
                           request: function (config) {
                               $rootScope.activeCalls += 1;
                               return config;
                           },
                           requestError: function (rejection) {
                               $rootScope.activeCalls -= 1;
                               return rejection;
                           },
                           response: function (response) {
                               $rootScope.activeCalls -= 1;
                               return response;
                           },
                           responseError: function (rejection) {
                               $rootScope.activeCalls -= 1;
                               return rejection;
                           }
                       };
                   });
               }]);
///#source 1 1 /Layouts/Orange.Common/Design/Scripts/app/directives/jqueryAutocomplete.js
orangeCommonApp.app
               .directive('jqueryAutocomplete', jqueryAutocomplete);

jqueryAutocomplete.$inject = ['$parse', '$injector'];
function jqueryAutocomplete($parse, $injector) {
    var directive = {
        restrict: 'A',
        require: 'ngModel',
        compile: compile
    };

    return directive;

    function compile(elem, attrs) {
        var modelAccessor = $parse(attrs.valueNgModel),
            searchService = $injector.get(attrs.serviceName),
            searchMethod = searchService[attrs.serviceMethod];

        return function (scope, element, attrs) {
            var mappedItems = null;

            var elementAutocomplete = element.autocomplete({
                minLength: 3,
                autoFocus: true,
                source: function (request, response) {
                    searchMethod(request.term)
                        .then(function (serviceResponse) {
                            mappedItems = $.map(serviceResponse.data, function (item) {
                                return {
                                    label: item.ItemLabel,
                                    id: item.ItemId,
                                    value: item.ItemLabel
                                }
                            });

                            return response(mappedItems);
                        }, function (error) {
                            logger.logError('Unable to load action priorities: ' + error.message, error);
                        });
                },
                select: function (event, ui) {
                    scope.$apply(function (scope) {
                        modelAccessor.assign(scope, ui.item.id);
                    });

                    if (attrs.onSelect) {
                        scope.$apply(attrs.onSelect);
                    }

                    element.val(ui.item.label);

                    event.preventDefault();
                },
                change: function () {
                    var
                        currentValue = element.val(),
                        matchingItem = null;

                    if (mappedItems) {
                        for (var i = 0; i < mappedItems.length; i++) {
                            if (mappedItems[i].label === currentValue) {
                                matchingItem = mappedItems[i];
                                break;
                            }
                        }
                    }

                    scope.$apply(function (scope) {
                        modelAccessor.assign(scope, matchingItem ? matchingItem.id : null);
                    });
                }
            });
        };
    }
}
///#source 1 1 /Layouts/Orange.Common/Design/Scripts/app/directives/loadingSpinner.js
orangeCommonApp.app
               .directive('loadingSpinner', function () {
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
///#source 1 1 /Layouts/Orange.Common/Design/Scripts/app/directives/multiSelect.js
orangeCommonApp.app
               .directive('multiSelect', function () {
                   return {
                       restrict: 'A',
                       link: function (scope, element, attrs) {
                           scope.$watchGroup([attrs.multiSelectData, 'reloadMultiSelect'], function (newValues, oldValues, scope) {
                               if (!attrs.multiSelectInitialized && newValues[0] && newValues[0].length && newValues[0] != oldValues[0]) {
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
