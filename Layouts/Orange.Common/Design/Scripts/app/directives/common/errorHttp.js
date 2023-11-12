orangeCommonApp.app.directive('errorHttp', function errorHttp($rootScope, $http, moduleApp) {
    return {
        restrict: 'E',
        replace: true,
        template: "<div class='com-error' role='alert' ng-if='errorhttp'>\
                        <i class='fas fa-exclamation-circle'></i>\
                        Une erreur est survenue :\
                        <span id='errorguid'></span>\
                        <span id='errormessage'></span>\
                        <span class='close-error' ng-click='close()'><i class='fas fa-times'></i></span>\
                   </div>",
        link: function (scope, element, attrs) {
            $rootScope.$watch("errorhttp", function (newValue, oldValue) {
                if (!newValue)
                    return;

                var error = "Une erreur est survenue.";
                var errorEnd = " Veuillez contacter votre administrateur.";

                if (newValue.status != 500) {
                    var item = {
                        Module: moduleApp,  
                        Code: newValue.status,
                        Message: newValue.statusText,
                        Params: "TODO",
                        Requete: newValue.config.url.toString(),
                        Trace: "GET - ERROR",
                        Type: 2
                    }

                    var url = epilotproperties.getWebServiceUrl() + "Log/Save";

                    $.support.cors = true;
                    $.ajax({
                        type: "POST",
                        url: url,
                        dataType: "json",
                        data: item,
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function (data) {
                            var guid = data.Guid;
                            if (newValue.status == 404)
                                error = "Désolé, le service que vous demandez est introuvable.";
                            else if (newValue.status == 401 || newValue.status == 403)
                                error = "Désolé, l'accès au service que vous demandez est interdit ou refusé.";
                        

                            $("#errorguid").text(guid)
                            $("#errormessage").text(error + errorEnd);
                        },
                        failure: function (result) {
                            console.error(result);
                            error = "Désolé, le service que vous demandez est introuvable.";
                            $("#errormessage").text(error + errorEnd);
                        },
                        error: function (result) {
                            console.error(result);
                            error = "Désolé, le service que vous demandez est introuvable.";
                            $("#errormessage").text(error + errorEnd);
                        }
                    });

                } else {
                    var message = newValue.statusText.split(":");
                    $("#errorguid").text(message[0]);
                    if (message[1])
                        $("#errormessage").text(message[1]);
                    else
                        $("#errormessage").text(errorEnd);
                }
            });

            scope.close = function () {
                $rootScope.errorhttp  = false;
            }
        }
    };
});