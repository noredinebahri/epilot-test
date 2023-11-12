orangeCommonApp.app.controller('notificationCommonPopupController', function ($uibModalInstance, notificationCommonService, item) {
    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.titleToShow = item.Titre;
    vm.textToShow = item.Texte;
    vm.item = item;

    vm.doNotDisplay = function() {
        notificationCommonService.utilisateurNotificationSave(item).then(
            function saveSuccess(postResponse) {
                $uibModalInstance.close();
            },
            function saveFailed(error) {
                logger.logError('Impossible de sauvegarder cet élément: ' + error.message, error);
            });
    }
});
