/* global angular */

'use strict';

/* Controllers */
var cmsControllers = angular.module('cmsControllers', [])

.controller('MainController', function($scope, $window,$routeParams,$location,$http, ModalService,cmsService,utilityService) {

    //// layout modals
    $scope.leftColumn = "col-md-2 col-xs-12";
    $scope.centerColumn = "col-md-8 col-xs-12 ";
    $scope.changeBootstrapClass = function(action){
        if(action=="show"){
            $scope.leftColumn = "col-md-2 col-xs-12";
            $scope.centerColumn = "col-md-8 col-xs-12 ";
        }

        if(action=="hide"){
            $scope.leftColumn = "";
            $scope.centerColumn = "col-md-10 col-xs-12 ";
        }

        if(action=="extend"){
            $scope.leftColumn = "col-md-4 col-xs-12";
            $scope.centerColumn = "col-md-6 col-xs-12 ";
        }
    }



    $scope._appPrograms = [];
    $scope._tabProgram = "";
    $scope._tabContentProgram = "";
    $scope._smsProgram = "";
    $scope._linkProgram = "";
    $scope._appCharts = [];
    $scope._currentUser = null;
    $scope._users = [];
    $scope.activeClass = [];
    $scope.documents = [];
    $scope.analysis = [];

    cmsService.getUsers().then(function(value){
        $scope._users = cmsService.processUsers(value.users);
    });
    cmsService.loggedUser().then(function(value){
        $scope._currentUser = value;
    });

    // app resources functions
    $scope.loadPrograms = function(){
        cmsService.getPrograms().then(function(response){
            $scope.Programs = $scope.groupPrograms(response.programs);
        });
    }
    $scope.loadCharts = function(){
        cmsService.retrieveSetting().then(function(response){
            $scope.charts = response.selectedCharts;
        },function(error){
            $scope.errors  = true;
        });
    }

    $scope.groupPrograms = function(appPrograms){
        angular.forEach(appPrograms,function(programObject,programIndex){
            if(programObject.name.indexOf('cms')>=0){
                cmsService._appPrograms.push(programObject);

            }
            if(programObject.name.indexOf('home page menu')>=0){
                cmsService._tabProgram = programObject;
                $scope._tabProgram = programObject;
                //$scope.createTab(cmsService._tabProgram)
                $scope.loadTabs(cmsService._tabProgram);
            }
            if(programObject.name.indexOf('cms article')>=0){
                cmsService._tabContentProgram = programObject;
                $scope._tabContentProgram = programObject;

                var content = '';
                //$scope.createTabContent(cmsService._tabContentProgram,content,"Livestock",2);
                $scope.loadTabContent(cmsService._tabContentProgram);
            }
            if(programObject.name.indexOf('cms messages')>=0){
                cmsService._smsProgram = programObject;
                $scope._smsProgram = programObject;

                var content = '';
                //$scope.createTabContent(cmsService._tabContentProgram,content,"Livestock",2);
                //$scope.loadMessages(cmsService._smsProgram);
                //$scope.createMessage(cmsService._smsProgram,JSON.stringify({type:"users",list:[{id: "K8jZ8exCsNH",name: "Leonard Mpande"}]}),JSON.stringify({id:"K8jZ8exCsNH",name:"Leonard Mpande"}),"Stay Tuned","Hellow User Stay tuned");
            }
            if(programObject.name.indexOf('cms extenal links')>=0){
                cmsService._linkProgram = programObject;

                $scope.loadExternalLinks(cmsService._linkProgram);
                //$scope.addExternalLinks(cmsService._linkProgram,"http://www.countrystat.org/","CountryStat",'shown');
                //$scope.createMessage(cmsService._smsProgram,JSON.stringify({type:"users",list:[{id: "K8jZ8exCsNH",name: "Leonard Mpande"}]}),JSON.stringify({id:"K8jZ8exCsNH",name:"Leonard Mpande"}),"Stay Tuned","Hellow User Stay tuned");
            }

        });
    }

    $scope.loadTabs = function(tabProgram){
        var eventObject = utilityService.prepareEventObject(tabProgram);
        cmsService.getTabs(eventObject).then(function(response){
            $scope.tabs = utilityService.refineTabs(response.events);
            $scope.setDefaultUrl();
        });
    }

    $scope.createTab = function(tabProgram,tabValue){
        var payload = {
            "program":tabProgram.id,
            "orgUnit": cmsService.parentOrganisationUnit,
            "eventDate": "2013-05-17",
            "status": "COMPLETED",
            "storedBy": "admin",
            "dataValues": [
                { "dataElement": "RJ6cGZcjlB6", "value": tabValue }
            ]
        }
        cmsService.addTab(payload).then(function(response){
            $scope.loadTabs(tabProgram);
            $scope.add_menu_name = "";
            $scope.update_menu_name = "";
            $scope.editMenuForm = false;
            $scope.newMenuForm = false;
        });

    }

    $scope.loadTabContent = function(contentProgram){
        var eventObject = utilityService.prepareEventObject(contentProgram);
        cmsService.getTabContent(eventObject).then(function(response){
            $scope.tabContents = utilityService.refineTabContent(response.events);
        });
    }
    $scope.loadExternalLinks = function(contentProgram){

        var eventObject = utilityService.prepareEventObject(contentProgram);
        cmsService.getExternalLinks(eventObject).then(function(response){
            $scope.externalLinks = utilityService.refineExternalLinks(response.events);
        });
    }


    $scope.addExternalLinks = function(tabProgram,url,name,status){

        if(typeof  tabProgram !=="undefined"){
            var payload = {
                "program":tabProgram.id,
                "orgUnit": cmsService.parentOrganisationUnit,
                "eventDate": "2013-05-17",
                "status": "COMPLETED",
                "storedBy": "admin",
                "dataValues": [
                    { "dataElement": "fNpPvw46Mxl", "value": url },
                    { "dataElement": "cReJPO8bM6C", "value": name },
                    { "dataElement": "CqGEDx5xw2Y", "value": status }
                ]
            }

            cmsService.addExternalLinks(payload).then(function(response){
            });
        }




    }

    $scope.setDefaultUrl = function(){
        if($routeParams.tabId){
            angular.forEach($scope.tabs,function(tabValue,tabIndex){
                if(tabValue.active=="current"){
                    $scope.tabs[tabIndex].active = "";
                }

                if(tabValue.value==$routeParams.tabId){
                    $scope.tabs[tabIndex].active = "current";
                }
            });
            //$location.path('/cms/articles/'+$routeParams.tabId+"/tab");
        }else{
            angular.forEach($scope.tabs,function(tabValue,tabIndex){
                if(tabValue.active=="current") {
                    //$location.path('/cms/articles/' + tabValue.value + "/tab");
                }
            });
        }

    }

    $scope.createTabContent = function(tabProgram,content,menu,order){

        if(typeof  tabProgram !=="undefined"){
            var payload = {
                "program":tabProgram.id,
                "orgUnit": cmsService.parentOrganisationUnit,
                "eventDate": "2013-05-17",
                "status": "COMPLETED",
                "storedBy": "admin",
                "dataValues": [
                    { "dataElement": "qYjGeQATsEh", "value": content },
                    { "dataElement": "xiXnJ2aTlzz", "value": "shown" },
                    { "dataElement": "JTvaqwY7kDy", "value": order },
                    { "dataElement": "tz5ttCEyPhf", "value": menu }
                ]
            }

            cmsService.addTabContent(payload).then(function(response){
                $scope.loadTabContent(tabProgram);
                $scope.showAddForm = false;
                $scope.showEditForm = false;
            });
        }




    }


    $scope.updateTabContent = function(tabProgram,eventId,content,menu,order){

        if(typeof  tabProgram !=="undefined"){
            var payload = {
                "program":tabProgram.id,
                "orgUnit": cmsService.parentOrganisationUnit,
                "eventDate": "2016-04-26",
                "dataValues": [
                    { "dataElement": "qYjGeQATsEh", "value": content },
                    { "dataElement": "xiXnJ2aTlzz", "value": "shown" },
                    { "dataElement": "JTvaqwY7kDy", "value": order },
                    { "dataElement": "tz5ttCEyPhf", "value": menu }
                ]
            }

            cmsService.updateEvent(payload,payload.dataValues,eventId,"Article Update failed").then(function(response){
                $scope.loadTabContent(tabProgram);
                $scope.showAddForm = false;
                $scope.showEditForm = false;
            });
        }




    }

    $scope.toggleToCMS = function(){

        $location.path('/cms/articles/sub/all');

    }
    $scope.toggleToHOME = function(){

        $location.path('/home/all');

    }
    // Load favourites report tables
    $scope.getReportTable = function(){
        cmsService.getReportTables().then(function(reportTables){
            $scope.analysis = utilityService.formatAnalysis(reportTables);
        },function(error){
            $scope.analysis = false;
        });
    }



    //
    //$scope.loadMessagesOld = function(){
    //    //var eventObject = utilityService.prepareEventObject(contentProgram);
    //    cmsService.getMessages().then(function(response){
    //        $scope.messages = utilityService.refineMessage(response);
    //    });
    //}
    $scope.loadMessages = function(){

        cmsService.retrieveSetting().then(function(response){
            $scope.first_message = null;
            $scope.second_message = null;
            $scope.messages = response.availableMessages;
            angular.forEach($scope.messages,function(value,index){

                if(typeof value.first_message !=="undefined"){
                    $scope.first_message    = value.first_message;
                    $scope.hideFirstMessage = value.hide;

                }

                if(typeof value.second_message !=="undefined"){
                    $scope.second_message    = value.second_message;
                    $scope.hideSecondMessage = value.hide;
                }

            });
        });
    }

    $scope.messageStatus = function(isRead){
        if(isRead){
            return "read";
        }else{
            return "notRead"
        }
    }

    //$scope.createMessageOld = function(recepients,sender,subject,body){
    //    if(typeof  $scope._smsProgram !==""){
    //        var payload = {
    //            "program":$scope._smsProgram.id,
    //            "orgUnit": "m0frOspS7JY",
    //            "eventDate": "2013-05-17",
    //            "status": "COMPLETED",
    //            "storedBy": "admin",
    //            "dataValues": [
    //                { "dataElement": "r7FUBZIK1iH", "value": JSON.stringify(sender) },
    //                { "dataElement": "Am2wAwoJdCV", "value": JSON.stringify(recepients) },
    //                { "dataElement": "QLfNQoTlAM9", "value": subject },
    //                { "dataElement": "Wv5Ve9Iz8zv", "value": body }
    //            ]
    //        }
    //
    //        cmsService.addMessage(payload).then(function(response){
    //            $scope.loadMessages($scope._smsProgram);
    //        });
    //    }
    //}
    //$scope.createMessage = function(body){
    //
    //}

    $scope.readMessage = function(message){
    }

    //$scope.followUpMessage = function(message){
    //    cmsService.followUpMessage(message.id).then(function(response){
    //        $scope.loadMessages();
    //    },function(error){
    //
    //    });
    //
    //}


    $scope.deleteMessage = function(victim){
        var object = "";

        if(victim=="first"){
            object = {second_message:$scope.second_message,hide:$scope.hideSecondMessage,expireDate:""}
        }

        if(victim=="second"){
            object = {first_message:$scope.first_message,hide:$scope.hideFirstMessage,expireDate:""};
        }

        cmsService.deleteSetting(object).then(function(response){
            $scope.loadMessages();
        },function(error){

        });
    }


    $scope.toggleableCMSTab = function(tab){

        angular.forEach($scope.activeClass,function(tabD,index){
            $scope.activeClass[index] = "";
            if(index==tab){
                $scope.activeClass[index] = "active";
            }
        })

        if(typeof $scope.newMessageForm != "undefined"){
            $scope.newMessageForm = false;
        }

    }




    //$scope.showNewMessageForm = function(){
    //    $scope.newMessageForm = true;
    //}

    $scope.cancelMessageSend = function(){
        $scope.newBroadCastForm = false;
        $scope.editBroadCastForm = false;
    }

    $scope.newMessageForm = function(){
        $scope.newBroadCastForm = true;
    }

    $scope.editMessageForm = function(choice){
        if(choice=="first"){
            $scope.firstEdit = true;
            $scope.secondEdit = false;
        }
        if(choice=="second"){
            $scope.firstEdit = false;
            $scope.secondEdit = true;
        }
        $scope.editBroadCastForm = true;
    }

    $scope.hideMessage = function(victim){
        console.log($scope.hideFirstMessage)
        if(victim=="first"){
            if(!$scope.hideFirstMessage){
                $scope.hideFirstMessage = true;
            }

        }
        if(victim=="second"){
            if(!$scope.hideSecondMessage){
                $scope.hideSecondMessage = true;
            }

        }
        console.log($scope.hideFirstMessage)
        cmsService.saveSetting($scope.first_message,$scope.second_message,$scope.hideFirstMessage,$scope.hideSecondMessage).then(function(response){
            $scope.loadMessages();
        },function(error){

        })

    }
    $scope.unHideMessage = function(victim){

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

    $scope.newBroadCastForm = false
    $scope.sendMessage = function(first_message,second_message){
        var hideMessageOne = false; var hideMessageTwo = false;
        cmsService.saveSetting(first_message,second_message,hideMessageOne,hideMessageTwo).then(function(response){
            $scope.newBroadCastForm = false;
            $scope.editBroadCastForm = false;
            $scope.loadMessages();
        },function(error){

        })

    }

    $scope.newMenu = function(){
        $scope.newMenuForm = true;
        $scope.editMenuForm = false;
    }

    $scope.saveMenu = function(menu_name){
        //
        //var payload = {
        //    "program": $scope._smsProgram.id,
        //    "orgUnit": "m0frOspS7JY",
        //    "eventDate": "2013-05-17",
        //    "status": "COMPLETED",
        //    "storedBy": "admin",
        //    "dataValues": [
        //        {"dataElement": "RJ6cGZcjlB6", "value": menu_name},
        //    ]
        //}
        //console.log($scope._tabProgram);
        $scope.createTab($scope._tabProgram,menu_name);
    }

    $scope.editMenu = function(tab){
        $scope.currentTab = tab;
        $scope.update_menu_name = tab.value;
        $scope.editMenuForm = true;
        $scope.newMenuForm = false;
    }

    $scope.updateMenu = function(update_menu_name){
        $scope.currentTab.value = update_menu_name;
        cmsService.updateEvent($scope.currentTab,[{ "dataElement": "RJ6cGZcjlB6", "value":update_menu_name}],$scope.currentTab.event,"error updating menu").then(function(response){
            $scope.loadTabs(cmsService._tabProgram);
            $scope.add_menu_name = "";
            $scope.update_menu_name = "";
            $scope.editMenuForm = false;
            $scope.newMenuForm = false;
        },function(){

        })
        $scope.editMenuForm = true;
        $scope.newMenuForm = false;
    }
    //eventId
    $scope.deleteTab = function(tab){
        var eventId  = tab.event;
        cmsService.deleteEvent(eventId).then(function(response){
            $scope.loadTabs(cmsService._tabProgram);
        },function(){

        })
    }

    $scope.cancelUpdateMenu = function(){
        $scope.add_menu_name = "";
        $scope.update_menu_name = "";
        $scope.editMenuForm = false;
        $scope.newMenuForm = false;
    }

    $scope.cancelSaveMenu = function(){
        $scope.add_menu_name = "";
        $scope.update_menu_name = "";
        $scope.editMenuForm = false;
        $scope.newMenuForm = false;
    }
    //!showAddForm&&!showEditForm
    $scope.getNewArticleForm = function(){
        $scope.showAddForm = true;
    }

    $scope.getEditArticleForm = function(content){
        $scope.currentArticle = content;
        $scope.editedContent = content.content;
        $scope.showEditForm = true;
    }

    function switchCMSTab (){
        var link = $location.path();
        console.log(link)
        if(link.indexOf('tab')<=-1){
            var url_length = link.length;
            var cms = link.substr(5,url_length-1);
            $scope.activeClass[cms] = 'active';
        }else{

        }

    }
    switchCMSTab();

    $scope.users = [
        { icon: "<i class='fa fa-user'></i>",               name: "Leonard Mpande",              maker: "(Opera Software)",        ticked: false  }
    ];


    // Editor options.
    $scope.options = {
        language: 'en',
        allowedContent: true,
        entities: false
    };

    // Called when the editor is completely ready.
    $scope.onReady = function () {


    };

    $scope.addArticle = function(category,content){
        $scope.createTabContent($scope._tabContentProgram,content,category,'1');

    }

    $scope.updateArticle = function(category,content){
        $scope.updateTabContent($scope._tabContentProgram,$scope.currentArticle.id,content,category,'1');
        $scope.showAddForm = false;
        $scope.showEditForm = false;
    }

    $scope.cancelAddArticle = function(){
        $scope.showAddForm = false;
        $scope.showEditForm = false;
    }
    // function calls

    cmsService.getParentOrgUnit().then(function(response){
        angular.forEach(response.organisationUnits,function(value){
            cmsService.parentOrganisationUnit  = value.id;
        });
        $scope.loadPrograms();
        $scope.loadMessages();
        $scope.loadCharts();
    },function(){
        console.log("there is error probable the network error");
    });

    $scope.getReportTable();



    String.prototype.Capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

})

.controller('homeController',function($scope, $window,$routeParams,$location, cmsService,utilityService){
    //
    //$scope._appPrograms = [];
    //$scope._tabProgram = "";
    //$scope._tabContentProgram = "";
    //$scope._smsProgram = "";
    //$scope._linkProgram = "";
    //$scope._appCharts = [];
    //$scope._currentUser = null;
    //$scope._users = [];
    //$scope.activeClass = [];
    //$scope.documents = [];
    //$scope.analysis = [];
    //
    //cmsService.getUsers().then(function(value){
    //    $scope._users = cmsService.processUsers(value.users);
    //});
    //cmsService.loggedUser().then(function(value){
    //    $scope._currentUser = value;
    //});
    //
    //// app resources functions
    //$scope.loadPrograms = function(){
    //    cmsService.getPrograms().then(function(response){
    //        $scope.Programs = $scope.groupPrograms(response.programs);
    //    });
    //}
    //$scope.loadCharts = function(){
    //    cmsService.retrieveSetting().then(function(response){
    //        $scope.charts = response.selectedCharts;
    //    },function(error){
    //        $scope.errors  = true;
    //    });
    //}

    //$scope.groupPrograms = function(appPrograms){
    //    angular.forEach(appPrograms,function(programObject,programIndex){
    //        if(programObject.name.indexOf('cms')>=0){
    //            cmsService._appPrograms.push(programObject);
    //
    //        }
    //        if(programObject.name.indexOf('home page menu')>=0){
    //            cmsService._tabProgram = programObject;
    //            $scope._tabProgram = programObject;
    //            //$scope.createTab(cmsService._tabProgram)
    //            $scope.loadTabs(cmsService._tabProgram);
    //        }
    //        if(programObject.name.indexOf('cms article')>=0){
    //            cmsService._tabContentProgram = programObject;
    //            $scope._tabContentProgram = programObject;
    //
    //            var content = '';
    //            //$scope.createTabContent(cmsService._tabContentProgram,content,"Livestock",2);
    //            $scope.loadTabContent(cmsService._tabContentProgram);
    //        }
    //        if(programObject.name.indexOf('cms messages')>=0){
    //            cmsService._smsProgram = programObject;
    //            $scope._smsProgram = programObject;
    //
    //            var content = '';
    //            //$scope.createTabContent(cmsService._tabContentProgram,content,"Livestock",2);
    //            //$scope.loadMessages(cmsService._smsProgram);
    //            //$scope.createMessage(cmsService._smsProgram,JSON.stringify({type:"users",list:[{id: "K8jZ8exCsNH",name: "Leonard Mpande"}]}),JSON.stringify({id:"K8jZ8exCsNH",name:"Leonard Mpande"}),"Stay Tuned","Hellow User Stay tuned");
    //        }
    //        if(programObject.name.indexOf('cms extenal links')>=0){
    //            cmsService._linkProgram = programObject;
    //
    //            $scope.loadExternalLinks(cmsService._linkProgram);
    //            //$scope.addExternalLinks(cmsService._linkProgram,"http://www.countrystat.org/","CountryStat",'shown');
    //            //$scope.createMessage(cmsService._smsProgram,JSON.stringify({type:"users",list:[{id: "K8jZ8exCsNH",name: "Leonard Mpande"}]}),JSON.stringify({id:"K8jZ8exCsNH",name:"Leonard Mpande"}),"Stay Tuned","Hellow User Stay tuned");
    //        }
    //
    //    });
    //}
    //
    //$scope.loadTabs = function(tabProgram){
    //    var eventObject = utilityService.prepareEventObject(tabProgram);
    //    cmsService.getTabs(eventObject).then(function(response){
    //        $scope.tabs = utilityService.refineTabs(response.events);
    //        $scope.setDefaultUrl();
    //    });
    //}
    //
    //$scope.createTab = function(tabProgram,tabValue){
    //    var payload = {
    //        "program":tabProgram.id,
    //        "orgUnit": cmsService.parentOrganisationUnit,
    //        "eventDate": "2013-05-17",
    //        "status": "COMPLETED",
    //        "storedBy": "admin",
    //        "dataValues": [
    //            { "dataElement": "RJ6cGZcjlB6", "value": tabValue }
    //        ]
    //    }
    //    cmsService.addTab(payload).then(function(response){
    //        $scope.loadTabs(tabProgram);
    //        $scope.add_menu_name = "";
    //        $scope.update_menu_name = "";
    //        $scope.editMenuForm = false;
    //        $scope.newMenuForm = false;
    //    });
    //
    //}
    //
    //$scope.loadTabContent = function(contentProgram){
    //    var eventObject = utilityService.prepareEventObject(contentProgram);
    //    cmsService.getTabContent(eventObject).then(function(response){
    //        $scope.tabContents = utilityService.refineTabContent(response.events);
    //    });
    //}
    //$scope.loadExternalLinks = function(contentProgram){
    //
    //    var eventObject = utilityService.prepareEventObject(contentProgram);
    //    cmsService.getExternalLinks(eventObject).then(function(response){
    //        $scope.externalLinks = utilityService.refineExternalLinks(response.events);
    //    });
    //}
    //
    //
    //$scope.addExternalLinks = function(tabProgram,url,name,status){
    //
    //    if(typeof  tabProgram !=="undefined"){
    //        var payload = {
    //            "program":tabProgram.id,
    //            "orgUnit": cmsService.parentOrganisationUnit,
    //            "eventDate": "2013-05-17",
    //            "status": "COMPLETED",
    //            "storedBy": "admin",
    //            "dataValues": [
    //                { "dataElement": "fNpPvw46Mxl", "value": url },
    //                { "dataElement": "cReJPO8bM6C", "value": name },
    //                { "dataElement": "CqGEDx5xw2Y", "value": status }
    //            ]
    //        }
    //
    //        cmsService.addExternalLinks(payload).then(function(response){
    //        });
    //    }
    //
    //
    //
    //
    //}
    //
    //$scope.setDefaultUrl = function(){
    //    if($routeParams.tabId){
    //        angular.forEach($scope.tabs,function(tabValue,tabIndex){
    //            if(tabValue.active=="current"){
    //                $scope.tabs[tabIndex].active = "";
    //            }
    //
    //            if(tabValue.value==$routeParams.tabId){
    //                $scope.tabs[tabIndex].active = "current";
    //            }
    //        });
    //        //$location.path('/cms/articles/'+$routeParams.tabId+"/tab");
    //    }else{
    //        angular.forEach($scope.tabs,function(tabValue,tabIndex){
    //            if(tabValue.active=="current") {
    //                //$location.path('/cms/articles/' + tabValue.value + "/tab");
    //            }
    //        });
    //    }
    //
    //}
    //
    //$scope.createTabContent = function(tabProgram,content,menu,order){
    //
    //    if(typeof  tabProgram !=="undefined"){
    //        var payload = {
    //            "program":tabProgram.id,
    //            "orgUnit": cmsService.parentOrganisationUnit,
    //            "eventDate": "2013-05-17",
    //            "status": "COMPLETED",
    //            "storedBy": "admin",
    //            "dataValues": [
    //                { "dataElement": "qYjGeQATsEh", "value": content },
    //                { "dataElement": "xiXnJ2aTlzz", "value": "shown" },
    //                { "dataElement": "JTvaqwY7kDy", "value": order },
    //                { "dataElement": "tz5ttCEyPhf", "value": menu }
    //            ]
    //        }
    //
    //        cmsService.addTabContent(payload).then(function(response){
    //            $scope.loadTabContent(tabProgram);
    //            $scope.showAddForm = false;
    //            $scope.showEditForm = false;
    //        });
    //    }
    //
    //
    //
    //
    //}
    //
    //
    //$scope.updateTabContent = function(tabProgram,eventId,content,menu,order){
    //
    //    if(typeof  tabProgram !=="undefined"){
    //        var payload = {
    //            "program":tabProgram.id,
    //            "orgUnit": cmsService.parentOrganisationUnit,
    //            "eventDate": "2016-04-26",
    //            "dataValues": [
    //                { "dataElement": "qYjGeQATsEh", "value": content },
    //                { "dataElement": "xiXnJ2aTlzz", "value": "shown" },
    //                { "dataElement": "JTvaqwY7kDy", "value": order },
    //                { "dataElement": "tz5ttCEyPhf", "value": menu }
    //            ]
    //        }
    //
    //        cmsService.updateEvent(payload,payload.dataValues,eventId,"Article Update failed").then(function(response){
    //            $scope.loadTabContent(tabProgram);
    //            $scope.showAddForm = false;
    //            $scope.showEditForm = false;
    //        });
    //    }
    //
    //
    //
    //
    //}
    //
    //$scope.togglePages = function(){
    //
    //    $location.path('/cms/articles/sub/all');
    //
    //}
    //// Load favourites report tables
    //$scope.getReportTable = function(){
    //    cmsService.getReportTables().then(function(reportTables){
    //        $scope.analysis = utilityService.formatAnalysis(reportTables);
    //    },function(error){
    //        $scope.analysis = false;
    //    });
    //}
    //
    //
    //
    ////
    ////$scope.loadMessagesOld = function(){
    ////    //var eventObject = utilityService.prepareEventObject(contentProgram);
    ////    cmsService.getMessages().then(function(response){
    ////        $scope.messages = utilityService.refineMessage(response);
    ////    });
    ////}
    //$scope.loadMessages = function(){
    //
    //    cmsService.retrieveSetting().then(function(response){
    //        $scope.first_message = null;
    //        $scope.second_message = null;
    //        $scope.messages = response.availableMessages;
    //        angular.forEach($scope.messages,function(value,index){
    //
    //            if(typeof value.first_message !=="undefined"){
    //                $scope.first_message    = value.first_message;
    //                $scope.hideFirstMessage = value.hide;
    //
    //            }
    //
    //            if(typeof value.second_message !=="undefined"){
    //                $scope.second_message    = value.second_message;
    //                $scope.hideSecondMessage = value.hide;
    //            }
    //
    //        });
    //    });
    //}
    //
    //$scope.messageStatus = function(isRead){
    //    if(isRead){
    //        return "read";
    //    }else{
    //        return "notRead"
    //    }
    //}
    //
    ////$scope.createMessageOld = function(recepients,sender,subject,body){
    ////    if(typeof  $scope._smsProgram !==""){
    ////        var payload = {
    ////            "program":$scope._smsProgram.id,
    ////            "orgUnit": "m0frOspS7JY",
    ////            "eventDate": "2013-05-17",
    ////            "status": "COMPLETED",
    ////            "storedBy": "admin",
    ////            "dataValues": [
    ////                { "dataElement": "r7FUBZIK1iH", "value": JSON.stringify(sender) },
    ////                { "dataElement": "Am2wAwoJdCV", "value": JSON.stringify(recepients) },
    ////                { "dataElement": "QLfNQoTlAM9", "value": subject },
    ////                { "dataElement": "Wv5Ve9Iz8zv", "value": body }
    ////            ]
    ////        }
    ////
    ////        cmsService.addMessage(payload).then(function(response){
    ////            $scope.loadMessages($scope._smsProgram);
    ////        });
    ////    }
    ////}
    ////$scope.createMessage = function(body){
    ////
    ////}
    //
    //$scope.readMessage = function(message){
    //}
    //
    ////$scope.followUpMessage = function(message){
    ////    cmsService.followUpMessage(message.id).then(function(response){
    ////        $scope.loadMessages();
    ////    },function(error){
    ////
    ////    });
    ////
    ////}
    //
    //
    //$scope.deleteMessage = function(victim){
    //    var object = "";
    //
    //    if(victim=="first"){
    //        object = {second_message:$scope.second_message,hide:$scope.hideSecondMessage,expireDate:""}
    //    }
    //
    //    if(victim=="second"){
    //        object = {first_message:$scope.first_message,hide:$scope.hideFirstMessage,expireDate:""};
    //    }
    //
    //    cmsService.deleteSetting(object).then(function(response){
    //        $scope.loadMessages();
    //    },function(error){
    //
    //    });
    //}
    //
    //
    //$scope.toggleableCMSTab = function(tab){
    //
    //    angular.forEach($scope.activeClass,function(tabD,index){
    //        $scope.activeClass[index] = "";
    //        if(index==tab){
    //            $scope.activeClass[index] = "active";
    //        }
    //    })
    //
    //    if(typeof $scope.newMessageForm != "undefined"){
    //        $scope.newMessageForm = false;
    //    }
    //
    //}
    //
    //
    //
    //
    ////$scope.showNewMessageForm = function(){
    ////    $scope.newMessageForm = true;
    ////}
    //
    //$scope.cancelMessageSend = function(){
    //    $scope.newBroadCastForm = false;
    //    $scope.editBroadCastForm = false;
    //}
    //
    //$scope.newMessageForm = function(){
    //    $scope.newBroadCastForm = true;
    //}
    //
    //$scope.editMessageForm = function(choice){
    //    if(choice=="first"){
    //        $scope.firstEdit = true;
    //        $scope.secondEdit = false;
    //    }
    //    if(choice=="second"){
    //        $scope.firstEdit = false;
    //        $scope.secondEdit = true;
    //    }
    //    $scope.editBroadCastForm = true;
    //}
    //
    //$scope.hideMessage = function(victim){
    //    console.log($scope.hideFirstMessage)
    //    if(victim=="first"){
    //        if(!$scope.hideFirstMessage){
    //            $scope.hideFirstMessage = true;
    //        }
    //
    //    }
    //    if(victim=="second"){
    //        if(!$scope.hideSecondMessage){
    //            $scope.hideSecondMessage = true;
    //        }
    //
    //    }
    //    console.log($scope.hideFirstMessage)
    //    cmsService.saveSetting($scope.first_message,$scope.second_message,$scope.hideFirstMessage,$scope.hideSecondMessage).then(function(response){
    //        $scope.loadMessages();
    //    },function(error){
    //
    //    })
    //
    //}
    //$scope.unHideMessage = function(victim){
    //
    //    if(victim=="first"){
    //        if($scope.hideFirstMessage){
    //            $scope.hideFirstMessage = false;
    //        }
    //
    //    }
    //    if(victim=="second"){
    //        if($scope.hideSecondMessage){
    //            $scope.hideSecondMessage = false;
    //        }
    //
    //    }
    //
    //    cmsService.saveSetting($scope.first_message,$scope.second_message,$scope.hideFirstMessage,$scope.hideSecondMessage).then(function(response){
    //        $scope.loadMessages();
    //    },function(error){
    //
    //    })
    //
    //}
    //
    //$scope.newBroadCastForm = false
    //$scope.sendMessage = function(first_message,second_message){
    //    var hideMessageOne = false; var hideMessageTwo = false;
    //    cmsService.saveSetting(first_message,second_message,hideMessageOne,hideMessageTwo).then(function(response){
    //        $scope.newBroadCastForm = false;
    //        $scope.editBroadCastForm = false;
    //        $scope.loadMessages();
    //    },function(error){
    //
    //    })
    //
    //}
    //
    //$scope.newMenu = function(){
    //    $scope.newMenuForm = true;
    //    $scope.editMenuForm = false;
    //}
    //
    //$scope.saveMenu = function(menu_name){
    //    //
    //    //var payload = {
    //    //    "program": $scope._smsProgram.id,
    //    //    "orgUnit": "m0frOspS7JY",
    //    //    "eventDate": "2013-05-17",
    //    //    "status": "COMPLETED",
    //    //    "storedBy": "admin",
    //    //    "dataValues": [
    //    //        {"dataElement": "RJ6cGZcjlB6", "value": menu_name},
    //    //    ]
    //    //}
    //    //console.log($scope._tabProgram);
    //    $scope.createTab($scope._tabProgram,menu_name);
    //}
    //
    //$scope.editMenu = function(tab){
    //    $scope.currentTab = tab;
    //    $scope.update_menu_name = tab.value;
    //    $scope.editMenuForm = true;
    //    $scope.newMenuForm = false;
    //}
    //
    //$scope.updateMenu = function(update_menu_name){
    //    $scope.currentTab.value = update_menu_name;
    //    cmsService.updateEvent($scope.currentTab,[{ "dataElement": "RJ6cGZcjlB6", "value":update_menu_name}],$scope.currentTab.event,"error updating menu").then(function(response){
    //        $scope.loadTabs(cmsService._tabProgram);
    //        $scope.add_menu_name = "";
    //        $scope.update_menu_name = "";
    //        $scope.editMenuForm = false;
    //        $scope.newMenuForm = false;
    //    },function(){
    //
    //    })
    //    $scope.editMenuForm = true;
    //    $scope.newMenuForm = false;
    //}
    ////eventId
    //$scope.deleteTab = function(tab){
    //    var eventId  = tab.event;
    //    cmsService.deleteEvent(eventId).then(function(response){
    //        $scope.loadTabs(cmsService._tabProgram);
    //    },function(){
    //
    //    })
    //}
    //
    //$scope.cancelUpdateMenu = function(){
    //    $scope.add_menu_name = "";
    //    $scope.update_menu_name = "";
    //    $scope.editMenuForm = false;
    //    $scope.newMenuForm = false;
    //}
    //
    //$scope.cancelSaveMenu = function(){
    //    $scope.add_menu_name = "";
    //    $scope.update_menu_name = "";
    //    $scope.editMenuForm = false;
    //    $scope.newMenuForm = false;
    //}
    ////!showAddForm&&!showEditForm
    //$scope.getNewArticleForm = function(){
    //    $scope.showAddForm = true;
    //}
    //
    //$scope.getEditArticleForm = function(content){
    //    $scope.currentArticle = content;
    //    $scope.editedContent = content.content;
    //    $scope.showEditForm = true;
    //}
    //
    //function switchCMSTab (){
    //    var link = $location.path();
    //    console.log(link)
    //    if(link.indexOf('tab')<=-1){
    //        var url_length = link.length;
    //        var cms = link.substr(5,url_length-1);
    //        $scope.activeClass[cms] = 'active';
    //    }else{
    //
    //    }
    //
    //}
    //switchCMSTab();
    //
    //$scope.users = [
    //    { icon: "<i class='fa fa-user'></i>",               name: "Leonard Mpande",              maker: "(Opera Software)",        ticked: false  }
    //];
    //
    //
    //// Editor options.
    //$scope.options = {
    //    language: 'en',
    //    allowedContent: true,
    //    entities: false
    //};
    //
    //// Called when the editor is completely ready.
    //$scope.onReady = function () {
    //
    //
    //};
    //
    //$scope.addArticle = function(category,content){
    //    $scope.createTabContent($scope._tabContentProgram,content,category,'1');
    //
    //}
    //
    //$scope.updateArticle = function(category,content){
    //    $scope.updateTabContent($scope._tabContentProgram,$scope.currentArticle.id,content,category,'1');
    //    $scope.showAddForm = false;
    //    $scope.showEditForm = false;
    //}
    //
    //$scope.cancelAddArticle = function(){
    //    $scope.showAddForm = false;
    //    $scope.showEditForm = false;
    //}
    //// function calls
    //
    //cmsService.getParentOrgUnit().then(function(response){
    //    angular.forEach(response.organisationUnits,function(value){
    //        cmsService.parentOrganisationUnit  = value.id;
    //    });
    //    $scope.loadPrograms();
    //    $scope.loadMessages();
    //    $scope.loadCharts();
    //},function(){
    //    console.log("there is error probable the network error");
    //});
    //
    //$scope.getReportTable();
    //
    $scope.currentTab = 'all';
    if($routeParams.tabs){
        $scope.currentTab = $routeParams.tabs;
        $scope.currentTabCapitaize = $routeParams.tabs.Capitalize();
    }

    //$scope.currentSubTab = 'all';
    //if($routeParams.subtab){
    //    $scope.currentSubTab = $routeParams.subtab;
    //    $scope.currentSubTabCapitalize = $scope.currentSubTab.Capitalize();
    //}
    //
    //$scope.subTabAction = 'list';
    //if($routeParams.action_id){
    //    $scope.subTabAction = $routeParams.action_id;
    //}


})
.controller('cmsController',function($scope, $window,$routeParams,$location, cmsService,utilityService){

    //$scope._appPrograms = [];
    //$scope._tabProgram = "";
    //$scope._tabContentProgram = "";
    //$scope._smsProgram = "";
    //$scope._linkProgram = "";
    //$scope._appCharts = [];
    //$scope._currentUser = null;
    //$scope._users = [];
    //$scope.activeClass = [];
//
//    cmsService.getUsers().then(function(value){
//        $scope._users = cmsService.processUsers(value.users);
//    });
//    cmsService.loggedUser().then(function(value){
//        $scope._currentUser = value;
//    });
//
//    // app resources functions
//    $scope.loadPrograms = function(){
//        cmsService.getPrograms().then(function(response){
//            $scope.Programs = $scope.groupPrograms(response.programs);
//        });
//    }
//    $scope.loadCharts = function(){
//        cmsService.getCharts().then(function(response){
//            $scope.charts = response.charts;
//        });
//    }
//
//    $scope.groupPrograms = function(appPrograms){
//        angular.forEach(appPrograms,function(programObject,programIndex){
//            if(programObject.name.indexOf('cms')>=0){
//                cmsService._appPrograms.push(programObject);
//
//            }
//            if(programObject.name.indexOf('home page menu')>=0){
//                cmsService._tabProgram = programObject;
//                $scope._tabProgram = programObject;
//                //$scope.createTab(cmsService._tabProgram)
//                $scope.loadTabs(cmsService._tabProgram);
//                console.log("TABS LOADS HERE");
//            }
//            if(programObject.name.indexOf('cms article')>=0){
//                cmsService._tabContentProgram = programObject;
//                $scope._tabContentProgram = programObject;
//
//                var content = '';
//                //$scope.createTabContent(cmsService._tabContentProgram,content,"Livestock",2);
//                $scope.loadTabContent(cmsService._tabContentProgram);
//            }
//            if(programObject.name.indexOf('cms messages')>=0){
//                cmsService._smsProgram = programObject;
//                $scope._smsProgram = programObject;
//
//                var content = '';
//                //$scope.createTabContent(cmsService._tabContentProgram,content,"Livestock",2);
//                //$scope.loadMessages(cmsService._smsProgram);
//                //$scope.createMessage(cmsService._smsProgram,JSON.stringify({type:"users",list:[{id: "K8jZ8exCsNH",name: "Leonard Mpande"}]}),JSON.stringify({id:"K8jZ8exCsNH",name:"Leonard Mpande"}),"Stay Tuned","Hellow User Stay tuned");
//            }
//            if(programObject.name.indexOf('cms extenal links')>=0){
//                cmsService._linkProgram = programObject;
//
//                $scope.loadExternalLinks(cmsService._linkProgram);
//                //$scope.addExternalLinks(cmsService._linkProgram,"http://www.countrystat.org/","CountryStat",'shown');
//                //$scope.createMessage(cmsService._smsProgram,JSON.stringify({type:"users",list:[{id: "K8jZ8exCsNH",name: "Leonard Mpande"}]}),JSON.stringify({id:"K8jZ8exCsNH",name:"Leonard Mpande"}),"Stay Tuned","Hellow User Stay tuned");
//            }
//
//        });
//    }
//
//    $scope.loadTabs = function(tabProgram){
//        var eventObject = utilityService.prepareEventObject(tabProgram);
//        cmsService.getTabs(eventObject).then(function(response){
//            $scope.tabs = utilityService.refineTabs(response.events);
//            $scope.setDefaultUrl();
//        });
//    }
//
//    $scope.createTab = function(tabProgram,tabValue){
//        var payload = {
//            "program":tabProgram.id,
//            "orgUnit": cmsService.parentOrganisationUnit,
//            "eventDate": "2013-05-17",
//            "status": "COMPLETED",
//            "storedBy": "admin",
//            "dataValues": [
//                { "dataElement": "RJ6cGZcjlB6", "value": tabValue }
//            ]
//        }
//        cmsService.addTab(payload).then(function(response){
//            $scope.loadTabs(tabProgram);
//            $scope.add_menu_name = "";
//            $scope.update_menu_name = "";
//            $scope.editMenuForm = false;
//            $scope.newMenuForm = false;
//        });
//
//    }
//
//    $scope.loadTabContent = function(contentProgram){
//        var eventObject = utilityService.prepareEventObject(contentProgram);
//        cmsService.getTabContent(eventObject).then(function(response){
//            $scope.tabContents = utilityService.refineTabContent(response.events);
//        });
//    }
//    $scope.loadExternalLinks = function(contentProgram){
//
//        var eventObject = utilityService.prepareEventObject(contentProgram);
//        cmsService.getExternalLinks(eventObject).then(function(response){
//            $scope.externalLinks = utilityService.refineExternalLinks(response.events);
//        });
//    }
//
//
//    $scope.addExternalLinks = function(tabProgram,url,name,status){
//
//        if(typeof  tabProgram !=="undefined"){
//            var payload = {
//                "program":tabProgram.id,
//                "orgUnit": cmsService.parentOrganisationUnit,
//                "eventDate": "2013-05-17",
//                "status": "COMPLETED",
//                "storedBy": "admin",
//                "dataValues": [
//                    { "dataElement": "fNpPvw46Mxl", "value": url },
//                    { "dataElement": "cReJPO8bM6C", "value": name },
//                    { "dataElement": "CqGEDx5xw2Y", "value": status }
//                ]
//            }
//
//            cmsService.addExternalLinks(payload).then(function(response){
//            });
//        }
//
//
//
//
//    }
//
//    $scope.setDefaultUrl = function(){
//        if($routeParams.tabId){
//            angular.forEach($scope.tabs,function(tabValue,tabIndex){
//                if(tabValue.active=="current"){
//                    $scope.tabs[tabIndex].active = "";
//                }
//
//                if(tabValue.value==$routeParams.tabId){
//                    $scope.tabs[tabIndex].active = "current";
//                }
//            });
//            //$location.path('/cms/articles/'+$routeParams.tabId+"/tab");
//        }else{
//            angular.forEach($scope.tabs,function(tabValue,tabIndex){
//                if(tabValue.active=="current") {
//                    //$location.path('/cms/articles/' + tabValue.value + "/tab");
//                }
//            });
//        }
//
//    }
//
//    $scope.createTabContent = function(tabProgram,content,menu,order){
//
//        if(typeof  tabProgram !=="undefined"){
//            var payload = {
//                "program":tabProgram.id,
//                "orgUnit": cmsService.parentOrganisationUnit,
//                "eventDate": "2013-05-17",
//                "status": "COMPLETED",
//                "storedBy": "admin",
//                "dataValues": [
//                    { "dataElement": "qYjGeQATsEh", "value": content },
//                    { "dataElement": "xiXnJ2aTlzz", "value": "shown" },
//                    { "dataElement": "JTvaqwY7kDy", "value": order },
//                    { "dataElement": "tz5ttCEyPhf", "value": menu }
//                ]
//            }
//
//            cmsService.addTabContent(payload).then(function(response){
//                $scope.loadTabContent(tabProgram);
//                $scope.showAddForm = false;
//                $scope.showEditForm = false;
//            });
//        }
//
//
//
//
//    }
//
//
//    $scope.updateTabContent = function(tabProgram,eventId,content,menu,order){
//
//        if(typeof  tabProgram !=="undefined"){
//            var payload = {
//                "program":tabProgram.id,
//                "orgUnit": cmsService.parentOrganisationUnit,
//                "eventDate": "2016-04-26",
//                "dataValues": [
//                    { "dataElement": "qYjGeQATsEh", "value": content },
//                    { "dataElement": "xiXnJ2aTlzz", "value": "shown" },
//                    { "dataElement": "JTvaqwY7kDy", "value": order },
//                    { "dataElement": "tz5ttCEyPhf", "value": menu }
//                ]
//            }
//
//            cmsService.updateEvent(payload,payload.dataValues,eventId,"Article Update failed").then(function(response){
//                $scope.loadTabContent(tabProgram);
//                $scope.showAddForm = false;
//                $scope.showEditForm = false;
//            });
//        }
//
//
//
//
//    }
//
//
//
//    $scope.togglePages = function(){
//
//           $location.path('/home');
//
//}
//
//    $scope.loadMessages = function(){
//
//        cmsService.retrieveSetting().then(function(response){
//            $scope.first_message = null;
//            $scope.second_message = null;
//            $scope.messages = response.SMS_CONFIG;
//            angular.forEach($scope.messages,function(value,index){
//
//                if(typeof value.first_message !=="undefined"){
//                        $scope.first_message    = value.first_message;
//                        $scope.hideFirstMessage = value.hide;
//
//                }
//
//                if(typeof value.second_message !=="undefined"){
//                        $scope.second_message    = value.second_message;
//                    $scope.hideSecondMessage = value.hide;
//                }
//
//            });
//        });
//    }
//
//    $scope.messageStatus = function(isRead){
//        if(isRead){
//            return "read";
//        }else{
//            return "notRead"
//        }
//    }
//
//    $scope.readMessage = function(message){
//    }
//
//
//    $scope.deleteMessage = function(victim){
//        var object = "";
//
//        if(victim=="first"){
//            object = {second_message:$scope.second_message,hide:$scope.hideSecondMessage,expireDate:""}
//        }
//
//        if(victim=="second"){
//            object = {first_message:$scope.first_message,hide:$scope.hideFirstMessage,expireDate:""};
//        }
//
//        cmsService.deleteSetting(object).then(function(response){
//           $scope.loadMessages();
//        },function(error){
//
//        });
//    }
//
//
//    $scope.toggleableCMSTab = function(tab){
//
//        angular.forEach($scope.activate,function(tabD,index){
//            $scope.activate[index] = "";
//            if(index==tab){
//                $scope.activate[index] = "active";
//            }
//        })
//
//        if(typeof $scope.newMessageForm != "undefined"){
//            $scope.newMessageForm = false;
//        }
//
//    }
//
//    $scope.cancelMessageSend = function(){
//        $scope.newBroadCastForm = false;
//        $scope.editBroadCastForm = false;
//    }
//
//    $scope.newMessageForm = function(){
//        $scope.newBroadCastForm = true;
//    }
//
//    $scope.editMessageForm = function(choice){
//        if(choice=="first"){
//            $scope.firstEdit = true;
//            $scope.secondEdit = false;
//        }
//        if(choice=="second"){
//            $scope.firstEdit = false;
//            $scope.secondEdit = true;
//        }
//        $scope.editBroadCastForm = true;
//    }
//
//    $scope.hideMessage = function(victim){
//        console.log($scope.hideFirstMessage)
//        if(victim=="first"){
//            if(!$scope.hideFirstMessage){
//                $scope.hideFirstMessage = true;
//            }
//
//        }
//        if(victim=="second"){
//            if(!$scope.hideSecondMessage){
//                $scope.hideSecondMessage = true;
//            }
//
//        }
//        console.log($scope.hideFirstMessage)
//        cmsService.saveSetting($scope.first_message,$scope.second_message,$scope.hideFirstMessage,$scope.hideSecondMessage).then(function(response){
//            $scope.loadMessages();
//        },function(error){
//
//        })
//
//    }
//    $scope.unHideMessage = function(victim){
//
//        if(victim=="first"){
//            if($scope.hideFirstMessage){
//                $scope.hideFirstMessage = false;
//            }
//
//        }
//        if(victim=="second"){
//            if($scope.hideSecondMessage){
//                $scope.hideSecondMessage = false;
//            }
//
//        }
//
//        cmsService.saveSetting($scope.first_message,$scope.second_message,$scope.hideFirstMessage,$scope.hideSecondMessage).then(function(response){
//            $scope.loadMessages();
//        },function(error){
//
//        })
//
//    }
//
//    $scope.newBroadCastForm = false
//    $scope.sendMessage = function(first_message,second_message){
//        var hideMessageOne = false; var hideMessageTwo = false;
//        cmsService.saveSetting(first_message,second_message,hideMessageOne,hideMessageTwo).then(function(response){
//            $scope.newBroadCastForm = false;
//            $scope.editBroadCastForm = false;
//            $scope.loadMessages();
//        },function(error){
//
//        })
//
//    }
//
//    $scope.newMenu = function(){
//        $scope.newMenuForm = true;
//        $scope.editMenuForm = false;
//    }
//
//    $scope.saveMenu = function(menu_name){
//        //
//        //var payload = {
//        //    "program": $scope._smsProgram.id,
//        //    "orgUnit": "m0frOspS7JY",
//        //    "eventDate": "2013-05-17",
//        //    "status": "COMPLETED",
//        //    "storedBy": "admin",
//        //    "dataValues": [
//        //        {"dataElement": "RJ6cGZcjlB6", "value": menu_name},
//        //    ]
//        //}
//        //console.log($scope._tabProgram);
//        $scope.createTab($scope._tabProgram,menu_name);
//    }
//
//    $scope.editMenu = function(tab){
//        $scope.currentTab = tab;
//        $scope.update_menu_name = tab.value;
//        $scope.editMenuForm = true;
//        $scope.newMenuForm = false;
//    }
//
//    $scope.updateMenu = function(update_menu_name){
//        $scope.currentTab.value = update_menu_name;
//        cmsService.updateEvent($scope.currentTab,[{ "dataElement": "RJ6cGZcjlB6", "value":update_menu_name}],$scope.currentTab.event,"error updating menu").then(function(response){
//            $scope.loadTabs(cmsService._tabProgram);
//            $scope.add_menu_name = "";
//            $scope.update_menu_name = "";
//            $scope.editMenuForm = false;
//            $scope.newMenuForm = false;
//        },function(){
//
//        })
//        $scope.editMenuForm = true;
//        $scope.newMenuForm = false;
//    }
//    //eventId
//    $scope.deleteTab = function(tab){
//        var eventId  = tab.event;
//        cmsService.deleteEvent(eventId).then(function(response){
//            $scope.loadTabs(cmsService._tabProgram);
//        },function(){
//
//        })
//    }
//
//    $scope.cancelUpdateMenu = function(){
//        $scope.add_menu_name = "";
//        $scope.update_menu_name = "";
//        $scope.editMenuForm = false;
//        $scope.newMenuForm = false;
//    }
//
//    $scope.cancelSaveMenu = function(){
//        $scope.add_menu_name = "";
//        $scope.update_menu_name = "";
//        $scope.editMenuForm = false;
//        $scope.newMenuForm = false;
//    }
//    //!showAddForm&&!showEditForm
//    $scope.getNewArticleForm = function(){
//        $scope.showAddForm = true;
//    }
//
//    $scope.getEditArticleForm = function(content){
//        $scope.currentArticle = content;
//        $scope.editedContent = content.content;
//        $scope.showEditForm = true;
//    }
//
//    function switchCMSTab (){
//        var link = $location.path();
//
//        if(link.indexOf('tab')<=-1){
//            var url_length = link.length;
//            var cms = link.substr(5,url_length-1);
//            console.log(cms)
//        }else{
//
//        }
//
//    }
//    switchCMSTab();
//
//    $scope.users = [
//        { icon: "<i class='fa fa-user'></i>",name: "Leonard Mpande",maker: "(Opera Software)",ticked: false  }
//    ];
//
//
//    // Editor options.
//    $scope.options = {
//        language: 'en',
//        allowedContent: true,
//        entities: false
//    };
//
//    // Called when the editor is completely ready.
//    $scope.onReady = function () {
//
//    };
//
//    $scope.addArticle = function(category,content){
//        $scope.createTabContent($scope._tabContentProgram,content,category,'1');
//    }
//
//    $scope.updateArticle = function(category,content){
//        $scope.updateTabContent($scope._tabContentProgram,$scope.currentArticle.id,content,category,'1');
//        $scope.showAddForm = false;
//        $scope.showEditForm = false;
//    }
//
//    $scope.cancelAddArticle = function(){
//        $scope.showAddForm = false;
//        $scope.showEditForm = false;
//    }
//
//
//    // function calls
//    cmsService.getParentOrgUnit().then(function(response){
//        angular.forEach(response.organisationUnits,function(value){
//            cmsService.parentOrganisationUnit  = value.id;
//        });
//        $scope.loadPrograms();
//        $scope.loadMessages();
//        $scope.loadCharts();
//    },function(){
//        console.log("there is error probable the network error");
//    });
//

    $scope.currentTab = 'articles';
    if($routeParams.tab){
        $scope.currentTab = $routeParams.tab;
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



    /**
     * Process edit article form event
     * */

    //    // Editor options.
    $scope.editOptions = {
        language: 'en',
        allowedContent: true,
        entities: false
    };


    if($routeParams.action_id){
        if($routeParams.action_id=="edit"){
            if($routeParams.edit_item_id){
                angular.forEach($scope.tabContents,function(value){
                    console.log(value);
                    if(value.id==$routeParams.edit_item_id){
                        $scope.editContent = value.content;
                    }
                });

            }
        }
    }

        // Called when the editor is completely ready.
    $scope.onReady = function () {


    };



})
.controller('rightController',function($scope, $window){
    //
    ////This is not a highcharts object. It just looks a little like one!
    //$scope.chartConfig = {
    //    //chart: {
    //    //    type: 'pie'
    //    //},
    //    title: {
    //        text: 'Monthly Average Rainfall',
    //        style:{fontSize:'10px'}
    //    },
    //    subtitle: {
    //        text: 'Source: WorldClimate.com',
    //        style:{fontSize:'9px'}
    //    },
    //    xAxis: {
    //        categories: [
    //            'Jan',
    //            'Feb',
    //            'Mar'
    //        ],
    //        crosshair: true
    //    },
    //    yAxis: {
    //        min: 0,
    //        title: {
    //            text: 'Rainfall (mm)'
    //        }
    //    },
    //    tooltip: {
    //        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
    //        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
    //        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
    //        footerFormat: '</table>',
    //        shared: true,
    //        useHTML: true
    //    },
    //    plotOptions: {
    //        column: {
    //            pointPadding: 0.1,
    //            borderWidth: 0
    //        }
    //    },
    //    series: [{
    //        name: 'Tokyo',
    //        data: [49.9, 71.5, 106.4]
    //
    //    }, {
    //        name: 'New York',
    //        data: [83.6, 78.8, 98.5]
    //
    //    }, {
    //        name: 'London',
    //        data: [48.9, 38.8, 39.3]
    //
    //    }]
    //};

})
.controller('analysisController',function($scope,$stateParams, $window){})
.controller('cmsTabController',function($scope,$stateParams, $window){
    $scope.activeClass = [];
    $scope.$watch($stateParams,function(newState,oldState){
        $scope.currentSelectedTab = $stateParams.tabs;
        $scope.activeClass[$stateParams.tabs] = "active";
    })
})
.controller('cmsSubTabController',function($scope,$stateParams, $window){

})
.controller('newsController',function($scope,$stateParams, $window){})
.controller('articlesController',function($scope,$stateParams, $window){})
.controller('homeTabController',function($scope,$stateParams, $window){
   $scope.currentTab = $stateParams.tabs;
});
