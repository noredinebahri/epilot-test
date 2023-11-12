orangeCommonApp.app.service('homeService', function homeService($http) {

    this.getByModule = function (module) {
        var url = module ?
            epilotproperties.getWebServiceUrl() + "Home/" + module
            : epilotproperties.getWebServiceUrl() + "Home/";

        return $http.get(url);
    }
    
    
});