/* global angular */

'use strict';

/* Controllers */
var cmsControllers = angular.module('cmsControllers', [])

//Controller for settings page
.controller('MainController',
        function($rootScope,
                $scope,
                $modal,
                $translate,
                $anchorScroll,
                $window,
                orderByFilter,
                SessionStorageService,
                Paginator,
                MetaDataFactory,
                ProgramFactory,                               
                DHIS2EventFactory,
                DHIS2EventService,
                ContextMenuSelectedItem,                
                DateUtils,
                CalendarService,
                GridColumnService,
                CustomFormService,
                ECStorageService,
                CurrentSelection,
                ModalService,
                DialogService,
                CommonUtils,
                FileService,
                AuthorityService,
                TrackerRulesExecutionService,
                TrackerRulesFactory) {
    
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
.controller('analysisController',function($scope, $window,$routeParams,$location,$filter, cmsService,utilityService){

    if($routeParams.menuId){
        $scope.tab = $routeParams.tab;
        $scope.menuId = $routeParams.menuId;
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
.controller('analysisDataController',function($scope, $window,$routeParams,$location,$filter, cmsService,chartsManager,utilityService){

    $scope.analyticsUrl      = "";
    $scope.analyticsObject   = "";
    $scope.chartType         = $routeParams.type;
    $scope.orgUnitArray      = $routeParams.orgunit.split(';');
    $scope.dataArray         = $routeParams.dx.split(';');
    $scope.categoryArray     = $routeParams.category.split(';');
    $scope.periodType        = null;
    $scope.periodType        = getPeriodType($routeParams.period);



    $scope.showDataCriteria = true;

    if($routeParams.menuId){
        $scope.tab = $routeParams.tab;
        $scope.menuId = $routeParams.menuId;
        $scope.favourite = $routeParams.favourite;
    }

    $scope.data = {periodTypes: {
        "Monthly": {
            name: "Monthly", value: "Monthly", list: [],
                populateList: function (date) {
                var monthNames = ["July", "August", "September", "October", "November", "December", "January", "February", "March", "April", "May", "June"];
                if (!date) {
                    date = new Date();
                }
                this.list = [];
                var that = this;
                var year = date.getFullYear();
                monthNames.forEach(function (monthName, index) {

                    var monthVal = index + 7;

                    if (monthVal > 12) {
                        monthVal = monthVal % 12;
                    }
                    if (monthVal == 1) {
                        year++;
                    }
                    var testDate = new Date();
                    if ((year == testDate.getFullYear() && monthVal > (testDate.getMonth() + 1)) || year > testDate.getFullYear()) {
                        return;
                    }
                    if (monthVal < 10) {
                        monthVal = "0" + monthVal;
                    }
                    that.list.push({
                        name: monthName + " " + year,
                        value: year + "" + monthVal
                    })
                });
                if (this.list.length == 0) {
                    this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
                }
            }
        },
        "Quarterly": {
            name: "Quarterly", value: "Quarterly", list: [],
                populateList: function (date) {
                var quarters = ["July - September", "October - December", "January - March", "April - June"];
                if (!date) {
                    date = new Date();
                }
                //this.list = [];
                var that = this;
                var year = date.getFullYear();
                quarters.forEach(function (quarter, index) {
                    var quarterVal = index + 3;
                    if (quarterVal == 5) {
                        quarterVal = 1;
                    }
                    if (quarterVal == 6) {
                        quarterVal = 2;
                    }
                    if (quarterVal == 1) {
                        year++;
                    }
                    var testDate = new Date();
                    if ((year == testDate.getFullYear() && quarterVal > ((testDate.getMonth() + 1) % 4)) || year > testDate.getFullYear()) {
                        return;
                    }
                    that.list.push({
                        name: quarter + " " + year,
                        value: year + "Q" + quarterVal
                    })
                });
                if (this.list.length == 0) {
                    this.populateList(new Date(date.getFullYear() - 2, date.getMonth() + 1, date.getDate()))
                }
            }
        },
        "Yearly": {
            name: "Yearly", value: "Yearly", list: [],
                populateList: function () {
                var date = new Date();
                this.list = [];
                for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
                    this.list.push({name: "" + i,value: "" + i});
                }
            }
        },
        "FinancialJuly": {
            name: "Financial-July", value: "FinancialJuly", list: [],
                populateList: function () {
                var date = new Date();
                this.list = [];
                var testDate = new Date();

                for (var i = date.getFullYear() - 5; i < date.getFullYear() + 5; i++) {
                    if ((i == testDate.getFullYear() && (testDate.getMonth() + 1) < 7) || (i == (testDate.getFullYear() - 1) && (testDate.getMonth() + 1) < 7) || i > testDate.getFullYear()) {
                        continue;
                    }
                    this.list.push({name: "July " + i + " - June " + (i + 1), value: i + "July"});
                }
            }
        }
    }}

    $scope.changePeriodType = function(periodType) {

        if ( periodType!=null ) {

            var limit = 10;
            var date = new Date();
            var thisYear = date.getFullYear();
            for( var i=0 ; i<limit ; i++ ) {
                var date = new Date((thisYear-i)+"-01"+"-01");
                console.log(thisYear-i);
                console.log(date);
                //$scope.data.periodTypes[periodType].populateList(date);
            }



            angular.forEach($scope.data.periodTypes[periodType].list,function(valueList,indexList){
            angular.forEach($routeParams.period.split(';'),function(value,index){
                console.log();
                console.log(valueList.value," = ",value);
                if(valueList.value == value) {
                    $scope.data.periodTypes[periodType].list[indexList].selected = true;
                    $scope.data.periodTypes[periodType].list[indexList].isActive = true;
                    $scope.data.periodTypes[periodType].list[indexList].isExpanded = false;
                }
            });

            })
        }

    }

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
    }

    $scope.categoryCallBack = function(item, selectedItems,selectedType) {
        var criteriaArray = cmsService.getSelectionCriterias(item, selectedItems,selectedType,$location.path());

    }

    $scope.btnClass = {};
    $scope.btnClass[$routeParams.type] = true;
    $scope.chartSwitcher = function(chartType) {

        angular.forEach($scope.btnClass,function(value,index){
            $scope.btnClass[index] = false;
        });

        $scope.btnClass[chartType] = true;
        $scope.chartType = chartType;
        $location.path(cmsService.prepareUrlForChange($location.path(),'type',chartType).newUrl);

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
            $scope.analyticsUrl = "../../../api/analytics.json?dimension=dx:"+$routeParams.dx+"&dimension=pe:"+$routeParams.period+"&filter=ou:"+$routeParams.orgunit;

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
            $scope.chartObject = {
                title: {
                    text: 'Monthly Average Temperature',
                    x: -20 //center
                },
                subtitle: {
                    text: 'Source: WorldClimate.com',
                    x: -20
                },
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: [{
                    name: 'Tokyo',
                    data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                }, {
                    name: 'New York',
                    data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                }, {
                    name: 'Berlin',
                    data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                }, {
                    name: 'London',
                    data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                }]
            }
            if ( $scope.chartType != "table" ) {
                $scope.chartObject = chartsManager.drawChart($scope.analyticsObject,
                    'pe',
                    [],
                    'dx',
                    [],
                    'none',
                    '',
                    $scope.favouriteObject.name,
                    $scope.chartType);

            }else{
                $scope.tableObject = chartsManager.drawTable($scope.analyticsObject,
                    'pe',
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
