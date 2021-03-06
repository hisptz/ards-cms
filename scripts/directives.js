/* global selection, angular */

'use strict';

/* Directives */

var cmsDirectives = angular.module('cmsDirectives', []);

cmsDirectives.directive("cmsHomeTabs", function(){
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

            $scope.tabs =[ "Agriculture","LIvestock","Fisheries","Trade","Hidden"];
            $scope.tabs = orderTabs($scope.tabs);


                    angular.forEach($scope.tabs,function(tab){
                        tab.name = tab.value.toLowerCase();
                        $scope.homeTabActiveClass[tab.value.toLowerCase()] = {active:""};
                        if(tab.value.toLowerCase()==$scope.subTab){
                            $scope.homeTabActiveClass[tab.value.toLowerCase()].active = "current";
                        }
                    })


            $scope.$watch('tabContentObject', function(newtabContentObject, oldtabContentObject){
                $scope.tabContents = newtabContentObject;
            }, true);



            function orderTabs(tabArray){
                var tabs = [{value: "All",active:"current"}]
                angular.forEach(tabArray,function(value){
                    if(value=="All"){
                        tabs[0].value=value;
                    }

                    if(value=="Agriculture"){
                        tabs[1]={value: value,active:""};
                        if(tabs[0]==null){
                            tabs[0] = {value: "All",active:"current"}
                        }
                    }
                    if(value=="Livestock"){
                        tabs[2]={value: value,active:""};
                        if(tabs[1]==null){
                            tabs[1] = {value: "Agriculture",active:""}
                        }
                    }
                    if(value=="Fisheries"){
                        tabs[3]={value: value,active:""};
                        if(tabs[2]==null){
                            tabs[2] = {value: "Livestock",active:""}
                        }
                    }if(value=="Trade"){
                        tabs[4]={value: value,active:""};
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
cmsDirectives.directive("cmsHomeMessage", function(){
    return {
        restrict: "E",
        replace: true,
        scope: {
            messages: "=availableMessages",
        },
        templateUrl: "views/directives/cms_home_message.html",
        link: function($scope, element, attrs) {
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
            $scope.chartErrorMessage  = null;
            $scope.selectedCharts = [];
            $scope.selectedOptions = [];

            $scope.appBaserUrl = dhis2.settings.baseUrl;



            $scope.$watch('chartObject', function(newchartObject, oldchartObject){

                if( typeof newchartObject != null ) {
                    $('.data-element').multiselect().multiselectfilter();
                    $(".data-element").multiselectfilter("destroy");
                    $(".data-element").multiselect("destroy");
                    $(".data-element").css('width', '100px');
                    $('.data-element').html(prepareOptions($scope.selectedCharts,$scope.chartObject)).multiselect().multiselectfilter();
                }

            }, true);



            $scope.$watch('messageObject', function(newmessageObject, oldmessageObject){
                $scope.messages = newmessageObject;
                if(!$scope.messages){
                    $scope.errorSms = true;
                }
            }, true);

            $scope.addingCharts = function(selectedOptions) {
                    var selectedCharts = [];

                function unique(list) {
                    var result = [];
                    $.each(list, function(i, e) {
                        if ($.inArray(e, result) == -1) result.push(e);
                    });
                    return result;
                }

                selectedOptions = unique(selectedOptions);

                if(selectedOptions.length<4){
                    angular.forEach($scope.chartObject,function(chartValue){
                        if($.inArray(chartValue.id, selectedOptions) >=0){
                            selectedCharts.push(chartValue);
                        }
                    });
                cmsService.saveSelectedCharts(selectedCharts).then(function (respose) {
                    if (respose.success == false) {
                        cmsService.updateSelectedCharts(selectedCharts);

                    }
                    $scope.getSelectedCharts();
                }, function (error) {
                    $scope.getSelectedCharts();
                });
                }else{
                    $scope.chartErrorMessage  = "select only three charts";

                }
            }

            $scope.getSelectedCharts = function(){
                cmsService.getSelectedCharts().then(function(selected){
                    $scope.selectedCharts = selected;
                })
            }

            $scope.$watch('chartObject', function(ch1, ch2){
                if(typeof ch1 !="undefined"){
                    $('.remove-example').selectpicker('refresh');
                }
            }, true);

            $scope.shortenLongStatement = function(statement,counts){

                if(statement && statement.length>=counts){
                    statement = statement.substring(0,counts)+"...";
                }

                return statement;
            }

            $scope.checkStatus = function( messages ) {
                var status = true;
                var messageLength = 0;
                if(messages){
                    messageLength = messages.length;
                }


                if(messageLength==1){
                    if(messages[0].hidden){
                        return false;
                    }
                }if(messageLength==0){
                    return false;
                }else{
                    var test = 0;
                    angular.forEach(messages,function(valueS,indexS){
                        if(valueS.hidden){
                            test++;
                        }
                    })

                    if(test==2){
                        return false;
                    }
                }



                return status;
            }


            function prepareOptions(selectedCharts,chartObject){

                $scope.selectedOptions = [];
                $scope.pushedOptions = [];
                var option = "";


                angular.forEach(chartObject,function(value){

                    if(selectedCharts.length>0){

                        angular.forEach(selectedCharts,function(selected){

                            if(selected.id==value.id){

                                if($.inArray( value.id, $scope.selectedOptions )<0){
                                    $scope.selectedOptions.push(value.id);
                                    option+="<option value='"+value.id+"' selected='selected' style='width:100px!important;'>"+value.displayName+"</option>";
                                }

                            }else{

                                if($.inArray( value.id, $scope.pushedOptions )<0){
                                    $scope.pushedOptions.push(value.id);
                                    option+="<option value='"+value.id+"'  style='width:100px!important;'>"+value.displayName+"</option>";
                                }

                            }

                        });

                    }else{

                        option+="<option value='"+value.id+"' style='width:100px!important;'>"+value.displayName+"</option>";

                    }




                });

                return option;

            }

            $scope.getSelectedCharts();

        },
        controller:'cmsLeftController'
    };
}]);

cmsDirectives.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

cmsDirectives.directive("cmsLeftMenu", ['cmsService','FilesService','$location',function(cmsService,FilesService,$location){
    return {
        restrict: "E",
        replace: true,
        scope: {
            reportTables: "=reportTables",
            otherLinksObject: "=otherLinksObject",
            documentObject: "=documentObject",
            tab: "=tabs",
            menu: "=menu",
            favourite: "=favourite"
        },
        templateUrl: "views/directives/cms_left_menu.html",
        link: function(scope, element, attrs) {
            attrs.$set('file-model', attrs['file']);
            scope.externalLinks = [];

            scope.requestSuccess = false;
            scope.doneLoading = true;
            scope.uploadingFile = false;
            scope.documentDataElement = null;

            /**
             * Adding ARDS functionality
             * */

                // add documents
            scope.documentForm = false;
            // add external links
            scope.linksForm = false;
            scope.addLinksForm = function (linksForm) {
                scope.linksForm = !linksForm;
            }

            //  add links to url
            scope.addLink = function (link_name,url) {
            }

            scope.openTab = {};
            scope.openChildTab = {};
            scope.statusClass = {};
            scope.openTab['analysis'] = true;
            scope.openChildTab['Agriculture'] = true;
            scope.openAccordion = function(parentElement,childElement){


                if ( !scope.openTab[parentElement] ) {
                    scope.openTab = {};
                    scope.statusClass = {};
                    scope.openTab[parentElement] = true;
                    scope.statusClass[scope.favourite] = "alert-success";
                }

                if ( !scope.openChildTab[childElement] && childElement != "" ) {
                    scope.openChildTab = {};
                    scope.statusClass = {};
                    scope.openChildTab[childElement] = true;
                    scope.statusClass[scope.favourite] = "alert-success";
                }

                $location.path('/'+parentElement+'/menu/'+childElement);
            }

            scope.$watch(scope.tab,function(newTab,oldTab){
                scope.openTab[scope.tab] = true;
                scope.openChildTab[scope.menu] = true;
                scope.statusClass[scope.favourite] = "alert-success";
                //$location.path('/'+scope.tab+'/menu/'+scope.menu);
            });

            scope.loadExternalLinks = function(){
                cmsService.listExternalLink().then(function(data){
                    //if(!data.success){
                        scope.externalLinks = data;
                    //}else{
                    //    console.log(data);
                    //    //scope.externalLinks = eval('('+data+')');
                    //    //console.log(scope.externalLinks);
                    //}

                },function(error){

                });
            }


            // add external links
            scope.externalLink = {name:"",url:""};
            scope.addExternalLinks = function (externalLink) {
                cmsService.addExternalLink(scope.externalLinks,externalLink).then(function(data){

                    if(!data.success){
                        cmsService.updateExternalLink(scope.externalLinks,externalLink).then(function(response){
                            scope.externalLink.name ="";
                            scope.externalLink.url ="";
                            scope.loadExternalLinks();
                        },function(error){

                        })
                    }else{
                        scope.externalLink.name ="";
                        scope.externalLink.url ="";
                    }

                },function(error){

                });

            }
            scope.selectedLinkIndex = null;
            scope.editExternalLinks = function(index) {
                scope.selectedLink = null;
                scope.editLinksForm = true;
                scope.selectedLink = scope.externalLinks[index];
                scope.selectedLinkIndex = index;

            }

            scope.cancelUpdate = function(){
                scope.selectedLink = null;
                scope.editLinksForm = false;
                scope.selectedLinkIndex = null;
            }

            // update external links
            scope.updateExternalLinks = function (selectedLink) {
                scope.externalLinks[scope.selectedLinkIndex] = selectedLink;
                cmsService.updateExternalLink(scope.externalLinks).then(function(data){
                    scope.editLinksForm = false;
                    scope.selectedLink = null;
                    scope.loadExternalLinks();
                },function(error){

                });

            }

            // external links functions

            scope.showExternal = function(link) {
                scope.externalLinks[link].hidden = false;

                cmsService.updateExternalLink(scope.externalLinks).then(function(data){
                },function(response){

                });
            }

            scope.hideExternal = function(link) {
                scope.externalLinks[link].hidden = true;

                cmsService.updateExternalLink(scope.externalLinks).then(function(data){
                },function(response){

                });
            }

            scope.deleteExternal = function(link) {
                scope.externalLinks.splice(link, 1);

                cmsService.updateExternalLink(scope.externalLinks).then(function(data){
                },function(response){

                });
            }

            // documents functions
            scope.uploadFile = function (fieldId,document) {
                var dataElementId = scope.documentDataElement.id;
                scope.uploadingFile = true;

                scope.doneLoading = false;
                var optionComboId = scope.documentDataElement.categoryCombo.categoryOptionCombos[0].id;
                var fieldId = fieldId;
                var fileResource = "";

                FilesService.uploading(document.file).then(function(data){

                    cmsService.saveFileResource( dataElementId, optionComboId, fieldId, data.response.fileResource,
                    function(successObject){
                        scope.doneLoading = true;
                        scope.requestSuccess = true;
                       // success callback
                       console.log(successObject)
                    },function(){
                            scope.doneLoading = true;
                            scope.requestSuccess = false;
                        });
                },function(error){
                    scope.doneLoading = true;
                    scope.requestSuccess = false;
                });



            }

            scope.deleteDocument = function(uid){
                    cmsService.getDocumentId(uid).then(function(data){
                    var documentId = filterDocumentId(data);
                    cmsService.deleteDocumentById(documentId).then(function(success){
                        scope.listDocuments();
                    },function(error){

                    })
                })

            }

            function filterDocumentId(data){
                var documentArray = data.rows;
                if (data.rows)
                {
                    if (documentArray.length>0)
                    {
                        return documentArray[0][0];
                    }

                    return null;
                }

                return null;
            }

            scope.documents = null;

            scope.listDocuments = function(){
               cmsService.loadDocuments().then(function(data){

                   scope.shownDocuments = filterDocuments(data.documents);
               })
            }

            function filterDocuments(documents){
                var documentArray = [];
                angular.forEach(documents, function (document) {

                    if (document.contentType){
                        if (document.contentType.indexOf('image')>=0){

                        }else{
                            documentArray.push(document);
                        }
                    }
                })

                return documentArray;
            }


            function getDocumentDataElementUid(){

                cmsService.getDadaElement().then(function(data){
                    if (data.dataElements){
                        angular.forEach(data.dataElements,function(results){

                            if ( results.displayName == "Document dataElement" )
                            {
                                scope.documentDataElement = results;
                            }

                        })
                    }else{
                        scope.documentDataElement = null;
                    }

                },function(error){

                })
            }

            scope.listDocuments();
            getDocumentDataElementUid();

            scope.loadExternalLinks();

        }
    };
}]);

cmsDirectives.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });

        }
    };
}]);

cmsDirectives.directive("cmsTabs", function(){
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

            $scope.activeClass = [];
            $scope.tabsLinks = [{id:"articles",name:"Articles",icon:'<i class="fa fa-file-text-o"></i>'},{id:"home page menus",name:"Home Page Menus",icon:'<i class="fa fa-list"></i>'},{id:"messages",name:"Messages",icon:' <i class="fa fa-envelope-o"></i>'},{id:"information sharing",name:"Information Sharing",icon:'<i class="fa fa-th-large">'}]
            $scope.activeClass[$scope.currentTab] = 'active';
            $scope.clickTab = function(tabName){

                if($scope.activeClass[tabName] == 'active')
                {

                }else{
                    $scope.currentTab = tabName;
                    $scope.activeClass = [];
                    $scope.activeClass[tabName] = 'active';
                }

            }

            $scope.switchPage = function(){
                window.location.href = "/"+dhis2.settings.baseUrl+'/api/apps/home/index.html';
            }


        }


    };
});

