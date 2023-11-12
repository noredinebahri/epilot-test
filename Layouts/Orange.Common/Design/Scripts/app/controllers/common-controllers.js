var orangeCommonApp = orangeCommonApp || {};
orangeCommonApp.app = angular.module('orangeCommonApp', ['ui.bootstrap', 'ngMaterial', 'ngMessages', 'textAngular', 'ngWYSIWYG', 'colorpicker.module', 'ngCookies']);

orangeCommonApp.app.value('moduleApp', '0');

orangeCommonApp.app.config(function orangeCommonAppConfig($compileProvider, $httpProvider, $provide) {

    // https://stackoverflow.com/questions/30037312/adding-color-to-textangular-is-there-an-easy-way-to-cause-the-colorpicker-to-clo
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular

        taRegisterTool('backgroundColor', {
            display: "<button colorpicker class='btn btn-default ng-scope' title='Background Color' type='button' colorpicker-close-on-select colorpicker-position='bottom' ng-model='backgroundColor' style='background-color: {{backgroundColor}}'><i class='fa fa-paint-brush'></i></button>",
            action: function (deferred) {
                var self = this;
                this.$editor().wrapSelection('backgroundColor', this.backgroundColor);
                if (typeof self.listener == 'undefined') {
                    self.listener = self.$watch('backgroundColor', function (newValue) {
                        self.$editor().wrapSelection('backColor', newValue);
                    });
                }
                self.$on('colorpicker-selected', function () {
                    deferred.resolve();
                });
                self.$on('colorpicker-closed', function () {
                    deferred.resolve();
                });
                return;
            }
        });
        taOptions.toolbar[1].unshift('backgroundColor');

        taRegisterTool('fontColor', {
            display: "<button colorpicker type='button' class='btn btn-default ng-scope'  title='Font Color'  colorpicker-close-on-select colorpicker-position='bottom' ng-model='fontColor' style='color: {{fontColor}}'><i class='fa fa-font '></i></button>",
            action: function (deferred) {
                var self = this;
                if (typeof self.listener == 'undefined') {
                    self.listener = self.$watch('fontColor', function (newValue) {
                        self.$editor().wrapSelection('foreColor', newValue);
                    });
                }
                self.$on('colorpicker-selected', function () {
                    deferred.resolve();
                });
                self.$on('colorpicker-closed', function () {
                    deferred.resolve();
                });
                return false;
            }
        });
        taOptions.toolbar[1].unshift('fontColor');

        taOptions.setup.textEditorSetup=function($element) {
            $element.attr('ui-codemirror', '');
        };
        return taOptions;
    }]);

    // https://github.com/textAngular/textAngular/issues/224#issuecomment-81960485
    $provide.decorator('taOptions', ['taCustomRenderers', '$delegate', function(taCustomRenderers, taOptions) {
        taCustomRenderers.push({
            selector: 'a',
            renderLogic: function(element) {
                element.attr('target', '_blank');
                element.attr('dummu', 'super');
            }
        });
        return taOptions;
    }]);

    if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
        // Disabling debug data
        $compileProvider.debugInfoEnabled(false);
    }

    //Activation du cross domain
    $httpProvider.defaults.withCredentials = true;

    $httpProvider.interceptors.push(function httpProviderInterceptorConfiguration($rootScope) {
        if ($rootScope.activeCalls == undefined) {
            $rootScope.activeCalls = 0;
        }

        if ($rootScope.errorResponse == undefined) {
            $rootScope.errorResponse = false;
        }

        return {
            request: function httpProviderRequestConfig(config) {
                $rootScope.overrideCodeAlliance = JSON.parse(sessionStorage.getItem('Epilot.OverrideCodeAlliance'));

                if ($rootScope.overrideCodeAlliance)
                {
                    config.headers['overrideCodeAlliance'] = $rootScope.overrideCodeAlliance.CodeAlliance;
                }

                $rootScope.delegateUser = JSON.parse(sessionStorage.getItem('Epilot.Perfco.DelegationActor'));

                if ($rootScope.delegateUser) {
                    if (!config.url.includes($('#PropertyDrcePVCWebApiUrl').text()) && !config.url.includes($('#PropertyPVVWebApiUrl').text())) {
                        config.headers['delegateUser'] = $rootScope.delegateUser.SourceCodeAlliance;
                    }
                }

                $rootScope.delegatePvcUser = JSON.parse(sessionStorage.getItem('Epilot.Pvc.DelegationActor'));

                if ($rootScope.delegatePvcUser) {
                    config.headers['delegateUser'] = $rootScope.delegatePvcUser.SourceCodeAlliance;
                }

                $rootScope.delegatePvvUser = JSON.parse(sessionStorage.getItem('Epilot.Pvv.DelegationActor'));

                if ($rootScope.delegatePvvUser) {
                    config.headers['delegateUser'] = $rootScope.delegatePvvUser.SourceCodeAlliance;
                }
                $rootScope.activeCalls += 1;
                return config;
            },
            requestError: function httpProviderRequestErrorConfig(rejection) {
                $rootScope.activeCalls -= 1;
                return rejection;
            },
            response: function httpProviderResponseConfig(response) {
                $rootScope.activeCalls -= 1;
                return response;
            },
            responseError: function httpProviderResponseErrorConfig(rejection) {
                $rootScope.activeCalls -= 1;
                $rootScope.errorhttp = rejection;
                return rejection;
            }
        };
    });
});
orangeCommonApp.app.controller('baseCommonController', function baseCommonController($scope, $q, $http, $window, i18nService, $uibModal, uiGridConstants) {

    // ==========================================
    // VARIABLES
    // ==========================================

    //PLUGIN CONFIGURATION
    i18nService.setCurrentLang('fr');
    uiGridConstants.LOG_DEBUG_MESSAGES = false;

    //FORMAT
    $scope.Format = $scope.Format || {};

    //WEBSERVICE
    $scope.WebService = $scope.WebService || {};
    $scope.WebService.Url = "";

    //PAGE
    $scope.Page = $scope.Page || {};
    $scope.Page.IsPeriodeLess = false;

    //GRID
    $scope.Grid = $scope.Grid || {};
    $scope.Grid.IsEditable = true;

    $scope.Grid.Filtres = $scope.Grid.Filtres || {};
    $scope.Grid.Filtres.Actif = [{ value: true, label: 'Actif' }, { value: false, label: 'Inactif' }];

    $scope.Grid.Pagination = $scope.Grid.Pagination || {};
    $scope.Grid.Pagination.LocalStorage = localStorage.getItem("EPilot.Pagination.CurrentValue");
    $scope.Grid.Pagination.Sizes = [10, 50, 200, 500];
    $scope.Grid.Pagination.Size = !$scope.Grid.Pagination.LocalStorage ? 10 : $scope.Grid.Pagination.LocalStorage;

    $scope.Grid.Options = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableSelectAll: false,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 1,
        rowTemplate: '/_layouts/15/Orange.Common/Design/Scripts/app/views/grid/rowTemplate.html?version=EPilotCurrentVersion',
        enablePaginationControls: false,
        paginationCurrentPage: 1,
        paginationPageSize: $scope.Grid.Pagination.Size,
        paginationPageSizes: $scope.Grid.Pagination.Sizes
    };
    $scope.Grid.Options.onRegisterApi = function (gridApi) {
        
        $scope.Grid.Api = gridApi;
        $scope.Grid.Api.core.on.sortChanged($scope, function onSortChanged(grid, sortColumns) {
            while (sortColumns.length > 1) {
                sortColumns[0].unsort(); sortColumns.shift();
            }
        });
    };

    $scope.Grid.SortingAlgorithm = $scope.Grid.SortingAlgorithm || {};
    $scope.Grid.SortingAlgorithm.SortByDate  = function (a, b) {
        var nulls = $scope.Grid.Api.core.sortHandleNulls(a, b);

        if (nulls !== null) {
            return nulls;
        } else {
            var dateA = moment(a, "YYYY-MM-DD").toDate();
            var dateB = moment(b, "YYYY-MM-DD").toDate();

            if (dateA < dateB)
                return -1;
            else if (dateA > dateB)
                return 1;
            else
                return 0;
        }
    }
    $scope.Grid.SortingAlgorithm.SortByDouble = function (a, b) {
        var nulls = $scope.Grid.Api.core.sortHandleNulls(a, b);

        if (nulls !== null) {
            return nulls;
        } else {
            var floatA = parseFloat(a);
            var floatB = parseFloat(b);

            if (floatA < floatB)
                return -1;
            else if (floatA > floatB)
                return 1;
            else
                return 0;
        }
    }

    $scope.Grid.Resize = function (value) {
        localStorage.setItem("EPilot.Pagination.CurrentValue", value);
        $scope.Grid.Options.paginationPageSize = value;
        $scope.Grid.Options.virtualizationThreshold = value;
    }

    //AGENCE
    $scope.Agence = $scope.Agence || {};
    $scope.Agence.All = [];
    $scope.Agence.AllFormatted = [];
    $scope.Agence.AllFormattedCopy = [];
    $scope.Agence.Current = null;

    //BUTTONS
    $scope.Boutons = $scope.Boutons || {};
    $scope.Boutons.AreActive = function () {
        return true;
    }
    $scope.Boutons.Import = $scope.Boutons.Import || {};
    $scope.Boutons.Import.Name = "Importer";
    $scope.Boutons.Import.RequireAgenceSelected = false;
    $scope.Boutons.Import.IsActive = function () {
        if ($scope.Boutons.Import.RequireAgenceSelected && !$scope.Agence.Current)
            return false;

        if (!$scope.Periode.DefaultPeriode)
            return true;

        return $scope.Periode.DefaultPeriode.Period == $scope.Periode.Current.Period;
    }

    //POPUP IMPORT
    $scope.ImportPopup = $scope.ImportPopup || {};
    $scope.ImportPopup.Title = "";
    $scope.ImportPopup.Open = function () {
        if (!$scope.Page.IsEditable()) return;

        $uibModal.open({
            animation: true,
            templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/import.html?version=EPilotCurrentVersion',
            controller: 'importPopupController',
            controllerAs: 'vm',
            resolve: {
                currentPeriod: function currentPeriodResolve() {
                    return $scope.Periode.Current;
                },
                currentAgence: function currentAgenceResolve() {
                    return $scope.Agence.Current;
                },
                urls: function urlsResolve() {
                    return $scope.urls;
                },
                title: function titleResolve() {
                    return $scope.ImportPopup.Title;
                },
                refreshGrid: function refreshGridResolve() {
                    return function refreshGrid() {
                        $scope.fillGrid();
                    }
                },
                currentDomain: function currentDomain() {
                    return null;
                }
            },
            size: 'lg'
        });
    }

    //POPUP EXPORT
    $scope.exportToExcel = function () {
        var exportUrl = $scope.WebService.Url + "/" + $scope.urls.exportToExcel;

        if ($scope.Periode.Current) {
            exportUrl += "/" + $scope.Periode.Current.Id;
        }

        if ($scope.urls.sendCodeAgence) {
            exportUrl += "/" + $scope.selectedAgencyName;
        }
        else if ($scope.selectedAgencyId) {
            exportUrl += "/" + $scope.selectedAgencyId;
        }
        window.open(exportUrl, '_blank');
        // à surcharger
    }

    //SCROLLBAR
    $scope.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    $scope.urls = [];

    //POPUP ADD/EDIT
    $scope.EditPopup = $scope.EditPopup || {};
    $scope.EditPopup.Size = 'lg';
    $scope.EditPopup.DefaultTemplate = '/_layouts/15/Orange.Common/Design/Scripts/app/views/gridPopup.html?version=EPilotCurrentVersion';
    $scope.EditPopup.OverridenTemplateUrl = '';

    $scope.EditPopup.LoadParameters = function () { };
    $scope.EditPopup.OpenAdd = function () {
        if (!$scope.Page.IsEditable())
            return;

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: $scope.EditPopup.OverridenTemplateUrl ? $scope.EditPopup.OverridenTemplateUrl : $scope.EditPopup.DefaultTemplate,
            backdrop: 'static',
            keyboard: false,
            controller: $scope.popupController,
            controllerAs: 'vm',
            size: $scope.EditPopup.Size,
            resolve: {
                isNewForm: true,
                grid: function gridResolve() { return $scope.Grid.Options; },
                row: function rowResolve() { return undefined; },
                params: function paramsResolve() { return $scope.EditPopup.LoadParameters(); }
            }
        });

        modalInstance.result.then(function (item) {
            $scope.EditPopup.EventHandlers.ItemAdded(item);
        });
    }

    $scope.EditPopup.OpenEdit = function (event, grid, row) {
        event.preventDefault();
        if (!$scope.Page.IsEditable() || !$scope.Grid.IsEditable)
            return;

        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: $scope.EditPopup.OverridenTemplateUrl ? $scope.EditPopup.OverridenTemplateUrl : $scope.EditPopup.DefaultTemplate,
            backdrop: 'static',
            keyboard: false,
            controller: $scope.popupController,
            controllerAs: 'vm',
            size: $scope.EditPopup.Size,
            resolve: {
                isNewForm: false,
                grid: function gridResolve() { return $scope.Grid.Options; },
                row: function rowResolve() { return row; },
                params: function paramsResolve() { return $scope.EditPopup.LoadParameters(); }
            }
        });

        modalInstance.result.then(function (item) {
            $scope.EditPopup.EventHandlers.ItemUpdated(item);
        });
    }

    $scope.EditPopup.EventHandlers = $scope.EventHandlers || {};
    $scope.EditPopup.EventHandlers.ItemAdded = function (item) {}
    $scope.EditPopup.EventHandlers.ItemUpdated = function (item) {}

    // Etats 
    $scope.Page.IsEditable = function () {
        if (!$scope.Periode.DefaultPeriode)
            return true;

        return $scope.Periode.DefaultPeriode.Period == $scope.Periode.Current.Period;
    }

    //FORMAT DATA
    $scope.Format.ObjectToListBox = function (data, nameKey1, nameKey2, valueKey, valueAsString) {
        var listToFill = [];

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            listToFill.push({
                value: valueAsString ? item[valueKey].toString() : item[valueKey],
                name: item[nameKey1] + "-" + item[nameKey2],
            });
        }

        return listToFill;
    }

    $scope.mapSelectData = function (data, nameKey, valueKey) {
        var listToFill = [];

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            listToFill.push({
                value: item[valueKey],
                name: item[nameKey]
            });
        }

        return listToFill;
    }


    $scope.getArrayElement = function (array, elementKey, elementValue) {
        return array[$scope.getArrayElementIndex(array, elementKey, elementValue)];
    }

    $scope.getArrayElementIndex = function (array, elementKey, elementValue) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i][elementKey] == elementValue) {
                return i;
            }
        }
    }

    //PERIODE
    $scope.Periode = $scope.Periode || {};
    $scope.Periode.All = [];
    $scope.Periode.AllYears = [];

    $scope.Periode.DefaultPeriode = null;
    $scope.Periode.Current = null;
    $scope.Periode.CurrentYear = null;

    $scope.Periode.Selecteur = $scope.Periode.Selecteur || {};
    $scope.Periode.Selecteur.PeriodesFiltreParAnnee = [];
    $scope.Periode.Selecteur.TempPeriode = null;
    $scope.Periode.Selecteur.TempPeriodeShortValue = null;

    $scope.Periode.SetDefault = function (data) {
        $scope.Periode.DefaultPeriode = data;
        $scope.Periode.Current = data;
        $scope.Periode.Current.Period = data.Libelle;
        $scope.Periode.CurrentYear = data.Libelle.split("-")[1];
        $scope.Periode.Selecteur.TempPeriodeShortValue = data.Libelle.split("-")[0];
        $scope.Periode.ExtractAllYear();
    }

    $scope.Periode.ExtractAllYear = function () {
        $scope.Periode.All.forEach(function (item) {
            var tab = item.Libelle.split("-");
            var year = tab[1];
            if ($scope.Periode.AllYears.indexOf(year) == -1) {
                $scope.Periode.AllYears.push(year);
            }
        });
    }

    $scope.Periode.Selecteur.SelectYear = function (selectedYear, notload) {
        $scope.Periode.Selecteur.PeriodesFiltreParAnnee = [];
        $scope.Periode.CurrentYear = selectedYear;
        $scope.Periode.All.forEach(function (item) {
            var tab = item.Libelle.split("-");
            var year = tab[1];
            var period = tab[0];
            if (selectedYear == year) {
                item.shortPeriod = period;
                $scope.Periode.Selecteur.PeriodesFiltreParAnnee.push(item);
            }
        });

        if (!notload && $scope.Periode.All && $scope.Periode.All.length > 0) {
            $scope.Periode.Selecteur.TempPeriodeShortValue = $scope.Periode.Selecteur.PeriodesFiltreParAnnee[0].shortPeriod;
            $scope.Periode.Selecteur.TempPeriode = $scope.Periode.Selecteur.PeriodesFiltreParAnnee[0];
        }
    }

    $scope.Periode.Selecteur.SelectPeriode = function (selectedPeriod) {
        $scope.Periode.Selecteur.TempPeriodeShortValue = selectedPeriod.shortPeriod;
        $scope.Periode.Selecteur.TempPeriode = selectedPeriod;
    }

    $scope.Periode.Selecteur.Save = function () {
        if ($scope.Periode.Selecteur.TempPeriode && (!$scope.Periode.Current || ($scope.Periode.Current.Period != $scope.Periode.Selecteur.TempPeriode.Period))) {
            $scope.Periode.Current = $scope.Periode.Selecteur.TempPeriode;
            $scope.Periode.Current.Period = $scope.Periode.Current.Libelle;
            $scope.fillGrid();
        }
    }

    $("#aspnetForm").on("click", function (event) {
        let popoverOpen = $(".com-top-selector-period .popover.fade.in");

        if (popoverOpen.length > 0) {
            if ($(event.target).length == 0)
                return;

            if ($(event.target)[0].className == "dropdown-toggle baseddt"
                || $(event.target)[0].className == "popover-content"
                || $(event.target)[0].className == "popover-title"
                || $(event.target)[0].className == "dropdown-toggle text-select-period"
                || $(event.target)[0].className == "selector-year"
                || $(event.target)[0].className == "selector-period") {
                return;
            }

            $(".com-top-selector-period button.dropdown-toggle").click();
        }
    });

});
orangeCommonApp.app.controller('basePopupCommonController', function basePopupCommonController($scope, isNewForm, grid, row) {
    $scope.isNewForm = isNewForm;
    $scope.showDeleteButton = false;
    $scope.info = null;
    $scope.warning = null;
    $scope.error = null;
    $scope.entity = $scope.isNewForm ? {} : angular.copy(row.entity);
    $scope.decimalColumns = [];
    $scope.showOtherButton = false;
    $scope.otherButtonAction = function otherButtonAction() { }
    $scope.otherButtonName = null;
    $scope.disabledSave = false;
    $scope.saveError = "Une erreur est survenue, impossible de sauvegarder les données saisies";

    $scope.decimalUnder50Pattern = "^(50|([0-9]|[1-4][0-9])([\.,][0-9]{1,2})?)$";
    $scope.decimalUnder50FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xx,xx] et inférieure ou égale à 50" };

    $scope.decimalUnder100Pattern = "^(100|([0-9]|[1-9][0-9])([\.,][0-9]{1,2})?)$";
    $scope.decimalUnder100FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xxx,xx] et inférieure ou égale à 100" };

    $scope.decimalUnder999Pattern = "^(([0-9]{1,3})([\.,][0-9]{1,2})?)$";
    $scope.decimalUnder999FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xxx,xx]" };

    $scope.decimalUnder150Pattern = "^(150|(([0-1][0-4][0-9])|[0-9]{0,2})([\.,][0-9]{1,2})?)$";
    $scope.decimalUnder150FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xxx,xx] et inférieure ou égale à 150" };

    $scope.decimalUnder999NegativePattern = "^-?(?:[0-9]{1,3}(?:[\.,][0-9]{0,2})?)$";

    $scope.decimal18_2 = "^-?(?:[0-9]{1,16}(?:[\.,][0-9]{1,2})?)$";
    $scope.decimal18_2FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xxxxxxxxxxxxxxxx,xx]" };

    $scope.decimal18_6 = "^-?(?:[0-9]{1,16}(?:[\.,][0-9]{1,6})?)$";
    $scope.decimal18_6FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xxxxxxxxxxxxxxxx,xxxxxx]" };

    $scope.decimal4_2 = "^-?(?:[0-9]{1,2}(?:[\.,][0-9]{1,2})?)$";
    $scope.decimal4_2FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xx,xx]" };

    $scope.decimal7_5 = "^-?(?:[0-9]{1,2}(?:[\.,][0-9]{1,5})?)$";
    $scope.decimal7_5FormatValidationMessage = { "202": "La valeur acceptée doit être au format [xx.xxxxx]" };


    $scope.dateFormatValidationMessage = {
        "checkDate": "Format jj/mm/aaaa"
    }

    $scope.baseValidationMessages = {
        105: "La valeur n\'est pas un nombre valide",
        0: 'La valeur est incorrecte',
        101: '{{viewValue}} est inférieure à la valeur minimale autorisée de {{schema.minimum}}',
        102: '{{viewValue}} est égal au minimum exclusif de {{schema.minimum}}',
        103: '{{viewValue}} est supérieure à la valeur maximale autorisée de {{schema.maximum}}',
        104: '{{viewValue}} est égal au maximum exclusif de {{schema.maximum}}',
        201: "La valeur est trop longue ({{viewValue.length}} caractères), elle est limitée à {{schema.maxLength}} symboles",
        302: "Le champ est obligatoire"
    }


    $scope.validateDuplicate = function validateDuplicate(value, field) {
        for (var i = 0; i < grid.data.length; i++) {
            var data = grid.data[i];
            var rowId = !row ? 0 : row.entity.Id;

            if (data[field] === value && data.Id != rowId)
                return false;
        }
        return true;
    }

    $scope.validateDuplicateByOtherField = function validateDuplicateByOtherField(value, field, otherField) {
        for (var i = 0; i < grid.data.length; i++) {
            var data = grid.data[i];
            var rowId = !row ? 0 : row.entity.Id;

            if (data[field] === value && data.Id != rowId && data[otherField] == $scope.entity[otherField])
                return false;
        }
        return true;
    }

    $scope.validateDuplicateTwoFields = function validateDuplicateTwoFields(value, field, value2, field2) {
        for (var i = 0; i < grid.data.length; i++) {
            var data = grid.data[i];
            var rowId = !row ? 0 : row.entity.Id;

            if (data[field] === value && data[field2] == value2 && data.Id != rowId)
                return false;
        }
        return true;
    }

    $scope.customDateValidator = {
        checkDate: function checkDate(value) {
            return $scope.validateDate(value);
        }
    }

    $scope.validateDate = function validateDate(date) {
        if (!date) return true;

        var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(date);
        if (matches == null) return false;
        var d = matches[1];
        var m = matches[2] - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
                composedDate.getMonth() == m &&
                composedDate.getFullYear() == y;
    }

    $scope.selectDefaultValue = function selectDefaultValue(name, value) {
        var result = [];
        result.push({ name: name, value: value });
        return result;
    };

    $scope.onSelectChange = function onSelectChange(modelValue, form, fieldToUpdate) {
        for (var i = 0, len = form.titleMap.length; i < len; i++) {
            if (form.titleMap[i].value == modelValue) {
                $scope.entity[fieldToUpdate] = form.titleMap[i].value;
                break;
            }
        }
    }

    $scope.getFormElementByKey = function getFormElementByKey(elementKey) {
        var itemToReturn = null;
        $scope.form.forEach(function (item) {
            if (item.key && item.key.indexOf(elementKey) !== -1) {
                itemToReturn = item;
                return;
            } else {
                var data = null;
                if (data == null) {
                    item.items.forEach(function (subItem) {
                        if (subItem.key && subItem.key.indexOf(elementKey) !== -1) {
                            itemToReturn = subItem;
                            return;
                        }
                    });
                }
            }
        });

        return itemToReturn;
    }

    $scope.getArrayElementIndex = function getArrayElementIndex(array, elementKey, elementValue) {
        for (var i = 0, len = array.length; i < len; i++) {
            if (array[i][elementKey] == elementValue) {
                return i;
            }
        }
    }

    $scope.formatDecimalValues = function formatDecimalValues() {
        angular.forEach($scope.decimalColumns, function decimalColumnsIterator(key) {
            $scope.entity[key] = $scope.fixDecimalFormat($scope.entity[key]);
        });
    }

    $scope.fixDecimalFormat = function fixDecimalFormat(value, defaultValue) {
        if (!value)
            return defaultValue;

        var val = value.toString();
        if (val.indexOf(",")) {
            val = val.replace(",", ".");
        }

        var parsedValue = parseFloat(val);
        return parsedValue ? parsedValue : val;
    }

    $scope.mapSelectData = function mapSelectData(data, nameKey, valueKey) {
        var listToFill = [];

        for (var i = 0, len = data.length; i < len; i++) {
            var item = data[i];
            listToFill.push({
                value: item[valueKey],
                name: item[nameKey]
            });
        }

        return listToFill;
    }
});
orangeCommonApp.app.controller('confirmPopupController', function ($uibModalInstance, titleToShow, textToShow, htmlToShow) {
    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.titleToShow = titleToShow;
    vm.textToShow = textToShow;
    vm.htmlToShow = htmlToShow;
});

