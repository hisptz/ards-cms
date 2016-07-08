'use strict';

/* Directives */

var cmsDirectives = angular.module('cmsDirectives', []);

cmsDirectives.directive("homeRightMenu", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            messageObject: "=messageObject",
            chartObject: "=chartObject"
        },
        templateUrl: "views/directives/home_right_menu.html",
        link: function($scope, element, attrs) {
            $scope.errors  = false;
            $scope.errorSms  = false;
            $scope.errorMessage  = "no chart found";

            $scope.$watch('chartObject', function(newchartObject, oldchartObject){
                $scope.charts = newchartObject;
                if(!$scope.charts&&newchartObject!=null){
                    $scope.errors = true;
                }
            }, true);

            $scope.$watch('messageObject', function(newmessageObject, oldmessageObject){
                $scope.messages = newmessageObject;
                if(!$scope.messages){
                    $scope.errorSms = true;
                }
            }, true);

        }
    };
});
cmsDirectives.directive("homeLeftMenu", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            analysisObject: "=analysisObject",
            otherLinksObject: "=otherLinksObject",
            documentObject: "=documentObject",
        },
        templateUrl: "views/directives/home_left_menu.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no document found";

            $scope.$watch('documentObject', function(newdocumentObject, olddocumentObject){
                $scope.documents = newdocumentObject;
                if(newdocumentObject==false){
                    $scope.error = true;
                }
            }, true);


            $scope.$watch('otherLinksObject', function(newotherLinksObject, oldotherLinksObject){
                $scope.externalLinks = newotherLinksObject;
            }, true);



            $scope.$watch('analysisObject', function(newanalysisObject, oldanalysisObject){
                $scope.analysis = newanalysisObject;
            }, true);

        }
    };
});

