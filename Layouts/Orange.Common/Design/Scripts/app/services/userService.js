orangeCommonApp.app.service('userService', function userService($http, $q) {
    this.getAllUsers = function (searchInput) {
        var url = epilotproperties.getWebServiceUrl() + "User/GetUtilisateurs/" + searchInput;
        return $http.get(url);
    }

    this.searchbyAgence = function (agenceId, searchInput) {
        var url = epilotproperties.getWebServiceUrl() + "User/Search/" + agenceId + "/" + searchInput;
        return $http.get(url);
    }


    this.getEPilotWebServiceUrl = function () {
        var webServiceUrl = $('#PropertyEPilotWebApiUrl').text();
        if (!webServiceUrl) {
                var jqxhr = $.ajax({
                    type: "GET",
                    url: "/_layouts/15/Orange.Common/handlers/GlobalInfo.ashx",
                    dataType: 'json',
                    cache: false,
                    async: false
                });

                // 'async' has to be 'false' for this to work
                var result = { valid: jqxhr.statusText, data: jqxhr.responseJSON };
                if (result.data && result.valid == "OK" && result.data.EPilotWS) {
                    return result.data.EPilotWS.trim();
                }
        }
        else {
            return webServiceUrl;
        }
       
    }

    this.getRapportFiltre = function (codeAlliance) {
            var deferred = $q.defer();
            var url = this.getEPilotWebServiceUrl() + "User/GetRapportFiltreByCodeAlliance/" + codeAlliance;
            return $http.get(url);
    }

    this.getRapportFiltreCapa = function (codeAlliance) {
        var deferred = $q.defer();
        var url = this.getEPilotWebServiceUrl() + "User/GetRapportFiltreCapaByCodeAlliance/" + codeAlliance;
        return $http.get(url);
    }

    this.getCurrent = function () {
        if (!sessionStorage.getItem("Epilot.User.Current")) {
            var deferred = $q.defer();
            var url = this.getEPilotWebServiceUrl() + "User/Current/";
            $http.get(url).then(function success(result) {
                if (result.data && result.status == 200) {
                    sessionStorage.setItem("Epilot.User.Current", JSON.stringify(result.data));
                    deferred.resolve(result.data);
                }
            })
            return deferred.promise;
        }
        else {
            return JSON.parse(sessionStorage.getItem("Epilot.User.Current"));
        }
    }

    this.getCurrentNoCache = function () {
        var url = epilotproperties.getWebServiceUrl() + "User/Current/";
        return $http.get(url);
    }

    this.getUser = function () {
        var url = epilotproperties.getWebServiceUrl() + "User/" ;
        return $http.get(url);
    }

    this.desabonnement = function () {
        var url = epilotproperties.getWebServiceUrl() + "User/Desabonnement/";
        return $http.get(url);
    }

});