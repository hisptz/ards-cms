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
                $scope.maxmumCharactersMessage = "Content will not be saved , Broad cast messages shall not exceed 150 characters ";
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
                var mainmenu = new Array();
                var menuarr = [{'name':"Agriculture",values:[]},{'name':"Livestock",values:[]},{'name':"Fishery",values:[]},{'name':"Trade",values:[]},{'name':"General Information",values:[]}];
                var arrayCounter = 0;

                $.each( reportTables.reportTables, function( key, value ) {
                    var arr = value.displayName.split(':');
                    if(arr.length != 1){
                        angular.forEach(menuarr,function(menuValue){
                            if(arr[0] == menuValue.name){
                                menuValue.values.push({id:value.id,displayName:arr[1],shortName:arr[1].substring(0,20)+"..."});
                            }
                        })

                    }
                });
                $scope.analysis = menuarr;
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

    console.log("ajkgewfyWEF");

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

    $(".listmenu").hover(function(){
        var origin = $(this).find('a').html()
        $(this).find('a').html($(this).attr('allstring'))
        $(this).attr('allstring',origin);
    },function(){
        var origin = $(this).find('a').html()
        $(this).find('a').html($(this).attr('allstring'))
        $(this).attr('allstring',origin);
    })

    var name ="";
    var first_orgunit =new Array();
    var first_period = new Array();

    var url1 = '../../../api/reportTables/' + $routeParams.id + '.json?fields=*,dataDimensionItems[dataElement[id,name]]';
    $('#mainarea').html("");

    //prepare data multselect from data_element.js

    $.getJSON(url1, function (data) {
        console.log(data);
        name = data.name;
        var data_element_select = "";
        $.each(data.dataDimensionItems, function (key, value) {
            data_element_select += "<option value='" + value.dataElement.id + "' selected='selected'>" + value.dataElement.name + "</option>";
        });
        $.each(data.organisationUnits, function (key, value) {
            first_orgunit[key] = value.id;
        });

        $.each(data.periods, function (key, value) {
            first_period[key] = value.id;
        });
        //prepare period Multselect from periods.js
        $('.data-element').multiselect().multiselectfilter();
        preparePeriods(first_period);
        $(".data-element").multiselectfilter("destroy");
        $(".data-element").multiselect("destroy");
        $(".data-element").css('width', '180px');
        $('.data-element').html(data_element_select).multiselect().multiselectfilter();

        //creating organization unit multselect from orgUnit.js
//                prepareOrganisationUnit(first_orgunit);

        //creating organization unit multselect
        var district = [];
        var districtOptions="<optgroup label='Districts'>";
        var regions = [];
        var regionsOptions = "<optgroup label='Regions'>";
        var allunits = [];
        var allunitsOptions ="";
        $.getJSON( "scripts/analysis/organisationUnits.json", function( data ) {
            $.each( data.organisationUnits, function( key, value ) {
                //populate regions
                if(value.level == 2){
                    var temp ={ name: value.name, id: value.id };
                    regions.push(temp);
                    if($.inArray(value.id, first_orgunit) == -1){
                        regionsOptions += '<option value="'+value.id+'">'+value.name+' Region</option>';
                    }else{
                        regionsOptions += '<option value="'+value.id+'" selected="selected">'+value.name+' Region</option>';
                    }
                }
                //populate districts
                if(value.level == 3){
                    var temp ={ name: value.name, id: value.id };
                    district.push(temp);
                    if($.inArray(value.id, first_orgunit) == -1){
                        districtOptions += '<option value="'+value.id+'">'+value.name+'</option>';
                    }else{
                        districtOptions += '<option value="'+value.id+'" selected="selected">'+value.name+'</option>';
                    }
                }


            });
            regionsOptions += "<optgroup/>"
            districtOptions += "<optgroup/>"
            allunitsOptions = regionsOptions + districtOptions
            $('.adminUnit').multiselect().multiselectfilter();
            $('#allunits').click(function(){
                $('.unitfilter button').removeClass('btn-success').addClass('btn-default');
                $(this).removeClass('btn-default').addClass('btn-success');
                $(".adminUnit").multiselectfilter("destroy");
                $(".adminUnit").multiselect("destroy");
                $('.adminUnit').html(allunitsOptions);
                $('.adminUnit').multiselect().multiselectfilter();
            })
            $('#district').click(function(){
                $('.unitfilter button').removeClass('btn-success').addClass('btn-default');
                $(this).removeClass('btn-default').addClass('btn-success');
                $(".adminUnit").multiselectfilter("destroy");
                $(".adminUnit").multiselect("destroy");
                $('.adminUnit').html(districtOptions);
                $('.adminUnit').multiselect().multiselectfilter();
            })
            $('#regions').click(function(){
                $('.unitfilter button').removeClass('btn-success').addClass('btn-default');
                $(this).removeClass('btn-default').addClass('btn-success');
                $(".adminUnit").multiselectfilter("destroy");
                $(".adminUnit").multiselect("destroy");
                $('.adminUnit').html(regionsOptions);
                $('.adminUnit').multiselect().multiselectfilter();
            })
            $('.adminUnit').css('width', '180px');
            $('#allunits').trigger('click')

            //hiding error alert
            $('.alert').hide();

            $('.reports button').click(function () {
                $('#mainarea').html('<i class="fa fa-spinner fa-spin fa-3x"></i> Loading...')
                var orgunit = $(".adminUnit").val();
                var dataelement = $('.data-element').val();
                var timeperiod = $(".periods").val();
                if (!orgunit || !dataelement || !timeperiod) {
                    $('.alert').fadeIn('slow');
                    setTimeout(function () {
                        $('.alert').fadeOut('slow');
                    }, 3000);
                } else {
                    //identifying active report
                    $('.reports button').removeClass('btn-success').addClass('btn-default');
                    $(this).removeClass('btn-default').addClass('btn-success');

                    //preparing a link to send to analytics
                    var data_dimension = 'dimension=dx:';
                    for (var i = 0; i < dataelement.length; i++) {
                        data_dimension += (i == dataelement.length - 1) ? dataelement[i] : dataelement[i] + ';';
                    }

                    //creating column dimension
                    var column_dimension = 'dimension=' + $('select[name=category]').val() + ':';
                    //if column will be administrative units
                    if ($('select[name=category]').val() == 'ou') {
                        for (var i = 0; i < orgunit.length; i++) {
                            column_dimension += (i == orgunit.length - 1) ? orgunit[i] : orgunit[i] + ';';
                        }
                    }
                    else { //if column will be periods
                        for (var i = 0; i < timeperiod.length; i++) {
                            column_dimension += (i == timeperiod.length - 1) ? timeperiod[i] : timeperiod[i] + ';';
                        }
                    }

                    //creating filter dimensions
                    var filter = ($('select[name=category]').val() != 'ou') ? 'filter=ou:' : 'filter=pe:'
                    //if filter will be administrative units
                    if ($('select[name=category]').val() != 'ou') {
                        for (var i = 0; i < orgunit.length; i++) {
                            filter += (i == orgunit.length - 1) ? orgunit[i] : orgunit[i] + ';';
                        }
                    }
                    else { //if filter will be periods
                        for (var i = 0; i < timeperiod.length; i++) {
                            filter += (i == timeperiod.length - 1) ? timeperiod[i] : timeperiod[i] + ';';
                        }
                    }

                    var url = '../../../api/analytics.json?' + data_dimension + '&' + column_dimension + '&' + filter


                    //checking types of report needed and react accordingly
                    //drawing table
                    if ($(this).attr('id') == 'draw_table') {
                        drawTable(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //drawing bar chart
                    if ($(this).attr('id') == 'draw_bar') {
                        drawBar(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //drawing column chart
                    if ($(this).attr('id') == 'draw_column') {
                        drawColumn(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //drawing line chart
                    if ($(this).attr('id') == 'draw_line') {
                        drawLine(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //drawing pie chat
                    if ($(this).attr('id') == 'draw_pie') {
                        drawPie(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //drawing staked chat
                    if ($(this).attr('id') == 'draw_staked') {
                        drawStaked(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //drawing spider chat
                    if ($(this).attr('id') == 'draw_spider') {
                        drawSpider(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //drawing combined chat
                    if ($(this).attr('id') == 'draw_combined') {
                        drawCombined(name, url, $('select[name=category]').val(), $('.data-element').val());
                    }
                    //exporting data to excel
                    if ($(this).attr('id') == 'export_cvs') {
                        window.location = '../../../api/analytics.xls?' + data_dimension + '&' + column_dimension + '&' + filter;
                    }
                }
            })
            $(".category").multiselect({
                multiple: false,
                header: "Select an option",
                noneSelectedText: "Select an Option",
                selectedList: 1
            });
            $(".category").css('width', '180px');
            $('#content_to_hide').hide();
            $('.analysis-wraper').fadeIn();
            $('#draw_table').trigger("click");

        });
    });

});
