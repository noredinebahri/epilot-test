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