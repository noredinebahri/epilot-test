orangeCommonApp.app.service('telechargementService', function telechargementService($http) {

    this.get = function () {
        var url = epilotproperties.getWebServiceUrl() + "Telechargements/";
        $.support.cors = true;
        return $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        });
    }

    this.refresh = function () {
        var url = epilotproperties.getWebServiceUrl() + "Telechargements/Refresh/";

        $.support.cors = true;
        return $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            xhrFields: {
                withCredentials: true
            }
        });
    }

    this.updateStatus = function (id, statusId) {
        var url = epilotproperties.getWebServiceUrl() + "Telechargements/UpdateStatus/" + id + "/" + statusId;
        return $http.get(url);
    }
});