cmsDirectives.directive("homeTabs", function($stateParams){
    return {
        restrict: "E",
        replace: true,
        scope: {
            currentTab: "=currentTab",
            tabObject: "=tabObject",
            tabContentObject: "=tabContentObject",
        },
        templateUrl: "views/directives/home_tabs.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no chart found";
            $scope.homeTabActiveClass = {};
            //
            //$scope.$watch('tabObject', function(newtabObject, oldtabObject){
            //
            //    if(newtabObject!=null){
            //        $scope.tabs = orderTabs(newtabObject);
            //        angular.forEach($scope.tabs,function(tab){
            //            tab.active = "";
            //            tab.content = "hide";
            //            if($scope.currentTab==tab.value){
            //                tab.active = "current";
            //            }
            //        })
            //    }
            //
            //}, true);

            $scope.$watch('tabContentObject', function(newtabContentObject, oldtabContentObject){
                $scope.tabContents = newtabContentObject;
            }, true);





            $scope.$watch('tabObject', function(newtabObject, oldtabObject){

                if(newtabObject!=null){
                    $scope.tabs = orderTabs(newtabObject);
                    angular.forEach($scope.tabs,function(tab){
                        var name = tab.value.toLowerCase();
                        tab.name = name;
                        $scope.homeTabActiveClass[name] = {active:""};
                        if(name==$scope.currentTab){
                            $scope.homeTabActiveClass[name].active = "current";
                        }
                    })
                }

            }, true);


            //$scope.$watch('tabObject',function(newTabs,oldTabs){
            //    $scope.activeClass = [];
            //    $scope.activeClass['All'] = {active:"current"};
            //    if(typeof newTabs!='undefined'){
            //        angular.forEach(newTabs,function(tab){
            //            $scope.activeClass[tab.value] = {active:""};
            //            if(tab.value=="All"){
            //                $scope.activeClass[tab.value].active = "current";
            //            }
            //        });
            //    }
            //
            //});
            //

            $scope.toggleableTab = function(tabIndex,tab){
                angular.forEach($scope.tabs,function(tab){
                    $scope.activeClass[tab.value].active = "";

                })
                $scope.activeClass[tab.value].active = "current";
            }

            function orderTabs(tabArray){
                var tabs = []
                angular.forEach(tabArray,function(value){

                    if(value.value=="All"){
                        tabs[0]=value;
                    }

                    if(value.value=="Agriculture"){
                        tabs[1]=value;
                        if(tabs[0]==null){
                            tabs[0] = {value: "All",active:"current"}
                        }
                    }
                    if(value.value=="Livestock"){
                        tabs[2]=value;
                        if(tabs[1]==null){
                            tabs[1] = {value: "Agriculture",active:""}
                        }
                    }
                    if(value.value=="Fisheries"){
                        tabs[3]=value;
                        if(tabs[2]==null){
                            tabs[2] = {value: "Livestock",active:""}
                        }
                    }if(value.value=="Trade"){
                        tabs[4]=value;
                        if(tabs[3]==null){
                            tabs[3] = {value: "Fisheries",active:""}
                        }
                    }

                })

                return tabs;
            }

        }
    };
});
cmsDirectives.directive("cmsHomeTabs", function($stateParams){
    return {
        restrict: "E",
        replace: true,
        scope: {
            subTab: "=subTab",
            tabObject: "=tabObject",
            tabContentObject: "=tabContentObject",
        },
        templateUrl: "views/directives/cms_home_tabs.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no chart found";
            $scope.clickedHomeTab  = "All";
            $scope.homeTabActiveClass = {};


            $scope.$watch('tabObject', function(newtabObject, oldtabObject){

                    if(newtabObject!=null){
                    $scope.tabs = orderTabs(newtabObject);
                    angular.forEach($scope.tabs,function(tab){
                        tab.name = tab.value.toLowerCase();
                        $scope.homeTabActiveClass[tab.value.toLowerCase()] = {active:""};
                        if(tab.value.toLowerCase()==$scope.subTab){
                            $scope.homeTabActiveClass[tab.value.toLowerCase()].active = "current";
                        }
                    })
                }

            }, true);

            $scope.$watch('tabContentObject', function(newtabContentObject, oldtabContentObject){
                $scope.tabContents = newtabContentObject;
            }, true);



            function orderTabs(tabArray){
                var tabs = [{value: "All",active:"current"}]
                angular.forEach(tabArray,function(value){

                    if(value.value=="All"){
                        tabs[0]=value;
                    }

                    if(value.value=="Agriculture"){
                        tabs[1]=value;
                        if(tabs[0]==null){
                            tabs[0] = {value: "All",active:"current"}
                        }
                    }
                    if(value.value=="Livestock"){
                        tabs[2]=value;
                        if(tabs[1]==null){
                            tabs[1] = {value: "Agriculture",active:""}
                        }
                    }
                    if(value.value=="Fisheries"){
                        tabs[3]=value;
                        if(tabs[2]==null){
                            tabs[2] = {value: "Livestock",active:""}
                        }
                    }if(value.value=="Trade"){
                        tabs[4]=value;
                        if(tabs[3]==null){
                            tabs[3] = {value: "Fisheries",active:""}
                        }
                    }

                })

                return tabs;
            }

        }
    };
});
cmsDirectives.directive("cmsHomeMessage", function($stateParams){
    return {
        restrict: "E",
        replace: true,
        scope: {
            messages: "=availableMessages",
        },
        templateUrl: "views/directives/cms_home_message.html",
        link: function($scope, element, attrs) {
            console.log($scope.messages);
        }
    };
});

