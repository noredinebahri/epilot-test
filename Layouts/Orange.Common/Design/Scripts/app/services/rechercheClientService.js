orangeCommonApp.app.service('rechercheClientService', function rechercheClientService($http) {

    this.getClients = function (niveau, searchInput) {

        var url = epilotproperties.getWebServiceUrl() + "RechercheClient/GetClients/" + searchInput;
        return $http.get(url);
    }

    this.getActeurs = function (searchInput) {

        var url = epilotproperties.getWebServiceUrl() + "RechercheActeur/GetActeurs/" + searchInput;
        return $http.get(url);
    }

    this.getProduits = function (searchInput) {

        var url = epilotproperties.getWebServiceUrl() + "RechercheProduit/GetProduits/" + searchInput;
        return $http.get(url);
    }
    this.getDomaines = function (siren, niveau) {

        var url = epilotproperties.getWebServiceUrl() + "RechercheClient/GetDomaines/" + siren + "/" + niveau;
        return $http.get(url);
    }
});