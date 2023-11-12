orangeCommonApp.app
               .directive('jqueryAutocomplete', function jqueryAutocomplete($parse, $injector) {
                   return {
                       restrict: 'A',
                       require: 'ngModel',
                       compile: function jqueryAutocompleteCompile(elem, attrs) {
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
                   };
               });