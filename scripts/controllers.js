/* global angular */

'use strict';

/* Controllers */
var cmsControllers = angular.module('cmsControllers', [])

//Controller for settings page
.controller('MainController',
        function($rootScope,
                 $scope, $window,$routeParams,$location,$filter,cmsService,utilityService) {
    
    $scope.formUnsaved = false;
    $scope.fileNames = [];
    $scope.currentFileNames = [];


    $scope.downloadFile = function(eventUid, dataElementUid, e) {
        eventUid = eventUid ? eventUid : $scope.currentEvent.event ? $scope.currentEvent.event : null;
        if( !eventUid || !dataElementUid){

            var dialogOptions = {
                headerText: 'error',
                bodyText: 'missing_file_identifier'
            };

            DialogService.showDialog({}, dialogOptions);
            return;
        }

        $window.open('../api/events/files?eventUid=' + eventUid +'&dataElementUid=' + dataElementUid, '_blank', '');
        if(e){
            e.stopPropagation();
            e.preventDefault();
        }
    };

    $scope.deleteFile = function(dataElement){

        if( !dataElement ){
            var dialogOptions = {
                headerText: 'error',
                bodyText: 'missing_file_identifier'
            };
            DialogService.showDialog({}, dialogOptions);
            return;
        }

        var modalOptions = {
            closeButtonText: 'cancel',
            actionButtonText: 'remove',
            headerText: 'remove',
            bodyText: 'are_you_sure_to_remove'
        };

        ModalService.showModal({}, modalOptions).then(function(result){
            $scope.fileNames[$scope.currentEvent.event][dataElement] = null;
            $scope.currentEvent[dataElement] = null;
            $scope.updateEventDataValue($scope.currentEvent, dataElement);
        });
    };

    $scope.updateFileNames = function(){
        for(var dataElement in $scope.currentFileNames){
            if($scope.currentFileNames[dataElement]){
                if(!$scope.fileNames[$scope.currentEvent.event]){
                    $scope.fileNames[$scope.currentEvent.event] = [];
                }
                $scope.fileNames[$scope.currentEvent.event][dataElement] = $scope.currentFileNames[dataElement];
            }
        }
    };
            // get report tables
            $scope.getReportTable = function () {
                cmsService.getReportTables().then(function(reportTables){
                    $scope.analysis = cmsService.prepareLeftMenu(reportTables.reportTables);
                });

            };

            $scope.getReportTable();
   String.prototype.Capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
   }
})

