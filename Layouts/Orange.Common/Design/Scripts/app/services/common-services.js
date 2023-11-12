orangeCommonApp.app.service('statistiqueService', function statistiqueService($http) {

    this.trackEvent = function (eventMessage) {
        
        //TODO : Implementer la gestion des evenements custom avec Google Analytics
        if (typeof (ga) != 'undefined')
        {
            console.log(eventMessage);
            //ga('send', 'event', eventMessage, null, null);

            gtag('js', new Date());
            gtag('config', googleAnalyticsKey);

            gtag('event',
                eventMessage, {
                    'event_category': 'statistique',
                    'event_label': eventMessage
           });
        }
        

    }
    
});
orangeCommonApp.app.service('notificationCommonService', function notificationCommonService($http) {

    this.getAllActives = function (module) {
        if (!module)
            return;

        var url = epilotproperties.getWebServiceUrl() + "Notification/GetActiveByModule/" + module;
        return $http.get(url);
    }

    this.count = function (module) {
        if (!module)
            return;

        var url = epilotproperties.getWebServiceUrl() + "Notification/Count/" + module;
        return $http.get(url);
    }

    this.utilisateurNotificationSave = function utilisateurNotificationSave(item) {
        var url = epilotproperties.getWebServiceUrl() + "NotificationPopup/UtilisateurNotificationSave";
        return $http.post(url, item);
    }

    this.getAllPopupNotificationActives = function getAllPopupNotificationActives() {
        var url = epilotproperties.getWebServiceUrl() + "NotificationPopup/GetAllActif/" ;
        return $http.get(url);
    }

});
orangeCommonApp.app.service('blocNoteService', function blocNoteService($http) {

    this.getAll = function (type,codeAlliance) {
        var url = codeAlliance ?
            epilotproperties.getWebServiceUrl() + "Note/GetAll/" + type + '/' + codeAlliance
            : epilotproperties.getWebServiceUrl() + "Note/GetAll/" + type + '/';

        return $http.get(url);
    }

    this.count = function () {
        var url = epilotproperties.getWebServiceUrl() + "Note/Count/";
        return $http.get(url);
    }

    this.read = function (id) {
        var url = epilotproperties.getWebServiceUrl() + "Note/Read/" + id;
        return $http.get(url);
    }

    this.delete = function (id) {
        var url = epilotproperties.getWebServiceUrl() + "Note/Delete/" + id;
        return $http.get(url);
    }

    this.save = function (item) {
        var url = epilotproperties.getWebServiceUrl() + "Note/Save/";
        return $http.post(url, item);
    }

    this.actors = function (search) {
        var url = epilotproperties.getWebServiceUrl() + "Note/SearchActor/" + search;
        return $http.get(url);
    }

    this.saveCommentaire = function (commentaire) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/Save";
        return $http.post(url, commentaire);
    }

    this.getAllCommentaires = function (idNote) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/GetAll/" + idNote;
        return $http.get(url);
    }

    this.deleteCommentaire = function (idNote) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/Delete/" + idNote;
        return $http.get(url);
    }

    this.readCommentaire = function (idNote) {
        var url = epilotproperties.getWebServiceUrl() + "NoteCommentaire/Read/" + idNote;
        return $http.get(url);
    }

    this.getAllFavoris = function () {
        var url = epilotproperties.getWebServiceUrl() + "NoteFavoris/GetAll/";
        return $http.get(url);
    }

    this.saveFavoris = function (favori) {
        var url = epilotproperties.getWebServiceUrl() + "NoteFavoris/Save";
        return $http.post(url, favori);
    }

    this.deleteFavoris = function (id) {
        var url = epilotproperties.getWebServiceUrl() + "NoteFavoris/Delete/" + id;
        return $http.get(url);
    }

});
orangeCommonApp.app.service('homeService', function homeService($http) {

    this.getByModule = function (module) {
        var url = module ?
            epilotproperties.getWebServiceUrl() + "Home/" + module
            : epilotproperties.getWebServiceUrl() + "Home/";

        return $http.get(url);
    }
    
    
});
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
orangeCommonApp.app.service('cacheService', function cacheService($http, $q) {
    this.getCache = function (url, forceReload) {
        var deferred = $q.defer();

        var cachedValue = JSON.parse(sessionStorage.getItem(url));
        if (!forceReload && cachedValue) {
            logger.logInfo('Fetching cached value for : ' + url);
            deferred.resolve(cachedValue);

            return deferred.promise;

        } else {
            $http.get(url).then(
                                function success(getResponse) {
                                    if (getResponse.status == 200) {
                                        logger.logInfo('Creating cache value for : ' + url);

                                        try {
                                            sessionStorage.setItem(url, JSON.stringify(getResponse))
                                        } catch (e) {
                                            if (e.name == 'QuotaExceededError' || e.name == 'NS_ERROR_DOM_QUOTA_REACHED') {
                                                sessionStorage.clear();
                                                                                        }
                                        }

                                        deferred.resolve(getResponse);
                                    }
                                    else {
                                        logger.logInfo('Unable to load data to be cached from : ' + url, getResponse);
                                        deferred.resolve();
                                    }
                                },
                                function error(error) {
                                    logger.logInfo('Unable to load data to be cached from : ' + url + ' : ' + error.message, error);
                                    deferred.reject(error);
                                });
        }

        return deferred.promise;
    }

    this.setCache = function (key, value) {
        
        logger.logInfo('Changing cache value for : ' + key, value);

        try {
            sessionStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            // Clear localStorage if the quota was reached.
            if (e.name == 'QuotaExceededError' || e.name == 'NS_ERROR_DOM_QUOTA_REACHED') {
                sessionStorage.clear();
            }
        }
    }
});
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