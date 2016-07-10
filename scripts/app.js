'use strict';

/* App Module */

var cms = angular.module('cms',
                    ['ui.bootstrap',
                    'ngRoute',
                    'ngCookies',
                    'ngMessages',
                    'ngSanitize',
                    'ckeditor',
                    'cmsDirectives',
                    'cmsControllers',
                    'cmsServices',
                    'cmsFilters',
                    'd2Filters',
                    'd2Directives',
                    'd2Services',
                    'd2Controllers',
                    'ui.select',
                    'ngFileUpload',
                    'angularLocalStorage',
                    'pascalprecht.translate',
                    'd2HeaderBar'])

.value('DHIS2URL', '..')

.config(function ($routeProvider, $translateProvider) {

    $routeProvider
        .when('/', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab/action/:action_id', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab/action/edit/:edit_id', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab/sub/:subtab', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab/sub/:subtab/action/:action_id', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab/sub/:subtab/action/:action_id/:edit_item_id', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab/sub/:subtab/edit/:id', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        }).when('/', {
            redirectTo: "/articles/sub/all"
        })


        .otherwise('/articles/sub/all');

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});