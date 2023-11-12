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