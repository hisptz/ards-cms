/* global angular, dhis2 */

'use strict';

/* Services */

var cmsServices = angular.module('cmsServices', ['ngResource']);

cmsServices.service('cmsService',['$http','DHIS2URL',function($http,DHIS2URL){
    var cms = this;
    cms.baseUrl = DHIS2URL;
    cms._appPrograms = [];
    cms._tabProgram = null;
    cms._tabContentProgram = null;
    cms._smsProgram = null;
    cms.parentOrganisationUnit = null;
    cms.getParentOrgUnit = function(){
        var url = "../../../api/organisationUnits.json?paging=false&&filter=level:eq:1";
        return $http.get(url).then(handleSuccess, handleError('Error loading parent org unit groups'));
    }


    cms.getPrograms = function(){
        var url = "../../../api/programs.json?filter=programType:eq:WITHOUT_REGISTRATION&filter=name:ilike:cms&&paging=false&fields=id,name,version,categoryCombo[id,isDefault,categories[id]],programStages[id,version,programStageSections[id],programStageDataElements[dataElement[id,optionSet[id,version]]]]";
        return $http.get(url).then(handleSuccess, handleError('Error loading data elements groups'));
    }
    cms.getCharts = function(){
        var url = "../../../api/charts.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading favourite charts'));
    }

    cms.getOrgUnitTree = function(userOrgUnit){
        var orgUnitIds = [];
        userOrgUnit.forEach(function (orgUnit) {
            orgUnitIds.push(orgUnit.id);
        });
        return $http.get("../../../api/organisationUnits.json?filter=id:in:[" + orgUnitIds + "]&fields=id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children[id,name,level,children]]]]");

    }

    cms.sortOrganisationUnits = function (orgUnit,orgUnitArray) {

        angular.forEach(orgUnitArray,function (unitData) {

            if ( unitData == orgUnit.id ) {
                orgUnit.isExpanded = false;
                orgUnit.isActive = false
                orgUnit.selected = true;

            }

        })

        var that = this;
        if (orgUnit.children) {
            orgUnit.children.sort(function (child1, child2) {
                return orgUnitFunction(child1).localeCompare(orgUnitFunction(child2));
            });
            orgUnit.children.forEach(function (child) {
                that.sortOrganisationUnits(child,orgUnitArray);
            })
        }
    }

    cms.uploadDocument = function(file){

        var url = "../../../api/fileResources";
        return $http({method:'POST',headers: {  'Content-Type'  : 'multipart/form-data'},data:file,url:url}).then(handleSuccess, handleError("Error storing file"));
    }

    cms.addExternalLink = function(links,newLink){
        // save document to storage

        links.push(newLink);
        var externalinks = [];
        angular.forEach(links,function(linkValue,linkIndex){
            externalinks.push({marker:"<i class='fa fa-globe'></i>",name:linkValue.name,url:linkValue.url,hidden:false});

        });

        var url = "../../../api/dataStore/linksStorage/externalLinks";
        return $http({method:'POST',data:externalinks,url:url}).then(handleSuccess, handleError("Error storing external links"));
    }


    cms.updateExternalLink = function(links){
        var externalinks = [];
        angular.forEach(links,function(linkValue,linkIndex){
            externalinks.push({marker:"<i class='fa fa-globe'></i>",name:linkValue.name,url:linkValue.url,hidden:linkValue.hidden});

        });
        var url = "../../../api/dataStore/linksStorage/externalLinks";
        return $http({method:'PUT',data:externalinks,url:url}).then(handleSuccess, handleError("Error  updating external links"));
    }


    cms.listExternalLink = function(){

        var url = "../../../api/dataStore/linksStorage/externalLinks";
        return $http({method:'GET',url:url}).then(handleSuccess, handleError("Error list external links"));
    }


    cms.getDocuments = function(charts){
        // save document to storage
        var documents = [];
        var url = "../../../api/dataStore/documentStorage/documents";
        return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error getting documents"));
    }


    cms.hideDocument = function(documentId){
        // save document to storage
        var documents = [];

        return "";

        // var url = "../../../api/dataStore/chartsStorage/availableCharts";
        // return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error hiding documents"));
    }


    cms.showDocument = function(documentId){
        // save document to storage
        var documents = [];
        return "";
        // var url = "../../../api/dataStore/chartsStorage/availableCharts";
        // return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error sho documents"));
    }


    cms.removeDocument = function(charts){
        // save charts to storage
        var documents = [];
        return "";
        // var url = "../../../api/dataStore/chartsStorage/availableCharts";
        // return $http({method:'POST',data:documents,url:url}).then(handleSuccess, handleError("Error remove documents"));
    }


    cms.saveCharts = function(charts){
        // save charts to storage
        var modifiedCharts = [];
        angular.forEach(charts,function(chartValue,chartIndex){
            modifiedCharts.push({id:chartValue.id,name:chartValue.displayName});
        });

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http({method:'POST',data:modifiedCharts,url:url}).then(handleSuccess, handleError("Error storing adding charts"));
    }

    cms.updateCharts = function(charts){
        // save charts to storage
        var modifiedCharts = [];
        angular.forEach(charts,function(chartValue,chartIndex){
            modifiedCharts.push({id:chartValue.id,name:chartValue.displayName});
        });

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http({method:'PUT',data:modifiedCharts,url:url}).then(handleSuccess, handleError("Error storing adding charts"));
    }


    cms.saveSelectedCharts = function(charts){
        // save charts to storage
        var modifiedCharts = [];
        angular.forEach(charts,function(chartValue,chartIndex){

            modifiedCharts.push({id:chartValue.id,name:chartValue.displayName});
        });
        var url = "../../../api/dataStore/chartsStorage/selectedCharts";
        return $http({method:'PUT',data:modifiedCharts,url:url}).then(handleSuccess, handleError("Error storing adding charts"));
    }

    cms.refineCharts = function(charts){
        var newCharts = [];
        angular.forEach(charts,function(newChart,oldChart){

            newCharts.push(eval("("+newChart+")"));
            newCharts.push(JSON.parse((newChart)));
        });
        return newCharts;
    }


    cms.updateSelectedCharts = function(charts){

        // save charts to storage
        var modifiedCharts = [];
        angular.forEach(charts,function(chartValue,chartIndex){

            modifiedCharts.push({icon:"<i class='fa fa-chart'></i>",id:chartValue.id,name:chartValue.displayName,ticked:true});
        });

        //var url = "../../../api/dataStore/chartsStorage/availableCharts";
        var url = "../../../api/dataStore/chartsStorage/selectedCharts";
        return $http({method:'PUT',data:charts,url:url}).then(handleSuccess, handleError("Error storing adding charts"));
        //return $http({method:'DELETE',url:url}).then(handleSuccess, handleError("Error storing adding charts"));
    }

    cms.getSelectedCharts = function(charts){
        var url = "../../../api/dataStore/chartsStorage/selectedCharts";
        return $http({method:'GET',data:charts,url:url}).then(handleSuccess, handleError("Error getting charts"));
    }


    cms.getPageTemplates = function(orientation,page){
        var templates = "";
        if(page=="home"){

            if(orientation=="left"){
                templates = "views/menus/leftmenu.html";
            }

            if(orientation=="center"){
                templates = "views/partials/home.html";
            }

            if(orientation=="right"){
                templates = "views/menus/rightmenu.html";
            }

        }else{

            if(orientation=="left"){
                templates = "views/menus/leftmenu_cms.html";
            }
            if(orientation=="center"){
                templates = "views/partials/home_cms.html";
            }
            if(orientation=="right"){
                templates = "views/menus/rightmenu_cms.html";
            }

        }


        return templates;
    }

    cms.getTabs = function(){
        var url = "../../../api/dataStore/articles/tabs";
        return $http({method:'GET',url:url}).then(handleSuccess, handleError("Error getting charts"));
    }

    cms.getDefaultPage = function(){
        if(!localStorage.getItem('defaultPage')){cms.setDefaultPage('home')}
        return localStorage.getItem('defaultPage');
    }

    cms.setDefaultPage = function(pageName){
        localStorage.setItem('defaultPage',pageName);
    }

    cms.addTab = function(modifiedTabs){

        var url = "../../../api/dataStore/articles/tabs";
        return $http({method:'POST',data:modifiedTabs,url:url}).then(handleSuccess, handleError("Error storing new tabs"));
    }
    cms.updateTab = function(modifiedTabs){

        var url = "../../../api/dataStore/articles/tabs";
        return $http({method:'PUT',data:modifiedTabs,url:url}).then(handleSuccess, handleError("Error storing update tabs"));
    }

    cms.getTabContent = function(){

        var url = "../../../api/dataStore/articles/tabContents";
        return $http({method:'GET',url:url}).then(handleSuccess, handleError("Error getting tab contents"));
    }

    cms.addTabContent = function(tabContents){
        var url = "../../../api/dataStore/articles/tabContents";
        return $http({method:'POST',data:tabContents,url:url}).then(handleSuccess, handleError("Error storing tab contents"));
    }


    cms.updateTabContent = function(tabContents){
        var url = "../../../api/dataStore/articles/tabContents";
        return $http({method:'PUT',data:tabContents,url:url}).then(handleSuccess, handleError("Error updating tab contents"));
    }

    cms.getMessages = function(){
        return cms.retrieveSetting();
    }

    cms.addMessage = function(settingObject){

        return cms.postSettings(settingObject);
    }

    cms.deleteMessage = function(messageId){
        cms.deleteSetting(messageId);
    }

    cms.loadEvent = function(eventObject){
        var url = "../../../api/events.json?orgUnit="+cms.parentOrganisationUnit+"&program="+eventObject.id+"&paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading external links'));
    }


    cms.loadChartStorage = function(){

        var url = "../../../api/dataStore/chartsStorage/availableCharts";
        return $http.get(url).then(handleSuccess, handleError("Error loading Messages"));
    }

    cms.loadInformations = function(){

        var url = "../../../api/dataStore/informationSharing/sharing";
        return $http.get(url).then(handleSuccess, handleError("Error loading Information sharing"));
    }

    cms.addInformations = function(dataArray){

        var url = "../../../api/dataStore/informationSharing/sharing";
        return $http({method:'POST',data:dataArray,url:url}).then(handleSuccess, handleError("Error storing adding information sharing"));

    }

    cms.updateInformations = function(dataArray){

        var url = "../../../api/dataStore/informationSharing/sharing";
        return $http({method:'PUT',data:dataArray,url:url}).then(handleSuccess, handleError("Error storing adding information sharing"));

    }



    cms.retrieveSetting = function(){

        var url = "../../../api/systemSettings";
        return $http.get(url).then(handleSuccess, handleError("Error loading Messages"));
    }


    cms.postSettings = function(dataObject){
        var url = "../../../api/systemSettings";
        return $http({method:'POST',data:dataObject,url:url}).then(handleSuccess, handleError(""));
    }

    cms.deleteSetting = function(data){
        var url = "../../../api/systemSettings/"+data;
        return $http({method:'DELETE',url:url}).then(handleSuccess, handleError(""));
    }

    cms.saveEvent = function(eventPayload,errorMessage){
        var url = "../../../api/events";
        return $http({
            method: 'POST',
            url: url,
            data:eventPayload,
            dataType: "json",
            cache: true,
            ifModified: true
        }).then(handleSuccess, handleError(errorMessage));
    }

    cms.updateEvent = function(eventPayload,data,eventId,errorMessage){
        var url = "../../../api/events/"+eventId;

        var payload = {
            "program":eventPayload.program,
            "orgUnit": cms.parentOrganisationUnit,
            "eventDate": "2013-05-17",
            "dataValues":
            data

        }
        return $http({
            method: 'PUT',
            url: url,
            data:payload,
            dataType: "json",
            cache: true,
            ifModified: true
        }).then(handleSuccess, handleError(errorMessage));
    }

    cms.deleteEvent = function(eventId,errorMessage){
        var url = "../../../api/events/"+eventId;
        return $http.delete(url).then(handleSuccess, handleError(errorMessage));
    }

    cms.getReportTables = function(){
        var url = "../../../api/reportTables.json?fields=:all&paging=false";
        return $http.get(url).then(handleSuccess, handleError("Error Loading favourites"));
    }

    cms.getUsers = function(){
        var url = "../../../api/users.json?paging=false";
        return $http.get(url).then(handleSuccess, handleError('Error loading users'));
    }

    cms.loggedUser = function(){
        var url = "../../../api/me.json";
        return $http.get(url).then(handleSuccess, handleError('Error loading logeged in user'));
    }

    cms.processUsers = function(users){
        var finalUsers = []
        angular.forEach(users,function(user,index){
            user.icon = "<i class='fa fa-user'></i>";
            finalUsers.push(user);
        })

        return finalUsers;
    }

    cms.uploadFileFromForm = function(file, uploadUrl){
            var fd = new FormData();
            fd.append('file', file);

            return $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': 'application/pdf'}
                });
    }
    cms.prepareLeftMenu = function(reportTables){

        var mainmenu = new Array();
        var menuarr = [{'name':"Agriculture",values:[]},{'name':"Livestock",values:[]},{'name':"Fishery",values:[]},{'name':"Trade",values:[]},{'name':"General Information",values:[]}];
        var arrayCounter = 0;


        angular.forEach( reportTables , function( value ){
            var arr = value.displayName.split(':');
            if(arr.length != 1){
                angular.forEach(menuarr,function(menuValue){
                    if(arr[0] == menuValue.name){
                        var filterDimension = "pe";
                        if (value.filterDimensions.length > 0){
                            filterDimension = value.filterDimensions[0];
                        }
                        menuValue.values.push({id:value.id,displayName:arr[1],shortName:arr[1].substring(0,20)+"...",period:cms.preparePeriodFromReportTables(value),orgUnit:cms.prepareOrgUnitFromReportTables(value),dx:cms.prepareDxFromReportTables(value),filter:filterDimension});
                    }
                })

            }
        });

        return menuarr;

    }
    cms.getAnalytics = function(url){

        return $http.get(url).then(handleSuccess, handleError('Error getting analytics'));

        }

    cms.preparePeriodFromReportTables = function(reportTable){

        var periodLength = reportTable.periods.length;
        var period = [];

        angular.forEach(reportTable.periods, function(value){

            if ( periodLength >1 ) {

            }

            period.push(value.id);
        });

        return period.join(";");

    }

    cms.prepareOrgUnitFromReportTables = function(reportTable){

        var organisationUnitsLength = reportTable.organisationUnits.length;
        var organisationUnits = "";

        angular.forEach(reportTable.organisationUnits, function(value){

            if ( organisationUnitsLength >1 ) {
                organisationUnits+=";"
            }

            organisationUnits+=value.id;
        });

        return organisationUnits;
    }


    cms.prepareDxFromReportTables = function(reportTable){

        var dataDimensionItemsLength = reportTable.dataDimensionItems.length;
        var dataDimensionItems = "";

        angular.forEach(reportTable.dataDimensionItems, function(value){

                if ( value.dataDimensionItemType == "AGGREGATE_DATA_ELEMENT" ) {

                    dataDimensionItems+=value.dataElement.id+";"
                }


                if ( value.dataDimensionItemType == "INDICATOR" ) {

                    dataDimensionItems+=value.indicator.id+";"
                }
        });
        dataDimensionItems = dataDimensionItems.substring(0, dataDimensionItems.length-1);

        return dataDimensionItems;
    }


    cms.saveFileResource = function   ( dataElementId, optionComboId, fieldId, fileResource, onSuccessCallback )
    {
        fieldId = '#' + fieldId;

        var periodId = "2016";

        var valueSaver = new FileResourceValueSaver( dataElementId, periodId, optionComboId, fileResource, fieldId, dhis2.de.cst.colorGreen, onSuccessCallback );
        valueSaver.save();
    }

    cms.getDataDimension = function (analytics,dataArray) {
        var dx = analytics.metaData.dx;
        var names = analytics.metaData.names;
        var datadimensions = [];

        angular.forEach(dx, function(value){
            if(names[value]){
                datadimensions.push({name:names[value],id:value});
            }
        });

        angular.forEach(datadimensions, function(dimensionValue,index){

            angular.forEach(dataArray, function(dataValue){
                if ( dataValue == dimensionValue.id ) {

                    datadimensions[index].isExpanded = false;
                    datadimensions[index].isActive = false;
                    datadimensions[index].selected = true;
                }
            });
        });

        return datadimensions;
    }

    cms.getSelectionCriterias = function(item, selectedItems,selectedType,newUrl){

        var organisationUnit = "";
        var period = "";
        var data = "";
        var category = "";
        var type = "";

        if ( selectedType == "orgUnit" && selectedItems.length > 0 ) {
            angular.forEach(selectedItems , function(item){
                organisationUnit+=item.id+";";
            })

        }

        if ( selectedType == "period" && selectedItems.length > 0 ) {
            angular.forEach(selectedItems , function(item){
                period+=item.value+";";
            })
        }

        if ( selectedType == "data" && selectedItems.length > 0 ) {
            angular.forEach(selectedItems , function(item){
                data+=item.id+";";
            })
        }


        if ( selectedType == "category" && selectedItems.length > 0 ) {
            console.log(selectedItems)
            angular.forEach(selectedItems , function(item){
                category = item.id;
            })
        }


        var extractingCategory = newUrl.split('/category/');
        var extractingType = extractingCategory[0].split('/type/');
        var extractingDx = extractingType[0].split('/dx/');
        var extractingOrgUnit = extractingDx[0].split('/orgunit/');
        var extractingPeriod = extractingOrgUnit[0].split('/period/');

        if (organisationUnit==""){
            organisationUnit = extractingOrgUnit[1];
        }
        if (data==""){
            data = extractingDx[1];
        }
        if (period==""){
            period = extractingPeriod[1];
        }

        if (category==""){
            category = extractingCategory[1];
        }
        if (type==""){
            type = extractingType[1];
        }

        return {newUrl:extractingPeriod[0]+'/period/'+period+'/orgunit/'+organisationUnit+'/dx/'+data+'/type/'+type+'/category/'+category,category:category}

    }

    cms.prepareUrlForChange = function (url,param,paramValue) {

        var extractingType = url.split('/type/');
        var extractingDx = extractingType[0].split('/dx/');
        var extractingOrgUnit = extractingDx[0].split('/orgunit/');
        var extractingPeriod = extractingOrgUnit[0].split('/period/');

            var organisationUnit = extractingOrgUnit[1];

            var data = extractingDx[1];

            var period = extractingPeriod[1];


        return {newUrl:extractingPeriod[0]+'/period/'+period+'/orgunit/'+organisationUnit+'/dx/'+data+'/type/'+paramValue};
    }

    cms.setSelectedCategory = function(dataArray,category) {
        angular.forEach(dataArray,function(value,index){
            if ( value.id == category ) {
                dataArray[index].isExpanded = false;
                dataArray[index].isActive = false;
                dataArray[index].selected = true;
            }
        });

        return dataArray;
    }

    /**
     * Supportive method.
     */
    dhis2.de.alertField = function( fieldId, alertMessage )
    {
        var $field = $( fieldId );
        $field.css( 'background-color', dhis2.de.cst.colorYellow );

        window.alert( alertMessage );

        var val = dhis2.de.currentExistingValue || '';
        $field.val( val );

        $field.focus();

        return false;
    }

    // -----------------------------------------------------------------------------
    // Saver objects
    // -----------------------------------------------------------------------------

    /**
     * @param de data element identifier.
     * @param pe iso period.
     * @param co category option combo.
     * @param value value.
     * @param fieldId identifier of data input field.
     * @param resultColor the color code to set on input field for success.
     */
    function ValueSaver( de, pe, co, value, fieldId, resultColor )
    {
        var ou = "m0frOspS7JY";//dhis2.de.getCurrentOrganisationUnit();
        console.log("LOG VALUE");
        console.log(value);
        var dataValue = {
            'de' : de,
            'co' : co,
            'ou' : ou,
            'pe' : pe,
            'value' : value
        };

        var cc = dhis2.de.getCurrentCategoryCombo();
        var cp = dhis2.de.getCurrentCategoryOptionsQueryValue();

        if ( cc && cp )
        {
            dataValue.cc = cc;
            dataValue.cp = cp;
        }

        this.save = function()
        {
            dhis2.de.storageManager.saveDataValue( dataValue );

            $.ajax( {
                url: '../../../api/dataValues',
                data: dataValue,
                dataType: 'json',
                type: 'post',
                success: handleSuccess,
                error: handleError
            } );
        };

        var afterHandleSuccess = function() {};

        this.setAfterHandleSuccess = function( callback ) {
            afterHandleSuccess = callback;
        };

        function handleSuccess()
        {
            dhis2.de.storageManager.clearDataValueJSON( dataValue );
            markValue( fieldId, resultColor );
            $( document ).trigger( dhis2.de.event.dataValueSaved, [ dhis2.de.currentDataSetId, dataValue ] );
            afterHandleSuccess();
        }

        function handleError( xhr, textStatus, errorThrown )
        {
            if ( 409 == xhr.status || 500 == xhr.status ) // Invalid value or locked
            {
                markValue( fieldId, dhis2.de.cst.colorRed );
                var errorText = JSON.parse( xhr.responseText );
                setHeaderDelayMessage( errorText.message );
            }
            else // Offline, keep local value
            {
                markValue( fieldId, resultColor );
                setHeaderDelayMessage( i18n_offline_notification );
            }
        }

        function markValue( fieldId, color )
        {
            $( fieldId ).css( 'background-color', color );
        }
    }

    function FileResourceValueSaver( de, pe, co, fileResource, fieldId, resultColor, onSuccessCallback )
    {
        var valueSaver = new ValueSaver( de, pe, co, fileResource.id, fieldId, resultColor );

        valueSaver.setAfterHandleSuccess( onSuccessCallback );

        return valueSaver;
    }
    function orgUnitFunction(child) {
        return child.name;
    }


    return cms;
}]);