.controller('cmsController',function($scope, $window,$routeParams,$location,$filter,cmsService,utilityService){

        $scope.currentTab = 'articles';
        if($routeParams.tab){
            $scope.currentTab = $routeParams.tab.replace(/-/g," ");
        }

        if($routeParams.menuId){
            $scope.tab = $routeParams.tab;
            $scope.menuId = $routeParams.menuId;
        }


        String.prototype.Capitalize = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }


        $scope.currentSubTab = 'all';
        if($routeParams.subtab){
            $scope.currentSubTab = $routeParams.subtab;
            $scope.currentSubTabCapitalize = $scope.currentSubTab.Capitalize();
        }

        $scope.subTabAction = 'list';
        if($routeParams.action_id){
            $scope.subTabAction = $routeParams.action_id;
        }



        /**
         * Process add article form event
         * */

            // Called when the editor is completely ready.
        $scope.onReady = function () {


        };

        $scope.Options = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        var orderBy = $filter('orderBy');
        /**
         * Process edit article form event
         * */

            // Editor options.
        $scope.editOptions = {
            language: 'en',
            allowedContent: true,
            entities: false
        };

        $scope.tabsLinks = [];
        $scope.articles = [];
        // checking the current action
        if($routeParams.action_id){
            if($routeParams.action_id=="edit"){
                if($routeParams.edit_item_id){
                    angular.forEach($scope.tabContents,function(value){
                        if(value.id==$routeParams.edit_item_id){
                            $scope.editContent = value.content;
                            $scope.category = value.menu;
                            $scope.tabContent_id = value.id;
                        }
                    });

                }
            }

            $scope.message_action        = $routeParams.action_id;
            $scope.information_action    = $routeParams.action_id;

        }

        // checking for current selected item by id
        if($routeParams.edit_id){

            /**
             * Edit messages
             * */
                //$scope.message_action = "edit";
            $scope.editId = $routeParams.edit_id;


            /**
             * Edit menus
             * */
            $scope.menu_action = "edit";


            $scope.edited_menu = null;

            angular.forEach($scope.tabs,function(tab,tabIndex){
                if(tab.event==$scope.editId){
                    $scope.edited_menu = tab;
                    $scope.menu_name = tab.value;
                }
            });

            /**
             * Edit information sharing
             * */
            $scope.information_action = "edit";
            $scope.update_information = null;


            cmsService.loadInformations().then(function(response){
                $scope.informations = response;
                $scope.update_information = $scope.informations[$routeParams.edit_id];
            },function(error){

            });


        }



        // save home menus
        $scope.loadMenu = function(){

            cmsService.getTabs().then(function(data){
                if(data.success == false){
                    cmsService.addTab(['All']).then(function(output){
                    },function(error){
                    })
                }else{
                    $scope.tabsLinks = data;
                }

            },function(response){

            })
        }


        // save home menus
        var tabs = [];
        $scope.saveMenu = function(newMenu){
            tabs = $scope.tabsLinks;
            tabs.push(newMenu);
            cmsService.addTab(tabs).then(function(data){
                if(data.success == false){
                    $scope.updateMenu(newMenu);
                }else{
                    $scope.tabsLinks = data;
                }
            },function(response){

            })
        }

        // edit home menus
        $scope.editMenu = function(tab){
            $scope.currentTab = tab;
            $scope.update_menu_name = tab.value;
            $scope.editMenuForm = true;
            $scope.newMenuForm = false;
        }

         $scope.editingItem = null;
        $scope.editMenuItem = function(index){
            $scope.editingItem = index;
        }
        $scope.add_menu_name = "";
        $scope.cancelEditAdd = function(){
            $scope.editingItem = null;
            $scope.add_menu_name = null;
        }

        // update home menus
        $scope.menuItems = [];
        $scope.updateMenu = function(index){
            tabs = $scope.tabsLinks;
            tabs[index] = $scope.menuItems[index];
            cmsService.updateTab(tabs).then(function(data){
                if(data.success == false){
                }else{
                    $scope.loadMenu();
                    $scope.editingItem = null;
                }
            },function(response){

            })

        }

        // delete home menus
        $scope.deleteMenu = function(menuId){
            $scope.tabsLinks.splice(menuId,1);
            cmsService.updateTab($scope.tabsLinks).then(function(data){
                if(data.success == false){
                }else{
                    $scope.loadMenu();
                }
            },function(response){

            })
        }



        $scope.loadRawCharts = function(){
            cmsService.getCharts().then(function(response){
                var rowcharts = response.charts;
                $scope.loadCharts().then(function(response){
                    if(response){

                        if(response.length==rowcharts.length){
                            $scope.charts = response;//cmsService.getSelectedCharts(response.chartsStorage);
                        }else{
                            cmsService.saveCharts(rowcharts);
                            if(response.length>0){
                                cmsService.updateCharts(rowcharts);
                            }
                        }

                    }else{
                        cmsService.saveCharts(rowcharts);
                    }


                },function(error){
                    console.log(error);
                });
            },function(error){

            });
        }

        $scope.loadCharts = function(){
            return cmsService.loadChartStorage();
        }


        $scope.loadInformations = function(){

            /**
             * Loading informations sharing
             * */
            cmsService.loadInformations().then(function(response){
                $scope.informations = response;
            },function(error){

            });


        }
        // add information
        $scope.addInformation = function(informationtitle,informationContent){

            var informationTemplate = {title:informationtitle,body:informationContent};


            $scope.informations.push(informationTemplate);

            cmsService.addInformations($scope.informations).then(function(data){
                if(!data.success){
                    cmsService.updateInformations($scope.informations).then(function(response){
                        $location.path('/information-sharing');
                    },function(error){

                    })
                }

            },function(errors){

            });


        }



        // update information
        $scope.updateInformation = function(informationtitle,informationContent){

            var informationTemplate = {title:informationtitle,body:informationContent};

            $scope.informations[$scope.editId]=informationTemplate;
            cmsService.updateInformations($scope.informations).then(function(response){
                $location.path('/information-sharing');
            },function(error){

            });
        }

        // delete information
        $scope.deleteInformation = function(informationId){
            var informationTemplate = $scope.informations;
            informationTemplate.splice(informationId,1);
            cmsService.updateInformations(informationTemplate).then(function(response){
                $location.path('/information-sharing');
            },function(error){

            });


        }

        function getUpdatedArticles(tabContents,category,newArticle,id){
            var article_template = {category:category,content:newArticle,order:tabContents.length,shown:true};
            if(id){
                tabContents[id] = article_template;
            }else{
                tabContents.push(article_template);
            }

            return tabContents;

        }

        // add article contents
        var tabContents = [];
        $scope.addArticle = function(category,newArticle){
            tabContents = $scope.tabContents;
            tabContents = getUpdatedArticles(tabContents,category,newArticle);
            cmsService.addTabContent(tabContents).then(function(data){

                if( data.success == false ) {
                cmsService.updateTabContent(tabContents).then(function(data){
                    $location.path("/articles/sub/all");
                },function(error){

                });

                }else{


                }

            },function(){

            });
        }


        $scope.loadArticles = function(){
            cmsService.getTabContent().then(function(response){
                $scope.tabContents = orderBy(response, 'order', false);
            },function(error){

            });
        }


        // update article contents
        var tabContents = [];
        $scope.updateArticle = function(category,content,id){
            $scope.tabContents[id].content = content;
            cmsService.updateTabContent($scope.tabContents).then(function(data){
           },function(error){

           });
        }

        // hide article contents
        $scope.hideArticle = function(index){
            $scope.tabContents[index].shown = !$scope.tabContents[index].shown;
            cmsService.updateTabContent($scope.tabContents).then(function(data){
            },function(error){

            });

        }

        // hide article contents
        $scope.makeTopArticle = function(tabContents,index){
            if(tabContents[index].order==0){
                    return;
            }else{
                angular.forEach(tabContents,function(value,indexs){
                    if(value.order==0){
                        value.order = 1;
                    }
                })
            }

            tabContents[index].order = 0;
            cmsService.updateTabContent(tabContents).then(function(data){
                $scope.loadArticles();
            },function(error){

            });

        }

        // delete article content
        $scope.deleteContent = function(index){
            var contentCatche = [];
            if($scope.tabContents){
                contentCatche = $scope.tabContents;
                contentCatche.splice(index,1);
            }



            var object = "";

            // TODO:This confirm box should be removed with norma bootstrap widget
            var r = confirm('"Are you sure you want to this article  "');
            if (r == true) {
                cmsService.updateTabContent(contentCatche).then(function(data){
                },function(error){

                });
            } else {

            }

        }


        $scope.loadMessages = function(){
        $scope.messages = [];
        cmsService.getMessages().then(function(response){

            if(response.messageOne){
                $scope.messages.push(response.messageOne);
            }

            if(response.messageTwo){
                $scope.messages.push(response.messageTwo);
            }


        });
        }

        // checking for current selected item by id
        if($routeParams.edit_id){
        /**
         * Edit messages
         * */
        $scope.message_action = "edit";
        $scope.editId = $routeParams.edit_id;
        $scope.edited_message = null;

            cmsService.getMessages().then(function(response){
                $scope.messagesEdit = [];
                if(response.messageOne){
                    $scope.messagesEdit.push(response.messageOne);
                }

                if(response.messageTwo){
                    $scope.messagesEdit.push(response.messageTwo);
                }

                angular.forEach($scope.messagesEdit,function(messageValue,messageIndex){
                    if(messageValue.id==$scope.editId){
                        $scope.edited_message = messageValue;
                        $scope.messageTitle = $scope.edited_message.title;
                        $scope.editContent = $scope.edited_message.body;
                    }
                });

            });




    }


        // hide message contents
        $scope.hideMessage = function(message){
        message.hidden = !message.hidden;


        if(message.id==1){
            cmsService.addMessage({messageOne:{id:message.id,title:message.title,body:message.body,expired_date:"",hidden:message.hidden}}).then(function(data){
                $scope.loadMessages();
            });
        }

        if(message.id==2){

            cmsService.addMessage({messageTwo:{id:message.id,title:message.title,body:message.body,expired_date:"",hidden:message.hidden}}).then(function(data){
                $scope.loadMessages();
            });
        }


    }

        // show  message contents
        $scope.unHideMessage = function(messageToHideUnhide){

        if(victim=="first"){
            if($scope.hideFirstMessage){
                $scope.hideFirstMessage = false;
            }

        }
        if(victim=="second"){
            if($scope.hideSecondMessage){
                $scope.hideSecondMessage = false;
            }

        }

        cmsService.saveSetting($scope.first_message,$scope.second_message,$scope.hideFirstMessage,$scope.hideSecondMessage).then(function(response){
            $scope.loadMessages();
        },function(error){

        })

    }

        // save message contents
        $scope.sendMessage = function(title,body){

            if ( $scope.checkStatus ) {

                return true;
            }



                if($scope.messages.length==1){
                    if($scope.messages[0].id==1){
                        cmsService.addMessage({messageTwo:{id:2,title:title,body:body,expired_date:"",hidden:false}}).then(function(data){
                            $scope.loadMessages();
                            $location.path("/messages/action/list");
                        });
                    }

                    if($scope.messages[0].id==2){
                        cmsService.addMessage({messageOne:{id:1,title:title,body:body,expired_date:"",hidden:false}}).then(function(data){
                            $scope.loadMessages();
                            $location.path("/messages/action/list");
                        });
                    }




            }else{
                cmsService.addMessage({messageOne:{id:1,title:title,body:body,expired_date:"",hidden:false}}).then(function(data){
                    $scope.loadMessages();
                    $location.path("/messages/action/list");
                });
            }


    }

        // update message contents
        $scope.updateMessage = function(editId,title,body){


            if ( $scope.checkStatus ) {

                return true;
            }



            if(editId==1){
            cmsService.addMessage({messageOne:{id:1,title:title,body:body,expired_date:"",hidden:false}}).then(function(data){
                $scope.loadMessages();
                $location.path("/messages/action/list");
            });
        }

        if(editId==2){
            cmsService.addMessage({messageTwo:{id:2,title:title,body:body,expired_date:"",hidden:false}}).then(function(data){
                $scope.loadMessages();
                $location.path("/messages/action/list");
            });
        }




    }

        // delete message contents
        $scope.deleteMessage = function(message){
            if($scope.messages){
                var object = "";

                // TODO:This confirm box should be removed with norma bootstrap widget
                var r = confirm('"Are you sure you want to delete message  "'+message.title+'"');
                if (r == true) {

                    if(message.id==1){
                        object = "messageOne";
                    }

                    if(message.id==2){
                        object = "messageTwo";
                    }

                    cmsService.deleteSetting(object).then(function(response){
                        $scope.loadMessages();
                    },function(error){

                    });
                } else {

                }

            }



    }


        $scope.messageClass = "";
        $scope.checkStatus = false;
        var catchValue  = "";
        $scope.trackChanges = function( editContent , message_content ){

            if ( editContent.length > 150 ) {

                $scope.editContent = "";
                $scope.editContent = catchValue;
                angular.element('.message-content').attr('readonly','readonly');
                $scope.messageClass = "messageClasses";
                $scope.maxmumCharactersMessage = "Content will not be saved , Broad cast messages shall not exceed 150 characters , you have "+(editContent.length-150)+" extra characters ";
                $scope.checkStatus = true;
            } else {

                $scope.messageClass = "";
                $scope.maxmumCharactersMessage = "";
                catchValue = editContent;
                $scope.checkStatus = false;

            }

        }



        // get report tables
        $scope.getReportTable = function () {

            cmsService.getReportTables().then(function(reportTables){
                $scope.analysis = cmsService.prepareLeftMenu(reportTables.reportTables);
            });

        }


        if($routeParams.tab =="analysis") {
            $scope.showAnalysis=true;
        }


        $scope.getReportTable();
        $scope.loadMenu();
        $scope.loadArticles();
        $scope.loadMessages();
        $scope.loadInformations();
        $scope.loadRawCharts();
        $scope.loadCharts();


        // Editor options.
    $scope.editOptions = {
        language: 'en',
        allowedContent: true,
        entities: false
    };


    // checking the current action
    if($routeParams.action_id){
        if($routeParams.action_id=="edit"){
            if($routeParams.edit_item_id){
                cmsService.getTabContent().then(function(response){

                    $scope.tabContents = orderBy(response, 'order', false);
                    if(response.success == false){}else{
                        $scope.editContent = response[$routeParams.edit_item_id].content;
                        $scope.category = response[$routeParams.edit_item_id].category;
                        $scope.tabContent_id = $routeParams.edit_item_id;
                    }

                });


            }
        }

        $scope.message_action        = $routeParams.action_id;
        $scope.information_action    = $routeParams.action_id;

    }


    })
