'use strict';

/* App Module */

var cms = angular.module('cms',
                    ['ui.bootstrap',
                    'ngRoute',
                    'ngCookies',
                    'ngMessages',
                    'ngSanitize',
                    'highcharts-ng',
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
                    'chartServices',
                    'tableServices',
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
        })
        .when('/:tab/menu/:menuId', {
            templateUrl: "views/cms.html",
            controller: 'cmsController'
        })
        .when('/:tab/menu/:menuId/favourite/:favourite', {
            templateUrl: "views/analysis.html",
            controller: 'analysisController'
        }).when('/:tab/menu/:menuId/favourite/:favourite/period/:period', {
            templateUrl: "views/analysis.html",
            controller: 'analysisPeriodController'
        }).when('/:tab/menu/:menuId/favourite/:favourite/period/:period/orgunit/:orgunit/dx/:dx', {
            templateUrl: "views/analysis.html",
            controller: 'analysisDataController'
        })
        .when('/', {
            redirectTo: "/articles/sub/all"
        })


        .otherwise('/articles/sub/all');

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.useLoader('i18nLoader');
});