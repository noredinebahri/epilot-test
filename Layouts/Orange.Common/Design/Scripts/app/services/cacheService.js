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