.controller('cmsLeftController',function($scope, $window,$routeParams,$location,cmsService,utilityService){

    /**
     * Process add article form event
     * */


    // Called when the editor is completely ready.
    $scope.onReady = function () {


    };

    $scope.Options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };


    /**
     * Process edit article form event
     * */

        // Editor options.
    $scope.editOptions = {
        language: 'en',
        allowedContent: true,
        entities: false
    };


    // checking the current action
    if($routeParams.action_id){
        if($routeParams.action_id=="edit"){
            if($routeParams.edit_item_id){
                angular.forEach($scope.tabContents,function(value){
                    if(value.id==$routeParams.edit_item_id){
                        $scope.editContent = value.content;
                        $scope.category = value.menu;
                        $scope.tabContent_id = value.id;
                    }
                });

            }
        }

        $scope.message_action        = $routeParams.action_id;
    }



})
.controller('analysisController',function($scope, $window,$routeParams,$location,$filter, cmsService,utilityService,$rootScope){

    if($routeParams.menuId){
        $scope.tab = $routeParams.tab;
        $scope.menuId = $routeParams.menuId;
    }

        $rootScope.openChildTab = [];
        $rootScope.openChildTab[$routeParams.menuId] = true;
        console.log($rootScope.openChildTab)


    $scope.loadMessages = function(){
        $scope.messages = [];
        cmsService.getMessages().then(function(response){

            if(response.messageOne){
                $scope.messages.push(response.messageOne);
            }

            if(response.messageTwo){
                $scope.messages.push(response.messageTwo);
            }


        });
    };


    // get report tables
    $scope.getReportTable = function () {
        cmsService.getReportTables().then(function(reportTables){
            $scope.analysis = cmsService.prepareLeftMenu(reportTables.reportTables);
        });

    };



    $scope.loadRawCharts = function(){
        cmsService.getCharts().then(function(response){
            var rowcharts = response.charts;
            $scope.loadCharts().then(function(response){
                if(response){

                    if(response.length==rowcharts.length){
                        $scope.charts = response;//cmsService.getSelectedCharts(response.chartsStorage);
                    }else{
                        cmsService.saveCharts(rowcharts);
                        if(response.length>0){
                            cmsService.updateCharts(rowcharts);
                        }
                    }

                }else{
                    cmsService.saveCharts(rowcharts);
                }


            },function(error){
                console.log(error);
            });
        },function(error){

        });
    }

    $scope.loadCharts = function(){
        return cmsService.loadChartStorage();
    }

    $scope.getReportTable();
    $scope.loadMessages();
    $scope.loadRawCharts();
    $scope.loadCharts();
})
.controller('analysisPeriodController',function($scope, $window,$routeParams,$location,$filter, cmsService,utilityService){

    if($routeParams.menuId){
        $scope.tab = $routeParams.tab;
        $scope.menuId = $routeParams.menuId;
        $scope.favourite = $routeParams.favourite;
    }


    $scope.loadMessages = function(){
        $scope.messages = [];
        cmsService.getMessages().then(function(response){

            if(response.messageOne){
                $scope.messages.push(response.messageOne);
            }

            if(response.messageTwo){
                $scope.messages.push(response.messageTwo);
            }


        });
    }


    // get report tables
    $scope.getReportTable = function () {

        cmsService.getReportTables().then(function(reportTables){
            $scope.analysis = cmsService.prepareLeftMenu(reportTables.reportTables);
        });

    }



    $scope.loadRawCharts = function(){
        cmsService.getCharts().then(function(response){
            var rowcharts = response.charts;
            $scope.loadCharts().then(function(response){
                if(response){

                    if(response.length==rowcharts.length){
                        $scope.charts = response;//cmsService.getSelectedCharts(response.chartsStorage);
                    }else{
                        cmsService.saveCharts(rowcharts);
                        if(response.length>0){
                            cmsService.updateCharts(rowcharts);
                        }
                    }

                }else{
                    cmsService.saveCharts(rowcharts);
                }


            },function(error){
                console.log(error);
            });
        },function(error){

        });
    }

    $scope.loadCharts = function(){
        return cmsService.loadChartStorage();
    }

    $scope.getReportTable();
    $scope.loadMessages();
    $scope.loadRawCharts();
    $scope.loadCharts();

})
.controller('analysisDataController',function($scope, $window,$routeParams,$location,$filter, cmsService,chartsManager,utilityService,$rootScope){

    $scope.analyticsUrl      = "";
    $scope.analyticsObject   = "";
    $scope.chartType         = $routeParams.type;
    $scope.orgUnitArray      = $routeParams.orgunit.split(';');
    $scope.dataArray         = $routeParams.dx.split(';');
    $scope.categoryArray     = $routeParams.category.split(';');
    $scope.periodType        = getPeriodType($routeParams.period);
        console.log("Period type:",$scope.periodType)

        $rootScope.openChildTab = [];
        $rootScope.openChildTab[$routeParams.menuId] = true;
        console.log($rootScope.openChildTab);
    $scope.showDataCriteria = true;

    if($routeParams.menuId){
        $scope.tab = $routeParams.tab;
        $scope.menuId = $routeParams.menuId;
        $scope.favourite = $routeParams.favourite;
    }

        $scope.periodArray = function(type,year){
            var periods = [];
            if(type == "Weekly"){
                periods.push({id:'',name:''})
            }else if(type == "Monthly"){
                periods.push({id:year+'01',name:'January '+year,selected:true},{id:year+'02',name:'February '+year},{id:year+'03',name:'March '+year},{id:year+'04',name:'April '+year},{id:year+'05',name:'May '+year},{id:year+'06',name:'June '+year},{id:year+'07',name:'July '+year},{id:year+'08',name:'August '+year},{id:year+'09',name:'September '+year},{id:year+'10',name:'October '+year},{id:year+'11',name:'November '+year},{id:year+'12',name:'December '+year})
            }else if(type == "BiMonthly"){
                periods.push({id:year+'01B',name:'January - February '+year,selected:true},{id:year+'02B',name:'March - April '+year},{id:year+'03B',name:'May - June '+year},{id:year+'04B',name:'July - August '+year},{id:year+'05B',name:'September - October '+year},{id:year+'06B',name:'November - December '+year})
            }else if(type == "Quarterly"){
                periods.push({id:year+'Q1',name:'January - March '+year,selected:true},{id:year+'Q2',name:'April - June '+year},{id:year+'Q3',name:'July - September '+year},{id:year+'Q4',name:'October - December '+year})
            }else if(type == "SixMonthly"){
                periods.push({id:year+'S1',name:'January - June '+year,selected:true},{id:year+'S2',name:'July - December '+year})
            }else if(type == "SixMonthlyApril"){
                periods.push({id:year+'AprilS2',name:'October 2011 - March 2012',selected:true},{id:year+'AprilS1',name:'April - September '+year})
            }else if(type == "FinancialOct"){
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt(year) - i;
                    if(i == 1){
                        periods.push({id:useYear+'Oct',name:'October '+useYear+' - September '+useYear,selected:true})
                    }else{
                        periods.push({id:useYear+'Oct',name:'October '+useYear+' - September '+useYear})
                    }
                }
            }else if(type == "Yearly"){
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt(year) - i;
                    if(i == 1){
                        periods.push({id:useYear,name:useYear,selected:true})
                    }else{
                        periods.push({id:useYear,name:useYear})
                    }

                }
            }else if(type == "FinancialJuly"){
                year = new Date().getFullYear();
                for (var i = 0; i <= 10; i++) {
                    var yearr = useYear;
                    var useYear = parseInt(year) - i;
                    if(i == 1){
                        periods.push({id:useYear+'July',name:'July '+useYear+' - June '+yearr,selected:true})
                    }else{
                        periods.push({id:useYear+'July',name:'July '+useYear+' - June '+yearr})
                    }
                }
            }else if(type == "FinancialApril"){
                for (var i = 0; i <= 10; i++) {
                    var useYear = parseInt(year) - i;
                    if(i == 1){
                        periods.push({id:useYear+'April',name:'April '+useYear+' - March '+useYear,selected:true})
                    }else{
                        periods.push({id:useYear+'April',name:'April '+useYear+' - March '+useYear})
                    }
                }
            }else if(type == "Relative Weeks"){
                periods.push({id:'THIS_WEEK',name:'This Week'},{id:'LAST_WEEK',name:'Last Week'},{id:'LAST_4_WEEK',name:'Last 4 Weeks',selected:true},{id:'LAST_12_WEEK',name:'last 12 Weeks'},{id:'LAST_52_WEEK',name:'Last 52 weeks'});
            }else if(type == "Relative Month"){
                periods.push({id:'THIS_MONTH',name:'This Month'},{id:'LAST_MONTH',name:'Last Month'},{id:'LAST_3_MONTHS',name:'Last 3 Month'},{id:'LAST_6_MONTHS',name:'Last 6 Month'},{id:'LAST_12_MONTHS',name:'Last 12 Month',selected:true});
            }else if(type == "Relative Bi-Month"){
                periods.push({id:'THIS_BIMONTH',name:'This Bi-month'},{id:'LAST_BIMONTH',name:'Last Bi-month'},{id:'LAST_6_BIMONTHS',name:'Last 6 bi-month',selected:true});
            }else if(type == "Relative Quarter"){
                periods.push({id:'THIS_QUARTER',name:'This Quarter'},{id:'LAST_QUARTER',name:'Last Quarter'},{id:'LAST_4_QUARTERS',name:'Last 4 Quarters',selected:true});
            }else if(type == "Relative Six Monthly"){
                periods.push({id:'THIS_SIX_MONTH',name:'This Six-month'},{id:'LAST_SIX_MONTH',name:'Last Six-month'},{id:'LAST_2_SIXMONTHS',name:'Last 2 Six-month',selected:true});
            }else if(type == "Relative Year"){
                periods.push({id:'THIS_FINANCIAL_YEAR',name:'This Year'},{id:'LAST_FINANCIAL_YEAR',name:'Last Year',selected:true},{id:'LAST_5_FINANCIAL_YEARS',name:'Last 5 Years'});
            }else if(type == "Relative Financial Year"){
                periods.push({id:'THIS_YEAR',name:'This Financial Year'},{id:'LAST_YEAR',name:'Last Financial Year',selected:true},{id:'LAST_5_YEARS',name:'Last 5 Five financial years'});
            }
            return periods;
        };
    $scope.data = {};
        $scope.data.periodTypes = [
            {name:"Monthly", value:"Monthly"},
            {name:"Quarterly", value:"Quarterly"},
            {name:"Yearly", value:"Yearly"},
            {name:"Financial-July", value:"FinancialJuly"}
        ]


    //    "Monthly": {
    //        name: "Monthly", value: "Monthly", list: [],
    //            populateList: function (date) {
    //            var monthNames = ["July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
    //            if (!date) {
    //                date = new Date();
    //            }
    //            this.list = [];
    //            var that = this;
    //            var year = date.getFullYear();
    //            monthNames.forEach(function (monthName, index) {
    //
    //                var monthVal = index + 7;
    //
    //                if (monthVal > 12) {
    //                    monthVal = monthVal % 12;
    //                }
    //                if (monthVal == 1) {
    //                    year++;
    //                }
    //                var testDate = new Date();
    //                if ((year == testDate.getFullYear() && monthVal > (testDate.getMonth() + 1)) || year > testDate.getFullYear()) {
    //                    return;
    //                }
    //                if (monthVal < 10) {
    //                    monthVal = "0" + monthVal;
    //                }
    //                that.list.push({
    //                    name: monthName + " " + year,
    //                    value: year + "" + monthVal
    //                })
    //            });
    //            if (this.list.length == 0) {
    //                this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
    //            }
    //        }
    //    },
    //    "Quarterly": {
    //        name: "Quarterly", value: "Quarterly", list: [],
    //            populateList: function (date) {
    //            var quarters = ["July - September", "October - December", "January - March", "April - June"];
    //            if (!date) {
    //                date = new Date();
    //            }
    //            //this.list = [];
    //            var that = this;
    //            var year = date.getFullYear();
    //            quarters.forEach(function (quarter, index) {
    //                var quarterVal = index + 3;
    //                if (quarterVal == 5) {
    //                    quarterVal = 1;
    //                }
    //                if (quarterVal == 6) {
    //                    quarterVal = 2;
    //                }
    //                if (quarterVal == 1) {
    //                    year++;
    //                }
    //                var testDate = new Date();
    //                if ((year == testDate.getFullYear() && quarterVal > ((testDate.getMonth() + 1) % 4)) || year > testDate.getFullYear()) {
    //                    return;
    //                }
    //                that.list.push({
    //                    name: quarter + " " + year,
    //                    value: year + "Q" + quarterVal
    //                })
    //            });
    //            if (this.list.length == 0) {
    //                this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
    //            }
    //        }
    //    },
    //    "Yearly": {
    //        name: "Yearly", value: "Yearly", list: [],
    //            populateList: function () {
    //            var date = new Date();
    //            this.list = [];
    //            for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
    //                this.list.push({name: "" + i,value: "" + i});
    //            }
    //        }
    //    },
    //    "FinancialJuly": {
    //        name: "Financial-July", value: "FinancialJuly", list: [],
    //            populateList: function () {
    //            var date = new Date();
    //            this.list = [];
    //            var testDate = new Date();
    //
    //            for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
    //                if ((i == testDate.getFullYear() && (testDate.getMonth() + 1) < 7) || (i == (testDate.getFullYear() - 1) && (testDate.getMonth() + 1) < 7) || i > testDate.getFullYear()) {
    //                    continue;
    //                }
    //                this.list.push({name: "July " + i + " - June " + (i + 1), value: i + "July"});
    //            }
    //        }
    //    }
    //}}

    $scope.changePeriodType = function(periodType) {
        if ( periodType!=null && periodType != "" ) {

            var limit = 10;
            var date = new Date();
            var thisYear = date.getFullYear();
            for( var i=0 ; i<limit ; i++ ) {
                var date = new Date((thisYear-i)+"-01"+"-01");
                //console.log(thisYear-i);
                //console.log(date);
                //$scope.data.periodTypes[periodType].populateList(date);
            }
            console.log("periods:",$scope.data.periodTypes[periodType]);
            angular.forEach($routeParams.period.split(';'),function(value,index){
                if(valueList.value == value) {
                    $scope.data.periodTypes[periodType].list[indexList].selected = true;
                    $scope.data.periodTypes[periodType].list[indexList].isActive = true;
                    $scope.data.periodTypes[periodType].list[indexList].isExpanded = false;
                }
            });
        }

    };
        var date = new Date();
        $scope.yearValue = date.getFullYear();

        //loading period settings
        $scope.getPeriodArray = function(type){
            var periodsArray = [];
            angular.forEach($routeParams.period.split(";"),function(period){
                periodsArray.push(period)
            });
            var year = periodsArray[0].substring(0,4);
            $scope.yearValue = year;

            $scope.data.dataperiods = $scope.periodArray(type,year);
            angular.forEach($scope.data.dataperiods,function(data){
                if(periodsArray.indexOf(data.id) >= 1){
                    data.selected = true;
                }
            });
            console.log($scope.data.dataperiods)
        };

        //loading period settings
        $scope.getnextPrevPeriodArray = function(type){
            var year = $scope.yearValue;
            $scope.data.dataperiods = $scope.periodArray(type,year);
            console.log($scope.data.dataperiods)
        };

        //add year by one
        $scope.nextYear = function () {
            $scope.yearValue = parseInt($scope.yearValue) + 1;
            $scope.getnextPrevPeriodArray($scope.periodType);
        };
        //reduce year by one
        $scope.previousYear = function () {
            $scope.yearValue = parseInt($scope.yearValue) - 1;
            $scope.getnextPrevPeriodArray($scope.periodType);
        };

        $scope.changePeriodType = function(type){
            if ( type != null && type != "" ) {
                $scope.getPeriodArray(type);
            }
        };

    $scope.changePeriodType($scope.periodType);



    $scope.orgunitCallBack = function(item, selectedItems,selectedType) {

        var criteriaArray = cmsService.getSelectionCriterias(item, selectedItems,selectedType,$location.path());
        $location.path(criteriaArray.newUrl);
    }

    $scope.periodCallBack = function(item, selectedItems,selectedType) {

        //var criteriaArray = cmsService.getSelectionCriterias(selectedOrgUnit, selectedOrgUnits,selectedType,$location.path());
        //console.log(criteriaArray);
        //console.log(selectedOrgUnit);
        //console.log(selectedOrgUnits);
        //console.log(criteriaArray);
    }

    $scope.dataCallBack = function(item, selectedItems,selectedType) {
        var criteriaArray = cmsService.getSelectionCriterias(item, selectedItems,selectedType,$location.path());
        $location.path(criteriaArray.newUrl);
    };
        //a function to update chart based on selections
        $scope.chartType = $routeParams.type;
        $scope.updateData = function(){
            $scope.orgunitsArray = [];
            $scope.periodsArray = [];
            $scope.dataArray = [];
            angular.forEach($scope.data.organisationUnitOutPut,function(orgunit){
                $scope.orgunitsArray.push(orgunit.id)
            });
            angular.forEach($scope.data.outputPeriods,function(period){
                $scope.periodsArray.push(period.id)
            });
            angular.forEach($scope.data.outputData,function(value){
                $scope.dataArray.push(value.id)
            });

             var path = '/analysis/menu/'+$routeParams.menuId+'/favourite/'+$routeParams.favourite+'/period/'+$scope.periodsArray.join(";")+'/orgunit/'+$scope.orgunitsArray.join(";")+'/dx/'+$scope.dataArray.join(";")+'/type/'+$scope.chartType+'/category/'+$scope.data.outputCategory[0].id;
            console.log(path)
            $location.path(path);
        };

    $scope.categoryCallBack = function(item, selectedItems,selectedType) {
        var criteriaArray = cmsService.getSelectionCriterias(item, selectedItems,selectedType,$location.path());

    }

    $scope.btnClass = {};
    $scope.btnClass[$routeParams.type] = true;
    $scope.chartSwitcher = function(chartType) {

        angular.forEach($scope.btnClass,function(value,index){
            $scope.btnClass[index] = false;
        });

        $scope.orgunitsArray = [];
        $scope.periodsArray = [];
        $scope.dataArray = [];
        angular.forEach($scope.data.organisationUnitOutPut,function(orgunit){
            $scope.orgunitsArray.push(orgunit.id)
        });
        angular.forEach($scope.data.outputPeriods,function(period){
            $scope.periodsArray.push(period.id)
        });
        angular.forEach($scope.data.outputData,function(value){
            $scope.dataArray.push(value.id)
        });

        $scope.btnClass[chartType] = true;
        $scope.chartType = chartType;
        var path = '/analysis/menu/'+$routeParams.menuId+'/favourite/'+$routeParams.favourite+'/period/'+$scope.periodsArray.join(";")+'/orgunit/'+$scope.orgUnitArray.join(";")+'/dx/'+$scope.dataArray.join(";")+'/type/'+$scope.chartType+'/category/'+$scope.data.outputCategory[0].id;
        $location.path(path);

    };



    $scope.loadMessages = function(){
        $scope.messages = [];
        cmsService.getMessages().then(function(response){

            if(response.messageOne){
                $scope.messages.push(response.messageOne);
            }

            if(response.messageTwo){
                $scope.messages.push(response.messageTwo);
            }


        });
    }


    // get report tables
    $scope.getReportTable = function () {

        cmsService.getReportTables().then(function(reportTables){

            $scope.analysis = cmsService.prepareLeftMenu(reportTables.reportTables);
            $scope.analyticsUrl = "../../../api/analytics.json?dimension=dx:"+$routeParams.dx+"&dimension=pe:"+$routeParams.period+"&dimension=ou:"+$routeParams.orgunit;

            angular.forEach (reportTables.reportTables, function(value){

                if (value.id == $scope.favourite ) {
                    $scope.favouriteObject = value;
                }

            });

            $scope.loadAnalytics($scope.analyticsUrl);

        });

    }


    $scope.loadAnalytics = function (url) {

        cmsService.getAnalytics(url).then(function(analytics){
            $scope.analyticsObject = analytics;
            $scope.dataDimension = cmsService.getDataDimension(analytics,$scope.dataArray);
            $scope.categoryDimension = cmsService.setSelectedCategory([{name:"Administrative Units",id:"ou"},{name:"Period",id:"pe"}],$routeParams.category);
            $scope.chartObject = {};
            if ( $scope.chartType != "table" ) {
                $scope.chartObject = chartsManager.drawChart($scope.analyticsObject,
                    $routeParams.category,
                    [],
                    'dx',
                    [],
                    'none',
                    '',
                    $scope.favouriteObject.name,
                    $scope.chartType);

            }else{
                $scope.tableObject = chartsManager.drawTable($scope.analyticsObject,
                    $routeParams.category,
                    [],
                    'dx',
                    [],
                    'none',
                    '',
                    $scope.favouriteObject.name,
                    $scope.chartType);

            }

        });

    }

    cmsService.loggedUser().then(function(results){
        cmsService.getOrgUnitTree(results.organisationUnits)
            .then(function (results) {

                $scope.organisationUnits = results.data.organisationUnits;
                $scope.organisationUnits.forEach(function (orgUnit) {
                    cmsService.sortOrganisationUnits(orgUnit,$scope.orgUnitArray);
                });
            }, function (error) {
                $scope.organisationUnits = [];

            });
    })


    function getPeriodType(period){
        var periodArray = period.split(';');
        var periodCount = periodArray.length;
        var period = "";
        if ( periodCount > 1) {
            period = periodArray[1];
        }else{
            period = periodArray[0];
        }

        if ( period.indexOf('Q') >= 0 ) {
            return 'Quarterly';
        }else if(period.indexOf('J')>=0){
            return 'FinancialJuly'
        }else{
            return 'Monthly'
        }
    }

    $scope.loadRawCharts = function(){
        cmsService.getCharts().then(function(response){
            var rowcharts = response.charts;
            $scope.loadCharts().then(function(response){
                if(response){

                    if(response.length==rowcharts.length){
                        $scope.charts = response;//cmsService.getSelectedCharts(response.chartsStorage);
                    }else{
                        cmsService.saveCharts(rowcharts);
                        if(response.length>0){
                            cmsService.updateCharts(rowcharts);
                        }
                    }

                }else{
                    cmsService.saveCharts(rowcharts);
                }


            },function(error){
                console.log(error);
            });
        },function(error){

        });
    }

    $scope.loadCharts = function(){
        return cmsService.loadChartStorage();
    }

    $scope.getReportTable();
    $scope.loadMessages();
    $scope.loadRawCharts();
    $scope.loadCharts();

});