orangeCommonApp.app.controller('notificationCommonPopupController', function ($uibModalInstance, notificationCommonService, item) {
    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.titleToShow = item.Titre;
    vm.textToShow = item.Texte;
    vm.item = item;

    vm.doNotDisplay = function() {
        notificationCommonService.utilisateurNotificationSave(item).then(
            function saveSuccess(postResponse) {
                $uibModalInstance.close();
            },
            function saveFailed(error) {
                logger.logError('Impossible de sauvegarder cet élément: ' + error.message, error);
            });
    }
});

orangeCommonApp.app.controller('infosPopupController', function ($uibModalInstance, titleToShow, textToShow, htmlToShow) {
    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.titleToShow = titleToShow;
    vm.textToShow = textToShow;
    vm.htmlToShow = htmlToShow;
});

orangeCommonApp.app.controller('infosPopupNotCloseableController', function ($uibModalInstance, titleToShow, textToShow, htmlToShow) {
    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.titleToShow = titleToShow;
    vm.textToShow = textToShow;
    vm.htmlToShow = htmlToShow;
});

orangeCommonApp.app.controller('displayTopController', function displayTopController($scope, $rootScope, moduleApp) {

    // ==========================================
    // VARIABLES
    // ==========================================

    $scope.Panel = $scope.Panel || {};
    $scope.Panel.SessionStorageKey = "EPilot.Common.Panel.Selected";

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    $scope.Panel.Change = function (item) {
        if (!item) {
            item = $scope.Panel.GetDefaultPanel();
        } else {
            // On sauvegarde le dernier element selectionnée
            // Pour le rafraichissement rafraichissement => panel fermé
            let temp = angular.copy(item);
            temp.statut = false;
            sessionStorage.setItem($scope.Panel.SessionStorageKey, JSON.stringify(temp));
        }

        $scope.panelCurrent = item.panel;
        $scope.panelOpen = item.statut;
    }

    $scope.Panel.GetDefaultPanel = function () {
        var lastSelectedPanel = sessionStorage.getItem($scope.Panel.SessionStorageKey);

        if (!lastSelectedPanel) {
            return { panel: 'notification', statut: false }
        }

        // Cas hierarchie sur des modules n'ayant pas hierarchie
        if (lastSelectedPanel.panel == 'hierarchie' && moduleApp != 1 && moduleApp != 2) {
            return { panel: 'notification', statut: false }
        } else if (lastSelectedPanel) {
            var item = JSON.parse(lastSelectedPanel);
            item.statut = false; // On le ferme à l'ouverture de la page
            return item;
        }
    }

    $scope.Panel.AutoClose = function () {
        $scope.Panel.Open = false;
        $scope.panelOpen = false;
        $rootScope.$apply();
    }

    // ==========================================
    // WATCH
    // ==========================================

    $rootScope.$watch(
        function displayTopWatchExpression() {
            return $rootScope.topPanel;
        },
        function navigationActorListener(newValue, oldValue) {
            $scope.Panel.Change(newValue);
        }, true);

    $rootScope.$watch(
        function () {
            return document.getElementsByClassName('hierarchie-top-button');
        },
        function (newValue) {
            if (newValue.length == 0) {
                $(".button-topnav#hierarchie").css("display", "none");
            } else {
                $(".button-topnav#hierarchie").css("display", "inline-block");
            }
        });

    $rootScope.$watch(
        function () {
            return document.getElementsByClassName('bloc-note-top-button');
        },
        function (newValue) {
            if (newValue.length == 0) {
                $(".button-topnav#bloc-note").css("display", "none");
            } else {
                $(".button-topnav#bloc-note").css("display", "inline-block");
            }
        });


    $("#page-body").on("click", function () {
        $scope.Panel.AutoClose();
    });

    $("#suiteBarLeft").on("click", function () {
        $scope.Panel.AutoClose();
    });

    $("#overlay-iframe").on("click", function () {
        $scope.Panel.AutoClose();
    });

});
orangeCommonApp.app.controller('notificationCommonController', function notificationCommonController($scope, $uibModal, $controller, $rootScope, moduleApp, statistiqueService, notificationCommonService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.nbNotification = 0;
    vm.notifications = [];

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'notification';
    vm.Panel.Open = false;

    $controller('displayTopController', {
        $scope: vm
    });

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    vm.initializePage = function () {
        notificationCommonService.count(moduleApp)
            .then(function getAllSuccess(result) {
                vm.nbNotification = result.data;
            });

        notificationCommonService.getAllPopupNotificationActives().then(function getAllSuccess(result) {
            for (var i = 0; i < result.data.length; i++) {

                $uibModal.open({
                    animation: true,
                    templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/notificationPopup.html?version=EPilotCurrentVersion',
                    controller: 'notificationCommonPopupController',
                    controllerAs: 'vm',
                    resolve: {
                        item: function item() { return result.data[i]; }
                    }
                });
            }
        });
    }

    
    vm.Panel.Display = function () {

        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;
        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };

        vm.Panel.Open = !vm.Panel.Open;

        if (vm.notifications.length != 0)
            return;

        if (vm.Panel.Open) {
            notificationCommonService.getAllActives(moduleApp).then(function getAllSuccess(result) {
                vm.notifications = result.data;
                vm.nbNotification = 0;
            });

            statistiqueService.trackEvent("Global - Onglets - Ouverture notification");
        }
        
    }

    vm.enSavoirPlus = function(index) {
        vm.notifications.forEach(function (item) {
            item.Limite = 70;
        });
        vm.notifications[index].Lu = true;
        vm.notifications[index].Limite = 300;
    }

    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // INIT
    // ==========================================
    vm.initializePage();
});
orangeCommonApp.app.controller('overrideUserController', function overrideUserController($scope, $controller, $rootScope, userService, statistiqueService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'overrideUser';
    vm.Panel.Open = false;

    //CURRENT USER
    vm.CurrentUser = vm.CurrentUser || {};
    vm.CurrentUser.IsAdmin = false;

    //OVERRIDE USER
    vm.OverrideUser = vm.OverrideUser || {};
    vm.OverrideUser.Selected = null;
    vm.OverrideUser.SearchText;


    $controller('displayTopController', {
        $scope: vm
    });

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    vm.initializePage = function () {
        var sessionValue = sessionStorage.getItem('Epilot.OverrideCodeAlliance');
        if (sessionValue) {
            vm.OverrideUser.Selected = JSON.parse(sessionValue);
        }
        vm.CurrentUser.GetUser();
    }

    vm.CurrentUser.GetUser = function () {
        userService.getUser()
            .then(function success(response) {
                if (response.status == 200) {
                    if (response.data) {
                        if (response.data.IsAdmin) {
                            vm.CurrentUser.IsAdmin = true;
                        }
                    }

                }
            });
    }

    vm.Panel.Display = function () {

        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;

        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };
        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            statistiqueService.trackEvent("Global - Onglets - Ouverture override");
        }
    }

    vm.OverrideUser.Save = function () {
        sessionStorage.clear();
        vm.Panel.Display();
        sessionStorage.setItem('Epilot.OverrideCodeAlliance', JSON.stringify(vm.OverrideUser.Selected));
        location.reload();
    }

    vm.OverrideUser.Delete = function () {
        vm.OverrideUser.Selected = null;
        sessionStorage.clear();
        vm.Panel.Display();
        location.reload();
    }

    vm.OverrideUser.Search = function (searchInput) {
        if (!searchInput) {
            return [];
        }

        return userService.getAllUsers(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }

    vm.OverrideUser.Select = function (item) {
        vm.OverrideUser.Selected = item;
        vm.OverrideUser.Save();
    }

    // ==========================================
    // INIT
    // ==========================================

    vm.initializePage();
});
orangeCommonApp.app.controller('blocNoteController', function blocNoteController($scope, $controller, $rootScope, moduleApp, blocNoteService, userService, statistiqueService, $uibModal) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;
    vm.ActeurConnecte = null;

    //PANEL GLOBAL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'bloc-note';
    vm.Panel.Open = false;
    vm.Panel.IndicateurNotesNonLu = 0;

    //TABS
    vm.Tabs = vm.Tabs || {};
    vm.Tabs.MesNotes = "tabMesNotes";
    vm.Tabs.Equipe = "tabEquipe";
    vm.Tabs.MonManager = "tabMonManager";
    vm.Tabs.Autres = "tabAutre";
    vm.Tabs.Current = vm.Tabs.MesNotes;
    vm.Tabs.Autre = vm.Tabs.Autre || {};
    vm.Tabs.Autre.Favoris = [];

    //FILTRE
    vm.Filtre = vm.Filtre || {};
    vm.Filtre.Text = null;

    //NOTE
    vm.Notes = vm.Notes || {};
    vm.Notes.UtilisateurCodeAlliance = null;
    vm.Notes.UtilisateurDisplayName = null;
    vm.Notes.List = [];
    vm.Notes.ListInternal = [];

    vm.Notes.NouvelleNote = vm.Notes.NouvelleNote || {};
    vm.Notes.NouvelleNote.IsOpened = false;
    vm.Notes.NouvelleNote.Current = {
        Titre: null,
        Texte: null,
        CodeDestinataire: null
    }
    vm.Notes.NouvelleNote.Acteur = null;

    vm.Notes.ModificationForm = vm.Notes.ModificationForm || {};
    vm.Notes.ModificationForm.IndexToEdit = -9;
    vm.Notes.TailleTexteReduit = 100;

    //COMMENTAIRES
    vm.Commentaires = vm.Commentaires || {};


    $controller('displayTopController', {
        $scope: vm
    });


    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    // PANEL
    vm.Panel.Display = function () {
        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;

        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };
        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open)
            vm.Notes.Load();

        if (vm.Panel.Open) {
            statistiqueService.trackEvent("Global - Onglets - Ouverture bloc note");
        }
    }

    //TABS
    vm.Tabs.Autre.Init = function () {
        blocNoteService.getAllFavoris().then(function (result) {
            vm.Tabs.Autre.Favoris = result.data;
        });
    }

    vm.Tabs.Autre.SearchUser = function (searchInput) {
        if (!searchInput) {
            return [];
        }

        return userService.getAllUsers(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }

    vm.Tabs.Autre.Select = function (item) {
        if (item) {
            var exist = false;
            vm.Tabs.Autre.Favoris.forEach(function (fav) {
                if (fav.FavorisCodeAlliance == item.CodeAlliance) { exist = true; }
            });

            if (exist)
            {
                alert('L utilsateur est déja dans vos favoris.');
                vm.Tabs.Autre.selectedItem = null;
            }
            else {
                var favori = {
                    CodeAlliance: item.CodeAlliance,
                    FavorisCodeAlliance: item.CodeAlliance
                }

                blocNoteService.saveFavoris(favori).then(function (result) {
                    vm.Tabs.Autre.selectedItem = null;
                    vm.Tabs.Autre.Init();
                    vm.Notes.Load(vm.Tabs.Autres, item.CodeAlliance, item.NomPrenom);

                });

            }

        }
    }

    vm.Tabs.Autre.Delete = function (id) {
            blocNoteService.deleteFavoris(id).then(function (result) {
                vm.Tabs.Autre.Init();
            });
    }

    //FILTRE
    vm.Filtre.Search = function () {
        if (!vm.Filtre.Text) {
            vm.Notes.List = angular.copy(vm.Notes.ListInternal);
            return;
        }

        if (vm.Filtre.Text.length < 2) {
            return;
        }

        let tempNote = [];
        vm.Notes.ListInternal.forEach(function (note) {
            let date = moment(note.Date).format('DD/MM/YYYY');

            if (note.Titre.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || note.Texte.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || note.NomPrenomCreateur.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || note.NomPrenomDestinataire.toLowerCase().includes(vm.Filtre.Text.toLowerCase())
                || date.toLowerCase().includes(vm.Filtre.Text.toLowerCase()))
                tempNote.push(note);
        });

        vm.Notes.List = tempNote;
    }

    //NOUVELLE NOTE
    vm.Notes.NouvelleNote.Display = function () {
        vm.Notes.NouvelleNote.IsOpened = true;
    }

    vm.Notes.NouvelleNote.Save = function (noteForm) {
        if (!noteForm.$valid) {
            return;
        }

        vm.Notes.NouvelleNote.Current.CodeDestinataire = vm.Notes.UtilisateurCodeAlliance ? vm.Notes.UtilisateurCodeAlliance : null;
        vm.Notes.NouvelleNote.Current.Texte = vm.formatTexteToHtml(vm.Notes.NouvelleNote.Current.Texte);

        blocNoteService.save(vm.Notes.NouvelleNote.Current)
            .then(function success(result) {
                vm.Notes.Load(vm.Tabs.Current, vm.Notes.UtilisateurCodeAlliance, vm.Notes.UtilisateurDisplayName );
                vm.Notes.NouvelleNote.Reset(noteForm);
            });
    }

    vm.Notes.NouvelleNote.Reset = function (noteForm) {
        vm.Notes.NouvelleNote.Current = {
            Titre: null,
            Texte: null,
            CodeDestinataire: null
        }
        vm.Notes.NouvelleNote.IsOpened = false;
        noteForm.$setPristine();
        noteForm.$setUntouched();
    }

    //NOTE
    vm.Notes.Load = function (panel, codeAlliance, displayName) {
        
        vm.Notes.ModificationForm.IndexToEdit = -9;

        panel = !panel ? vm.Tabs.MesNotes: panel;
        vm.Tabs.Current = panel;

        if (panel == vm.Tabs.MesNotes) {
            vm.Notes.UtilisateurCodeAlliance = vm.Notes.UtilisateurCodeAlliance = null;
        }
        else if (panel == vm.Tabs.MonManager)
        {
            vm.Notes.UtilisateurCodeAlliance = vm.ActeurConnecte.ManagerCode;
        }
        else {
            vm.Notes.UtilisateurCodeAlliance = codeAlliance;
            vm.Notes.UtilisateurDisplayName = displayName;
        }

        blocNoteService.getAll(panel,vm.Notes.UtilisateurCodeAlliance).then(function (result) {
            result.data.forEach(function (item) {
                item.Limite = vm.Notes.TailleTexteReduit;
            });

            vm.Notes.ListInternal = result.data;
            vm.Notes.List = angular.copy(vm.Notes.ListInternal);

            if (vm.Filtre.Text) {
                vm.Filtre.Search();
            }
        });
    }

    vm.Notes.Delete = function (id, index) {
        if (!vm.Notes.List[index].PeutModifier)
            return;

        blocNoteService.delete(id).then(function (result) {
            vm.Notes.List.splice(index, 1);

            var nwIndex = 0;
            for (var i = 0; i < vm.Notes.ListInternal.length; i++) {
                if (vm.Notes.ListInternal[i].Id == id) {
                    nwIndex = i;
                    break;
                }
            }
            vm.Notes.ListInternal.splice(nwIndex, 1);
        });
    }

    vm.Notes.EnSavoirPlus = function (index) {
        if (vm.Notes.List[index].Limite != vm.Notes.TailleTexteReduit)
            return;

        vm.Notes.List.forEach(function (item) {
            item.Limite = vm.Notes.TailleTexteReduit;
        });

        vm.Notes.List[index].Limite = 1200;
        vm.Commentaires.Get(vm.Notes.List[index]);

        if (!vm.Notes.List[index].Lu) {
            blocNoteService.read(vm.Notes.List[index].Id).then(function (item) {
                vm.Notes.List[index].Lu = true;
                vm.Notes.ListInternal[index].Lu = true;
                //vm.Panel.IndicateurNotesNonLu--;

                vm.Panel.IndicateurNotesNonLu=item.data;
            });
        }
    }

    vm.Notes.ModificationForm.Open = function (index) {
        if (!vm.Notes.List[index].PeutModifier)
            return;

        // Remise en forme du texte de la note précedente
        if (vm.Notes.List[vm.Notes.ModificationForm.IndexToEdit]) {
            vm.Notes.List[vm.Notes.ModificationForm.IndexToEdit].Texte = vm.formatTexteToHtml(vm.Notes.List[index].Texte);
        }
        // Modification de la mise en forme de la note à modifier
        vm.Notes.List[index].Texte = vm.formatTexteToInput(vm.Notes.List[index].Texte);
        vm.Notes.ModificationForm.IndexToEdit = index;
    }

    vm.Notes.ModificationForm.Save = function (index) {
        vm.Notes.List[index].Texte = vm.formatTexteToHtml(vm.Notes.List[index].Texte);
        blocNoteService.save(vm.Notes.List[index])
           .then(function success(result) {

               for (var i = 0; i < vm.Notes.ListInternal.length; i++) {
                   if (vm.Notes.ListInternal[i].Id == vm.Notes.List[index].Id) {
                       vm.Notes.ListInternal[i].Texte = vm.Notes.List[index].Texte;
                   }
               }
              
               vm.Notes.ModificationForm.IndexToEdit = -9;
           });
    }

    vm.Notes.ModificationForm.Cancel = function (index) {
        vm.Notes.List[index].Texte = vm.formatTexteToHtml(vm.Notes.List[index].Texte);
        vm.Notes.ModificationForm.IndexToEdit = -9;
    }

    // COMMENTAIRES
    vm.Commentaires.ChangeToRead = function(commentaire){
        commentaire.Lu = true;
    }
    vm.Commentaires.Save = function (index) {
        if (!vm.Notes.List[index].Commentaires) {
            vm.Notes.List[index].Commentaires = [];
        }

        if (!vm.Notes.List[index].Commentaire)
            return;

        var commentaire = {
            IdNote: vm.Notes.List[index].Id,
            Texte: vm.Notes.List[index].Commentaire,
        }

        blocNoteService.saveCommentaire(commentaire).then(function (result) {
            vm.Notes.List[index].Commentaires = result.data;
            vm.Notes.List[index].NombreCommentaires++;
        });

        // RAZ du champs où on stocke le commentaire à créer.
        vm.Notes.List[index].Commentaire = null;

        vm.Commentaires.AffecterNoteSource(vm.Notes.List[index].Id, vm.Notes.List[index].Commentaires);
    }

    vm.Commentaires.AffecterNoteSource = function (id, commentaires) {
        // On affiche la liste Notes.List pour les filtres, ne pas oublier de recharcher les commentaires sur la liste originale jamais filtrée

        vm.Notes.ListInternal.forEach(function (item) {
            if (item.Id == id) {
                item.Commentaires = commentaires;
            }
        });
    }

    vm.Commentaires.Get = function (note) {
        blocNoteService.getAllCommentaires(note.Id).then(function (result) {
            note.Commentaires = result.data;
            vm.Commentaires.AffecterNoteSource(note.Id, note.Commentaires);

            blocNoteService.readCommentaire(note.Id).then(function (result) {
                // Enleve le nombre de commentaires non lus de la bulle de notification.
                vm.Panel.IndicateurNotesNonLu = vm.Panel.IndicateurNotesNonLu - note.NombreCommentairesNonLus;
                note.NombreCommentairesNonLus = 0;
            });
        });
    }

    vm.Commentaires.Delete = function (indexNote, indexCommentaire) {
        var note = vm.Notes.List[indexNote];
        var commentaire = note.Commentaires[indexCommentaire];

        blocNoteService.deleteCommentaire(commentaire.Id).then(function (result) {
            note.Commentaires.splice(indexCommentaire, 1);
            note.NombreCommentaires--;

            vm.Notes.ListInternal.forEach(function (item) {
                var cpt = 0;
                if (item.Id == note.Id) {
                    for(var i=0; i<item.Commentaires.length; i++) {
                        if (item.Commentaires[i].Id == commentaire.Id) {
                            cpt = i;
                            break;
                        }
                    }
                    item.Commentaires = note.Commentaires;
                    return;
                }
            });

        });
    }

    //FORMAT
    vm.formatTexteToHtml = function (texte) {
        return texte.replace(/\r?\n/g, '<br />');
    }

    vm.formatTexteToInput = function (texte) {
        return texte.replace(/<br \/>/g, '\n')
    }

    vm.formatDestinataire = function (item) {
        if (!item)
            return "";
        if (item.indexOf(",") > 0)
            return "son équipe";

        return item;
    }

    //SCROLLBAR
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // WATCH
    // ==========================================

    // Gestion des acteurs
    $scope.$watch(
        function () {
            return sessionStorage.getItem("Epilot.Perfco.Actor");
        },
        function (newVal, oldVal) {
            vm.ActeurConnecte = JSON.parse(newVal);
        }, true);

    vm.jouerTutorielVideo = function () {
        //Ouverture de la modale video
        var detailModal = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/aide/aide-video.html?version=EPilotCurrentVersion',
            controller: 'aideVideoPopupController',
            controllerAs: 'vm',
            resolve: {
                videoTitre: function () { return 'Sirtaki'; },
                videoUrl: function () { return '/SiteCollectionDocuments/tuto8.mp4' },
                videoDuree: function () { return 'Trop long !!!'; }
            }
        });
    }

    // ==========================================
    // INIT
    // ==========================================

    vm.initializePage = function () {
        blocNoteService.count().then(function (result) {
            vm.Panel.IndicateurNotesNonLu = result.data;
        });

        vm.Tabs.Autre.Init();
    }

    vm.initializePage();
});
orangeCommonApp.app.controller('aideVideoPopupController', function aideVideoPopupController($scope, $controller, $rootScope, videoTitre, videoUrl, videoDuree , moduleApp) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;
    vm.videoTitre = videoTitre;
    vm.videoUrl = videoUrl;
    vm.videoDuree = videoDuree;

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================


    // ==========================================
    // INIT
    // ==========================================
    vm.initializePage = function () {
        

    }

    vm.initializePage();
});
orangeCommonApp.app.controller('aideController', function aideController($scope, $controller, $rootScope, $uibModal, $filter, statistiqueService, moduleApp) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;
    vm.nbNotification = 0;
    vm.tutoriels = [];
    vm.tutorielsVideos = [];
    vm.modesOperatoires = [];

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'aide';
    vm.Panel.Open = false;

    $controller('displayTopController', {
        $scope: vm
    });

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    vm.Panel.Display = function () {
        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;

        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };
        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            statistiqueService.trackEvent("Global - Onglets - Ouverture aide");
        }
    }

    vm.jouerTutoriel = function (tuto) {
        statistiqueService.trackEvent("Global - Aide - Didactitiel", {Tutoriel_Nom: tuto.nom });
        playTuto(tuto);
    }

    vm.jouerTutorielVideo = function (tuto) {
        statistiqueService.trackEvent("Global - Aide - Tutoriel", { Tutoriel_Nom: tuto.nom });
        //Ouverture de la modale video
        var detailModal = $uibModal.open({
            animation: true,
            size: 'lg',
            templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/aide/aide-video.html?version=EPilotCurrentVersion',
            controller: 'aideVideoPopupController',
            controllerAs: 'vm',
            resolve: {
                videoTitre: function () { return tuto.nom; },
                videoUrl: function () { return tuto.url; },
                videoDuree: function () { return tuto.duree; }
            }
        });
    }

    vm.openModeOperatoire = function(item) {
        window.open(item.url,'_blank');
    }

    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // INIT
    // ==========================================
    vm.initializePage = function () {
        if (!tutoriels)
            return;

        tutoriels.forEach(function (tuto) {
            if (hasPattern(tuto)) {
                vm.tutoriels.push(tuto);
            }
        });

        // Tutoriels vidéos
        var tutorielsVideos = [
            //{ ordre: 1, episode: 'Episode 1', nom: 'Tutooc avril', url: '/SiteCollectionDocuments/episode1.mp4', duree: '4min 40s' },
            //{ ordre: 2, episode: 'Episode 2', nom: 'Tutooc juillet', url: '/SiteCollectionDocuments/episode2.mp4', duree: '4min 17s' },
            { ordre: 1, episode: 'Tuto#1', nom: 'Prendre la place de...', url: '/SiteCollectionDocuments/tuto1.mp4', duree: '55s', pattern: 'perfco' },
            { ordre: 2, episode: 'Tuto#2', nom: 'CAP pour les ICS', url: '/SiteCollectionDocuments/tuto2.mp4', duree: '2 min 56s', pattern: 'perfco/_layouts/15/Orange.EPilot/Pages/PlanAction.aspx' },
            { ordre: 3, episode: 'Tuto#3', nom: 'CAP pour les VRC', url: '/SiteCollectionDocuments/tuto3.mp4', duree: '3 min 25s', pattern: 'perfco/_layouts/15/Orange.EPilot/Pages/PlanAction.aspx' },
            { ordre: 4, episode: 'Tuto#4', nom: 'Saisir ses engagements PO', url: '/SiteCollectionDocuments/tuto4.mp4', duree: '1 min 4s', pattern: 'perfco/_layouts/15/Orange.EPilot/Pages/PrevisionSaisie.aspx' },
            { ordre: 5, episode: 'Tuto#5', nom: 'Centre de téléchargement', url: '/SiteCollectionDocuments/tuto5.mp4', duree: '1 min 39s', pattern: 'pvv' },
            { ordre: 6, episode: 'Tuto#6', nom: 'Bloc-notes', url: '/SiteCollectionDocuments/tuto6.mp4', duree: '2 min 05s', pattern: 'perfco' },
            { ordre: 7, episode: 'Tuto#7', nom: 'La nouvelle TPS', url: '/SiteCollectionDocuments/tutoTPS1.mp4', duree: '5 min 26s', pattern: 'tps' }
        ];

        tutorielsVideos.forEach(function (tuto) {
            if (!tuto.pattern) {
                vm.tutorielsVideos.push(tuto);
            } else if (hasPattern(tuto)) {
                vm.tutorielsVideos.push(tuto);
            }
        });

        vm.tutorielsVideos = $filter('orderBy')(vm.tutorielsVideos, 'ordre', true);

        // Modes opératoires
        var modesOperatoires = [
            { order: 1, nom: 'Pôle contrats', url: '/SiteCollectionDocuments/ModOp Epilot PC - 20190415.pptx', date: '17/06/2019', pattern: 'perfco/Pages/PoleContrat.aspx' },
            { order: 2, nom: 'La nouvelle TPS ', url: '/SiteCollectionDocuments/ModeOp_Nouvelle_TPS_Online.pdf', date: '10/07/2019', pattern: 'tps' },
            { order: 3, nom: 'Avant Vente', url: '/SiteCollectionDocuments/ModOpEpilotAVV.pptx', date: '26/02/2020', pattern: 'perfco/Pages/Avv.aspx' },
            { order: 4, nom: 'Avant Vente', url: '/SiteCollectionDocuments/ModOpEpilotAVV_IAV.pptx', date: '26/02/2020', pattern: 'perfco/Pages/AvvIAV.aspx' },
            { order: 5, nom: 'E-conformité', url: '/SiteCollectionDocuments/E-CONFORMITE_V2_Final.pdf', date: '29/04/2020', pattern: 'perfco/Pages/E-conformite.aspx' }

        ];

        modesOperatoires.forEach(function (tuto) {
            if (!tuto.pattern) {
                vm.modesOperatoires.push(tuto);
            } else if (hasPattern(tuto)) {
                vm.modesOperatoires.push(tuto);
            }
        });

        vm.modesOperatoires = $filter('orderBy')(vm.modesOperatoires, 'ordre', true);

        function hasPattern(tuto) {
            return document.URL.toString().toLowerCase().indexOf(tuto.pattern.toLowerCase()) !== -1;
        }
    }

    vm.initializePage();
});
orangeCommonApp.app.controller('telechargementController', function telechargementController($scope, $controller, $rootScope, $uibModal, statistiqueService, telechargementService, $cookies) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'telechargement';
    vm.Panel.Open = false;

    //Filtres
    vm.Filtres = vm.Filtres || {};

    //Telechargements
    vm.telechargements = [];

    //Timer
    vm.timer = 120000;

    $controller('displayTopController', {
        $scope: vm
    });


    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    //Panel
    vm.Panel.Display = function () {
        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;

        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };
        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            statistiqueService.trackEvent("Global - Onglets - Ouverture telechargement");
        }
    }

    vm.openTelechargement = function (item) {
        if (item.StatusId == 2) {
            if (item.FichierUrl) {
                statistiqueService.trackEvent("Global - Telechargement - Ouverture fichier");
                window.open(item.FichierUrl, "_blank");
            }
            else {
                statistiqueService.trackEvent("Global - Telechargement - Fichier introuvable");
                alert('Le fichier est introuvable');
            }
        }
        else {
            if (confirm("Une erreur est survenue lors de la génération du fichier. \r\nVoulez-vous le recharger ?")) {
                // Rechargement du fichier
                statistiqueService.trackEvent("Global - Telechargement - Regeneration fichier");
                telechargementService.updateStatus(item.Id, 1).then(function sucess(result) {
                    vm.initializePage();
                });
            }
        }
    }

    vm.getTelechargements = function () {
        telechargementService.get().then(function sucess(result) {
            vm.telechargements = result;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }

    vm.delete = function (item, modal) {
        if (modal) {
            var confirmModalInstance = $uibModal.open({
                animation: true,
                templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/confirmPopup.html?version=EPilotCurrentVersion',
                controller: 'confirmPopupController',
                controllerAs: 'vm',
                resolve: {
                    titleToShow: function titleToShowResolve() { return undefined; },
                    textToShow: function textToShowResolve() { return undefined; },
                    htmlToShow: function htmlToShowResolve() {
                        return "Vous allez supprimer un téléchargement en cours?";
                    }
                }
            });
            confirmModalInstance.result.then(function () {
                telechargementService.updateStatus(item.Id, 4).then(function sucess(result) {
                    vm.initializePage();
                });
            });
        } else {
            telechargementService.updateStatus(item.Id, 4).then(function sucess(result) {
                vm.initializePage();
            });
        }

    }

    //Filtres

    vm.Filtres.StatusEnAttente = function (item) {
        return item.StatusId == 1 && item.IsStarted == false;
    }

    vm.Filtres.StatusEnCours = function (item) {
        return item.StatusId == 1 && item.IsStarted == true;
    }

    vm.Filtres.StatusDisponible = function (item) {
        return (item.StatusId == 2 || item.StatusId == 3);
    }

    //Scrollbar
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };

    // ==========================================
    // INIT
    // ==========================================

    setInterval(function () {
        if ($cookies.get("EPilot.Telechargement.Update") &&
            ($cookies.get("EPilot.Telechargement.Update") == true || $cookies.get("EPilot.Telechargement.Update") == "true")) {
            vm.initializePage();
            $cookies.put("EPilot.Telechargement.Update", false, { path: '/' });
            if (!vm.Panel.Open)
                $('.telechargement-top-button').click();
        }
    },
    2000);

    setInterval(
    function () {
        telechargementService.refresh().then(function sucess(result) {
            if (result.refreshLocalStorage &&
                (!$cookies.get('Epilot.LocalStorage.Refresh') || $cookies.get('Epilot.LocalStorage.Refresh') != moment().format('DD-MM-YYYY'))) {
    
                //window.sessionStorage.clear();
                //var expireDate = new Date();
                //expireDate.setDate(expireDate.getDate() + 2);
                //$cookies.put('Epilot.LocalStorage.Refresh', moment().format('DD-MM-YYYY'), { path: '/', expires: expireDate });
                //window.location.reload();
                //console.log("refresh");
            }
            loop1:
                for (var i = 0; i < vm.telechargements.length; i++) {
                    for (var j = 0; j < result.telechargements.length; j++) {
    
                        if (vm.telechargements[i].Id === result.telechargements[j].Id &&
                        vm.telechargements[i].StatusId != result.telechargements[j].StatusId &&
                        (result.telechargements[j].StatusId == 2 || result.telechargements[j].StatusId == 3)) {
                            $uibModal.open({
                                animation: true,
                                templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/infosPopup.html?version=EPilotCurrentVersion',
                                controller: 'infosPopupController',
                                controllerAs: 'vm',
                                resolve: {
                                    titleToShow: function titleToShowResolve() { return undefined },
                                    textToShow: function textToShowResolve() { return undefined; },
                                    htmlToShow: function htmlToShowResolve() {
                                        return 'Un ou plusieurs téléchargements sont disponibles';
                                    }
                                }
                            });
                            break loop1;
                        }
                    }
                }
            vm.telechargements = result.telechargements;
            $scope.$apply();
           // vm.initializePage();
        }, function error(err) {
            console.log(err);
        });
    },
    vm.timer);

    vm.initializePage = function () {

        vm.getTelechargements();
    }


    vm.initializePage();

});
orangeCommonApp.app.controller('rechercheClientController', function rechercheClientController($scope, $controller,
    $rootScope, moduleApp, statistiqueService, rechercheClientService, userService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'recherche-client';
    vm.Panel.Open = false;

    $controller('displayTopController', {
        $scope: vm
    });

    vm.siren, vm._siren, vm.selectedActeur, vm.selectedProduit, vm.selectedClient;
    vm.niveau = '';
    vm.domaines = [];
    vm.canAccess = false;
    vm.isCapa = false;
    vm.isClientNew = false;
    vm.idCapa;

    vm.acteur = {};
    vm.produit = {};
    vm.client = {};
    vm.isClient = true;
    vm.isActeur = false;
    vm.isProduit = false;
    vm.isVendeur = false;
    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    vm.toggleBtn = function(type) {
        if (type == 1) {
            vm.isClient = true;
            vm.isActeur = false;
            vm.isProduit = false;
        }
        if (type == 2) {
            vm.isClient = false;
            vm.isActeur = true;
            vm.isProduit = false;
        }
        if (type == 3) {
            vm.isClient = false;
            vm.isActeur = false;
            vm.isProduit = true;
        }
    }
    vm.initializePage = function () {
        userService.getUser()
            .then(function success(response) {
                if (response.status == 200) {
                    if (response.data) {
                        if (response.data.PopulationCode == 'IC' ||
                            response.data.PopulationCode == 'RCT' ||
                            response.data.PopulationCode == 'AM' ||
                            response.data.PopulationCode == 'AUTRES-VENDEURS' ||
                            response.data.PopulationCode == 'ICS') {
                            vm.isVendeur = true;
                        } else {
                            vm.isVendeur = false;
                        }
                        var restrictedAccess = $('#PropertyFicheClientRestrictedAccess').text().split(';').filter(Boolean);
                        if (restrictedAccess.indexOf(response.data.PopulationCode) == -1) {
                            //vm.canAccess = true;
                            $('#recherche-client').show();
                        } else {
                            //vm.canAccess = false;
                            $('#recherche-client').hide();
                        }
                    }

                }
            });
    }

    
    vm.Panel.Display = function () {

        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;
        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };

        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            //notificationCommonService.getAllActives(moduleApp).then(function getAllSuccess(result) {
            //    vm.notifications = result.data;
            //    vm.nbNotification = 0;
            //});

            statistiqueService.trackEvent("Global - Onglets - Ouverture recherche client");
        }
        
    }

    // ==========================================
    // Client
    // ==========================================
    vm.onSelect = function ($item, $model, $label) {
        vm.client = $item;
        vm.niveau = $item.Niveau;
        vm.isClientNew = $item.IsClientNew;
        vm.isCapa = $item.IsClientCapa;
        vm.idCapa = $item.IdClientCapa;
        vm._siren = $item.Siren;
        if (vm.isCapa) {
            sessionStorage.setItem('Epilot.RechercheClientCapaId', JSON.stringify($item.IdClientCapa));
        }
        if (vm.isClientNew) {
            sessionStorage.setItem('Epilot.RechercheClientCodeClientSommet', JSON.stringify($item.CodeClient));
        }
        rechercheClientService.getDomaines($item.Siren, vm.niveau)
           .then(function success(response) {
               if (response.status == 200) {
                   vm.domaines = response.data;
                   if (response.data.length > 0) {
                       vm.parcNotExist = false;
                   } else {
                       vm.parcNotExist = true;
                   }
               }
           });
    };

    vm.export = function(id) {
        console.log(id);
        var exportUrl = epilotproperties.getWebServiceUrl() + "/RechercheClient/ExportParc/"
            + vm._siren + "/" + vm.niveau + "/" + id;
        window.open(exportUrl, '_blank');
    }

    vm.searchClient = function(searchInput) {
        if (!searchInput) {
            return [];
        }
        if (vm.isGroupe) {
            vm.niveau = 'G';
        } else {
            vm.niveau = 'E';
        }
        return rechercheClientService.getClients(vm.niveau, searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }

    vm.openCaParc = function () {
        if (vm.isCapa) {
            var url = window.location.protocol +
                "//" +
                window.location.host +
                "/" +
                "perfco/_layouts/15/Orange.EPilot/Pages/RechercheClientCaParc.aspx";
            window.open(url, '_blank');
        }
    }

    vm.openFicheClient = function () {
        if (vm.isClientNew) {
            var url = window.location.protocol +
                "//" +
                window.location.host +
                "/" +
                "perfco/_layouts/15/Orange.EPilot/Pages/RechercheClient.aspx" ;
            window.open(url, '_blank');
        }
    }

    vm.onChange = function() {
        vm.domaines = [];
        vm.isCapa = false;
        vm.parcNotExist = false;
    }

    vm.openPmdLink = function () {
        statistiqueService.trackEvent("Global - Onglets - Ouverture lien PMD");
        var codeClient = JSON.parse(sessionStorage.getItem("Epilot.RechercheClientCodeClientSommet"));
        if (codeClient.startsWith('E')) {
            var url = $('#PropertyPmdReportUrl').text() + "&filter=VM_TIERS%2fENTRPRS_ID%20eq '" + codeClient.substring(1) + "'";
            window.open(url, '_blank');
        }
        if (codeClient.startsWith('G')) {
            var url = $('#PropertyPmdReportUrl').text() + "&filter=VM_TIERS%2fGROUPE_ID%20eq '" + codeClient.substring(1) + "'";
            window.open(url, '_blank');
        }
    }

    // ==========================================
    // Acteur
    // ==========================================
    vm.onSelectActeur = function ($item, $model, $label) {
        vm.acteur = $item;
        sessionStorage.setItem('Epilot.RechercheActeurCodeAlliance', JSON.stringify($item.CodeActeur));
    };

    vm.searchActeur = function (searchInput) {
        if (!searchInput) {
            return [];
        }
        return rechercheClientService.getActeurs(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }
    vm.openFicheActeur = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/RechercheActeur.aspx";
        window.open(url, '_blank');
    }

    vm.openBenchClient = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/BenchClient.aspx";
        window.open(url, '_blank');
    }

    vm.openBenchVendeur = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/BenchVendeur.aspx";
        window.open(url, '_blank');
    }
    vm.onChangeActeur = function () {

    }

    // ==========================================
    // Produit
    // ==========================================
    vm.onSelectProduit = function ($item, $model, $label) {
        vm.produit = $item; 
        sessionStorage.setItem('Epilot.RechercheProduitCode', JSON.stringify($item.CodeProduit));
    };

    vm.searchProduit = function (searchInput) {
        if (!searchInput) {
            return [];
        }
        return rechercheClientService.getProduits(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }
    vm.openFicheProduit = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/RechercheProduit.aspx";
        window.open(url, '_blank');
    }
    vm.onChangeProduit = function () {

    }

    // ==========================================
    // INIT
    // ==========================================
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };


    vm.initializePage();
});
orangeCommonApp.app.controller('telechargementAddNewController', function telechargementAddNewController($scope, $uibModal, $controller, $rootScope, $http, $cookies) {

    // ==========================================
    // VARIABLES
    // ==========================================

    //Page
    $scope.Page = $scope.Page || {};

    //Url
    $scope.Url = $scope.Url || {};

    //Telechargement
    $scope.Telechargement = $scope.Telechargement || {};

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    //Page
    $scope.Page.Init = function () {
        //var ua = window.navigator.userAgent;
        //var msie = ua.indexOf("MSIE ");
        //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            var id = $scope.Url.GetId();
            var param = $scope.Url.GetParam();

            if (id) {
                $scope.Telechargement.Save(id, param).then(function (result) {
                    if (result.status == 200 && result.data == null) {
                        $cookies.put("EPilot.Telechargement.Update", true, { path: '/' });
                        $scope.Page.Close();
                    } else {
                        alert(result.data.Erreurs);
                        $scope.Page.Close();
                    }
                }
                );
            } else {
                alert('Une erreur est survenue. Paramètre "id" manquant dans l url.');
                $scope.Page.Close();
            }
        //} else {

        //    //$uibModal.open({
        //    //    animation: true,
        //    //    templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/infosPopup.html?version=EPilotCurrentVersion',
        //    //    controller: 'infosPopupController',
        //    //    controllerAs: 'vm',
        //    //    resolve: {
        //    //        titleToShow: function titleToShowResolve() { return undefined },
        //    //        textToShow: function textToShowResolve() { return undefined; },
        //    //        htmlToShow: function htmlToShowResolve() {
        //    //            return 'Le téléchargement que vous avez lancé n’est pas autorisé sur Firefox! <br> Nous vous invitions à le lancer depuis Internet explorer.';
        //    //        }
        //    //    }
        //    //});
        //}
    }

    $scope.Page.Close = function () {

        try {
            window.open('', '_parent', '');
            window.close();
        }
        catch (e) {

        }

        try {
            this.focus();
            self.opener = this;
            self.close();
        }
        catch (e) {

        }

        try {
            window.open('', '_self', '');
            window.close();
        }
        catch (e) {

        }
    }

    //Telechargement
    $scope.Telechargement.Save = function (id, param) {
        var url = epilotproperties.getWebServiceUrl() + "Telechargements/New/" + id + "/" + param;
        return $http.get(url);
    }

    //URL
    $scope.Url.GetId = function () {
        return $scope.Url.GetParameters("id");
    }

    $scope.Url.GetParam = function () {
        return $scope.Url.GetParameters("param");
    }

    $scope.Url.GetParameters = function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                var sub = sParameterName[0].length + 1;
                return sParameterName[1] === undefined ? true : sURLVariables[i].substring(sub);
            }
        }
    };

    // ==========================================
    //  INIT
    // ==========================================
    $scope.Page.Init();
});
orangeCommonApp.app.controller('homeController', function homeController($scope, $controller, $rootScope, moduleApp, homeService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    $scope.moduleId;
    $scope.homePage;
    $scope.message = 'Redirection en cours de chargement...';

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    $scope.initializePage = function (id) {

        //Recupération de la page d'accueil de l'utilisateur
        homeService.getByModule(id).then(function (result) {
            $scope.homePage = result.data.PageUrl;

            if ($scope.homePage != null & $scope.homePage != 'undefined') {
                //Redirection vers la page d'accueil de l'utilisateur
                window.location.replace($scope.homePage);
            }
            else {
                $scope.message = 'Aucune redirection configurée. Séléectionner un menu sur la gauche.';
            }

        });


    }
    
});
orangeCommonApp.app.controller('homeNavController', function homeNavController($scope, $controller,
    $rootScope, moduleApp, statistiqueService, rechercheClientService, userService, homeNavService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    //PANEL
    vm.Panel = vm.Panel || {};
    vm.Panel.Name = 'recherche-client';
    vm.Panel.Open = false;

    $controller('displayTopController', {
        $scope: vm
    });

    vm.siren, vm._siren, vm.selectedActeur, vm.selectedProduit, vm.selectedClient;
    vm.niveau = '';
    vm.domaines = [];
    vm.canAccess = false;
    vm.isCapa = false;
    vm.isClientNew = false;
    vm.idCapa;

    vm.acteur = {};
    vm.produit = {};
    vm.client = {};
    vm.isClient = true;
    vm.isActeur = false;
    vm.isProduit = false;
    vm.isVendeur = false;
    vm.baseUrl = window.location.origin;
    vm.listBlocs = [];
    vm.listBlocsItems = [];
    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    vm.toggleBtn = function (type) {
        if (type == 1) {
            vm.isClient = true;
            vm.isActeur = false;
            vm.isProduit = false;
        }
        if (type == 2) {
            vm.isClient = false;
            vm.isActeur = true;
            vm.isProduit = false;
        }
        if (type == 3) {
            vm.isClient = false;
            vm.isActeur = false;
            vm.isProduit = true;
        }
    }
    vm.initializePage = function () {
        userService.getUser()
            .then(function success(response) {
                if (response.status == 200) {
                    if (response.data) {
                        //Recherche fiches access
                        if (response.data.PopulationCode == 'IC' ||
                            response.data.PopulationCode == 'RCT' ||
                            response.data.PopulationCode == 'AM' ||
                            response.data.PopulationCode == 'AUTRES-VENDEURS' ||
                            response.data.PopulationCode == 'ICS') {
                            vm.isVendeur = true;
                        } else {
                            vm.isVendeur = false;
                        }
                        var restrictedAccess = $('#PropertyFicheClientRestrictedAccess').text().split(';').filter(Boolean);
                        if (restrictedAccess.indexOf(response.data.PopulationCode) == -1) {
                            $("#home-recherche-client").show();
                        } else {
                            $("#home-recherche-client").hide();
                        }

                        //Accueil bloc + Items
                        homeNavService.getAllBlocs()
                            .then(function (getResponse) {
                                if (getResponse.data.length > 0) {
                                    for (var i = 0; i < getResponse.data.length; i++) {
                                        var blocPopulations = getResponse.data[i].Populations.split(';');
                                        if (getResponse.data[i].Populations == "" || blocPopulations.indexOf(response.data.PopulationCode) > -1) {
                                            vm.listBlocs.push(getResponse.data[i]);
                                        }
                                    }
                                }
                                //vm.listBlocs = getResponse.data;
                            });
                        homeNavService.getAllBlocItems()
                            .then(function (getResponse) {
                                if (getResponse.data.length > 0) {
                                    for (var i = 0; i < getResponse.data.length; i++) {
                                        var blocItemsPopulations = getResponse.data[i].Populations.split(';');
                                        if (getResponse.data[i].Populations == "" || blocItemsPopulations.indexOf(response.data.PopulationCode) > -1) {
                                            vm.listBlocsItems.push(getResponse.data[i]);
                                        }
                                    }
                                }
                                //vm.listBlocsItems = getResponse.data;
                            });
                    }

                }
            });
    }


    vm.Panel.Display = function () {

        if (!$rootScope.topPanel || $rootScope.topPanel.panel != vm.Panel.Name)
            vm.Panel.Open = false;
        $rootScope.topPanel = { panel: vm.Panel.Name, statut: !vm.Panel.Open };

        vm.Panel.Open = !vm.Panel.Open;

        if (vm.Panel.Open) {
            //notificationCommonService.getAllActives(moduleApp).then(function getAllSuccess(result) {
            //    vm.notifications = result.data;
            //    vm.nbNotification = 0;
            //});

            statistiqueService.trackEvent("Global - Onglets - Ouverture recherche client");
        }

    }

    // ==========================================
    // Client
    // ==========================================
    vm.onSelect = function ($item, $model, $label) {
        vm.client = $item;
        vm.niveau = $item.Niveau;
        vm.isClientNew = $item.IsClientNew;
        vm.isCapa = $item.IsClientCapa;
        vm.idCapa = $item.IdClientCapa;
        vm._siren = $item.Siren;
        if (vm.isCapa) {
            sessionStorage.setItem('Epilot.RechercheClientCapaId', JSON.stringify($item.IdClientCapa));
        }
        if (vm.isClientNew) {
            sessionStorage.setItem('Epilot.RechercheClientCodeClientSommet', JSON.stringify($item.CodeClient));
        }
        rechercheClientService.getDomaines($item.Siren, vm.niveau)
           .then(function success(response) {
               if (response.status == 200) {
                   vm.domaines = response.data;
                   if (response.data.length > 0) {
                       vm.parcNotExist = false;
                   } else {
                       vm.parcNotExist = true;
                   }
               }
           });
    };

    vm.export = function (id) {
        console.log(id);
        var exportUrl = epilotproperties.getWebServiceUrl() + "/RechercheClient/ExportParc/"
            + vm._siren + "/" + vm.niveau + "/" + id;
        window.open(exportUrl, '_blank');
    }

    vm.searchClient = function (searchInput) {
        if (!searchInput) {
            return [];
        }
        if (vm.isGroupe) {
            vm.niveau = 'G';
        } else {
            vm.niveau = 'E';
        }
        return rechercheClientService.getClients(vm.niveau, searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }

    vm.openCaParc = function () {
        if (vm.isCapa) {
            var url = window.location.protocol +
                "//" +
                window.location.host +
                "/" +
                "perfco/_layouts/15/Orange.EPilot/Pages/RechercheClientCaParc.aspx";
            window.open(url, '_blank');
        }
    }

    vm.openFicheClient = function () {
        if (vm.isClientNew) {
            var url = window.location.protocol +
                "//" +
                window.location.host +
                "/" +
                "perfco/_layouts/15/Orange.EPilot/Pages/RechercheClient.aspx";
            window.open(url, '_blank');
        }
    }

    vm.onChange = function () {
        vm.domaines = [];
        vm.isCapa = false;
        vm.parcNotExist = false;
    }

    vm.openPmdLink = function () {
        statistiqueService.trackEvent("Global - Onglets - Ouverture lien PMD");
        var codeClient = JSON.parse(sessionStorage.getItem("Epilot.RechercheClientCodeClientSommet"));
        if (codeClient.startsWith('E')) {
            var url = $('#PropertyPmdReportUrl').text() + "&filter=VM_TIERS%2fENTRPRS_ID%20eq '" + codeClient.substring(1) + "'";
            window.open(url, '_blank');
        }
        if (codeClient.startsWith('G')) {
            var url = $('#PropertyPmdReportUrl').text() + "&filter=VM_TIERS%2fGROUPE_ID%20eq '" + codeClient.substring(1) + "'";
            window.open(url, '_blank');
        }
    }

    // ==========================================
    // Acteur
    // ==========================================
    vm.onSelectActeur = function ($item, $model, $label) {
        vm.acteur = $item;
        sessionStorage.setItem('Epilot.RechercheActeurCodeAlliance', JSON.stringify($item.CodeActeur));
    };

    vm.searchActeur = function (searchInput) {
        if (!searchInput) {
            return [];
        }
        return rechercheClientService.getActeurs(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }
    vm.openFicheActeur = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/RechercheActeur.aspx";
        window.open(url, '_blank');
    }

    vm.openBenchClient = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/BenchClient.aspx";
        window.open(url, '_blank');
    }

    vm.openBenchVendeur = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/BenchVendeur.aspx";
        window.open(url, '_blank');
    }
    vm.onChangeActeur = function () {

    }

    // ==========================================
    // Produit
    // ==========================================
    vm.onSelectProduit = function ($item, $model, $label) {
        vm.produit = $item;
        sessionStorage.setItem('Epilot.RechercheProduitCode', JSON.stringify($item.CodeProduit));
    };

    vm.searchProduit = function (searchInput) {
        if (!searchInput) {
            return [];
        }
        return rechercheClientService.getProduits(searchInput)
            .then(function success(response) {
                if (response.status == 200) {
                    return response.data;
                }
            });
    }
    vm.openFicheProduit = function () {
        var url = window.location.protocol +
            "//" +
            window.location.host +
            "/" +
            "perfco/_layouts/15/Orange.EPilot/Pages/RechercheProduit.aspx";
        window.open(url, '_blank');
    }
    vm.onChangeProduit = function () {

    }

    // ==========================================
    // INIT
    // ==========================================
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };


    vm.initializePage();
});

orangeCommonApp.app.controller('desabonnementController', function desabonnementController($scope, $controller, $uibModal, $rootScope, userService) {

    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;


    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================

    vm.initializePage = function () {
        userService.desabonnement()
            .then(function success(response) {
                if (response.status == 200) {

                    //alert('OK');
                    $uibModal.open({
                        animation: true,
                        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/infosPopup.html?version=EPilotCurrentVersion',
                        controller: 'infosPopupController',
                        controllerAs: 'vm',
                        resolve: {
                            titleToShow: function titleToShowResolve() { return undefined },
                            textToShow: function textToShowResolve() { return undefined; },
                            htmlToShow: function htmlToShowResolve() {
                                return 'Votre demande a bien été prise en compte. \n Vous ne recevrez plus les newsletters.';
                            }
                        }
                    });
                }
            });
    }

    // ==========================================
    // INIT
    // ==========================================
    vm.jQueryScrollbarOptions = {
        "onScroll": function (x, y) {
        }
    };


    vm.initializePage();
});