cmsDirectives.directive("cmsRightMenu", ['cmsService',function(cmsService){
    return {
        restrict: "E",
        replace: true,
        scope: {
            messageObject: "=messageObject",
            chartObject: "=chartObject"
        },
        templateUrl: "views/directives/cms_right_menu.html",
        link: function($scope, element, attrs) {
            $scope.errors  = false;
            $scope.errorsThree  = false;
            $scope.errorSms  = false;
            $scope.errorMessage  = "select only three charts";

            $scope.$watch('chartObject', function(newchartObject, oldchartObject){

                $scope.charts = newchartObject;
                if(!$scope.charts&&newchartObject!=null){
                    $scope.errors = true;
                }else{
                    cmsService.retrieveSetting().then(function(response){
                        $scope.charts = checkSelected(newchartObject,response.selectedCharts);
                    })
                }
            }, true);

            $scope.$watch('messageObject', function(newmessageObject, oldmessageObject){
                $scope.messages = newmessageObject;
                if(!$scope.messages){
                    $scope.errorSms = true;
                }
            }, true);

            $scope.$watch('selectedCharts', function(ch1, ch2){

                if(ch1!=null){

                    cmsService.postSettings({selectedCharts:[]}).then(function(data){
                        $scope.selectedCharts = data.selectedCharts;
                        $scope.charts = checkSelected($scope.charts,$scope.selectedCharts);
                        //cmsService.retrieveSetting().then(function(response){
                        //    $scope.charts = checkSelected($scope.charts,response.selectedCharts);
                        //})



                    });

                    //
                    //cmsService.retrieveSetting().then(function(response){
                    //    if(response.selectedCharts.length<3){
                    //        cmsService.postSettings({selectedCharts:$scope.selectedCharts}).then(function(data){
                    //            $scope.selectedCharts = data.selectedCharts;
                    //            $scope.charts = checkSelected($scope.charts,$scope.selectedCharts);
                    //        });
                    //    }else{
                    //        $scope.errorsThree = true;
                    //    }
                    //},function(error){
                    //    $scope.errors  = true;
                    //});
                    //
                    //

                }
            }, true);


            function checkSelected(charts,selectedCharts){
                var chartList = charts;
                angular.forEach(chartList,function(valueList,indexList){
                    angular.forEach(selectedCharts,function(value,index){

                        if(valueList.id==value.id){
                            chartList[indexList] = value;
                        }else{

                        }
                    });
                });

                return chartList;
            }

        }
    };
}]);
cmsDirectives.directive("cmsLeftMenu", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            analysisObject: "=analysisObject",
            otherLinksObject: "=otherLinksObject",
            documentObject: "=documentObject",
        },
        templateUrl: "views/directives/home_left_menu.html",
        link: function($scope, element, attrs) {
            $scope.error  = false;
            $scope.errorMessage  = "no document found";

            $scope.$watch('documentObject', function(newdocumentObject, olddocumentObject){
                $scope.documents = newdocumentObject;
                if(newdocumentObject==false){
                    $scope.error = true;
                }
            }, true);


            $scope.$watch('otherLinksObject', function(newotherLinksObject, oldotherLinksObject){
                $scope.externalLinks = newotherLinksObject;
            }, true);



            $scope.$watch('analysisObject', function(newanalysisObject, oldanalysisObject){
                $scope.analysis = newanalysisObject;
            }, true);

        }
    };
});

cmsDirectives.directive("cmsTabs", function($stateParams){
    return {
        restrict: "E",
        replace: true,
        scope: {
            currentTab:"=currentTab",
            homePageTabObject: "=homePageTabObject",
            homePageTabContentObject: "=homePageTabContentObject",
            availableMessages: "=availableMessages",
        },
        templateUrl: "views/directives/cms_tabs.html",
        link: function($scope, element, attrs) {
            console.log($scope.currentTabTemplate);
            $scope.activeClass = [];
            $scope.tabsLinks = [{id:"articles",name:"Articles",icon:'<i class="fa fa-file-text-o"></i>'},{id:"home page menus",name:"Home Page Menus",icon:'<i class="fa fa-list"></i>'},{id:"messages",name:"Messages",icon:' <i class="fa fa-envelope-o"></i>'},{id:"information sharing",name:"Information Sharing",icon:'<i class="fa fa-th-large">'}]
            $scope.activeClass[$scope.currentTab] = 'active';
            $scope.clickTab = function(tabName){
                $scope.currentTab = tabName;
                $scope.activeClass = [];
                $scope.activeClass[tabName] = 'active';
            }


        }


    };
});