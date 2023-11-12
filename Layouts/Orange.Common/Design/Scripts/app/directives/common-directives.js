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
orangeCommonApp.app.directive('errorHttp', function errorHttp($rootScope, $http, moduleApp) {
    return {
        restrict: 'E',
        replace: true,
        template: "<div class='com-error' role='alert' ng-if='errorhttp'>\
                        <i class='fas fa-exclamation-circle'></i>\
                        Une erreur est survenue :\
                        <span id='errorguid'></span>\
                        <span id='errormessage'></span>\
                        <span class='close-error' ng-click='close()'><i class='fas fa-times'></i></span>\
                   </div>",
        link: function (scope, element, attrs) {
            $rootScope.$watch("errorhttp", function (newValue, oldValue) {
                if (!newValue)
                    return;

                var error = "Une erreur est survenue.";
                var errorEnd = " Veuillez contacter votre administrateur.";

                if (newValue.status != 500) {
                    var item = {
                        Module: moduleApp,  
                        Code: newValue.status,
                        Message: newValue.statusText,
                        Params: "TODO",
                        Requete: newValue.config.url.toString(),
                        Trace: "GET - ERROR",
                        Type: 2
                    }

                    var url = epilotproperties.getWebServiceUrl() + "Log/Save";

                    $.support.cors = true;
                    $.ajax({
                        type: "POST",
                        url: url,
                        dataType: "json",
                        data: item,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            var guid = data.Guid;
                            if (newValue.status == 404)
                                error = "Désolé, le service que vous demandez est introuvable.";
                            else if (newValue.status == 401 || newValue.status == 403)
                                error = "Désolé, l'accès au service que vous demandez est interdit ou refusé.";
                        

                            $("#errorguid").text(guid)
                            $("#errormessage").text(error + errorEnd);
                        },
                        failure: function (result) {
                            console.error(result);
                            error = "Désolé, le service que vous demandez est introuvable.";
                            $("#errormessage").text(error + errorEnd);
                        },
                        error: function (result) {
                            console.error(result);
                            error = "Désolé, le service que vous demandez est introuvable.";
                            $("#errormessage").text(error + errorEnd);
                        }
                    });

                } else {
                    var message = newValue.statusText.split(":");
                    $("#errorguid").text(message[0]);
                    if (message[1])
                        $("#errormessage").text(message[1]);
                    else
                        $("#errormessage").text(errorEnd);
                }
            });

            scope.close = function () {
                $rootScope.errorhttp  = false;
            }
        }
    };
});
orangeCommonApp.app.directive('hierarchyNavigation', function hierarchyNavigation($rootScope, moduleApp) {

    var displaySelectedUser = function (selectedActor) {
        if (moduleApp != 1)
            return;

        var connectedActor = JSON.parse(sessionStorage.getItem("Epilot.Perfco.Actor"));

        if (!selectedActor || !connectedActor || selectedActor.Code == connectedActor.Code) {
            $("#page-title-seleted-user-pipe").text("");
            $("#page-title-seleted-user-name").text("");
            $("#page-title-seleted-user-name").attr("title", "");
            $("#page-title-seleted-user-agency").text("");
        }

        if (selectedActor && connectedActor && selectedActor.Code != connectedActor.Code) {
            $("#page-title-seleted-user-pipe").text("| ");

            $("#page-title-seleted-user-name").text(selectedActor.Label && selectedActor.Label.length > 18 
                    ? selectedActor.Label.substring(0,18) + "..."
                    : selectedActor.Label);

            $("#page-title-seleted-user-name").attr("title", selectedActor.Label);

            $("#page-title-seleted-user-agency").text("");
            if (selectedActor.AgencyLabel) {
                $("#page-title-seleted-user-agency").text(" / " + selectedActor.AgencyLabel);
            }
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/hierarchyNavigation.html?version=EPilotCurrentVersion',
        link: function (scope, element, attr) {

            $rootScope.$watch(
                function navigationActorWatchExpression() {
                    return sessionStorage.getItem("Epilot.Perfco.NavigationActor");
                },
                function navigationActorListener(newValue, oldValue) {
                    if (newValue) {
                        var selectedActor = JSON.parse(newValue)
                        displaySelectedUser(selectedActor);
                    }
                }, true);

            $('.com-topnav-alerts #hierarchie').html = "";
            $('.com-topnav-alerts #hierarchie').append($('.hierarchie-top-button'));
        },
        controller:'@', //specify the controller is an attribute
        name:'ctrlName', //name of the attribute.
        controllerAs: 'vm'
    };
});


orangeCommonApp.app.directive('enterEvent', function enterEvent() {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.enterEvent);
                });
                event.preventDefault();
            }
        });
    };
});
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
orangeCommonApp.app.directive('itemsCounter', function itemsCounter() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-result fr">\
                       <span class="ng-binding" ng-if="nbSiren" ng-bind="nbSiren"></span>\
                       <span class="ng-binding" ng-if="Grid.Options && Grid.Options.totalItems" ng-bind="Grid.Options.totalItems"></span>\
                        <p ng-if="nbSiren">SIREN</p>\
                        <p ng-if="Grid.Options && Grid.Options.totalItems">résultats</p>\
                    <span class="ng-binding" ng-if="!Grid.Options || !Grid.Options.totalItems">Aucun <p>résultats<p></span>\
                   </div>'
    };
});
orangeCommonApp.app.directive('datepickerPopup', function () {
    return {
        restrict: 'EAC',
        require: 'ngModel',
        link: function(scope, element, attr, controller) {
            //remove the default formatter from the input directive to prevent conflict
            controller.$formatters.shift();
        }
    }
});
orangeCommonApp.app.directive('dateFormatter', [
    function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function postLink(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(data) {
                    console.log("parsers.push " + data);
                    var out = moment(data).format('DD/MM/YYYY');
                    console.log("$parsers.out = " + out);
                    return out;
                });
                
                ngModel.$formatters.push(function(data) {
                    console.log("$formatters.push " + data);
                    var out = moment(data, 'DD/MM/YYYY').toDate();
                    console.log("$formatters.out =" + out);
                    return out;
                });
            }
        };
    }
]);
orangeCommonApp.app.directive('addButton', function addButton() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-action" ng-disabled="!Page.IsEditable()" ng-click="Page.IsEditable() && EditPopup.OpenAdd()">\
                        <a href="#">\
                            <i class="fa fa-plus" aria-hidden="true"></i> <p> Ajouter </p></a>\
                    </div>'
    };
});
orangeCommonApp.app.directive('exportButton', function exportButton() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-action" ng-click="Boutons.AreActive() && exportToExcel()" ng-disabled="!Boutons.AreActive()">\
                        <a href="#">\
                            <i class="fa fa-download" aria-hidden="true"></i> <p>Exporter</p>\
                        </a>\
                    </div>'
    };
});
orangeCommonApp.app.directive('importButton', function importButton() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-action" ng-disabled="!Page.IsEditable() || !Boutons.Import.IsActive() || !Boutons.AreActive()" ng-click="Page.IsEditable() && Boutons.Import.IsActive() && Boutons.AreActive() && ImportPopup.Open()">\
                        <a href="#">  \
                            <i class="fa fa-upload" aria-hidden="true"></i>\<p>{{Boutons.Import.Name}}</p>\
                        </a>\
                    </div>'
    };
});
orangeCommonApp.app.directive('agencySelector', function agencySelector() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-group fl com-top-selector common-content">\
                            <button type="button" class="dropdown-toggle btn-agency-selector" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                <div>\
                                    <i class="fa fa-home" aria-hidden="true"></i>\
                                    <span class="glyphicon glyphicon-chevron-down"></span>\
                                </div>\
                                <div class="periodName">{{selectedAgencyName}}</div>\
                            </button>\
                            <ul class="dropdown-menu">\
                                <li ng-repeat="item in Agence.AllFormattedCopy">\
                                    <a href="#" title="Selectionner cette agence" ng-click="Agence.Change(item.value);"><i class="fa fa-home"></i>{{item.name}}</a>\
                                </li>\
                            </ul>\
                        </div>'
    };
});
orangeCommonApp.app.directive('anneeSelector', function anneeSelector() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="btn-group fl com-top-selector common-content">\
                            <button type="button" class="dropdown-toggle btn-annee-selector" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">\
                                <div>\
                                    <i class="fa fa-calendar" aria-hidden="true"></i>\
                                    <span class="glyphicon glyphicon-chevron-down"></span>\
                                </div>\
                                <div class="anneeName">{{selectedAnneeName}}</div>\
                            </button>\
                            <ul class="dropdown-menu">\
                                <li ng-repeat="item in Annee.AllFormattedCopy">\
                                    <a href="#" title="Selectionner cette année" ng-click="Annee.Change(item.value);"><i class="fa fa-calendar"></i>{{item.name}}</a>\
                                </li>\
                            </ul>\
                        </div>'
    };
});
orangeCommonApp.app.directive('periodSelector', function periodSelector() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/periodSelector.html?version=EPilotCurrentVersion'
    };
});
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
orangeCommonApp.app.directive('notification', function notification($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/notification.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #notification').html = "";
            $('.com-topnav-alerts #notification').append($('.notification-top-button'));
        }
    };
});

orangeCommonApp.app.directive('overrideUser', function overrideUser($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/overrideUser.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #overrideuser').html = "";
            $('.com-topnav-alerts #overrideuser').append($('.overrideuser-top-button'));
        }
    };
});

orangeCommonApp.app.directive('blocNote', function blocNote($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/blocNote.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #bloc-note').html = "";
            $('.com-topnav-alerts #bloc-note').append($('.bloc-note-top-button'));
        }
    };
});

orangeCommonApp.app.directive('aide', function aide($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/aide.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #aide').html = "";
            $('.com-topnav-alerts #aide').append($('.aide-top-button'));
        }
    };
});

orangeCommonApp.app.directive('telechargement', function telechargement($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/telechargement.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #telechargement').html = "";
            $('.com-topnav-alerts #telechargement').append($('.telechargement-top-button'));
        }
    };
});

orangeCommonApp.app.directive('rechercheClient', function blocNote($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/rechercheClient.html?version=EPilotCurrentVersion',
        link: function (scope, element, attrs) {
            $('.com-topnav-alerts #recherche-client').html = "";
            $('.com-topnav-alerts #recherche-client').append($('.recherche-client-top-button'));
        }
    };
});