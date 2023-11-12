orangeCommonApp.app.controller('telechargementAddNewController', function telechargementAddNewController($scope, $uibModal, $controller, $rootScope, $http, $cookies) {

    // ==========================================
    // VARIABLES
    // ==========================================

    //Page
    $scope.Page = $scope.Page || {};

    //Url
    $scope.Url = $scope.Url || {};

    //Telechargement
    $scope.Telechargement = $scope.Telechargement || {};

    // ==========================================
    // CONTROLLER FUNCTIONS
    // ==========================================
    //Page
    $scope.Page.Init = function () {
        //var ua = window.navigator.userAgent;
        //var msie = ua.indexOf("MSIE ");
        //if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            var id = $scope.Url.GetId();
            var param = $scope.Url.GetParam();

            if (id) {
                $scope.Telechargement.Save(id, param).then(function (result) {
                    if (result.status == 200 && result.data == null) {
                        $cookies.put("EPilot.Telechargement.Update", true, { path: '/' });
                        $scope.Page.Close();
                    } else {
                        alert(result.data.Erreurs);
                        $scope.Page.Close();
                    }
                }
                );
            } else {
                alert('Une erreur est survenue. Paramètre "id" manquant dans l url.');
                $scope.Page.Close();
            }
        //} else {

        //    //$uibModal.open({
        //    //    animation: true,
        //    //    templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/infosPopup.html?version=EPilotCurrentVersion',
        //    //    controller: 'infosPopupController',
        //    //    controllerAs: 'vm',
        //    //    resolve: {
        //    //        titleToShow: function titleToShowResolve() { return undefined },
        //    //        textToShow: function textToShowResolve() { return undefined; },
        //    //        htmlToShow: function htmlToShowResolve() {
        //    //            return 'Le téléchargement que vous avez lancé n’est pas autorisé sur Firefox! <br> Nous vous invitions à le lancer depuis Internet explorer.';
        //    //        }
        //    //    }
        //    //});
        //}
    }

    $scope.Page.Close = function () {

        try {
            window.open('', '_parent', '');
            window.close();
        }
        catch (e) {

        }

        try {
            this.focus();
            self.opener = this;
            self.close();
        }
        catch (e) {

        }

        try {
            window.open('', '_self', '');
            window.close();
        }
        catch (e) {

        }
    }

    //Telechargement
    $scope.Telechargement.Save = function (id, param) {
        var url = epilotproperties.getWebServiceUrl() + "Telechargements/New/" + id + "/" + param;
        return $http.get(url);
    }

    //URL
    $scope.Url.GetId = function () {
        return $scope.Url.GetParameters("id");
    }

    $scope.Url.GetParam = function () {
        return $scope.Url.GetParameters("param");
    }

    $scope.Url.GetParameters = function (sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                var sub = sParameterName[0].length + 1;
                return sParameterName[1] === undefined ? true : sURLVariables[i].substring(sub);
            }
        }
    };

    // ==========================================
    //  INIT
    // ==========================================
    $scope.Page.Init();
});