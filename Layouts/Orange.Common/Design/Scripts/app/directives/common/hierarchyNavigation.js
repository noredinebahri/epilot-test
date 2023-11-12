orangeCommonApp.app.directive('hierarchyNavigation', function hierarchyNavigation($rootScope, moduleApp) {

    var displaySelectedUser = function (selectedActor) {
        if (moduleApp != 1)
            return;

        var connectedActor = JSON.parse(sessionStorage.getItem("Epilot.Perfco.Actor"));

        if (!selectedActor || !connectedActor || selectedActor.Code == connectedActor.Code) {
            $("#page-title-seleted-user-pipe").text("");
            $("#page-title-seleted-user-name").text("");
            $("#page-title-seleted-user-name").attr("title", "");
            $("#page-title-seleted-user-agency").text("");
        }

        if (selectedActor && connectedActor && selectedActor.Code != connectedActor.Code) {
            $("#page-title-seleted-user-pipe").text("| ");

            $("#page-title-seleted-user-name").text(selectedActor.Label && selectedActor.Label.length > 18 
                    ? selectedActor.Label.substring(0,18) + "..."
                    : selectedActor.Label);

            $("#page-title-seleted-user-name").attr("title", selectedActor.Label);

            $("#page-title-seleted-user-agency").text("");
            if (selectedActor.AgencyLabel) {
                $("#page-title-seleted-user-agency").text(" / " + selectedActor.AgencyLabel);
            }
        }
    }

    return {
        restrict: 'E',
        replace: true,
        templateUrl: '/_layouts/15/Orange.Common/Design/Scripts/app/views/panels/hierarchyNavigation.html?version=EPilotCurrentVersion',
        link: function (scope, element, attr) {

            $rootScope.$watch(
                function navigationActorWatchExpression() {
                    return sessionStorage.getItem("Epilot.Perfco.NavigationActor");
                },
                function navigationActorListener(newValue, oldValue) {
                    if (newValue) {
                        var selectedActor = JSON.parse(newValue)
                        displaySelectedUser(selectedActor);
                    }
                }, true);

            $('.com-topnav-alerts #hierarchie').html = "";
            $('.com-topnav-alerts #hierarchie').append($('.hierarchie-top-button'));
        },
        controller:'@', //specify the controller is an attribute
        name:'ctrlName', //name of the attribute.
        controllerAs: 'vm'
    };
});

