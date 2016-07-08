'use strict';

/* App Module */

var cms = angular.module('cms',
    ['ui.bootstrap',
        'ngRoute',
        'ui.router',
        'ngCookies',
        'ngSanitize',
        'highcharts-ng',
        'datatables',
        'ckeditor',
        'isteven-multi-select',
        'cmsDirectives',
        'cmsControllers',
        'cmsServices',
        'cmsFilters',
        'd2Services',
        'd2Controllers',
        'pascalprecht.translate',
        'd2HeaderBar',
        'd2Directives'
    ])

    .value('DHIS2URL', '../../../')

    .config(function ($translateProvider, $routeProvider, $stateProvider, $urlRouterProvider) {


            $routeProvider.when('/home', {
                templateUrl: "views/home.html",
                controller: 'homeController'
            })
            .when('/home/:tabs', {
                templateUrl: "views/home.html",
                controller: 'homeController'
            })
            .when('/cms', {
                templateUrl: "views/cms.html",
                controller: 'cmsController'
            })
            .when('/cms/:tab', {
                templateUrl: "views/cms.html",
                controller: 'cmsController'
            })
            .when('/cms/:tab/sub/:subtab', {
                templateUrl: "views/cms.html",
                controller: 'cmsController'
            }).when('/cms/:tab/sub/:subtab/action/:action_id', {
                templateUrl: "views/cms.html",
                controller: 'cmsController'
            })
                .when('/cms/:tab/sub/:subtab/action/:action_id/:edit_item_id', {
                templateUrl: "views/cms.html",
                controller: 'cmsController'
            })
                .when('/cms/:tab/sub/:subtab/edit/:id', {
                templateUrl: "views/cms.html",
                controller: 'cmsController'
            })

            //.when('cms/:tabs/:subtab',{
            //    templateUrl: "views/partials/subTabContent.html",
            //    controller: 'cmsSubTabController'
            //})
            //.when('/cms/:tabs/:subtab/:action',{
            //    templateUrl: "views/partials/action.html",
            //    controller: 'cmsSubTabController'
            //})
            .when('/analysis', {
                templateUrl: "views/analysis.html",
                controller: 'analysisController'
            }).when('/analysis/:indicator', {
                templateUrl: "views/analysis.html",
                controller: 'analysisController'
            }).when('/news', {
                templateUrl: "views/news.html",
                controller: 'newsController'
            }).when('/articles', {
                templateUrl: "views/articles.html",
                controller: 'articlesController'
            })

        /**
         * OLD DATA
         * **/

        //$stateProvider
        //    .state('home', {
        //        url: "/home",
        //        templateUrl: "views/home.html",
        //        controller: 'homeController'
        //    })
        //    .state('home.tabs', {
        //        url: "/:tabs",
        //        templateUrl: "views/partials/tabContent.html",
        //        controller: 'homeTabController'
        //    })
        //    .state('cms', {
        //        url: "/cms",
        //        templateUrl: "views/cms.html",
        //        controller: 'cmsController'
        //    })
        //    .state('cms.tabs', {
        //        url: "/cms/tabs/:tabs",
        //        templateUrl: "views/partials/cmsTabContent.html",
        //        controller: 'cmsTabController'
        //    })
        //    //.state('cms.tabs.subtab',{
            //    url: "/:tabs/:subtab",
            //    templateUrl: "views/partials/subTabContent.html",
            //    controller: 'cmsSubTabController'
            //})
            //.state('cms.tabs.subtab.action',{
            //    url: "/cms/:page/:tabs/:tabid/message/:messageid/about/:replisedid",
            //    templateUrl: "views/partials/action.html",
            //    controller: 'cmsSubTabController'
            //})
            //.state('analysis', {
            //    url: "/analysis",
            //    templateUrl: "views/partials/analysis.html",
            //    controller: 'analysisController'
            //}).state('analysis.indicator', {
            //    url: "/:indicator",
            //    templateUrl: "views/partials/analysis.html",
            //    controller: 'analysisController'
            //}).state('news', {
            //    url: "/news",
            //    templateUrl: "views/partials/news.html",
            //    controller: 'newsController'
            //}).state('articles', {
            //    url: "/articles",
            //    templateUrl: "views/partials/articles.html",
            //    controller: 'articlesController'
            //})


        /**
         * Very old data
         * **/
        //$routeProvider.when('/home', {
        //    templateUrl: 'views/home.html',
        //    controller: 'homeController'
        //})
        //.when('/home/:tab', {
        //        templateUrl: 'views/home.html',
        //        controller: 'homeTabController'
        //})
        //    .when('/cms', {
        //    templateUrl: 'views/cms.html',
        //    controller: 'cmsController'
        //})

        //    .when('/home/:tabId/tab', {
        //    templateUrl: 'views/partials/home.html',
        //    controller: 'homeController'
        //}).when('/cms/articles', {
        //    templateUrl: 'views/cms.html',
        //    controller: 'cmsController'
        //}).when('/cms/menus', {
        //    templateUrl: 'views/cms.html',
        //    controller: 'cmsController'
        //}).when('/cms/messages', {
        //    templateUrl: 'views/cms.html',
        //    controller: 'cmsController'
        //}).when('/cms/information', {
        //    templateUrl: 'views/cms.html',
        //    controller: 'cmsController'
        //}).when('/cms/:mainTabId/:tabId/tab', {
        //    templateUrl: 'views/cms.html',
        //    controller: 'homeTabsController'
        //})
        //$urlRouterProvider.otherwise('/home');


        .otherwise('/home');
        $translateProvider.preferredLanguage('en');
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.useLoader('i18nLoader');
    });
