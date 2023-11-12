orangeCommonApp.app.service('homeNavService', function homeNavService($http) {

    this.getAllBlocs = function getAll() {
        var url = epilotproperties.getWebServiceUrl() + "AccueilBloc/GetAll/";
        return $http.get(url);
    }

    this.getAllBlocItems = function getAll() {
        var url = epilotproperties.getWebServiceUrl() + "AccueilBloc/Items/GetAll/";
        return $http.get(url);
    }
    
});