orangeCommonApp.app.controller('infosPopupNotCloseableController', function ($uibModalInstance, titleToShow, textToShow, htmlToShow) {
    // ==========================================
    // VARIABLES
    // ==========================================
    var vm = this;

    vm.titleToShow = titleToShow;
    vm.textToShow = textToShow;
    vm.htmlToShow = htmlToShow;
});
