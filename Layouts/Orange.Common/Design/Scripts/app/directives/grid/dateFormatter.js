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