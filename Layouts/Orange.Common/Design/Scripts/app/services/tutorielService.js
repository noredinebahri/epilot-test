orangeCommonApp.app.service('tutorielService', function tutorielService($http) {

    this.avu = function (guid) {
        var url = epilotproperties.getWebServiceUrl() + "Tutoriel/AVu/" + guid;
        return $http.get(url);
    }

    this.save = function (item) {
        var url = epilotproperties.getWebServiceUrl() + "Tutoriel/Save/";
        return $http.post(url, item);
    }
});