/* Service for uploading/downloading file */
cmsServices.service('FileService', function ($http) {

        return {
            get: function (uid) {
                var promise = $http.get('../../../api/fileResources/' + uid).then(function (response) {
                    return response.data;
                });
                return promise;
            },
            delete: function (uid) {
                var promise = $http.get('../../../api/fileResources/' + uid).then(function (response) {
                    return response.data;
                });
                return promise;
            },
            download: function (fileName) {
                var promise = $http.get(fileName).then(function (response) {
                    return response.data;
                });
                return promise;
            },
            upload: function(file){
                var formData = new FormData();
                formData.append('file', file);
                var headers = {transformRequest: angular.identity, headers: {'Content-Type': undefined}};
                var promise = $http.post('../../../api/fileResources', formData, headers).then(function(response){
                    return response.data;
                });
                return promise;
            }
        };
    })
cmsServices.service('utilityService',function(){
    var utilityService = this;
    utilityService.prepareEventObject = function(assignedProgram){
        var eventObject = {id:assignedProgram.id};

        return eventObject;
    }

    utilityService.formatAnalysis = function(reportTable){
        var favourites = [{name:'Agriculture',indicators:[]},{name:'Livestock',indicators:[]},{name:'Fishery',indicators:[]},{name:'Trade',indicators:[]},{name:'General Information',indicators:[]}];
        angular.forEach(reportTable.reportTables,function(value){

            if(value.displayName.indexOf("Agriculture:")>=0){
                favourites[0].indicators.push(value);
            }
            if(value.displayName.indexOf("Fishery:")>=0){
                favourites[2].indicators.push(value);
            }
            if(value.displayName.indexOf("General Information:")>=0){
                favourites[4].indicators.push(value);
            }
            if(value.displayName.indexOf("Livestock:")>=0){
                favourites[1].indicators.push(value);
            }
            if(value.displayName.indexOf("Trade:")>=0){
                favourites[3].indicators.push(value);
            }
        });
        return favourites;
    }

    utilityService.refineTabs = function(events){
        var tabs = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            angular.forEach(eventValues.dataValues,function(eventValue,eventIndex){
                if(eventValue.value=="Agriculture"){
                    activeClass = "current";
                    contentClass = "show";
                }else{
                    activeClass = "";
                    contentClass = "hide";
                }
                tabs.push({event:eventValues.event,program:eventValues.program,programStage:eventValues.programStage,dataelement:eventValue.dataElement,value:eventValue.value,active:activeClass,content:contentClass})

            })

        });

        return tabs;
    }

    utilityService.refineTabContent = function(events){
        var content = [];
        var activeClass = "";
        var contentClass = "";
        angular.forEach(events,function(eventValues,eventIndexs){
            var template = {id:eventValues.event,menu:utilityService.getValue('tz5ttCEyPhf',eventValues.dataValues),order:utilityService.getValue('JTvaqwY7kDy',eventValues.dataValues),content:utilityService.getValue('qYjGeQATsEh',eventValues.dataValues),shown:utilityService.getValue('xiXnJ2aTlzz',eventValues.dataValues)}
            content.push(template);
        })

        return content;

    }

    utilityService.refineMessage = function(message){
        var content = [];
        var activeClass = "";
        var contentClass = "";

        angular.forEach(message.messageConversations,function(messageValues,messageIndexs){
            //    var template = {from:utilityService.getValue('r7FUBZIK1iH',eventValues.dataValues),to:utilityService.getValue('Am2wAwoJdCV',eventValues.dataValues),subject:utilityService.getValue('QLfNQoTlAM9',eventValues.dataValues),body:utilityService.getValue('qYjGeQATsEh',eventValues.dataValues),date:eventValues.created.substring(0,10)}
            //        angular.forEach(template,function(value,index){
            //            if(index == "from"){
            //                template[index] = eval("("+value+")");
            //            }
            //        });
            messageValues.created = messageValues.created.substring(0,10)
            content.push(messageValues);
        })
        //console.log(message.messageConversations);
        return content;

    }

    utilityService.getValue = function(element,arrayContainer){
        var value = "";
        angular.forEach(arrayContainer,function(elementObject,elementIndex){
            if(element==elementObject.dataElement){
                value = elementObject.value;
            }
        });

        return value;
    }
    utilityService.prepareReportTables = function(reportTables){

        // order the ards menus as required
        var mainmenu = new Array();
        var menuarr = ["Agriculture","Livestock","Fishery","Trade","General Information"];
        var arrayCounter = 0;
        angular.forEach( reportTables, function( value, key ) {
            var arr = value.displayName.split(':');
            if(arr.length > 1){
                if($.inArray(arr[0], menuarr) == -1){
                    var len = menuarr.length -1;
                    menuarr[len] = arr[0];
                    menuarr[menuarr.length] = "General Information";
                    mainmenu[arrayCounter] = arr[0];
                    arrayCounter++;
                }
            }
        });
        return menuarr;
    }

    return utilityService;
});

cmsServices.factory('LoginHttpInterceptor', function ($q, $window) {
    return {
        response: function (response) {
            // do something on success
            if (response.headers()['content-type'] === "text/html;charset=UTF-8") {

                if (response.data.indexOf("loginPage") != -1) {
                    $window.location.href = "../../../"
                    return $q.reject(response);
                }
            }
            return response;
        },
        responseError: function (response) {
            // do something on error
            return $q.reject(response);
        }
    };
});

function handleSuccess(res){
    return res.data;
}

function handleError(error){
    return function () {
        return { success: false, message: error };
    };
}