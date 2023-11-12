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