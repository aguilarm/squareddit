'use strict';

//define and start up the application

angular.module(appConfig.appModuleName, ['ui.router']);

angular.element(document).ready(function() {
    angular.bootstrap(document, [appConfig.appModuleName])
});