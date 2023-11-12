var orangeCommonApp = orangeCommonApp || {};
orangeCommonApp.app = angular.module('orangeCommonApp', ['ui.bootstrap', 'ngMaterial', 'ngMessages', 'textAngular', 'ngWYSIWYG', 'colorpicker.module', 'ngCookies']);

orangeCommonApp.app.value('moduleApp', '0');

orangeCommonApp.app.config(function orangeCommonAppConfig($compileProvider, $httpProvider, $provide) {

    // https://stackoverflow.com/questions/30037312/adding-color-to-textangular-is-there-an-easy-way-to-cause-the-colorpicker-to-clo
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){
        // $delegate is the taOptions we are decorating
        // register the tool with textAngular

        taRegisterTool('backgroundColor', {
            display: "<button colorpicker class='btn btn-default ng-scope' title='Background Color' type='button' colorpicker-close-on-select colorpicker-position='bottom' ng-model='backgroundColor' style='background-color: {{backgroundColor}}'><i class='fa fa-paint-brush'></i></button>",
            action: function (deferred) {
                var self = this;
                this.$editor().wrapSelection('backgroundColor', this.backgroundColor);
                if (typeof self.listener == 'undefined') {
                    self.listener = self.$watch('backgroundColor', function (newValue) {
                        self.$editor().wrapSelection('backColor', newValue);
                    });
                }
                self.$on('colorpicker-selected', function () {
                    deferred.resolve();
                });
                self.$on('colorpicker-closed', function () {
                    deferred.resolve();
                });
                return;
            }
        });
        taOptions.toolbar[1].unshift('backgroundColor');

        taRegisterTool('fontColor', {
            display: "<button colorpicker type='button' class='btn btn-default ng-scope'  title='Font Color'  colorpicker-close-on-select colorpicker-position='bottom' ng-model='fontColor' style='color: {{fontColor}}'><i class='fa fa-font '></i></button>",
            action: function (deferred) {
                var self = this;
                if (typeof self.listener == 'undefined') {
                    self.listener = self.$watch('fontColor', function (newValue) {
                        self.$editor().wrapSelection('foreColor', newValue);
                    });
                }
                self.$on('colorpicker-selected', function () {
                    deferred.resolve();
                });
                self.$on('colorpicker-closed', function () {
                    deferred.resolve();
                });
                return false;
            }
        });
        taOptions.toolbar[1].unshift('fontColor');

        taOptions.setup.textEditorSetup=function($element) {
            $element.attr('ui-codemirror', '');
        };
        return taOptions;
    }]);

    // https://github.com/textAngular/textAngular/issues/224#issuecomment-81960485
    $provide.decorator('taOptions', ['taCustomRenderers', '$delegate', function(taCustomRenderers, taOptions) {
        taCustomRenderers.push({
            selector: 'a',
            renderLogic: function(element) {
                element.attr('target', '_blank');
                element.attr('dummu', 'super');
            }
        });
        return taOptions;
    }]);

    if (location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
        // Disabling debug data
        $compileProvider.debugInfoEnabled(false);
    }

    //Activation du cross domain
    $httpProvider.defaults.withCredentials = true;

    $httpProvider.interceptors.push(function httpProviderInterceptorConfiguration($rootScope) {
        if ($rootScope.activeCalls == undefined) {
            $rootScope.activeCalls = 0;
        }

        if ($rootScope.errorResponse == undefined) {
            $rootScope.errorResponse = false;
        }

        return {
            request: function httpProviderRequestConfig(config) {
                $rootScope.overrideCodeAlliance = JSON.parse(sessionStorage.getItem('Epilot.OverrideCodeAlliance'));

                if ($rootScope.overrideCodeAlliance)
                {
                    config.headers['overrideCodeAlliance'] = $rootScope.overrideCodeAlliance.CodeAlliance;
                }

                $rootScope.delegateUser = JSON.parse(sessionStorage.getItem('Epilot.Perfco.DelegationActor'));

                if ($rootScope.delegateUser) {
                    if (!config.url.includes($('#PropertyDrcePVCWebApiUrl').text()) && !config.url.includes($('#PropertyPVVWebApiUrl').text())) {
                        config.headers['delegateUser'] = $rootScope.delegateUser.SourceCodeAlliance;
                    }
                }

                $rootScope.delegatePvcUser = JSON.parse(sessionStorage.getItem('Epilot.Pvc.DelegationActor'));

                if ($rootScope.delegatePvcUser) {
                    config.headers['delegateUser'] = $rootScope.delegatePvcUser.SourceCodeAlliance;
                }

                $rootScope.delegatePvvUser = JSON.parse(sessionStorage.getItem('Epilot.Pvv.DelegationActor'));

                if ($rootScope.delegatePvvUser) {
                    config.headers['delegateUser'] = $rootScope.delegatePvvUser.SourceCodeAlliance;
                }
                $rootScope.activeCalls += 1;
                return config;
            },
            requestError: function httpProviderRequestErrorConfig(rejection) {
                $rootScope.activeCalls -= 1;
                return rejection;
            },
            response: function httpProviderResponseConfig(response) {
                $rootScope.activeCalls -= 1;
                return response;
            },
            responseError: function httpProviderResponseErrorConfig(rejection) {
                $rootScope.activeCalls -= 1;
                $rootScope.errorhttp = rejection;
                return rejection;
            }
        };
    });
});