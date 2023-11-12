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