//const { text } = require("express");

//const { response } = require("express");

//const proj4 = require("./files/proj4");


function openPrint()
{
    showHideHeatmap('none');
    govmap.showPrint();
    hideLayers();
    
}

function openSaveMap() {
    showHideHeatmap('none');
    govmap.showExportMap();
    hideLayers();
}


var substringMatcher = function (strs) {
    return function findMatches(q, cb) {
        
        var matches, substringRegex;

        // an array that will be populated with substring matches
        matches = [];

        // regex used to determine if a string contains the substring `q`
        substrRegex = new RegExp(q, 'i');

        // iterate through the pool of strings and for any string that
        // contains the substring `q`, add it to the `matches` array
        $.each(strs, function (i, str) {
            if (substrRegex.test(str)) {
               if (!strs.some(isNaN)) // if numeric array sort 
                    matches.push(parseInt( str));
               else
                    matches.push(str);
               //matches.sort();
            }
        });

        matches.sort(function (a, b) { return a - b });
        
        cb(matches);
    };
};

function openLayersSectionClick(sectionname, sectionType)
{
    /// open the relevant section accoring to section name
    var layergroupvalue = "#" + sectionname;
    if (sectionType == "MAIN_TOC_BRANCH") {
        collapseAll("layers");
        $(layergroupvalue).collapse('show');
    }
    else
    {
        var father = findBranchFather(sectionname);
        collapseAll(father);
        $(father).collapse('show');
    }

}
function findBranchFather(sectionname)
{
    var section = document.getElementById(sectionname);
    var currentsectionnum = sectionname.charAt(11);
    var potentialFatherNum = Math.trunc( parseInt(currentsectionnum));
    while (potentialFatherNum > -1)
    {
        var potentialSectionName = "btncollapse" + potentialFatherNum;
        var potentialSection = document.getElementById(potentialSectionName);
        var potentialclassname = potentialSection.className;
        var potentialclassType = potentialclassname.substring(3, 6);
        if (potentialclassType == "Toc") {
            return potentialSectionName.substring(3,potentialclassname.length);

        }
        else
        {
            potentialFatherNum -= 1;
        }
    }

    
    
    
}
function clearHighlightInModal(acoordionname)
{
    $('tr', $('#' + acoordionname)).each(function () {
        $(this).removeClass('selected');

    });
}

function openLayersSection(layername, identifylayers)
{
    /// open the relevant section accoring to layer name
    var lnameEng, chk, collapsename, newgroupName, collapse, fatherCollapse,obj;

    var lgroupName = layerByGroup[layername];
    if (isbranch[layername])
    {        
        TurnTocGroupOfLayersOnOff(layername, true, identifylayers);
        //first
        newgroupName = layerByGroup[layername];
        
        collapse = findCollapse(newgroupName);
        fatherCollapse = collapse.substring(3, collapse.length);
        // if selected section is open no need to close it
        var obj = document.getElementById("btn" + fatherCollapse);
        if (obj.ariaExpanded == "false")
            collapseAll('layers');
         $('#' + fatherCollapse).collapse('show');
        //second
        collapse = findCollapse(layername);
        fatherCollapse = collapse.substring(3, collapse.length);
        obj = document.getElementById("btn" + fatherCollapse);
        //if (obj.ariaExpanded == "false")
        //    collapseAll('layers');
        $('#' + fatherCollapse).collapse('show');

    }
    else if (isbranch[lgroupName]) {
        // in case this is a branch we need to open two sections 
        // first 
        newgroupName = layerByGroup[lgroupName];
        collapse = findCollapse(newgroupName);
        var fatherCollapse = collapse.substring(3, collapse.length);
        // if selected section is open no need to close it
        var obj = document.getElementById("btn" + fatherCollapse);
        if (obj.ariaExpanded == "false")
             collapseAll('layers');
        $('#' + fatherCollapse).collapse('show');
        
        //second
        lnameEng = layerHebEng[layername];
        chk = document.getElementById("chk" + lnameEng);
        collapsename = chk.attributes["collapsename"].nodeValue;
        $('#' + collapsename).collapse('show');
    }
    else
    {
        // in case this isnt  a branch open only one section

        lnameEng = layerHebEng[layername];
        chk = document.getElementById("chk" + lnameEng);
        collapsename = chk.attributes["collapsename"].nodeValue;
        var obj = document.getElementById("btn" + collapsename);

        if (obj.ariaExpanded == "false")
            collapseAll('layers');

       // $('#' + collapsename).collapse('show');

        //
        newgroupName = layerByGroup[layername];

        collapse = findCollapse(newgroupName);
        Collapsename = collapse.substring(3, collapse.length);
                
        $('#' + Collapsename).collapse('show');
    }
    
          
}
function findCollapse(groupName)
{
    var name;
    $('button', $('#layers')).each(function ()
    {
        var obj = this;
        if (this.innerHTML.indexOf(groupName) > -1)
        {
            name = this.id;
            return false;
        }
    })
    return name;
}

function scrollToMiddle(containerID, elID) {
    // If element does not Exist then return
    var el = document.getElementById(elID);
    if (el == null) return;

    // If container does not Exist then return
    var container = document.getElementById(containerID);
    if (container == null) return;

    // Position container at the top line then scroll el into view
    container.scrollTop = 0;
    el.scrollIntoView(true);

    // Scroll back nothing if element is at bottom of container else do it
    // for half the height of the containers display area
    var scrollBack = (container.scrollHeight - container.scrollTop <= container.clientHeight) ? 0 : container.clientHeight / 2;
    container.scrollTop = container.scrollTop - scrollBack;
}

//function highlightLayername(heblname) {
  
//    clearselectedlabel();
//    var eanglishname = layerHebEng[heblname];
  
//    eanglishname = "#" + eanglishname;
//    $(eanglishname).css("border", "2.5px solid green");
    
//}

function collapseAll(section) {
  
   
        $('div', $('#'+section)).each(function () {
            if (this.id.indexOf('collapse') > -1) {
                $("#" + this.id).collapse('hide');
                //if (section.substring(3) != this.id)
                //{
                //    var id = "btn" + this.id;
                //   // toggleArrowDown(id);
                //}
            }
        });
       
   
}
//function clearselectedlabel() {
  
//    var tmp;
//    $('label', $('#accordion')).each(function () {
//        tmp = "#" + this.id;
//        $(tmp).css("border", "1px solid #088ccd");
//    });
//}

//function turnlayerOnOff(obj, identifylayers) {
  
//    var layersOff = [];
//    var engLname = obj.id.substring(3, obj.id.length);
//    var numOfCheckedLayers = getnumOfCheckedLAyersInSection(engLname,'up');
//    if (obj.checked == true) {
//        if (identifylayers.indexOf(engLname.toUpperCase()) == -1) {
//            identifylayers.push(engLname.toUpperCase());
//        }

//        checklayerVisibility(engLname);
//    }
//    else {
//        layersOff.push(engLname.toUpperCase());
//        var index = identifylayers.indexOf(engLname.toUpperCase());    // <-- Not supported in <IE9
//        if (index !== -1) {
//            identifylayers.splice(index, 1);
//        }
//        checklayerVisibility("");
//    }

//    govmap.setVisibleLayers(identifylayers, layersOff);
//    return identifylayers;

//}

function turnlayerOnOff(checkboxname, checked, identifylayers)
{
    //var lyr, chk;
    var layersOff = [];
    
    var lname = checkboxname.substring(3, checkboxname.length);

    // we have two checkbox with the same name
    // first    
    
    var chkBoxes = document.querySelectorAll('#'+checkboxname);
    for (i = 0; i < chkBoxes.length; i++)
    {
        chkBoxes[i].checked = checked;
    }
    
    //if(couple_chkBoxes.length>1)
    //    couple_chkBoxes[1].checked = checked;

    
    getnumOfCheckedLAyersInSection(lname, 'down');

    if (checked)
    {

            document.getElementById(checkboxname).checked = true;
            if (identifylayers.indexOf(lname.toUpperCase()) == -1) {
                identifylayers.push(lname.toUpperCase());
                checklayerVisibility(lname.toUpperCase());
            }
            else  // leave, layer already turned on
                return; 
    }
    else
    {
            document.getElementById(checkboxname).checked = false;
           // getnumOfCheckedLAyersInSection(lname, 'down');
            layersOff.push(lname.toUpperCase());
            var index = identifylayers.indexOf(lname);    // <-- Not supported in <IE9
            if (index !== -1) {
                identifylayers.splice(index, 1);
            }
    }

    getNumOfCheckedlayersTotal(identifylayers);
    govmap.setVisibleLayers(identifylayers, layersOff);
}



function changegroupbuttoncolor(groupname)
{
    var groupicons = ["bus", "train", "people", "bycycle", "prefer", "roads"];
    for (i = 0; i < groupicons.length; i++)
    {
        if (groupname == groupicons[i])
            document.getElementById(groupicons[i]).src = "icons/"+ groupname + "_blue.png";
        else
            document.getElementById(groupicons[i]).src = "icons/" + groupicons[i] + "_grey.png";
    }
}


function TurnGroupOfLayersOnOff(groupID,groupchecked, identifylayers)
{
    var lyr, chk;
    var layersOff = [];
    
    for (i = 0; i < layersGroup[groupID].length; i++)
    {
        lyr = layersGroup[groupID][i];
       // if (lyr != "סמן הכל")
        {
            lyr = layerHebEng[lyr];
            chk = "chk" + lyr;

            // we have two checkbox with the same name one in toc and one in groups 
            // this way makes sure they are both get checked / unchecked at the same time

            var chkBoxes = document.querySelectorAll("#" + chk);
            //couple_chkBoxes[0].checked = groupchecked;
            //if (couple_chkBoxes.length > 1)
            //    couple_chkBoxes[1].checked = groupchecked;

            for (j = 0; j < chkBoxes.length ; j++) {
                chkBoxes[j].checked = groupchecked;
            }
            

            getnumOfCheckedLAyersInSection(lyr, 'down');

            if (groupchecked) {
                if (identifylayers.indexOf(lyr.toUpperCase()) == -1) {
                    identifylayers.push(lyr.toUpperCase());

                }
            }
            else {

                document.getElementById(chk).checked = false;
                layersOff.push(lyr.toUpperCase());
                var index = identifylayers.indexOf(lyr);    // <-- Not supported in <IE9
                if (index !== -1) {
                    identifylayers.splice(index, 1);
                }
            }
        }
            

       
    }
    
    getNumOfCheckedlayersTotal(identifylayers);
    govmap.setVisibleLayers(identifylayers, layersOff);
}


function TurnTocGroupOfLayersOnOffold(groupID, groupchecked, identifylayers) // changed
{
    var lyr, chk;
    var layersOff = [];
    // there are three types of groups 
    // 1. TOC_Content group with Toc_Sub_Content inside
    // 2. TOC_Content group without Toc_Sub_Content inside
    // 3. Toc_Sub_Content 

    if (isbranch[groupID] != undefined) // type 3 
    {
        TurnTocSubGroupOfLayersOnOff(groupID, groupchecked, identifylayers, layersOff);
        govmap.setVisibleLayers(identifylayers, layersOff);
       // getNumOfCheckedlayersTotal();
        return;
    }
        
    for (i = 0; i < TOC_Content[groupID].length; i++)
    {
        lyr = TOC_Content[groupID][i];
        if ((lyr != "סמן הכל") && (isbranch[lyr] == undefined)) {
            lyr = layerHebEng[lyr];
            chk = "chk" + lyr;

            // we have two checkbox with the same name one in toc and one in groups 
            // this way makes sure they are both get checked / unchecked at the same time

            var couple_chkBoxes = document.querySelectorAll("#" + chk);
            couple_chkBoxes[0].checked = groupchecked;
            if (couple_chkBoxes.length > 1)
                couple_chkBoxes[1].checked = groupchecked;

            getnumOfCheckedLAyersInSection(lyr, 'down');

            if (groupchecked) {
                if (identifylayers.indexOf(lyr.toUpperCase()) == -1) {
                    identifylayers.push(lyr.toUpperCase());

                }
            }
            else {

                document.getElementById(chk).checked = false;
                layersOff.push(lyr.toUpperCase());
                var index = identifylayers.indexOf(lyr);    // <-- Not supported in <IE9
                if (index !== -1) {
                    identifylayers.splice(index, 1);
                }
            }
        }
        else if ((lyr != "סמן הכל") && (isbranch[lyr] != undefined)) // branch 
            TurnTocSubGroupOfLayersOnOff(lyr, groupchecked, identifylayers, layersOff);
    
    }

  //  getNumOfCheckedlayersTotal();
    govmap.setVisibleLayers(identifylayers, layersOff);
}
function TurnTocGroupOfLayersOnOff(groupID, groupchecked, identifylayers) // changed
{
    var lyr, chk;
    var layersOff = [];
    // there are three types of groups 
    // 1. TOC_Content group with Toc_Sub_Content inside
    // 2. TOC_Content group without Toc_Sub_Content inside
    // 3. Toc_Sub_Content 

    if (isbranch[groupID] != undefined) // type 3 
    {
        TurnTocSubGroupOfLayersOnOff(groupID, groupchecked, identifylayers);
        govmap.setVisibleLayers(identifylayers, layersOff);
        // getNumOfCheckedlayersTotal();
        return;
    }

    for (var k = 0; k < TOC_Content[groupID].length; k++) {
        lyr = TOC_Content[groupID][k];

        if ((lyr != "סמן הכל") && (isbranch[lyr] == undefined))
        {
            lyr = layerHebEng[lyr];
            chk = "chk" + lyr;

            turnlayerOnOff(chk, groupchecked, identifylayers);
        }
        else if ((lyr != "סמן הכל") && (isbranch[lyr] != undefined)) // branch 
            TurnTocSubGroupOfLayersOnOff(lyr, groupchecked, identifylayers);

    }

    //  getNumOfCheckedlayersTotal();
   // govmap.setVisibleLayers(identifylayers, layersOff);
}

function TurnTocSubGroupOfLayersOnOff(groupID, groupchecked, identifylayers) // changed
{
     
    for (j = 0; j < Toc_Sub_Content[groupID].length; j++) {
        tmplyr = Toc_Sub_Content[groupID][j];
        if (tmplyr != "סמן הכל") {
            tmplyr = layerHebEng[tmplyr];
            chk = "chk" + tmplyr;

            turnlayerOnOff(chk, groupchecked, identifylayers);
            
        }
        else {
            var chkallname = layerHebEng[groupID];
            document.getElementById("all" + groupID).checked = groupchecked;

        }
    }
  //  getNumOfCheckedlayersTotal();
}
function getnumOfCheckedLAyersInSection(layername,ArrowPos) {
   
    var lnameHeb = layerEngHeb[layername][0];

    var groupname = layerByGroup[lnameHeb];
    var collapseName = findCollapse(groupname);
    collapseName = collapseName.substring(3, collapseName.length);
    var numofcheckboxingroup = 0;

    $('#' + collapseName + ' input[type="checkbox"]').each(function () {
        if ($(this).is(":checked"))
        {
            if(this.id.substring(0,3)=='chk')    
                numofcheckboxingroup += 1;
        }
    });
        
    var btnname = "btn" + collapseName + "_selectedNum";
   

    if (numofcheckboxingroup > 0) {
       // $("#" + btnname).html("<FONT class='numberCircle'>" + numofcheckboxingroup + '</FONT>');
        document.getElementById(btnname).innerHTML = numofcheckboxingroup;
        document.getElementById(btnname).style.display = "inline-block";
    }
    else
    {
        $("#" + btnname).html("");
        document.getElementById(btnname).style.display = "none";
    }
   // getNumOfCheckedlayersTotal();
            
    if (isbranch[groupname])
    {
        var fathergroupname = layerByGroup[groupname];
        var fathrecollapseName = findCollapse(fathergroupname);
        fathrecollapseName = fathrecollapseName.substring(3, fathrecollapseName.length);
        var fathernumofcheckboxingroup = 0;

        $('#' + fathrecollapseName + ' input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                if (this.id.substring(0, 3) == 'chk')
                    fathernumofcheckboxingroup += 1;
            }
        });

         var btnname = "btn" + fathrecollapseName + "_selectedNum";


        if (fathernumofcheckboxingroup > 0)
        //  $("#" + btnname).html("<FONT class='numberCircleBranch'>" + fathernumofcheckboxingroup + '</FONT>');
        {
            document.getElementById(btnname).innerHTML = fathernumofcheckboxingroup;
            document.getElementById(btnname).style.display = "inline-block";

        }

        else
        {
            $("#" + btnname).html("");
            document.getElementById(btnname).style.display = "none";
        }
    }

}
function getNumOfCheckedlayersTotalMobile(identifylayers)
{
    if (identifylayers.length > 0) {
        document.getElementById("numberCircleMobile").innerHTML = identifylayers.length;
        document.getElementById("numberCircleMobile").style.visibility = "visible"

    }
    else {
        document.getElementById("numberCircleMobile").innerHTML = "";
        document.getElementById("numberCircleMobile").style.visibility = "hidden";

    }
}
function getNumOfCheckedlayersTotal(identifylayers)
{
    if (isMobile)
    {
        if (identifylayers.length > 0)
        {
            document.getElementById("numberCircleMobile").innerHTML = identifylayers.length;
            document.getElementById("numberCircleMobile").style.visibility = "visible"

        }
        else {
            document.getElementById("numberCircleMobile").innerHTML = "";
            document.getElementById("numberCircleMobile").style.visibility = "hidden";

        }
    }
    else
    {
        var groups = document.getElementsByClassName("numberCircle");
        var numOfAllcheckedLayers = 0;
        
        for (i = 0; i < groups.length; i++) {
            if (groups[i].innerHTML.length > 0)
                numOfAllcheckedLayers += parseInt(groups[i].innerHTML);
        }



        if (numOfAllcheckedLayers > 0) {

            document.getElementById("numberCircle").innerHTML = numOfAllcheckedLayers;
            document.getElementById("numberCircle").style.visibility = "visible";
            // document.getElementById("numberCircleMobile").innerHTML = numOfAllcheckedLayers;
            // document.getElementById("numberCircleMobile").style.visibility = "visible"

        }
        else {
            document.getElementById("numberCircle").innerHTML = "";
            document.getElementById("numberCircle").style.visibility = "hidden";
            //   document.getElementById("numberCircleMobile").innerHTML = "";
            //   document.getElementById("numberCircleMobile").style.visibility = "hidden";

        }
    }
    
        
} 


function clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextitems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS)
{
    
    
    govmap.clearSelection();
    govmap.clearDrawings();

    clearGeometries(drawTextData,drawTextitems,userDrawnPointsWKTS,userDrawnLinesWKTS,userDrawnPolygonsWKTS)
    //govmap.removeHeatLayer();
    // clear selected rows in datatable 
    var tb = document.getElementById('dataTable1');
    if (tb != undefined)
    {
        $('#dataTable1 tr').each(function ()
        {
            //var row = this;
            //row.removeClass()
            $(this).removeClass('selected');
        });
    }
   
    selectedIDInDatatable.value = -1;
    removeheatMap();
    if (heatmapLayer != undefined)
        heatmapLayer.value = '';
    if(heatmapField !=undefined)
        heatmapField.value = '';
    if (isMobile ==false )
    {
        document.getElementById('shareNameLabel').innerHTML = " שיתוף ";
        document.getElementById('iShare').style.color = 'rgba(218, 218, 218, 1)';
        document.getElementById("imgShare").src = 'icons/share_white.png';
    }
    
}

function clearGeometries(drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS)
{
    if (userDrawnPointsWKTS != undefined)
        userDrawnPointsWKTS.length = 0;
    if(userDrawnLinesWKTS != undefined)
        userDrawnLinesWKTS.length = 0;
    if(userDrawnPolygonsWKTS !=undefined)
        userDrawnPolygonsWKTS.length = 0;
    var wkts = ["Point(-212720 1151817)"];
    
    var data =
    {
        wkts: wkts,
        names: [],
        geometryType: govmap.drawType.Polygon,
        defaultSymbol:
        {
            outlineColor: [255, 99, 71, 0.5],
            outlineWidth: 2,
            fillColor: [255, 99, 71, 0.5]
        },
        symbols: [],
        clearExisting: true,
        data:
        {
            tooltips: [],
            headers: [],
            bubbleHTML: "",
            bubbleHTMLParameters: [[], []]
        }
    };
    govmap.displayGeometries(data).then(function (response) {
        var res = response;
        // govmap.zoomToDrawing();
    });
    drawTextData.length = 0;
    drawTextItems.length = 0;
}

function clearFilteredLayers(filteredLayers)
{
    if (filteredLayers != undefined) {
        for (i = 0; i < filteredLayers.length; i++) {

            govmap.filterLayers({ 'layerName': filteredLayers[i], 'whereClause': "OBJECTID>-1", 'zoomToExtent': false });
    
        }
        filteredLayers.length = 0;
        return filteredLayers;
    }
}

function select(nameoflayer, obj) {
    var params = {
        interfaceName: nameoflayer,
        continous: false,
        drawType: obj
    };
    govmap.selectFeaturesOnMap(params.interfaceName, params.drawType, params.continous).then(function (response) {
        console.log(response);
    }
    );
}

function openMeasure(selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    showHideHeatmap('none');
    hideLayers();
    govmap.unbindEvent(govmap.events.CLICK);  
    clickEventType.value = "measure";
   
   // const frames = document.getElementById('ifrMap').contentWindow; // or const frames = window.parent.frames;
    

    var msur =  govmap.showMeasure()
    .progress(function (e)
     {

        
     }).done(function (e)
     {
            var obj = this;
            // bind click event again
            clickEventType.value = "identify";
            govmap.onEvent(govmap.events.CLICK).progress(function (e) {
                var pt = "POINT(" + e.mapPoint.x + " " + e.mapPoint.y + ")";
                identifyGeo = pt;
                identifyGeoType = "Point";
                DoTheIntersectNew(identifyGeo, identifylayers, identifyGeoType, 'down', currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, true, routeSteps);
                
                
            });

     })
    //var obj = document.getElementById('divPolygon');
    //var obj2 = document.getElementsByClassName('ng-scope ng-isolate-scope');
    
}
//function advancedfilter(panorama)
//{
//    //var e = document.getElementById("ddlViewBy");
//    //var strUser = e.options[e.selectedIndex].value;
//    var selectedlyr = document.getElementById("advancedfilterselect");
//    var advancedFilterlyr = [];
//    advancedFilterlyr.push(selectedlyr.options[selectedlyr.selectedIndex].value);
//    draw('AFPoint', advancedFilterlyr, identifyResultLayers)
//}
function draw(drawType, identifylayers, arrowDirection, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{

    


    switch (drawType) {
        case "Rectangle":
            {

                govmap.draw(govmap.drawType.Rectangle).progress(function (e) {
                    if (identifylayers.length > numOfLayersToIdentify) {
                        var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                        
                        errormsg += "\n"
                        errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל זיהוי מחדש";
                        alert(errormsg);
                        clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                        return;
                    }
                    identifyGeo = e.wkt;
                    identifyGeoType = "Rectangle";
                    DoTheIntersectNew(e.wkt, identifylayers, 'Rectangle', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, true, routeSteps);
                });

            }
            break;
        case "Point":
            {
                govmap.draw(govmap.drawType.Point).progress(function (e) {
                    if (identifylayers.length > numOfLayersToIdentify) {
                        var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                        errormsg += "\n"
                        errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל זיהוי מחדש";
                        alert(errormsg);
                        clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                        return;
                    }
                    identifyGeo = e.wkt;
                    identifyGeoType = "Point";
                    DoTheIntersectNew(identifyGeo, identifylayers, identifyGeoType, "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, true, routeSteps);
                });
            }
            break;
        case 'streetview':
            {
                govmap.unbindEvent(govmap.events.CLICK);
                govmap.draw(govmap.drawType.Point).progress(function (e)
                {

                    startgoogle(e.wkt, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                });
                
            }
            break;
        case "Radius":
            {
                //govmap.draw(govmap.drawType.Circle).progress(function (e) {
                //    var wkt = PointToPolygon1(e.x, e.y, 10);
                //    DoTheIntersect(wkt, identifylayers,selectedIDInDatatable,slectedLayerInDatatable);
                //});
            }
            break;
        case "Polyline":
            {
                govmap.unbindEvent(govmap.events.CLICK);
                govmap.draw(govmap.drawType.Polyline).progress(function (e) {
                //    DoTheIntersect(e.wkt, identifylayers,selectedIDInDatatable,slectedLayerInDatatable);
                    var data =
                    {
                        wkts: e.wkt,
                        names: [],
                        geometryType: govmap.drawType.Polyline,
                        defaultSymbol:
                        {
                            outlineColor: [0, 80, 255, 1],
                            outlineWidth: 1,
                            fillColor: [138, 43, 226, 0.5]
                        },
                       
                        clearExisting: false,
                        data:
                        {
                            tooltips: [],
                            headers: [],
                            bubbleHTML: "",
                            bubbleHTMLParameters: [[], []]
                        }
                    };
                    govmap.displayGeometries(data).then(function (response) {
                        govmap.zoomToDrawing();
                    });
                    rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                });
            }
            break;
        case "AFPoint":
            {
                govmap.draw(govmap.drawType.Point).progress(function (e) {
                   // DoTheIntersectNew(e.wkt, identifylayers, 'Point', arrowDirection, "all");
                });
            }

    }
}

// 
function DoTheIntersectNew(geo, identifylayers, geoType, arrowDirection, id, identifyType, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, clearDrawnGeo, routeSteps)
{
    //alert(govmap.clickBinded);
    var select = document.getElementById('identifylayerselect');
    var selectmobile = document.getElementById('identifylayernameMobile');
// != null means this isnt first identify so we need to clear select 
// regular means this is regular identify and not sort identify so we also need to clear 
// only when sorting  identify we dont need to reload select since reloading affect the all process 
    if ((identifyType == "Regular") && (select != null))
        select.length = 0;
        
    if ((identifyType == "Regular") && (selectmobile != null))
        selectmobile.length = 0;
    

    var lname = "";
    var lnameUpper = "";
    var idnFields = "";
    var results = [];

    var layerlist = [];
    var fieldValues = [];
    var identifyModalBody = document.getElementById("identifyAccordionNew");
    identifyModalBody.innerHTML = "";
    $('#idresultsTDNew').empty();
    $('#identifyModalNew').modal('hide');
   // clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
    var currentScale = computeMapScale();
    var bufferRadius = 50;
    switch (currentScale) {
        case 3000000:
            bufferRadius = 13000;
            break;
        case 1000000:
            bufferRadius = 5000;
            break;
        case 500000:
            bufferRadius = 3500;
            break;
        case 250000:
            bufferRadius = 2000;
            break;
        case 100000:
            bufferRadius = 700;
            break;
        case 50000:
            bufferRadius = 400;
            break;
        case 25000:
            bufferRadius = 240;
            break;
        case 10000:
            bufferRadius = 120;
            break;
        case 5000:
            bufferRadius = 70;
            break;
        case 2500:
            bufferRadius = 30;
            break;
        case 1250:
            bufferRadius = 20;
            break;
    }
    var xval, yval, polygonGeo;
    if (geoType.toUpperCase() == 'POINT') {
        var tmp = geo.substring(6, geo.length - 1);
        xval = parseFloat(tmp.split(" ")[0]);
        yval = parseFloat(tmp.split(" ")[1]);
        polygonGeo = PointToPolygon1(xval, yval, bufferRadius);
    }


    if (identifylayers.length == 0) {

       // clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
        return;
    }

    for (let i = 0; i < identifylayers.length; i++) {

        lname = identifylayers[i];
        // in case  that selection geometry is point and that layer geometry is point or line we create a buffer from the selection point 

        if ((geoType.toUpperCase() == 'POINT') && (polygonsLayers.indexOf(lname) == -1)) {
            geo = polygonGeo;

        }

        idnFields = identifyFields[lname];
        lnameUpper = lname.toUpperCase();
        // closure
        (function (lname,i) {

           // govmap.intersectFeaturesLongGeom({ 'geometry': geo, 'layerName': lname, 'fields': idnFields, 'getShapes': true, 'maxResults': 500})
            govmap.intersectFeatures({ 'geometry': geo, 'layerName': lname, 'fields': idnFields, getShapes: false })
                .then(function (results) {
                    if (results.data != null) {

                        var columnNumber = parseInt(id.value.substring(7));
                        
                        results.data.sort(sortByProperty(columnNumber, arrowDirection));

                        fieldValues.push({ 'layer': lname, 'data': results.data });

                        DisplayIdentifyresults(fieldValues, lname, identifylayers, arrowDirection, id.value, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, true,routeSteps);

                        try
                        {
                           // selectFeatures1(lname, results);
                        }
                        catch (e) 
                        {

                        }
                        
                    }
                    else {

                        if (fieldValues.length == 0)
                        {
                            hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                            document.getElementById('identifyResultMobileData').innerHTML = '';
                        }
                            

                    }

                }, function (err) {
                    var error1 = err;
                });


        })(lname,i);

    }
    if (clearDrawnGeo)
      govmap.clearDrawings();
}
function sortIdentifyresults(geo, identifylayers, geoType, arrowDirection, id, data, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var select = document.getElementById('identifylayerselect');
    var lname = select.options[select.selectedIndex].value;
    lname = layerHebEng[lname];
    var idnFields = "";
    var results; 
    var fieldValues = [];
    var identifyModalBody = document.getElementById("identifyAccordionNew");
    identifyModalBody.innerHTML = "";
    $('#idresultsTDNew').empty();
    $('#identifyModalNew').modal('hide');
    clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
    

    for ( k = 0; k < identifylayers.length; k++)
    {
        if (lname == identifylayers[k])
        {
            for (j = 0; j < data.length; j ++)
            {
                if (data[j].layer == lname)
                {
                    results = data[j].data;
                    data.splice(j, 1);
                    break;
                }
            }

            //idnFields = identifyFields[lname];
            lnameUpper = lname.toUpperCase();
            if (data != null) {
                var columnNumber;
                columnNumber = parseInt(id.substring(7));
                results.sort(sortByProperty(columnNumber, arrowDirection));
                data.push({ 'layer': lname, 'data': results });
                DisplayIdentifyresults(data, lname, identifylayers, arrowDirection, id, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);
            }
                
            break;
        }
    

    }
    govmap.clearDrawings();
}
function clearTableInfo()
{
    if (document.getElementById("datatable1") != undefined)
        document.getElementById("datatable1").innerHTML = '';
    if (document.getElementById("dataTableModalBody") != undefined)
        document.getElementById("dataTableModalBody").innerHTML = '';
    

}
function DoTheIntersect(objectID, lname, identifylayers, arrowDirection, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{

    var fieldValues = [];

    govmap.intersectFeaturesByWhereClause({ 'layerName': lname, 'fields': identifyFields[lname], getShapes: false, 'whereClause': 'OBJECTID=' + objectID })
        .then(function (e) {
            if (e.data != null && e.data.length > 0)
            {
                fieldValues.push({ 'layer': lname, 'data': e.data });
                DisplayIdentifyresults(fieldValues, lname, identifylayers, arrowDirection, currentSortedColumn.value, objectID, lname, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);
                
            }
        });
   
    govmap.clearDrawings();
}

function DisplayIdentifyresultsMobile(results, lname, identifylayers, arrowDirection, id, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, clearDrawings, routeSteps)
{
    closeAllMobileDivs();
    document.getElementById('identifyResultMobile').style.display = "block";
   
    var lnameheb = layerEngHeb[lname][0];
    document.getElementById('identifyResultMobileData').innerHTML = '';
   // document.getElementById('identifylayernameMobile').length = 0;
    var layerIndex, size;
        

    
    for (j = 0; j < results.length; j++)
    {
        if (results[j].layer == lname)
        {
            size = results[j].data.length;
            break;
        }
        
    }
    

    var select;
    
    var obj = document.getElementById('identifylayernameMobileTD');
    if(obj.innerHTML.indexOf('select')==-1) // first time select doesnt exist
    {
        select = document.createElement('select');
        select.id = 'identifylayernameMobile';
        select.style.width = '95%';
        select.style.textAlign = 'right';
        select.style.fontFamily = 'Alef-Regular';
        select.style.fontSize = 'calc(1.2vh + 1.1vw)';
        select.style.fontWeight = '600';
        select.style.paddingRight = '5%';
        select.style.direction = 'rtl';

        select.onchange = function ()
        {
            var value = this.value;
            var text = this.options[this.selectedIndex].text;
            text = text.split('(')[0];
            var Name = layerHebEng[text];

            for (j = 0; j < results.length; j++)
                if (results[j].layer == Name)
                {
                    //DisplayIdentifyresultsMobile(results, results[j].layer, routeSteps);
                    DisplayIdentifyresultsMobile(results, results[j].layer, identifylayers, arrowDirection, id, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, clearDrawings, routeSteps);
                    layerIndex = j;
                    break;
                }
                
        }
        obj.appendChild(select);

    }
    else 
        select = document.getElementById('identifylayernameMobile');


    var exist = false;
    for (var i = 0; i < select.length; i++) {
        if (select.options[i].value == lnameheb)
        {
            exist = true;
            break;
        }
        
    }
    

    
        
    
    var dataTableM = document.getElementById('identifyResultMobileData');
    dataTableM.innerHTML = '';

    for (j = 0; j < results.length; j++)
        if (results[j].layer == lname) {
            layerIndex = j;
            break;
        }


    for (i = 0; i < results[layerIndex].data.length; i++)
    {
        for (k = 0; k < identifyFields[lname].length ; k++) {
            var fldName = identifyFields[lname][k];
            var fldNameHeb = identifyFieldsEngHeb[lname + '_' + fldName];
            var fldValue = results[layerIndex].data[i].Values[k];
            var value;
            ///// if we have linked file to feature 
            if (urlFields.indexOf(fldName) > -1) {
                value = document.createElement("a");
                if (fldValue == null || fldValue.length == 0) {
                    // in case  feature doesnt have a link 
                    value.style.textDecoration = "";
                    value.setAttribute("href", "");
                    value.setAttribute("target", "")
                    var linkText = document.createTextNode("");
                }
                else {
                    value.style.textDecoration = "underline";
                    value.setAttribute("href", fldValue);
                    value.setAttribute("target", "_blank")
                    value.style.color = "blue";
                    var linkText = document.createTextNode("קישור");
                }
                value.appendChild(linkText);

            }
            else
                value = fldValue;


            /////
           
            //  var oid = results[layerIndex].data[i].ObjectId;
            var tr = document.createElement('tr');
            
            //
            if (lname == 'ROUTING') 
                tr.setAttribute("id", lname + '*' + i); 
            else if (lname == 'BUSROUTES')
                tr.setAttribute("id", lname + '*' + results[0].data[i].Values[2] + "$$$" + results[0].data[i].Values[3] + "#" + results[0].data[i].Values[0])  ;
            else if (lname == 'BUSROUTESTATIONS') // this is not a layer from service but an avi darwn layer  
                tr.setAttribute("id", lname + '*' + results[0].data[i].Values[2] + "$$$" + results[0].data[i].Values[3] + "#" + results[0].data[i].Values[0]);
            else {
                try {
                    tr.setAttribute("id", lname + '*' + results[0].data[i].ObjectId);
                }
                catch
                {

                }
                
                //currentObjID.push(data[t].ObjectId);
                //objID.push(data[t].ObjectId);
            }
            
            //


            tr.setAttribute('title', 'לחץ להתמקדות לרשומה ');
            tr.style.cursor = 'pointer';
            
            tr.style.width = '100%';
            tr.style.border = '1px solid lightgrey';
            var tdlabel = document.createElement('td');
            tdlabel.style.width = '50%';
            tdlabel.style.paddingRight = '5%';
            tdlabel.appendChild(document.createTextNode(fldNameHeb));
            var tdvalue = document.createElement('td');
            //
            if (urlFields.indexOf(fldName) > -1)
                tdvalue.appendChild(value);
            else
                tdvalue.appendChild(document.createTextNode(value));
            //
            tdvalue.style.width = '50%';
            tr.appendChild(tdvalue);
            tr.appendChild(tdlabel);
            tr.onclick = function ()
            {
                zoomToSelectedTableInfoItemMobile(this, selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, clearDrawings, routeSteps);
            }
            dataTableM.appendChild(tr);

        }
        var trgrey = document.createElement('tr');
        trgrey.style.width = '100%';
        trgrey.style.height = '5px';
        trgrey.style.backgroundColor = 'lightgrey';
        trgrey.style.borderRadius = '2px';
        var tdgrey = document.createElement('td');
        trgrey.appendChild(tdgrey);
        tdgrey = document.createElement('td');
        trgrey.appendChild(tdgrey);
        dataTableM.appendChild(trgrey);

    }
    
    if (!exist) {
        var opt = document.createElement('option');
        opt.style.width = '100%';
        opt.value = lnameheb;
        opt.innerHTML = lnameheb + "(" + size + ")";
        //select.insertBefore(opt, select.options[0]);
        select.appendChild(opt);
        select.selectedIndex = select.length-1;

    }    
    
}
function DisplayIdentifyresults(results, lname, identifylayers, arrowDirection, id, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName,clearDrawings,routeSteps)
{
    if (isMobile)
        DisplayIdentifyresultsMobile(results, lname, identifylayers, arrowDirection, id, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, clearDrawings, routeSteps);
        
    else
    {
        if (results[0].data.ExceptionMethod != undefined)
            return

        if (panorama != undefined)
            panorama.setVisible(false);

        var data;
        for (q = 0; q < results.length; q++)
            if (results[q].layer == lname) {
                data = results[q].data;
                break;
            }

        var objID = [];
        var currentObjID = [];
        for (t = 0; t < data.length; t++) {
            // currentObjID.length = 0;
            if (lname == 'ROUTING')
            {
                currentObjID.push(data[t].index);
                objID.push(data[t].index);
            }
            
            else
            {
                currentObjID.push(data[t].ObjectId);
                objID.push(data[t].ObjectId);
            }
            

            //govmap.searchInLayer({ 'layerName': lname, 'fieldName': 'ObjectId', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgb(0,255,255)" });
        }
        // mark identify selected items 
        var queryValues = {
            layerName: lname,
            fieldName: 'ObjectId',
            fieldValues: currentObjID,
            highlight: false,
            outLineColor: "rgb(0,255,255)",
            fillColor: "rgb(0,255,255)"

        };

        // as of november 2020 the searchInLayer function mark only featueres with distance of 11k apart
        // also it doesnt mark point features and lastly it zoom to features as part of the selection it is not possible to 
        // only search without zoom so we dont use the function deliberately 

        // govmap.searchInLayer(queryValues);
        //govmap.searchInLayer({ 'layerName': lname, 'fieldName': 'ObjectId', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgb(0,255,255)" });
        //

        var table = document.createElement('table');
        var wdth = "175px";
        table.style.backgroundColor = "white";
        // table.style.textAlign = 'right';
        table.style.width = '100%';
        table.style.overflow = "auto";
        table.style.tableLayout = 'fixed';
        table.id = "dataTable1";

        // loop through results  
        document.getElementById('statisticsCount').innerHTML = data.length;
        var columnNumber = 0;

        columnNumber = parseInt(id.substring(7));
        try {
            data.sort(sortByProperty(columnNumber, arrowDirection));
        }
        catch
        {

        }


        currentSortedColumn.value = 'mnuDTH_' + columnNumber;
        //data.sort(sortByProperty(columnNumber, arrowDirection[columnNumber]));

        var fldname = identifyFields[lname][columnNumber];
        if (isFieldString[lname + "_" + fldname]) {
            document.getElementById('statisticsMin').innerHTML = 0;
            document.getElementById('statisticsMax').innerHTML = 0;
            document.getElementById('statisticsSum').innerHTML = 0;
            document.getElementById('statisticsAvg').innerHTML = 0;

        }
        else {
             try
            {
                 if (arrowDirection == 'up')
                 {

                document.getElementById('statisticsMin').innerHTML = ToFixed2(data[data.length - 1].Values[columnNumber]);
                document.getElementById('statisticsMax').innerHTML = ToFixed2(data[0].Values[columnNumber]);
            }
            else
            {
                document.getElementById('statisticsMin').innerHTML = ToFixed2(data[0].Values[columnNumber]);
                document.getElementById('statisticsMax').innerHTML = ToFixed2(data[data.length - 1].Values[columnNumber]);
            }
             }
             catch
             {

             }

        }
        var statisticsDataSum = 0;
        var stAvreage = 0;
        var stSD = 0;

        for (i = 0; i < data.length; i++) {
            //

            if ((isFieldString[lname + "_" + fldname] == false) && isNaN(parseInt(data[i].Values[columnNumber])) == false) {
                if (isFloat(data[i].Values[columnNumber]))
                    statisticsDataSum += parseFloat(data[i].Values[columnNumber]);
                else
                    statisticsDataSum += parseInt(data[i].Values[columnNumber]);
            }



            tr = document.createElement('tr');
            tr.style.borderStyle = "solid";
            tr.style.borderWidth = "0.5px";
            tr.style.borderColor = "lightgrey";
            tr.style.height = "36px";
            // object id 



            // rest of fields 
            for (k = identifyFields[lname].length - 1; k > -1; k--) {
                var fldName = identifyFields[lname][k];
                var fldValue = data[i].Values[k];
                var value;
                td = document.createElement('TD');
                td.setAttribute("id", "tdd" + k);
                td.style.textAlign = "right";
                td.style.direction = 'rtl';
                td.style.width = wdth;
                if (urlFields.indexOf(fldName) > -1)
                {
                    value = document.createElement("a");


                    if (fldValue == null || fldValue.length == 0)
                    {
                        // in case  feature doesnt have a link 
                        value.style.textDecoration = "";
                        value.setAttribute("href", "");
                        value.setAttribute("target", "")
                        var linkText = document.createTextNode("");
                    }
                    else
                    {
                        value.style.textDecoration = "underline";
                        value.setAttribute("href", fldValue);
                        value.setAttribute("target", "_blank")
                        value.style.color = "blue";
                        var linkText = document.createTextNode("קישור");
                    }

                    value.appendChild(linkText);
                    td.appendChild(value);
                }
                else
                {
                    value = formatValueForDisplay(fldName, fldValue);
                    td.setAttribute('title', 'לחץ להתמקדות לרשומה ');
                    td.style.cursor = 'pointer';
                    td.onclick = function (evt)
                    {
                        var myparentTr = $(this).closest('tr');
                        $(myparentTr).addClass('selected').siblings().removeClass('selected');
                        zoomToSelectedTableInfoItem(myparentTr[0], selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, clearDrawings,routeSteps);
                    };
                    td.appendChild(document.createTextNode(value));
                }


                tr.appendChild(td);
            }

            // add sfirot download file 
            var oid = data[i].ObjectId;
            var fileKey = lname + "_" + oid;
            td = document.createElement('td');
            td.style.width = wdth;

            if (lname == 'WPLAN2019Q2' || lname == 'SFIROT') {
                if (OID_TO_File[fileKey] != undefined) {
                    var filename = OID_TO_File[fileKey][0];
                    var fileType = OID_TO_File[fileKey][1];
                    var fileFullname = "downloadFiles/" + filename + "." + fileType;
                    var link = document.createElement('a');
                    link.setAttribute('href', fileFullname);
                    link.text = filename + "." + fileType;
                    link.style.color = "blue";
                    link.style.textDecoration = "underline";
                    //link.setAttribute('target', "_blank");
                    //var glyphattach = document.createElement("IMG");
                    //glyphattach.title = "לחץ להורדה";
                    //glyphattach.setAttribute("src", "icons/attachment.png");
                    //glyphattach.setAttribute("width", "7px");
                    //glyphattach.setAttribute("height", "20px");
                    //glyphattach.setAttribute("id", fileKey);
                    //glyphattach.onclick = function () {
                    //    var lyrname = this.id.split("_")[0];
                    //    var id = this.id.split("_")[1];
                    //    downloadAttachedFile(lyrname, id);
                    //}
                    //td.appendChild(glyphattach);
                    td.appendChild(link);
                    tr.appendChild(td);
                }
            }
            // add index field to table
            td = document.createElement('td');
            td.setAttribute("id", "tdd" + k);
            td.style.textAlign = "center";
            td.style.width = "80px";

            td.appendChild(document.createTextNode(i + 1));
            tr.appendChild(td);
            if (lname == 'BUSROUTESTATIONS') // this is not a layer from service but an avi darwn layer  
                tr.setAttribute("id", lname + '*' + data[i].Values[2] + "$$$" + data[i].Values[3] + '@' + data[i].Values[0] );
            else if (lname == 'BUSROUTES')
                tr.setAttribute("id", lname + '*' + data[i].Values[3] + "$$$" + data[i].Values[2] + '@' + data[i].Values[0]);
            else if (lname == 'ROUTING')
                tr.setAttribute("id", lname + '*' + data[i].index + "$$$" + data[i].Values[2] + '@' + data[i].Values[0]);
            else
                tr.setAttribute("id", lname + '*' + data[i].ObjectId);
            table.appendChild(tr);
        }

        if (isFieldString[lname + "_" + fldname] == false) {
            stAvreage = statisticsDataSum / data.length;
            document.getElementById('statisticsSum').innerHTML = ToFixed2(statisticsDataSum);
            document.getElementById('statisticsAvg').innerHTML = ToFixed2(stAvreage);
        }

        for (k = 0; k < data.length; k++) {
            if (isFieldString[lname + "_" + fldname] == false) {
                if (isNaN(parseInt(data[k].Values[columnNumber])) == false) {
                    stSD += Math.pow(parseInt(data[k].Values[columnNumber]) - stAvreage, 2);
                }
            }
        }
        stSD = stSD / data.length;
        stSD = Math.sqrt(stSD);

        document.getElementById('statisticsSD').innerHTML = ToFixed2(stSD);

        var dtDiv = document.getElementById('dataTableModalBody');
        dtDiv.innerHTML = '';
        dtDiv.appendChild(table);
        reshapeMapToFitIdentifyInfo(lname, results, arrowDirection, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, clearDrawings);

        // move datatable1 to right side
        //$("#dataTableModalBody").offset().left += 1;
        var dtdivLeft = dtDiv.scrollWidth;
        dtDiv.scrollLeft = dtdivLeft;
        document.getElementById('dataTableModalBody').scrollLeft += 1;

        // header table 
        table = document.createElement('table');

        table.style.backgroundColor = "white";
        table.style.textAlign = 'center';
        table.style.width = '100%';
        table.style.overflow = "auto";
        table.style.tableLayout = 'fixed';
        table.id = "columnsTable";

        // download connected file clmn
        var tr = document.createElement("tr");

        tr.style.borderTopStyle = "solid";
        tr.style.borderTopWidth = "0.5px";
        tr.style.borderTopColor = "lightgrey";
        tr.style.borderBottomStyle = "solid";
        tr.style.borderBottomWidth = "0.5px";
        tr.style.borderBottomColor = "lightgrey";
        //
        // rest of clmns
        for (j = identifyFields[lname].length - 1; j > -1; j--) {
            if (identifyFields[lname] != "OBJECTID") {
                var th = document.createElement('th');

                th.style.textAlign = "right";
                var fldName = lname + '_' + identifyFields[lname][j];

                th.style.width = wdth;
                th.style.position = "relative";

                //th.setAttribute("offsetLeft" , tmp.offsetLeft+"px");
                th.style.cursor = 'pointer';

                th.setAttribute('title', 'מיון ערכים ');
                th.setAttribute('id', 'DTH_' + j);
                var tmp = document.getElementById("tdd" + j);
                $("#DTH_" + j).offset({ left: tmp.offsetLeft });

                //
                var mnuSelect = document.createElement('select');
                mnuSelect.setAttribute('class', 'dropdown');
                mnuSelect.style.direction = 'rtl';
                mnuSelect.style.border = 'none';
                mnuSelect.style.outline = 'none';
                mnuSelect.style.fontFamily = "Alef-Regular";
                mnuSelect.style.fontWeight = "100";

                mnuSelect.setAttribute('id', 'mnuDTH_' + j);
                mnuSelect.style.scrollBehavior = 'smooth';
                var DDItem = document.createElement('option');
                DDItem.appendChild(document.createTextNode(identifyFieldsEngHeb[fldName]));
                mnuSelect.appendChild(DDItem);
                DDItem = document.createElement('option');
                DDItem.appendChild(document.createTextNode('מיון בסדר יורד'));
                //var arrowD = document.createElement('img');
                //arrowD.src = "icons/Triangle_down.png"
                //DDItem.appendChild(arrowD);
                mnuSelect.appendChild(DDItem);
                DDItem = document.createElement('option');
                DDItem.appendChild(document.createTextNode('מיון בסדר עולה'));
                mnuSelect.appendChild(DDItem);
                DDItem = document.createElement('option');

                DDItem.appendChild(document.createTextNode('סטטיסטיקה'));
                if (isFieldString[lname + "_" + identifyFields[lname][j]])
                    DDItem.disabled = 'true';

                mnuSelect.appendChild(DDItem);

                mnuSelect.onchange = function () {
                    if (this.children[3].disabled)
                        document.getElementById('statisticsDiv').style.width = "0%";
                    //arrowDirection.length = 0;
                    switch (this.selectedIndex) {

                        case 1:
                            {
                                document.getElementById('statisticsDiv').style.width = "0%";
                                //var clmnName = this.id.substring(3, this.id.length);
                                sortIdentifyresults(identifyGeo, identifylayers, identifyGeoType, 'up', this.id, results, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                            }
                            break;
                        case 2:
                            {
                                document.getElementById('statisticsDiv').style.width = "0%";
                                //var clmnName = this.id.substring(3, this.id.length);
                                sortIdentifyresults(identifyGeo, identifylayers, identifyGeoType, 'down', this.id, results, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                            }
                            break;
                        case 3:
                            {
                                //var clmnName = this.id.substring(3, this.id.length);
                                sortIdentifyresults(identifyGeo, identifylayers, identifyGeoType, 'down', this.id, results, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                                hideLayers();
                                openStatistics(lname, this.id, identifylayers);
                            }
                    }
                    this.selectedIndex = 0;

                }

                th.appendChild(mnuSelect);
                //

                tr.appendChild(th);
            }

        }
        // sfirot download file column

        if (lname == 'WPLAN2019Q2' || lname == 'SFIROT') {
            var th = document.createElement('th');
            th.style.textAlign = "right";
            th.appendChild(document.createTextNode('קובץ ספירה'));
            th.style.width = wdth;
            th.style.cursor = 'pointer';

            tr.appendChild(th);
        }

        // index clmn 
        var th = document.createElement('th');
        th.style.textAlign = "center";
        th.appendChild(document.createTextNode('מספר סידורי'));
        //th.appendChild(document.createTextNode(''));
        th.style.width = "84px";
        th.style.fontWeight = "normal";
        th.style.cursor = 'pointer';
        tr.appendChild(th);
        table.appendChild(tr);
        //

        var headertableDiv = document.getElementById("columnHeadersTable");
        headertableDiv.innerHTML = "";
        headertableDiv.appendChild(table);

        // in case a new table is open hide the maximise button
        document.getElementById("btnMaximiseInfoTable").style.display = "none";
    }

    
}


function removeBadCharsFromString(str)
{
    if ((str == undefined) || (str == null) || (str == "null") || (str == "-"))
        return "";

    var currenttext = str.toString();
     
    var re2 = new RegExp("\\\\", "g");
    currenttext = currenttext.replace(re2, "");
    
    if (str != null)
    {
  
        if (currenttext.indexOf(",") > -1)
            currenttext = currenttext.split(",").join("<br>");
        if (currenttext.indexOf("/") > -1)
        {
            var splited = currenttext.split("/");
            
            if (onlyDigits(splited[0]))
                currenttext = currenttext.split("/").join("/");
            else
                currenttext = currenttext.split("/").join("<br>");
        }
        
        if (currenttext.indexOf("_") > -1)
            currenttext = currenttext.split("_").join(" ");
  
    }
    return currenttext;
   
}
function onlyDigits(s) {
    for (let i = s.length - 1; i >= 0; i--) {
        const d = s.charCodeAt(i);
        if (d < 48 || d > 57) return false;
    }
    return true;
}

function zoomToSelectedTableInfoItemMobile(item, selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, clearDrawings, routeSteps)
    //this, selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, clearDrawings, routeSteps
{

   
    var lname = item.id.split('*')[0];
    if (lname == 'BUSROUTESTATIONS') // this isnt a regular layer in service so we cant do "שיתוף" it behaves different then a regular layer
    {
        //clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);

        if (clearDrawings) {
            govmap.clearDrawings();
            clearGeometries(drawTextData, drawTextItems);
            govmap.clearSelection();
        }




        //var stationInfo1 = item.id.split('*');
        //var stationInfo2 = stationInfo1[1].split('$$$');
        //var x = WgsToIsrael(stationInfo2[0], stationInfo2[1]);


        //// we need to draw the station once again since its not a real layer
        //// and the clear drawing cleared its drawn icon
        //var bus_stop_symbol = CheckIconURL();
        //var point = "POINT(" + x[0] + " " + x[1] + ")";
        //var wkts = [];
        //wkts.push(point);
        //var data =
        //{
        //    wkts: wkts,
        //    names: [],
        //    geometryType: govmap.drawType.Point,
        //    defaultSymbol:
        //    {

        //        url: bus_stop_symbol + "/bus_stop.png",
        //        width: 25,
        //        height: 25

        //    },
        //    symbols: [],
        //    clearExisting: false,
        //    data:
        //    {
        //        tooltips: [],
        //        headers: [],
        //        bubbleHTML: "",
        //        bubbleHTMLParameters: [[], []]
        //    }
        //}
        //govmap.displayGeometries(data).then(function (e) {


        //});

        turnlayerOnOff("chkBUS_STOPS_MOT", true, identifylayers);

        var objID = [];
        objID.push(item.id.split('#')[1].trim());
        govmap.searchInLayer({ 'layerName': "BUS_STOPS_MOT", 'fieldName': 'STOP_ID', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
        //govmap.zoomToXY({ x: x[0], y: x[1], level: 10, marker: true });

    }
    else if (lname == 'BUSROUTES') {
        //clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
        var busNum = item.id.split("#")[1];
        if (busNum != null)
            document.getElementById('busNumber').value = busNum;
        govmap.clearSelection();
        govmap.clearDrawings();

        clearGeometries(drawTextData, drawTextItems);

        var routeInfo = item.id.split('*');
        var routeID = item.id.split('$$$')[1].split('#')[0];
        currentBusName = routeID;
        GTFS_Bus_Route_and_Stations(routeID, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, currentBusName);
        govmap.zoomToXY({ x: currentBusStopGeometry[0], y: currentBusStopGeometry[1], level: 10, marker: true });

    }
    else if (lname == 'ROUTING') {
        var index = item.id.split("*")[1];
        var wkts = [];
        x_list = [];
        y_list = [];
        var linestring = "LINESTRING(";
        var routeStepsCounter = 0;
        var steps = routeSteps[parseInt(index)].split(',');
        for (i = 0; i < steps.length; i++) {
            var pt = steps[i].trim();
            xy_pair = pt.split(" ");
            x = xy_pair[0];
            y = xy_pair[1];
            linestring = linestring + x + " " + y + ", ";

            x_list.push(x);
            y_list.push(y);
        }

        linestring = linestring.trim();
        linestring = linestring.substring(0, linestring.length - 1);
        linestring = linestring + ")";
        wkts.push(linestring);

        max_x = Math.max.apply(Math, x_list);
        min_x = Math.min.apply(Math, x_list);
        max_y = Math.max.apply(Math, y_list);
        min_y = Math.min.apply(Math, y_list);
        d_x = max_x - min_x;
        d_y = max_y - min_y;
        radius = Math.floor(Math.max.apply(Math, [d_x, d_y]))
        // console.log(radius);
        lvl = 1;
        if (radius <= 100) {
            lvl = 8
        }
        if (radius > 100 && radius <= 2500) {
            lvl = 7
        }
        if (radius > 2500 && radius <= 5000) {
            lvl = 6
        }
        if (radius > 5000 && radius <= 7500) {
            lvl = 5
        }
        if (radius > 7500 && radius <= 10000) {
            lvl = 4
        }
        if (radius > 10000 && radius <= 25000) {
            lvl = 3
        }
        if (radius > 25000 && radius <= 50000) {
            lvl = 2
        }
        if (radius > 50000 && radius <= 100000) {
            lvl = 1
        }
        if (radius > 100000) {
            lvl = 0
        }
        center_x = min_x + ((max_x - min_x) / 2);
        center_y = min_y + ((max_y - min_y) / 2);

        govmap.zoomToXY({ x: center_x, y: center_y, level: lvl, marker: false });
        //

        var data =
        {
            wkts: wkts,
            names: ['routePart'],
            geometryType: govmap.drawType.Polyline,
            defaultSymbol:
            {
                width: 5,
                color: [255, 38, 127, 1],

                fillColor: [255, 38, 127, 1]
            },
            clearExisting: false,
            data:
            {

            }
        };
        // remove prev selected part if exist
        govmap.clearGeometriesByName('routePart');
        govmap.displayGeometries(data).then(function (e) {

        });

    }
    else {
        var objID = [];
        objID.push(item.id.split('*')[1]);
        selectedIDInDatatable.value = item.id.split('*')[1];
        slectedLayerInDatatable.value = lname;
        document.getElementById('shareNameLabel').innerHTML = " שיתוף " + "<font style='color:rgba(255, 0, 255, 1)'> (כולל הישות שסימנת) </font>";
        document.getElementById("imgShare").src = 'icons/share_pink.png';
        document.getElementById('iShare').style.color = 'rgba(255, 104, 196, 1)';
        govmap.searchInLayer({ 'layerName': lname, 'fieldName': 'ObjectId', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
    }


   
    
}
function zoomToSelectedTableInfoItem(item, selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName,clearDrawings,routeSteps)
{
    var lname = item.id.split('*')[0];
    if (lname == 'BUSROUTESTATIONS') // this isnt a regular layer in service so we cant do "שיתוף" it behaves different then a regular layer
    {
        //clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
        
        if (clearDrawings)
        {
            govmap.clearDrawings();
            clearGeometries(drawTextData, drawTextItems);
            govmap.clearSelection();
        }
        
        
        

        var stationInfo1 = item.id.split('*');
        var stationInfo2 = stationInfo1[1].split('$$$');
        var x = WgsToIsrael(stationInfo2[0], stationInfo2[1]);
        
        
        // we need to draw the station once again since its not a real layer
        // and the clear drawing cleared its drawn icon

        // not relevant anymore since we created and published bus_stops_mot

        //var bus_stop_symbol = CheckIconURL();
        //var point = "POINT(" + x[0] + " " + x[1] + ")";
        //var wkts = [];
        //wkts.push(point);
        //var data =
        //{
        //    wkts: wkts,
        //    names: [],
        //    geometryType: govmap.drawType.Point,
        //    defaultSymbol:
        //    {

        //        url: bus_stop_symbol + "/bus_stop.png",
        //        width: 25,
        //        height: 25
                
        //    },
        //    symbols: [],
        //    clearExisting: false,
        //    data:
        //    {
        //        tooltips: [],
        //        headers: [],
        //        bubbleHTML: "",
        //        bubbleHTMLParameters: [[], []]
        //    }
        //}
        //govmap.displayGeometries(data).then(function (e) {


        //});
        turnlayerOnOff("chkBUS_STOPS_MOT", true, identifylayers);
        //govmap.zoomToXY({ x: x[0], y: x[1], level: 10, marker: true });
        var objID = [];
        objID.push(item.id.split('@')[1].trim());
        govmap.searchInLayer({ 'layerName': "BUS_STOPS_MOT", 'fieldName': 'STOP_ID', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
    }
    else if (lname == 'BUSROUTES')
    {
        //clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
        var busNum = item.childNodes[2].innerHTML;
        if (busNum != null)
            document.getElementById('busNumber').value = busNum;
        govmap.clearSelection();
        govmap.clearDrawings();

        clearGeometries(drawTextData, drawTextItems);

        var routeInfo = item.id.split('*');
        var routeID = routeInfo[1].split('$$$')[0];
        currentBusName = routeID;
        GTFS_Bus_Route_and_Stations(routeID, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, currentBusName);

         govmap.zoomToXY({ x: currentBusStopGeometry[0], y: currentBusStopGeometry[1], level: 10, marker: true });
        //var objID = [];
        //objID.push(item.id.split('*')[1].split('$$$')[0]);
        //govmap.searchInLayer({ 'layerName': lname, 'fieldName': 'ObjectId', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
    }
    else if (lname == 'ROUTING')
    {
        var index = item.id.split("*")[1];
        var wkts = [];
        x_list = [];
        y_list = [];
        var linestring = "LINESTRING(";
        var routeStepsCounter = 0;
        var steps = routeSteps[parseInt(index)].split(',');
        for (i = 0; i < steps.length; i++) {
            var pt = steps[i].trim();
            xy_pair = pt.split(" ");
            x = xy_pair[0];
            y = xy_pair[1];
            linestring = linestring + x + " " + y + ", ";

            x_list.push(x);
            y_list.push(y);
        }

        linestring = linestring.trim();
        linestring = linestring.substring(0, linestring.length - 1);
        linestring = linestring + ")";
        wkts.push(linestring);

        max_x = Math.max.apply(Math, x_list);
        min_x = Math.min.apply(Math, x_list);
        max_y = Math.max.apply(Math, y_list);
        min_y = Math.min.apply(Math, y_list);
        d_x = max_x - min_x;
        d_y = max_y - min_y;
        radius = Math.floor(Math.max.apply(Math, [d_x, d_y]))
        // console.log(radius);
        lvl = 1;
        if (radius <= 100) {
            lvl = 8
        }
        if (radius > 100 && radius <= 2500) {
            lvl = 7
        }
        if (radius > 2500 && radius <= 5000) {
            lvl = 6
        }
        if (radius > 5000 && radius <= 7500) {
            lvl = 5
        }
        if (radius > 7500 && radius <= 10000) {
            lvl = 4
        }
        if (radius > 10000 && radius <= 25000) {
            lvl = 3
        }
        if (radius > 25000 && radius <= 50000) {
            lvl = 2
        }
        if (radius > 50000 && radius <= 100000) {
            lvl = 1
        }
        if (radius > 100000) {
            lvl = 0
        }
        center_x = min_x + ((max_x - min_x) / 2);
        center_y = min_y + ((max_y - min_y) / 2);

        govmap.zoomToXY({ x: center_x, y: center_y, level: lvl, marker: false });
        //

        var data =
        {
            wkts: wkts,
            names: ['routePart'],
            geometryType: govmap.drawType.Polyline,
            defaultSymbol:
            {
                width: 5,
                color: [255, 38, 127, 1],

                fillColor: [255, 38, 127, 1]
            },
            clearExisting: false,
            data:
            {

            }
        };
        // remove prev selected part if exist
        govmap.clearGeometriesByName('routePart');
        govmap.displayGeometries(data).then(function (e) {

        });

    }
    else
    {
        var objID = [];
        objID.push(item.id.split('*')[1]);
        selectedIDInDatatable.value = item.id.split('*')[1];
        slectedLayerInDatatable.value = lname;
        document.getElementById('shareNameLabel').innerHTML = " שיתוף " + "<font style='color:rgba(255, 0, 255, 1)'> (כולל הישות שסימנת) </font>";
        document.getElementById("imgShare").src = 'icons/share_pink.png';
        document.getElementById('iShare').style.color = 'rgba(255, 104, 196, 1)';
        govmap.searchInLayer({ 'layerName': lname, 'fieldName': 'ObjectId', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
    }
    


}


function openlayers()
{
    
    collapseAll('layers');
    document.getElementById('layersFilter').style.width = "0%";
    document.getElementById('fieldFilter').style.width = "0%";
    document.getElementById('layerDownload').style.width = "0%";
    document.getElementById('layerInformation').style.width = "0%";
    document.getElementById('renderer').style.width = "0%";
    document.getElementById('spatialDiv').style.width = "0%";
    document.getElementById('statisticsDiv').style.width = "0%";
   // document.getElementById('BufferDiv').style.width = "0%";

   // hideForm("layersFilter");
   // hideForm("")
    if (document.getElementById("map_div").className == "mapdivsmall")
    {
        document.getElementById('layers').className = 'rightPanelSmall';
    }
    else
        document.getElementById('layers').className = 'rightPanelBig';
    document.getElementById('layers').style.width = '25%';
    document.getElementById("heatmapDiv").style.display = "none";
    hideDrawDiv();
    
}
function openProjects(identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    openlayers();
    var lyr = "tWORKPLAN";
    openLayersFilter(lyr);
    
    buildFielFiltedList(lyr, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
    //turnOneLyrOn(lyr, identifylayers, "up");
    turnlayerOnOff("chk" + "WORKPLAN", true, identifylayers);
    
}
function hideLayers()
{
    
    document.getElementById('layers').style.width = '0%';
    document.getElementById('layerInformation').style.width = '0%';
    document.getElementById('layersFilter').style.width = '0%';
    document.getElementById('fieldFilter').style.width = '0%';
    document.getElementById('layerDownload').style.width = '0%';
    document.getElementById('layers').style.width = '0%';
    document.getElementById('layers').style.width = '0%';
    document.getElementById('renderer').style.width = "0%";
    document.getElementById('spatialDiv').style.width = "0%";
    document.getElementById('statisticsDiv').style.width = "0%";
    document.getElementById('drawDiv').style.display = "none";
    document.getElementById('drawTextDiv').style.display = "none";
   // document.getElementById('bufferDiv').style.display = "none";
    document.getElementById('heatmapDiv').style.display = "none";
    
    //document.getElementById('GTFS').style.display = "none";
    collapseAll('layers');
    $('#fieldfilterTH .typeahead').typeahead('val', '');
    fieldfilterlist.length = 0;
}
function showBufferDiv()
{
    
    hideLayers();
    document.getElementById("spatialDiv").style.display = "block";
}
function showDrawDiv()
{
    //if (isMobile)
    //    $('#btnExportGeometries').css({ display: 'none' });
    //else
    //    $('#btnExportGeometries').css({ display: 'block' });
    document.getElementById("drawDiv").style.display = "block";
}
function showDrawTextDiv() {
    document.getElementById("drawTextDiv").style.display = "block";
}
function hidespatialDiv()
{
    document.getElementById("bufferRadius").value = "";
    document.getElementById("txtBufferSourceLayer").value = "";
    document.getElementById("spatialDiv").style.display = "none";
    
}
function hideDrawDiv() {
    document.getElementById("drawDiv").style.display = "none";
}
function hideDrawTextDiv() {
    document.getElementById("drawTextDiv").style.display = "none";
}
function hideQueries()
{
    document.getElementById('layers').style.width = '0%';
    document.getElementById('layerInformation').style.width = '0%';
    document.getElementById('layersFilter').style.width = '0%';
    document.getElementById('fieldFilter').style.width = '0%';
    document.getElementById('layerDownload').style.width = '0%';
    document.getElementById('layers').style.width = '0%';
    document.getElementById('renderer').style.width = "0%";
    document.getElementById('Queries').style.width = "0%";
    collapseAll('layers');
    $('#fieldfilterTH .typeahead').typeahead('val', '');
    fieldfilterlist.length = 0;
}

function openLayersInformation(id)
{
    document.getElementById('layerInformation').style.width = '25%';
    if (document.getElementById("map_div").className == "mapdivsmall") {
        document.getElementById('layerInformation').className = 'rightPanelSmall';
    }
    else
        document.getElementById('layerInformation').className = 'rightPanelBig';

    var lname = id.substring(1, id.length);
    var lnameHeb = layerEngHeb[lname][0];
    document.getElementById('layerInformationHeader').innerHTML = lnameHeb;
    concatenateInfoString(lname);
    //
    // clear prev renderer 
    document.getElementById("divResult").innerHTML = "";
    
    createRenderer("divResult", lname);
}
function createRenderer(divName,lname)
{
    var layerForRenderer = [];
    layerForRenderer.push(lname);

    var layers = { LayerNames: layerForRenderer };

    govmap.getLayerRenderer(layers)
        .then(function (e) {
            var result = e;
            var table = document.createElement('table');
            table.style.width = "100%";
            table.style.alignSelf = "center";
            var tablebody = document.createElement('TBODY');
            table.appendChild(tablebody);

            for (var object in e.data.Renderers) {
                for (var obj in e.data.Renderers[object].RendererList) {
                    var img = document.createElement('img');
                    img.src = e.data.Renderers[object].RendererList[obj];
                    img.style.width = '17px';
                    img.style.height = '17px';
                    var tr = document.createElement('tr');
                    tr.style.height = "20px";
                     // some layers have only one symbol and so dont have description for that symbol
                    var td = document.createElement("td");
                    td.style.fontFamily = 'Alef-Regular';
                    td.style.fontSize = '15px';
                    td.style.color = 'rgba(142, 158, 183, 1)';
                    if (obj == "") {
                        document.getElementById('rndrHeader').innerHTML = "";
                        td.appendChild(document.createTextNode(lyrRendererDesc[object]));
                    }
                    else
                    {
                        td.appendChild(document.createTextNode(obj));
                        document.getElementById('rndrHeader').innerHTML = lyrRendererDesc[lname];
                    }
                                            
                    td.style.width = "90%";
                    tr.appendChild(td);

                    td = document.createElement('td');
                    td.style.width = "10%";
                    td.appendChild(img)
                    
                    tr.appendChild(td);
                    tablebody.appendChild(tr);
                }

            }
            document.getElementById(divName).appendChild(table);

        });

}

function openLayersFilter(id) {

    document.getElementById('layersFilter').style.width = '25%';
    if (document.getElementById("map_div").className == "mapdivsmall") {
        document.getElementById('layersFilter').className = 'rightPanelSmall';
    }
    else
        document.getElementById('layersFilter').className = 'rightPanelBig';

    var lname = id.substring(1, id.length);
    var lnameHeb = layerEngHeb[lname][0];
    document.getElementById('layerFilterHeader').innerHTML = lnameHeb;
    concatenateInfoString(lname);
    
    
}
function openAdvancedLayersFilter(id)
{
    document.getElementById('AdvancedlayersFilter').style.width = '25%';
    if (document.getElementById("map_div").className == "mapdivsmall") {
        document.getElementById('AdvancedlayersFilter').className = 'rightPanelSmall';
    }
    else
        document.getElementById('AdvancedlayersFilter').className = 'rightPanelBig';

    var lname = id.substring(1, id.length);
    var lnameHeb = layerEngHeb[lname][0];
    document.getElementById('AdvancedLayerFilterHeader').innerHTML = lnameHeb;
    concatenateInfoString(lname);
}

function openRenderer(identifyLayers)
{
    hideLayers();
    document.getElementById('renderer').style.width = '25%';
    if (document.getElementById("map_div").className == "mapdivsmall") {
        document.getElementById('renderer').className = 'rightPanelSmall';
    }
    else
        document.getElementById('renderer').className = 'rightPanelBig';

    var tb = document.getElementById("rendererDivTable");
    tb.innerHTML = "";
    var tbody = document.createElement("tbody");
    tb.appendChild(tbody);
    var tr = document.createElement("tr");
    tr.style.height = "10px";
    tbody.appendChild(tr);
    var td = document.createElement("td");
    tr.appendChild(td);
    var rndrHeader = '';

    for (i = 0; i < identifylayers.length; i++)
    {

        tr = document.createElement("tr");
        tr.style.height = "10px";
        tbody.appendChild(tr);
        td = document.createElement("td");
        tr.appendChild(td);

        tr = document.createElement("tr");
        tbody.appendChild(tr);
        td = document.createElement("td");
        td.setAttribute('id', identifyLayers[i] + 'rndrLayerHeader')
        td.style.color = "rgba(29, 103, 217, 1)";
        td.style.fontFamily = 'Alef-Regular';
        td.style.fontSize = '15px';
        tr.appendChild(td);
        td.appendChild(document.createTextNode(layerEngHeb[identifyLayers[i]][0]));

        tr = document.createElement("tr");
        tbody.appendChild(tr);
        td = document.createElement("td");
        td.setAttribute('id',identifyLayers[i]+'rndrSymbologyHeader')
        td.style.color = "black";
        td.style.fontFamily = 'Alef-Regular';
        td.style.fontSize = '15px';
        tr.appendChild(td);
        if (lyrRendererDesc[identifyLayers[i]] == layerEngHeb[identifyLayers[i]][0])
            rndrHeader = "";
        else
            rndrHeader = lyrRendererDesc[identifyLayers[i]];
        //if (lyrRendererDesc[identifyLayers[i]].length > 0)
        //    rndrHeader = lyrRendererDesc[identifyLayers[i]];
        //else
        //    rndrHeader = "";
        td.appendChild(document.createTextNode(rndrHeader));

        tr = document.createElement("tr");
        tr.style.height = "10px";
        tbody.appendChild(tr);
        td = document.createElement("td");
        tr.appendChild(td);

        tr = document.createElement("tr");
        tbody.appendChild(tr);
        td = document.createElement("td");
        tr.appendChild(td);
        var rndDiv = document.createElement("div");
        rndDiv.setAttribute("id", identifyLayers[i] + "_DIV");
        td.appendChild(rndDiv);
        

        createRenderer(identifyLayers[i] + "_DIV", identifyLayers[i]);
       
    }

}


function openQueries(identifyLayers, SQTHCitylist, SQIDlist)
{
    hideLayers();
    document.getElementById('spatialDiv').style.display = "block";
    document.getElementById('spatialDiv').style.width = '25%';
    if (document.getElementById("map_div").className == "mapdivsmall") {
        document.getElementById('spatialDiv').className = 'rightPanelSmall';
    }
    else
        document.getElementById('spatialDiv').className = 'rightPanelBig';

    // load city typeahead
    var fieldcode1 = getFieldID("MUNI", "SETL_NAME");
    var filecode = layerEngHeb["MUNI"][1];
        
    getDataFromServerCity(fieldcode1, filecode, identifylayers, SQTHCitylist, SQIDlist);

    // jurisdiction typeahead
    fieldcode1 = getFieldID('REGION_AUTH', 'MUNI_NAME');
    var fieldcode2 = getFieldID('REGION_AUTH', 'MUNI_CODE');

    filecode = layerEngHeb["REGION_AUTH"][1];
    getDataFromServerJurisdictionArea(fieldcode1, fieldcode2,filecode, identifylayers, SQTHJurilist, SQJuriIDlist);
    
    
}
function openFieldFilter(lname, fldname, fieldType, identifyLayers)
{
    if (isMobile)
        document.getElementById('fieldFilter').style.width = '100%';
    else
    {
        document.getElementById('fieldFilter').style.width = '25%';
        if (document.getElementById("map_div").className == "mapdivsmall") {
            document.getElementById('fieldFilter').className = 'rightPanelSmall';
        }
        else
            document.getElementById('fieldFilter').className = 'rightPanelBig';
    }
    


    //lname = getLayerNameById(lname);
    currentfilteredLayer = lname;
   // fldname = FieldNameById[lname + "_" + fldname ];
    currentfilteredFieldType = fieldType;
    currentfilteredField = fldname;
    
    //var lname = id.substring(1, id.length);

    var lnameHeb = layerEngHeb[lname][0];
    document.getElementById('fflname').innerHTML = lnameHeb;
    var fname = identifyFieldsEngHeb[lname + "_" + fldname];
    document.getElementById('fieldname').innerHTML = fname ;
    concatenateInfoString(lname);
   
   // turnlayerOnOff('chk' + lname, true, identifyLayers);
}
function openStatistics(lname, fldname,  identifyLayers)
{
    document.getElementById('statisticsDiv').style.width = '25%';
    if (document.getElementById("map_div").className == "mapdivsmall") {
        document.getElementById('statisticsDiv').className = 'rightPanelSmall';
    }
    else
        document.getElementById('statisticsDiv').className = 'rightPanelBig';
    var lnameHeb = layerEngHeb[lname][0];
    document.getElementById('statistoicsLayer').innerHTML = lnameHeb;
        
    var stsfldnameheb = document.getElementById(fldname);
    //e.options[e.selectedIndex].value
    document.getElementById('statisticsFld').innerHTML = stsfldnameheb.options[0].value;
    
}
function getLayerNameById(id)
{
    for (lyr in layerEngHeb)
    {
        if (parseInt(layerEngHeb[lyr][1]) == (parseInt(id)))
            return lyr;
        
    }
    
}
function openLayerDownload(id  )
{
    document.getElementById('layerDownload').style.width = '25%';
    if (document.getElementById("map_div").className == "mapdivsmall") {
        document.getElementById('layerDownload').className = 'rightPanelSmall';
    }
    else
        document.getElementById('layerDownload').className = 'rightPanelBig';

    var lname = id.substring(1, id.length);
    var lnameHeb = layerEngHeb[lname][0];
    document.getElementById('layerDownloadHeader').innerHTML = lnameHeb;
    
   // document.getElementById('btnOpeninfoTable').value = lname;
    downloadLayerName = lname;
}

function showHideRightPanels(paneltoshow,paneltohide)
{
    document.getElementById(paneltohide).style.width = '25%';
    document.getElementById(paneltohide).style.width = '0%';
    $('#fieldfilterTH .typeahead').typeahead('val', '');
    fieldfilterlist.length = 0;
    
}
function hideDisclaimer() {
    $('#Disclaimer').modal('hide');
}
function showSignIn()
{
    document.getElementById('email').value = "";
    document.getElementById('username').value = "";
    $('#modal-signup').modal('show');

}

function openSearchXY()
{
  $('#searchXY').modal('show');
}

function openContactModal()
{
    $('#ContactModal').modal('show');
}
function selectLayerResult(layer, intersectResults)
{
  
    $(layer).addClass('selected').siblings().removeClass('selected');
  
    var element = document.getElementById('resultstableTD');
    element.innerHTML = "";

    var layernameHeb = layer.innerText;
    var layername = layerHebEng[layernameHeb];
    
    var tr, td, table, tableBody;
    var obj;
    var numOfFields;
    table = document.createElement('TABLE');
    table.border = '2';
    table.borderColor = "deepskyblue";
    table.height = '100%';
    table.width = '100%';
    table.id = "identifyTable";
    table.width = "100%";
    
    tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);
    
    for (i = 0; i < intersectResults.length; i++) {

        if (intersectResults[i].layer == layername)
        {
            for (j = 0; j < intersectResults[i].fieldName.length; j++)
            {
                numOfFields = intersectResults[i].fieldName.length;
                tr = document.createElement('TR');
                td = document.createElement('TD');
                td.width = '75';
                td.appendChild(document.createTextNode(layername + '_' + identifyFieldsEngHeb[intersectResults[i].fieldName[j]]));
                tr.appendChild(td);

                td = document.createElement('TD');
                td.width = '75';
                td.appendChild(document.createTextNode(intersectResults[i].layeritems[j]));
                tr.appendChild(td);
                
  
                td = document.createElement('TD');
                td.padding = '0';
                td.appendChild(document.createTextNode(intersectResults[i].layer));
                td.style.display = "none";
                tr.appendChild(td);

  
                td = document.createElement('TD');
                td.padding = '0';
                td.appendChild(document.createTextNode(intersectResults[i].ObjectId));
                td.style.display = "none";
                tr.appendChild(td);


                tr.onclick = function (evt) {
                    selectRow(this);
                };
                tr.title = "לחץ על שורה לצורך התמקדות";
  
                tableBody.appendChild(tr);
            }
            // run selectrow on first row 
            if (obj == undefined)
            {
                obj = tr;
            };

            var link = document.createElement('a');
            link.setAttribute('href', "downloadFiles/space_syntax.pdf");
            link.setAttribute('target', "_blank");
            var linkname = document.createTextNode("קישור");
            link.appendChild(linkname);

            tr = document.createElement('TR');
            td = document.createElement('TD');
            td.width = '75';
            td.appendChild(document.createTextNode("קובץ ספירה"));
            td.style.cursor = 'pointer';
            tr.appendChild(td);

            td = document.createElement('TD');
            td.width = '75';
            td.appendChild(link);
            tr.appendChild(td);
                        
            tableBody.appendChild(tr);
            
           
            tr = document.createElement('TR');
            td = document.createElement('TD');
            td.width = '75';
            td.height = '20';
            tr.appendChild(td);

            td = document.createElement('TD');
            td.width = '75';
            td.height = '20';
            tr.appendChild(td);
            tr.style.backgroundColor = "#1a6eb7";
            tableBody.appendChild(tr);
        }
        
    }
       
    element.style.display = "block";
    element.appendChild(table);
    // assign color to nth row
    setTableRowColor(numOfFields+2);
    
    var footer = document.getElementById("identifyModalfooter");
    footer.innerHTML = "* לחץ על שורה לצורך התמקדות"; 
    var identifylabel = document.getElementById("identifyModalHeader");
    identifylabel.innerHTML = "  זיהוי " + layernameHeb;
    selectRow(obj);
}
    
function setTableRowColor(n)
{
    var tbl = document.getElementById("identifyTable");
    if (tbl != null) {
        if (tbl.rows.length > 0)
        {
             for (var i = 0; i < tbl.rows.length; i++) 
                if (i % n == 0)
                    tbl.rows[i].style.backgroundColor = "lightgrey";
        }
    }
}

function IncaseMobile()
{
    if (isMobile) {
        // we have mobile screen show mobile message
        //  $('#DisclaimerMobile').css({ 'display': 'block' });
        checkDisclaimerStatus();
        document.getElementById('mainToolbar').style.display = 'none';
        document.getElementById('mainToolbarMobile').style.display = 'table';
        document.getElementById('bgOptionsDiv').style.display = 'none';
        document.getElementById('btnMaximiseInfoTable').style.display = 'none';
        document.getElementById('btnOpenDrawText').style.display = 'none';
        document.getElementById('btnStreetView').style.display = 'none';
        document.getElementById('btnOpenDrawGeometry').style.display = 'none';
        document.getElementById('btnMeasure').style.display = 'none';
        document.getElementById('btnHeatMap').style.display = 'none';
        document.getElementById('btnClear').style.display = 'none';
        document.getElementById('btnIdentifyRect').style.display = 'none';
        document.getElementById('mot0').style.display = 'none';
        document.getElementById('mot1').style.display = 'none';
        document.getElementById('mot2').style.display = 'none';
        document.getElementById('mot3').style.display = 'none';
        document.getElementById('mot4').style.display = 'none';
        document.getElementById('searchMain').style.display = 'none';
        document.getElementById('txtlSearchLayerNameMobile').style.display = 'block';
        document.getElementById('mobileGroupsList').style.display = 'none';
        createMobileGroupLayers(identifylayers);
        // suppose to get rid of bottom toolbar in iphone
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        //
    }
    else
    {
        // showAlert(); //show regular disclaimer
    }
    
}
function checkMobile(identifylayers) {
   // var ismobile = isMobileDevice();



    if ("ontouchstart" in window || navigator.msMaxTouchPoints)
    {
        isMobile = true;
        
        
    }
    else
    {
        isMobile == false;
    


    }
    
 
 }
function showAlert() {
    
    $('#Disclaimer').modal('show');
    //$('#Disclaimer').show();
    //var element = document.getElementById("Disclaimer");
    //element.style.display = 'block';  
}

function openExternalApp(object)
{
    
    window.open(externalApps[object.innerHTML]);
}

function selectRow(row)
{
    
    var tmpRow = $(row);
    var layer = tmpRow[0].children[2].innerHTML;
    var objectID = tmpRow[0].children[3].innerHTML;
    var objectIDS = [];
    objectIDS.push(objectID);
    govmap.searchInLayer({ 'layerName': layer, 'fieldName': 'ObjectId', 'fieldValues': objectIDS, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });

}
function computeScaleBarLength(lenInPx,scale)
{
    var scalebarLen = lenInPx * 0.0002645833333333 * scale;
    return scalebarLen;
}
function assignScaleBarElemetsSize(lenInPx)
{
    var start = ($(window).width() / 2) - 50;

    var wdt = lenInPx / 4;
    var sc1 = document.getElementById('scale1');
    
    sc1.style.width = wdt + "px";
    sc1.style.left = start.toString() + "px";
    
    var sc2 = document.getElementById('scale2');
    sc2.style.width = wdt + "px";
    var tmp = sc1.style.left.substr(0, sc1.style.left.length - 2);
    tmp = parseFloat(tmp);
    sc2.style.left = tmp + wdt + "px";

    var sc3 = document.getElementById('scale3');
    sc3.style.width = wdt + "px";
    tmp = sc2.style.left.substr(0, sc2.style.left.length - 2);
    tmp = parseFloat(tmp);
    sc3.style.left = tmp + wdt + "px";

    var sc4 = document.getElementById('scale4');
    sc4.style.width = wdt +"px";
    tmp = sc3.style.left.substr(0, sc3.style.left.length - 2);
    tmp = parseFloat(tmp);
    sc4.style.left = tmp + wdt + "px";
    
    

}
function computeMapScale(obj)
{
    //{level:0,resolution:793.751587503175,scale:3000000},
    //{ level: 1, resolution: 264.583862501058, scale: 1000000 },
    //{ level: 2, resolution: 132.291931250529, scale: 500000 },
    //{ level: 3, resolution: 66.1459656252646, scale: 250000 },
    //{ level: 4, resolution: 26.4583862501058, scale: 100000 },
    //{ level: 5, resolution: 13.2291931250529, scale: 50000 },
    //{ level: 6, resolution: 6.61459656252646, scale: 25000 },
    //{ level: 7, resolution: 2.64583862501058, scale: 10000 },
    //{ level: 8, resolution: 1.32291931250529, scale: 5000 },
    //{ level: 9, resolution: 0.661459656252646, scale: 2500 },
    //{ level: 10, resolution: 0.330729828126323, scale: 1250 }],
    //
    
    //





    var mpDiv = document.getElementById("map_div");
    var mapWidthInPx = mpDiv.offsetWidth;
    var scale = Math.round((objExtent.xmax - objExtent.xmin) / (mapWidthInPx * 0.000264583));
    if (scale > 2800000)
        scale = 3000000;
    var txtScale = scale.toString();
    
    if (txtScale.charAt(txtScale.length - 1) != "0") {
        txtScale = txtScale.substring(0, txtScale.length - 1) + "0";
        scale = parseInt(txtScale);
    }
    txtScale = scale.toString();
    if ((txtScale.length == 7) && (txtScale.substring(txtScale.length - 2, txtScale.length - 1) != "0")) {
        txtScale = txtScale.substring(0, txtScale.length - 2) + "00";
        scale = parseInt(txtScale);
    }

    document.getElementById("scale_p").innerHTML = "1 : " + scale;
    var pxwdt, mtwidt;
    switch (scale) {
        case 3000000:
            pxwdt = 126;
            mtwidt = 100000;
            break;
        case 1000000:
            pxwdt = 113.383;
            mtwidt = 30000;
            break;
        case 500000:
            pxwdt = 113.383;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 250000:
            pxwdt = 151.18;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 100000:
            pxwdt = 113.4;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 50000:
            pxwdt = 113.4;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 25000:
            pxwdt = 151.2;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 10000:
            pxwdt = 113.4;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 5000:
            pxwdt = 113.4;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 2500:
            pxwdt = 151;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 1250:
            pxwdt = 151;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;
        case 500:
            pxwdt = 151;
            mtwidt = Math.round(computeScaleBarLength(pxwdt, scale));
            break;

    }
    if (mtwidt >= 1000) {
        mtwidt = mtwidt / 1000;
        document.getElementById('scaleUnit').innerHTML = 'ק"מ';
    }
    else
        document.getElementById('scaleUnit').innerHTML = 'מטר';

    document.getElementById('scaleInMeters').innerHTML = mtwidt;
    assignScaleBarElemetsSize(pxwdt);
    return scale;
}
function bindClickEvent()
{
    
    govmap.onEvent(govmap.events.CLICK).progress(function (e) {
        identify(e.mapPoint, "point", identifylayers, filteredLayers);
    });
}
function download1()
{
    var shp = document.getElementById('optDownloadshp').checked;
    var excl = document.getElementById('optDownloadexcel').checked;
    var kml = document.getElementById('optDownloadkml').checked;
    var metadata = document.getElementById('optMetaData').checked;


    var lname = downloadLayerName;
    if (shp)
        fileName = Download[lname][0];
    else if (excl)
        fileName = Download[lname][2];
    else if (kml)
        fileName = Download[lname][1];
    else if (metadata)
        fileName = Download[lname][3];
        
    if (lname != "" && downloadLayer[lname])
    {
        var link = document.createElement('a');
        link.setAttribute('href',  fileName);
        //"/downloadFiles/"
      //  link.setAttribute('href', downloadLayer[lname][0]);

        link.setAttribute('target', "_blank");
        link.click();
    }
    
      
}

function downloadAttachedFile(lname,id)
{
    var fileKey = lname + '_' + id;
    var fileType, filename, fileFullname;

    if (OID_TO_File[fileKey] != undefined) {
        filename = OID_TO_File[fileKey][0];
        fileType = OID_TO_File[fileKey][1];
        fileFullname = "downloadFiles/" + filename + "." + fileType;
        //if(isAviOnTrip())
        //    fileFullname = "sample.docx";
        var link = document.createElement('a');
        link.setAttribute('href',  fileFullname);
        link.setAttribute('target', "_blank");
        link.click();
    }    
}

function isAviOnTrip()
{
    var today = new Date();
    var dd = parseInt( today.getDate());
    var mm = parseInt( today.getMonth() + 1); //January is 0!
    var yyyy = parseInt(today.getFullYear());
    if (dd > 12 &&  mm >= 2 )
        return true;
    else
        return false;
}
function getLayerInfo(lyrname)
{   
    return layerInfo[lyrname];
}
function showLayerPossibilities(after, obj, group, fieldFilterSqlArray) // changed
{
   
    // in case we are in "סמן הכל" or if this is a branch 
    // dont show layer posibilities
    if (obj.innerText == "סמן הכל")
        return;
    var engName = obj.id.substring(6, obj.id.length);

    //|| (isbranch[lnameHeb]))

    
   // var engName = layerHebEng[lnameHeb];
    
    
    if ((downloadLayer[engName]) == true) {
        document.getElementById(group + 'd' + after + engName).style.visibility = 'visible';
    }
    
    // information
    document.getElementById(group + 'i' + after + engName).style.visibility = 'visible';
    
    // focus
    document.getElementById(group + 'f' + after + engName).style.visibility = 'visible';
    

    // filter
    if ((filterLayer[engName] == false) ||(identifyFields[engName] == undefined) || (identifyFields[engName].length == 1 && identifyFields[engName][0].toUpperCase() == 'OBJECTID')) {
        document.getElementById(group + 't' + after + engName).style.visibility = "hidden";
    }
    else
    {
        if (layerWasFiltered(engName, fieldFilterSqlArray)) {
            document.getElementById('t' + engName).src = "icons/filter2_dot.png";
            if (document.getElementById('gt' + engName) != null)
                 document.getElementById('gt' + engName).src = "icons/filter2_dot.png";
        }
        else
        {
            document.getElementById('t' + engName).src = "icons/filter_transparant.png";
            if (document.getElementById('gt' + engName) != null)
                document.getElementById('gt' + engName).src = "icons/filter_transparant.png";
        }
        

        document.getElementById(group + 't' + after + engName).style.visibility = 'visible';
    }
    
   //

    
}
function hideLayerPossibilities(after, obj,group) // changed
{
    if (obj.innerText == "סמן הכל")
        return;
    var engName = obj.id.substring(6, obj.id.length);

    document.getElementById(group + 'i' + after + engName).style.visibility = 'hidden';
    document.getElementById(group + 'd' + after + engName).style.visibility = 'hidden';
    document.getElementById(group + 'f' + after + engName).style.visibility = 'hidden';
    document.getElementById(group + 't' + after + engName).style.visibility = 'hidden';
}
function concatenateInfoString(lname) {

    document.getElementById("layerinfoSource").innerHTML = layerInfo[lname][0];
    if ((layerInfo[lname][1] != undefined) && (layerInfo[lname][1].length > 0)) 
        document.getElementById("layerinfoValid").innerHTML = layerInfo[lname][1];
    else
        document.getElementById("layerinfoValid").innerHTML = "";
        
    if ((layerInfo[lname][2] != undefined) && (layerInfo[lname][2].length > 0))
        document.getElementById("layerinfoDesc").innerHTML = layerInfo[lname][2];
    else
        document.getElementById("layerinfoDesc").innerHTML = "";
        
    

}
function openAddressDiv()
{
    $('#multiresultsdiv').show();    
}

function findAddressMobile() {
    
    var thep = document.getElementById("additionalResultsMobile");
    thep.style.display = 'none';
    //document.getElementById("closeAdditionalResultsMobile").style.display = 'none';
    thep.innerHTML = "";
    var resultsTable, tableBody, tr, td, i;
    addr_list = [];
    tb = document.createElement('table');
    tb.id = 'findAddressTableMobile';
    tb.style.width = '100%';
    govmap.geocode({ keyword: document.getElementById("searchedAddressMobile").value }, govmap.geocodeType.FullResult)
        .then(function (response)
        {
 
            results = response.data;
            if (results == null) {
                thep.style.display = 'block';
                thep.style.textAlign = 'right';
                thep.style.fontSize = '15pt';
                thep.color = 'red';
                thep.innerHTML = "כתובת לא נמצאה";
                
                clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
            }
            else if (results.length == 1) {

                govmap.zoomToXY({ x: results[0].X, y: results[0].Y, level: 10, marker: true });
            }
            else if (results.length > 1)
            {
                thep.style.display = 'block';
                thep.style.textAlign = 'right';

               
                
                for (i = 0; i < results.length; i++)
                {
                    var tr = document.createElement('tr');
                    tr.style.border = '1px solid grey';
                    tr.style.cursor = 'pointer';
                    tr.style.cursor = 'pointer';
                    var td = document.createElement('td');
                    
                    var text = document.createTextNode(results[i].ResultLable)
                    var xy = results[i].X + "$" + results[i].Y;
                    tr.id = xy;
                    tr.onclick = function ()
                    {
                        var x = this.id.split("$")[0];
                        var y = this.id.split("$")[1];
                        govmap.zoomToXY({ x: x, y: y, level: 10, marker: true });
                        $("#additionalResultsMobile tr").remove(); 
                    }
                    td.appendChild(text);
                    tr.appendChild(td);
                    tb.appendChild(tr);
                    thep.appendChild(tb);
                    
                }
            }
        })
}
function findAddress(heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    
    var thep = document.getElementById("additionalresults");
    thep.style.display = 'none';
    document.getElementById("closeAditionalResults").style.display = 'none';
    thep.innerHTML = "";
    var resultsTable , tableBody, tr, td,i;
    addr_list = [];
    govmap.geocode({ keyword: document.getElementById("searchedAddress").value }, govmap.geocodeType.FullResult)
        .then(function (response) {
           // console.log("then:");
           // console.log(response);
            results = response.data;
            if (results == null) {
                thep.style.display = 'block';
                thep.style.textAlign = 'right';
                thep.style.fontSize = '15pt';
                thep.color = 'red';    
                thep.innerHTML = "כתובת לא נמצאה";
                document.getElementById("closeAditionalResults").style.display = 'block';
                clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                return;
            }
            if (results.length == 1)
            {
                document.getElementById("searchAll").style.display = 'none';
                govmap.zoomToXY({ x: response.data[0].X, y: response.data[0].Y, level: 10, marker: true });
                return;
            }
            if (results.length > 1) {


                document.getElementById("searchAll").style.display = 'none';
                thep.style.display = 'block';
                document.getElementById("closeAditionalResults").style.display = 'block';
                //openAddressDiv();
               // thep.style.paddingTop = "80px";
                resultsTable = document.createElement('TABLE');
                resultsTable.id = "findAddressTable";
                resultsTable.style.width = "100%";
                resultsTable.style.direction = "ltr";
                resultsTable.style.textAlign = 'right';
                tableBody = document.createElement('TBODY');
                resultsTable.appendChild(tableBody);
                tr = document.createElement('TR');
                td = document.createElement('TD');
                td.appendChild(document.createTextNode(" :האם התכוונת ל "));
                td.style.fontFamily = 'Alef-Regular';

                tr.appendChild(td);

                /////
                //var closeButtonRes = document.createElement('button');
                
                //closeButtonRes.style.top ='10px';
                //closeButtonRes.style.left='10px';
                //closeButtonRes.style.position = 'absolute';
                //closeButtonRes.innerHTML = 'x';
                //td = document.createElement('TD');
                //td.appendChild(closeButtonRes);
                

                tableBody.appendChild(tr);

                for (let i = 0; i < results.length; i++)
                {
                    // closure
                    (function (i) {

                    tr = document.createElement('TR');
                    td = document.createElement('TD');
                    var r = results[i].ResultLable;
                    var btn = document.createElement("BUTTON");
                    btn.type = 'button';
                    btn.className = "btn btn-link";
                    btn.innerHTML = r;
                    btn.style.fontFamily = 'Alef-Regular';  
                    btn.value = r;

                    addr_list[i]=[results[i].X, results[i].Y];

                    btn.onclick = function (evt)
                    {
                        hideForm('additionalresults');  
                        document.getElementById("closeAditionalResults").style.display = 'none';
                        govmap.zoomToXY({ x: addr_list[i][0], y: addr_list[i][1], level: 10, marker: true });
                    };

                    td.appendChild(btn);
                    tr.appendChild(td);
                    tableBody.appendChild(tr);
                    })(i);
                }

                thep.appendChild(resultsTable);
            }

        })
        .done(function (response) {
            console.log("done:");
            console.log(response);
        })
        .always(function (response) {
            console.log("always:");
            console.log(response);
        })
        .fail(function (response) {
            console.log("fail:");
            console.log(response);
        });
}
function closeSearchAddress()
{
    
   // govmap.clearSelection();
    var obj = document.getElementById("searchedAddress");
    obj.value = "";
    var label = document.getElementById("additionalresults");
    
    document.getElementById("closeAditionalResults").style.display = 'none';

    label.innerHTML = "";
    label.style.paddingTop = "10px";
}
function showErrorMsg(msg) {
    var err = document.getElementById("errorModalmsg");
    err.innerHTML = msg;
    $('#errorModal').modal('show');
}
function findXY(x,y)
{
    document.getElementById("searchXYFooterText").innerHTML = '';
    //var x = document.getElementById("x").value;
    //var y = document.getElementById("y").value;
    if (x ==null || x==undefined)
        x = document.getElementById("x").value;
    if(y==null || y==undefined)
       y = document.getElementById("y").value;
    var coord = (document.getElementById("itm").checked) ? "רשת ישראל חדשה" : "רשת עולמית";
    if (coord == "רשת ישראל חדשה")
    {
        if (x.length < 6 || y.length < 6 || isNaN(x)|| isNaN(y))
        {
            document.getElementById("searchXYFooterText").innerHTML = 'הערכים שהוזנו לא תקינים';
            //showErrorMsg("הערכים שהוזנו לא תקינים");
            return;
        }
    }
    if (coord == "רשת עולמית")
    {
        if (x.length < 2 || y.length < 2) {
            document.getElementById("searchXYFooterText").innerHTML = 'הערכים שהוזנו לא תקינים';
            //showErrorMsg("הערכים שהוזנו לא תקינים");
            return;
        }
    }
    if (coord == "רשת עולמית")
    {
        var val = WgsToIsrael(y, x); 

        //result = JSITM.gpsRef2itmRef(y + " " + x);
        x= val[0];
        y = val[1];
    }
    
    govmap.zoomToXY({ x: x, y: y, level: 6, marker: true });

    // close search all form so you can see the result
    if(!isMobile)
        $("#searchAll").toggle();
}
function closeSearchedXY()
{
    
   // govmap.clearSelection();
    document.getElementById("searchedX").value = "";
    document.getElementById("searchedY").value = "";
  
}
function retreiveCoordinate()
{
    
    govmap.clearSelection();
    document.getElementById("retreivedX").value = "";
    document.getElementById("retreivedY").value = "";
    govmap.unbindEvent(govmap.events.CLICK);

    
    govmap.draw(govmap.drawType.Point).progress(function (response) {
        var pt = response.wkt;
        var leftBracketpos = pt.indexOf("("); 
        var righttBracketpos = pt.indexOf(")"); 

        var point = pt.substring(leftBracketpos +1, righttBracketpos -1);
        var x = point.split(" ")[0];
        var y = point.split(" ")[1];
        document.getElementById("retreivedX").value = x;
        document.getElementById("retreivedY").value = y;
        govmap.zoomToXY({ x: x, y: y, level: 10, marker: true });
        $('#retreiveXY').modal('show');
    });
   
    
}

function openSearchLayer()
{
    searchLayerCounter = 0;
    ResetQuery();
    maximizeModal("searchLayer");
  
}
function openSpatialSearch()
{
    $('#searchLayerSpatial').modal('show');
}

function openProjectsSearch() {
    
    maximizeModal('projects');
}
function hideShareModal(name)
{
    //document.getElementById('shareModal').style.display = 'none';
    document.getElementById(name).style.display = 'none';
}
function openShareModal(name,identifylayers, objExtent, heatmapLayer, heatmapField, selectedIDInDatatable, slectedLayerInDatatable,bg)
{
    createShareLink(identifylayers, objExtent, heatmapLayer, heatmapField, selectedIDInDatatable, slectedLayerInDatatable,bg);
    //document.getElementById('shareModal').style.display = 'block';
    document.getElementById(name).style.display = 'block';
    
}

function setLayerOpacity(lname , percent)
{
    var params = {
        'layerName': lname,
        'opacity': percent

    };
    govmap.setLayerOpacity(params);
}
function showLabels(lname,bool)
{
    var params = {
        'layerName': lname,
        'showLabels': bool

    };

    govmap.showLabels(params);
}

function testIntersect() {
    
    var field = fieldFilterSqlArray[0].sql;// filter[j].field;

    if (field.indexOf(' OR ') > -1)
    {
        orValues = field.split(' OR ');
        for (m = 0; m < orValues.length; m++)
        {
            value = orValues[m].split("=")[1];

        }
    }

    var value = filter[j].sql.split("=")[1];
    // if filter value is string remove quotations 
    if (isNaN(value))
        value = value.slice(1, -1);
    if (feature.properties[field] != value) {
        res = false;

    }
    //var sql = "COMP_NAME IN ('נתיבי ישראל' ,'חוצה ישראל') AND PRJ_TYP='כבישים'";
   // var sql = "COMP_NAME='נתיבי ישראל' OR COMP_NAME='חוצה ישראל'";
    //var sql = "(COMP_NAME='נתיבי ישראל' OR COMP_NAME='חוצה ישראל') AND PRJ_TYP = 'כבישים'";

    //govmap.filterLayers({ 'layerName': 'WPLAN2019Q2', 'whereClause': sql, 'zoomToExtent': true })
    //    .then(function (e) {
    //        var obj = e;
    //    }, function (err) {
    //        var AccordionDiv = document.getElementById("filterErrorResult");
    //        AccordionDiv.innerHTML = 'השאילתא נכשלה';
    //        clearMapDrawing();
    //    });

    //govmap.intersectFeatures({ 'geometry': israelExtentPolygonGeo, 'layerName': 'WPLAN2019Q2', 'fields': ["OBJECTID"], getShapes: false, 'whereClause': sql })
    //    .then(function (e) {
    //        if (e.data != null && e.data.length > 0) {
    //        }
    //    });
    //govmap.draw(govmap.drawType.Point).progress(function (e) {
    //    govmap.intersectFeaturesLongGeom({ geometry: e.wkt, layerName: 'SUB_GUSH_ALL', fields: ['OBJECTID'], getShapes: true})
    //    //govmap.intersectFeatures({ geometry: e.wkt, layerName: 'SUB_GUSH_ALL', fields: ['OBJECTID'], getShapes: true })
    //        .then(function (ee)
    //        {
    //             var geo = ee.data[0].Values[0];
    //            govmap.intersectFeaturesLongGeom({ geometry: geo, layerName: 'PARCEL_ALL', fields: ['OBJECTID'], getShapes: true })
    //            //var geo = ee.data[0].Values[2];
    //            //govmap.intersectFeatures({ geometry: geo, layerName: 'PARCEL_ALL', fields: ['OBJECTID'], getShapes: true })
    //                .then(function (eee) {
    //                    var objectids = [];

                       

    //                    for (i = 0; i < eee.data.length; i++)
    //                        objectids.push(eee.data[i].ObjectId);

    //                    govmap.searchInLayer({ 'layerName': 'PARCEL_ALL', 'fieldName': 'OBJECTID', 'fieldValues': objectids, 'highlight': true, 'outLineColor': "rgb(0,255,255)" });

    //                });
    //        });

    //    //DoTheIntersectNew(e.wkt, identifylayers, identifyResultLayers, 'Point');
    //});
    //govmap.draw()
    //var israelExtentPolygonGeo = "POLYGON((129897.85 818015.41, 287854.42 818015.41, 287854.42 376689.53, 129897.85 376689.53, 129897.85 818015.41))";

} 

function createShareLink(identifylayers, objExtent, heatmapLayer,heatmapField,iObjID,iLayer,bg)
{

    var url = window.location.href;
    var heatLayer; var heatField; 
    var qMarkLocation = url.lastIndexOf('?');
    if (qMarkLocation > -1)
        url =url.substring(0,qMarkLocation)
    
    var tmpScale = document.getElementById("scale_p").innerHTML.split(":")[1];
    tmpScale = tmpScale.split(' ').join('');
    var z = getLevelFromScale(parseInt(tmpScale));
    
    var layers = "";
    for (i = 0; i < identifylayers.length; i++) {
        var lyrName = identifylayers[i];
        layers += lyrName+ ",";
    }
    layers = layers.substring(0, layers.length - 1);
    
    var x = Math.abs(((Math.abs( objExtent.xmax) - Math.abs(objExtent.xmin)) / 2)) +  parseFloat(objExtent.xmin) ;
    var y = Math.abs(((Math.abs( objExtent.ymax) - Math.abs( objExtent.ymin)) / 2)) + parseFloat(objExtent.ymin) ;
    if (heatmapLayer.value.length > 0)
    {
        //heatdata = heatmapObject[0].split("$$");
        heatLayer = heatmapLayer.value;
        heatField = heatmapField.value;
        url += "?z=" + z + "&layers=" + layers + "&x=" + x + "&y=" + y + "&heatLayer=" + heatLayer + "&heatField=" + heatField;
    }
    else
        url += "?z=" + z + "&layers=" + layers + "&x=" + x + "&y=" + y ;
    if (iObjID.value.length > 0 && iLayer.value.length > 0)
        url += "&iObjID=" + iObjID.value + "&iLayer=" + iLayer.value;
    
    var imgsrc = document.getElementById("bgimg").src;
    var imgNum = imgsrc.substring(imgsrc.length - 5, imgsrc.length - 4);
    var currentBgNum = parseInt(imgNum) - 1;
    if (currentBgNum == -1)
        currentBgNum = 2;
    if (currentBgNum == 0)
        bg.value = 0;
    else if (currentBgNum == 2)
        bg.value = 2
    

    url += "&bgval=" + bg.value;
    
    document.getElementById("txtUrl").value = url;
    document.getElementById("txtUrlMobile").value = url;
}
function copyToClipboard(name)
{
    var copyText = document.getElementById("txtUrl");
    copyText.select();
    navigator.clipboard.writeText(copyText.value);
    //document.execCommand("copy",false,"");
    hideShareModal(name);
}
function shareWithWhatsApp(name)
{
    //<a href="whatsapp://send?text=urlencodedtext">Share this</a>
    var copyText = document.getElementById("api.whatsapp.com");
    copyText.select();
   // navigator.clipboard.writeText(copyText.value);
    //document.execCommand("copy",false,"");
    var a = document.createElement("a");
    //a.href = "api.whatsapp.com / send/?text=" + copyText.value;
    //api.whatsapp.com / send ? text = YourShareTextHere
    a.href = "https://api.whatsapp.com/send?text=" + copyText.value;
    a.click();

    hideShareModal(name);
}
function getToken()
{
    var crntUrl = window.location.href;
    if (crntUrl.indexOf("localhost") > -1)
        return LH_token;
    else if (crntUrl.indexOf("t.geo.mot.gov.il")>-1)
        return T_GEO_MOT_token;
    else
        return GEO_MOT_token;
    
}
function getServer()
{
    var crntUrl = window.location.href;
    if (crntUrl.indexOf("localhost") > -1)
        return "http://localhost:";
    else if (crntUrl.indexOf("t.geo.mot.gov.il"))
        return "https://t.geo.mot.gov.il/geomottest:";
    else
        return "https://geo.mot.gov.il/geomottest:";
}
function getPort()
{
    var crntUrl = window.location.href;
    if (crntUrl.indexOf("localhost") > -1)
        return "3000";
    else
        return "443";
}
function parseUrl(identifyLayers, heatmapLayer, heatmapField, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, bg, panorama) {
  //var crntUrl = 'http://localhost:51332/Default.html?z=0&layers=&x=-182948&y=595397&bgval=2&naked=1 ';
  // var crntUrl = 'http://localhost:51332/Default.html?z=10&layers=SCHOOL&x=183891&y=664042&iObjID=3852&iLayer=SCHOOL';

  //var crntUrl = "http://localhost:52180/Default.html?z=3&layers=SFIROT&x=192440.60834209167&y=646605.8903076698&flayer=SFIROT&ffield=CUSTOMER&fval='חוצה ישראל'";//
  //var crntUrl = "http://localhost:49285/Default.html?z=6&layers=WPLAN2019Q2,LRT_LINE,LRT_STAT&x=179307.71103208882&y=660718.4991613285";
  // var crntUrl =   'http://localhost:51332/Default.html?z=2&layers=WORKPLAN&x=221462.53492506972&y=717370.0364067394';
  //  var crntUrl = "http://localhost:51332/Default.html?z=8&layers=WORKPLAN&x=222790.36845&y=638862.1200000006&iObjID=455&iLayer=WORKPLAN&disclaimer=hide";
    //var crntUrl = "http://localhost:51332/Default.html?z=8&layers=WORKPLAN&x=222790.36845&y=638862.1200000006&iObjID=455&iLayer=WORKPLAN";
 //   var crntUrl = "https://geo.mot.gov.il/?z=10&layers=KISHURIYUT_PRJ&x=176380.03851645545&y=657227.8650540151&bgval=0";

    // test();
    
    
    var crntUrl = window.location.href;
    if (crntUrl.indexOf("?") == -1)
    {
        checkDisclaimerStatus();
        //if (isMobile == false)
        //    //if ((window.orientation == undefined) && (navigator.userAgent.indexOf('IEMobile') == -1))
        //    $('#Disclaimer').modal('show');
        //else
        //{
        //   // $('#mobileModal').modal('show'); // we have mobile screen show mobile message
        //    $('#DisclaimerMobile').css({ 'display': 'block' }); 
        //}
        return;
    }
    
    var vars = crntUrl.split("?")[1].split("&");
    var z, lay, x, y, filterLayer, filterfield, filterval, heatLyr, heatFld, iObjID, iLayer,naked;
    for (var i = 0; i < vars.length; i++)
    {
        if (vars[i].indexOf("naked=") > -1)
           naked = vars[i].split("=")[1];
        if (vars[i].indexOf("z=") > -1)
            z = vars[i].split("=")[1];
        if (vars[i].indexOf("layers=") > -1)
            lay = vars[i].split("=")[1];
        if (vars[i].indexOf("x=") > -1)
            x = vars[i].split("=")[1];
        if (vars[i].indexOf("y=") > -1)
            y = vars[i].split("=")[1];
        if (vars[i].indexOf("flayer=") > -1)
            filterLayer = vars[i].split("=")[1];
        if (vars[i].indexOf("ffield=") > -1)
            filterfield = vars[i].split("=")[1];
        if (vars[i].indexOf("fval=") > -1)
            filterval = decodeURI(vars[i].split("=")[1]);
        if (vars[i].indexOf("heatLayer=") > -1)
            heatLyr = vars[i].split("=")[1];
        if (vars[i].indexOf("heatField=") > -1)
            heatFld = vars[i].split("=")[1];
        if (vars[i].indexOf("iObjID") > -1)
            iObjID = vars[i].split("=")[1];
        if (vars[i].indexOf("iLayer") > -1)
            iLayer = vars[i].split("=")[1];
        if (vars[i].indexOf("bgval") > -1)
            bg.value = vars[i].split("=")[1];
        if (vars[i].indexOf("disclaimer") > -1)
            disclaimerParam.value = vars[i].split("=")[1];
            
    }
    //

    // in case that hide disclaimer (parameter == hide) dont show modal
    //if (disclaimerParam.value.toLowerCase() == 'hide') {
    //    $('#Disclaimer').modal('hide');
    //}
    //else
    //{
    //    if ((window.orientation == undefined) && (navigator.userAgent.indexOf('IEMobile') == -1))
    //        $('#Disclaimer').modal('show');
    // //  else
    //     //   $('#mobileModal').modal('show'); // we have mobile screen show mobile message
    //}

    
    
    // build heatmap first since it has a zoom to layer in it so it wiil affect x,y zoom
    if (heatLyr != undefined)
    {
        heatmapLayer.value = heatLyr;
        heatmapField = heatFld;
        buildHeatMap(identifyLayers, heatmapLayer, heatmapField, heatLyr, heatFld);
    }
    

    (z != undefined && z.length > 0 && parseInt(z) > 0) ? z = z : z = 0;
    (x != undefined && x.length > 0 && parseFloat(x) > 0) ? x = x : x = 183429;
    (y != undefined && y.length > 0 && parseFloat(y) > 0) ? y = y : y = 657362;

    govmap.zoomToXY({ x: parseFloat(x), y: parseFloat(y), level: parseInt(z), marker: false });

    if (lay != undefined && lay.length > 0)
    {
        //dict_items = Object.values(layerEngHeb);
        

        // first_two = list(dict_items)[: 2]

        var layers = lay.split(",");
        for (lyr = 0; lyr < layers.length; lyr++)
        {
           // var lhebname = dict_items[layers[lyr] - 1][0];
           //var lengname = layerHebEng[lhebname];
           // turnlayerOnOff('chk' + lengname, true, identifyLayers);
            var lnm = "chk" + layers[lyr];
            
                 
           // $('#' + lnm).trigger('click');
           // document.getElementById(lnm).checked = true;
            turnlayerOnOff(lnm, true, identifyLayers);
        }
            // turnOneLyrOn(layers[lyr], identifyLayers, 'down');
            
    }
    if (filterLayer != undefined && filterfield != undefined && filterval!=undefined)
    {
        var filterSQl = filterfield + '=' + filterval;
        govmap.filterLayers({ 'layerName': filterLayer, 'whereClause': filterSQl, 'zoomToExtent': true })
            .then(function (e) {
               
            });

        turnlayerOnOff('chk' + filterLayer, true, identifyLayers);
        // enable cancel 
        var apostroph = "";
        if (isFieldString[filterfield])
            apostroph = "'";
        fieldFilterSqlArray.push({ lyr: filterLayer, field: filterfield, sql: filterLayer + "=" + apostroph + filterval+apostroph });
        //buildTocNew(identifylayers, fieldFilterSqlArray);
        //obj = document.getElementById("cancel$" + filterLayer + "$" + filterfield);
        //cancel$SFIROT$CUSTOMER
        //obj.style.display = 'block';
    }
    if (iObjID != null && iLayer != null)
    {
        selectedIDInDatatable.value = iObjID;
        slectedLayerInDatatable.value = iLayer;
        turnlayerOnOff("chk" + iLayer, true, identifyLayers);
        var objID = [];
        objID.push(iObjID);
        govmap.searchInLayer({ 'layerName': iLayer, 'fieldName': 'ObjectId', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });

        DoTheIntersect(iObjID, iLayer, identifyLayers, arrowDirection, currentSortedColumn,panorama);
        
    }

   
   // alert("bg.value:" + bg.value);
    if (bg.value != null && parseInt(bg.value) > -1)
        //alert( "bg.value:" + bg.value);
        switch (bg.value) {
            case "20":// 2005
                openBackgroundSlider();
                govmap.setBackground(20)
                document.getElementById("lblbg2005").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 0);// move slider handle to the according position
                document.getElementById("bgimg").src = "icons/bg2.png";// change image on slider option button
                break;
            case "21"://2007
                openBackgroundSlider();
                govmap.setBackground(21)
                document.getElementById("lblbg2007").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 1);
                document.getElementById("bgimg").src = "icons/bg2.png";
                
                break;
            case "19"://2010
                openBackgroundSlider();
                govmap.setBackground(19)
                document.getElementById("lblbg2010").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 2);
                document.getElementById("bgimg").src = "icons/bg2.png";
                break;
            case "23"://2018
                openBackgroundSlider();
                govmap.setBackground(23)
                document.getElementById("lblbg2018").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 3);
                document.getElementById("bgimg").src = "icons/bg2.png";
                
                break;
            case "24": // 2019
                openBackgroundSlider();
                govmap.setBackground(24)
                document.getElementById("lblbg2019").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 4);
                document.getElementById("bgimg").src = "icons/bg2.png";
                break;
            case "26": // 2020
                openBackgroundSlider();
                govmap.setBackground(26)
                document.getElementById("lblbg2020").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 5);
                document.getElementById("bgimg").src = "icons/bg2.png";
                break;
            case "32": // 2021
                openBackgroundSlider();
                govmap.setBackground(32)
                document.getElementById("lblbg2021").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 6);
                document.getElementById("bgimg").src = "icons/bg2.png";
                break;
            case "27": // 2022
                openBackgroundSlider();
                govmap.setBackground(27)
                document.getElementById("lblbg2022").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value", 6);
                document.getElementById("bgimg").src = "icons/bg2.png";
                break;
            

            case "1": // 2023
                openBackgroundSlider();
                govmap.setBackground(1)
                document.getElementById("lblbg2023").style.color = "rgb(19, 36, 64)";
                $("#bgSliderdiv").slider("value",7);
                document.getElementById("bgimg").src = "icons/bg2.png";
                break
            case "0"://1streets
                govmap.setBackground(0);
                document.getElementById("bgimg").src = "icons/bg1.png";
                bg.value = 1;
                break;
            case "2": //meshulav
                document.getElementById("bgimg").src = "icons/bg0.png";
                govmap.setBackground(2);
                bg.value = 1;
     
        }
         
    if (naked != undefined && parseInt(naked) == 1)
        removeAllToolbars();
}

function closeSearchLayer()
{
    searchLayerCounter = 0;
}
function loadFieldsCombo(lname) {

    
    var layerslist = lname;
    var counter = "";
    if (searchLayerCounter != undefined && searchLayerCounter > 0)
        counter = searchLayerCounter;
    var selectName = 'searchFieldSelect' ;
    if (layerslist != "בחר שכבה")
    {
        var fieldsList = document.getElementById(selectName + counter);
        fieldsList.innerHTML = "";
    
        var lnameEng = layerHebEng[layerslist];
                
        var opt1 = document.createElement('option');
        opt1.value = "בחר שדה";
        opt1.innerHTML = "בחר שדה";
        fieldsList.appendChild(opt1);
        var opt2 = document.createElement('option');
        opt2.value = "בחר שדה";
        opt2.innerHTML = "בחר שדה";
      
        for (i = 0; i < identifyFields[lnameEng].length; i++)
        {
            var fldEng = identifyFields[lnameEng][i]; 
            var fldHeb = identifyFieldsEngHeb[lnameEng +'_'+ fldEng];
            var opt3 = document.createElement('option');
            opt3.value = fldEng;
            opt3.innerHTML = fldHeb;
            fieldsList.appendChild(opt3);
            var opt4 = document.createElement('option');
            opt4.value = fldEng;
            opt4.innerHTML = fldHeb;
    
        }
        
    }
}
function clearToolbarAndButtons()
{

}
function zoomToFullExtent()
{
    
    var params =
    {
        xmin: -405601,
        ymin: 311631,
        xmax: 811220,
        ymax: 879163
    };
    govmap.zoomToExtent(params);
    
    
}

//function searchInLayer(identifylayers, selectedLayer, searchLayerCounter, filteredLayers, israelExtentPolygonGeo) {
    

//    clearresultspane();
//    var AccordionDiv = document.getElementById("identifyAccordionNew");
//    AccordionDiv.innerHTML ="";

//    if (validateSearchLayer(selectedLayer) == false) return;
//    var field, func, val, counter, cond;
//    var textboxSQL = "";
//    var lname = selectedLayer;

//    for (i = 0; i <= searchLayerCounter; i++) {
//        if (i == 0) {
//            counter = "";
//        }
//        else {
//            counter = i;
//        }

//        field = document.getElementById("searchFieldSelect" + counter).value;
//        textboxSQL += field;
//        func = document.getElementById("searchFunctionSelect" + counter).value;


//        textboxSQL += " " + func + " ";

//        val = document.getElementById("txtSearchLayerValue" + counter).value;
//        if (isFieldString[field]) {
//            if (func == "LIKE") {
//                textboxSQL += "'%" + val + "%'";
//            }
//            else {
//                textboxSQL += "'" + val + "'";
//            }

//        }
//        else {
//            textboxSQL += val;
//        }

//        if (searchLayerCounter > 0) {
//            cond = document.getElementById("searchAnotherCondition" + counter).value;
//            if (cond != "בחר פעולה נוספת") {
//                textboxSQL += cond;
//            }
//        }
//    }

//    var bZoom = true;
    
//    var lnameEng = layerHebEng[lname];


   
//    turnlayerOnOff('chk' + lnameEng, true, identifylayers);
//    var idnFields = identifyFields[lnameEng];

//    var fieldValues = [];
    
//    document.body.style.cursor = 'wait';

//    if ((lname == 'חלקות') && (textboxSQL.indexOf('GUSH_NUM =') > -1) && (textboxSQL.indexOf('PARCEL = ') > -1))
//    {
//        var gush, parcel;
//        var parseSQL = textboxSQL.split('AND');
//            if (parseSQL[0].indexOf('GUSH_NUM') > -1)
//            {
//                gush = parseSQL[0].split('=')[1];
//                parcel = parseSQL[1].split('=')[1];
//            }
//            else
//            {
//                gush = parseSQL[1].split('=')[1];
//                parcel = parseSQL[0].split('=')[1];
//            }
//            govmap.geocode({ keyword: gush + ' ' + parcel }, govmap.geocodeType.FullResult)
//                .then(function (response)
//                {
//                    if (response.data != null && response.data.length > 0)
//                    {
//                        var x = response.data[0].X;
//                        var y = response.data[0].Y;
//                        var pointgeo = "POINT (" + x + " " + y + ")";
//                        res = govmap.intersectFeatures({ 'geometry': pointgeo, 'layerName': lnameEng, 'fields': idnFields, getShapes: true })
//                            .then(function (e) {
//                                if (e.data != null && e.data.length > 0) {
//                                    document.body.style.cursor = 'default';
//                                    for (j = 0; j < e.data.length; j++) {
//                                        fieldValues.push({ layer: lnameEng, fieldName: identifyFields[lnameEng], ObjectId: e.data[j].ObjectId, layeritems: e.data[j].Values });
//                                    }
//                                    var identifyModalBody = document.getElementById("identifyAccordionNew");
//                                    identifyModalBody.innerHTML = "";

//                                    DisplayIdentifyresults(fieldValues, lnameEng, identifylayers);
//                                }
//                                else {
//                                    clearresultspane();
//                                    var AccordionDiv = document.getElementById("identifyAccordionNew");
//                                    AccordionDiv.innerHTML = "לא נמצאו ערכים";
    
//                                    maximizeModal('identifyModalNew');
//                                    clearMapDrawing();
//                                }
//                            });
//                    }
                    
//                }, function (err)
//                    {
//                        clearresultspane();
//                        var AccordionDiv = document.getElementById("identifyAccordionNew");
//                        AccordionDiv.innerHTML = "לא נמצאו ערכים";
//                        maximizeModal('identifyModalNew');

//                        clearMapDrawing();
//                    }
//                );
//    }
//    else
//    {
//        var result = govmap.filterLayers({ 'layerName': lnameEng, 'whereClause': textboxSQL, 'zoomToExtent': true, 'outLineColor': "red" });
//        filteredLayers.push(layerHebEng[lname]);
        
//        res = govmap.intersectFeatures({ 'geometry': israelExtentPolygonGeo, 'layerName': lnameEng, 'fields': idnFields, getShapes: true, 'whereClause': textboxSQL })
//            .then(function (e)
//            {
//                document.body.style.cursor = 'default';
//                if (e.data != null && e.data.length > 0) {


//                    for (j = 0; j < e.data.length; j++) {
//                        fieldValues.push({ layer: lnameEng, fieldName: identifyFields[lnameEng], ObjectId: e.data[j].ObjectId, layeritems: e.data[j].Values });
//                    }
//                    var identifyModalBody = document.getElementById("identifyAccordionNew");
//                    identifyModalBody.innerHTML = "";

//                    DisplayIdentifyresults(fieldValues, lnameEng, identifylayers);

//                }
//                else {
//                    clearresultspane();
//                    var AccordionDiv = document.getElementById("identifyAccordionNew");
//                    AccordionDiv.innerHTML = e.message;

//                    maximizeModal('identifyModalNew');
//                    clearMapDrawing();

//                }
//            }, function (err)
//                {
//                    document.body.style.cursor = 'default';
//                    clearresultspane();
//                    var AccordionDiv = document.getElementById("identifyAccordionNew");
//                    AccordionDiv.innerHTML = "תשאול השכבה נכשל";
//                    maximizeModal('identifyModalNew');

//                    clearMapDrawing();
//                }
//            );
            
                
        
//    }
    
//}

function searchInLayerParcell_All(sql)
{
    //if (sql.indexOf("GUSH_NUM") < 0)
    //{
    //    $("#searchLayerFooterText").text("יש לבחור גוש");
    //    return;
    //}

    //if (sql.indexOf("PARCEL") < 0) {
    //    $("#searchLayerFooterText").text("יש לבחור חלקה");
    //    return;
    //}


    //if (sql.indexOf("OR") > -1) {
    //    $("#searchLayerFooterText").text("לא ניתן לתשאל את שכבת חלקות עם OR");
    //    return;
    //}
    //var items = sql.split("AND");
    var gush = 455;//, helka;
    var lname = 'WORKPLAN';
    //if(items[0].indexOf("GUSH_NUM")>-1)
    // {
    //    gush = items[0].split("=")[1];
    //    helka = items[1].split("=")[1];
    //}
    //else
    //{
    //    gush = 5;
    //    helka = 6;
    //}

    //govmap.intersectFeatures({ 'geometry': israelExtentPolygonGeo, 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': 'GUSH_NUM=' + gush })
    //govmap.intersectFeaturesByWhereClause({ 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': 'GUSH_NUM=' + gush })
    govmap.intersectFeaturesByWhereClause({ 'layerName': lname, 'fields': identifyFields[lname], getShapes: false, 'whereClause': 'OBJECTID=' + gush })
          .then(function (e)
              {
                  if (e.data != null && e.data.length > 0)
                  {
                      var objID = [];
                      objID.push(e.data[0].ObjectId);
                      var geo = e.data[0].Values[2];
                      
                      govmap.intersectFeatures({ 'geometry': geo, 'layerName': 'PARCEL_ALL', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': sql })
                          .then(function (e) {
                              if (e.data != null && e.data.length > 0) {
                                  var objID = [];
                                  objID.push(e.data[0].ObjectId);
                                  govmap.searchInLayer({ 'layerName': 'PARCEL_ALL', 'fieldName': 'OBJECTID', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                              }
                          });
                  }
              });

}

function validateSearchLayer(selectedLayer)
{
    
    var counter = "";
    if (searchLayerCounter != undefined && searchLayerCounter > 0)
        counter = searchLayerCounter;
    $("#searchLayerFooterText").text("");

    var lname = selectedLayer;
    if (lname == undefined || lname =="") {
        $("#searchLayerFooterText").text("יש לבחור שכבה");
        return false;
    }

    var name = 'searchFieldSelect' + counter;
    var field = document.getElementById(name);
    
   
    if (field.options[field.selectedIndex].text == "בחר שדה") {
            $("#searchLayerFooterText").text("יש לבחור שדה");
            return false;
    }
   
    name = 'searchFunctionSelect' + counter;
   
    var func = document.getElementById(name);
    if (func.options[func.selectedIndex].text == "בחר פעולה") {
         $("#searchLayerFooterText").text("יש לבחור פעולה");
          return false;
    }
   

    name = 'txtSearchLayerValue' + counter;
    var val = document.getElementById(name).value;

    if (val.length == 0) {
        $("#searchLayerFooterText").text(" יש להזין ערך לחיפוש ");
        return false;
    }
    return true;
}

function clearAllCheckedLayersMobile(identifylayers) {

    ///
    //var lname = this.id.substring(3, this.id.length);
    //layersOff.push(lname);

    //var index = identifylayers.indexOf(lname);
    //if (index !== -1) {
    //    identifylayers.splice(index, 1);
    //}
    ///


    document.getElementById("numberCircleMobile").innerHTML = "";
    document.getElementById("numberCircleMobile").style.visibility = "hidden";
    var layersOff = identifylayers.slice();
    identifylayers.length =0;
    //for (i = 0; i < identifylayers.length; i++)
    //{
    //    identifylayers.splice(i, 1);
    //}
    govmap.setVisibleLayers(identifylayers, layersOff);
    $("#mobileListOfLayers tr").remove();
   
}
function clearAllCheckedLayers(identifylayers)
{
   
   // document.getElementById('layersByGroupTableHeader').innerHTML = "";
    document.getElementById('layersByGroupDiv').innerHTML = "";

    var layersOff = [];
    $('#layers input[type="checkbox"]').each(function () {

       if (this.checked == true)
        {
           if (this.id.substring(0, 3) == 'chk')
           {
               var lname = this.id.substring(3, this.id.length);
               layersOff.push(lname);

               var index = identifylayers.indexOf(lname);    
               if (index !== -1) {
                   identifylayers.splice(index, 1);
               }
           }
           
            this.checked = false;
        }
        
    });
    govmap.setVisibleLayers(identifylayers, layersOff);

    var btn,name;
    collapseAll("layers");


    // search all objects in layers  where id contain selectedNum
    $("#layers [id*=selectedNum]").each(function () {
        name = this.id;
        btn = document.getElementById(name);
        btn.innerHTML = "";//btn.title + "  " + glyph;
        btn.style.display = "none";
    })

    //for (i = 1; i <= 9; i++)
    //{
    //    name = "btncollapse" + i + "_selectedNum";
    //    btn = document.getElementById(name);
    //    //var glyphID = "TocGlyph" + i;
    //    //var glyph = "";//'<i class="fa fa-chevron-down" id=' + glyphID +  '></i> ';
    //    btn.innerHTML = "";//btn.title + "  " + glyph;
    //    btn.style.display = "none";
    //}
    //collapse1 = 0; collapse2 = 0; collapse3 = 0; collapse4 = 0; collapse5 = 0; collapse6 = 0; collapse7 = 0; collapse8 = 0; collapse9 = 0;
    document.getElementById('layersIMG').innerHTML = '<img style="height:18px" src="icons/shape_ORG.png" />' + " שכבות ";
    document.getElementById("numberCircle").innerHTML = "";
    document.getElementById("numberCircle").style.visibility = "hidden";
    document.getElementById("numberCircleMobile").innerHTML = "";
    document.getElementById("numberCircleMobile").style.visibility = "hidden";
}
function disableGroupIcons()
{
    document.getElementById('groupName').innerHTML = '';
        
    var mycarousel = document.getElementsByClassName('carousel');
    var prevBlue = -1;
    var current = '';

    for (i = 0; i < mycarousel[0].slick.$slides.length; i++) {
        for (j in GroupsEngHeb) {
            current = j;
            if (mycarousel[0].slick.$slides[i].innerHTML.indexOf(current + '_blue') > 0) {
                prevBlue = i;
                break;
            }
        }
        if (prevBlue > -1)
            break;

    }
    if ((prevBlue > -1) && (current.length > 0)) {
        //remove blue image of previous selection
        $('.carousel').slick('slickRemove', prevBlue);

        var newIMG = createImg(current, 'grey',);
        // add grey image 
        $('.carousel').slick('slickAdd', newIMG);


    }

}
function lockPrevSelections(counter)
{
    
    if (counter != null && counter > 0) {
        document.getElementById("searchFieldSelect" + counter).disabled = true;
        document.getElementById("searchFunctionSelect" + counter).disabled = true;
        document.getElementById("txtSearchLayerValue" + counter).disabled = true;
       

    }
    else
    {
        document.getElementById("searchFieldSelect").disabled = true;
        document.getElementById("searchFunctionSelect").disabled = true;
        document.getElementById("txtSearchLayerValue").disabled = true;
       
    }
    

   
}

function AddAnotherCondition()
{

    selectedlayer = $("#searchlayertypehead")[0].value;
    if (validateSearchLayer(selectedlayer) == false)
    {

        return;
    }
    
    
    if (searchLayerCounter != undefined && searchLayerCounter > 0) {
        id = "searchAnotherCondition" + searchLayerCounter;
    }
    else
    {
        id = "searchAnotherCondition";
    }

    lockPrevSelections(searchLayerCounter);

    searchLayerCounter += 1;    
    var val = document.getElementById(id).value;

    if (val == "בחר פעולה נוספת") 
    {
        return;
    }

    

    var table = document.getElementById("searchLayerModalTable");
    var tr = document.createElement("TR");
    var td = document.createElement("TD");
    td.appendChild(document.createTextNode("שדה:"));
    tr.appendChild(td);
    td = document.createElement("TD");
    var select = document.createElement("select");
    select.setAttribute("id", "searchFieldSelect" + searchLayerCounter);
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("בחר שדה"));
    select.appendChild(opt);
    td.appendChild(select);
    tr.appendChild(td);
    table.appendChild(tr);
    
    //
    tr = document.createElement("TR");
    td = document.createElement("TD");
    td.appendChild(document.createTextNode("פעולה:"));
    tr.appendChild(td);
    td = document.createElement("TD");
    select = document.createElement("select");
    select.setAttribute("id", "searchFunctionSelect" + searchLayerCounter);

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("שווה"));
    opt.value = "=";
    
    select.appendChild(opt);

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("בחר פעולה"));
    select.appendChild(opt);

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("גדול מ"));
    opt.value = ">";
    select.appendChild(opt);

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("קטן מ"));
    opt.value = "<";
    select.appendChild(opt);
    
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("דומה"));
    opt.value = "LIKE";
    select.appendChild(opt);

    td.appendChild(select);
    tr.appendChild(td);
    table.appendChild(tr);
    
    tr = document.createElement("TR");
    td = document.createElement("TD");
    td.appendChild(document.createTextNode("ערך:"));
    tr.appendChild(td);
    td = document.createElement("TD");

    var input = document.createElement('input');
    input.type = "text";
    input.id = "txtSearchLayerValue" + searchLayerCounter;
    td.appendChild(input);
    tr.appendChild(td);

    table.appendChild(tr);

    tr = document.createElement("TR");
    td = document.createElement("TD");
    td.appendChild(document.createTextNode("פעולה:"));
    tr.appendChild(td);
    td = document.createElement("TD");
    select = document.createElement("select");
    select.setAttribute("id", "searchAnotherCondition" + searchLayerCounter);
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("בחר פעולה נוספת"));
    select.appendChild(opt);
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("או"));
    opt.value = " OR ";
    select.appendChild(opt);
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("וגם"));
    opt.value = " AND ";
    select.appendChild(opt);
    select.onchange = function () {
        AddAnotherCondition(selectedlayer);
    };
    td.appendChild(select);
    tr.appendChild(td);
    table.appendChild(tr);

    loadFieldsCombo(selectedlayer);
    
    
}

function ResetQuery()

{

    searchLayerCounter = 0;
    selectedlayer = $("#searchlayertypehead")[0].value;
      
    var table = document.getElementById("searchLayerModalTable");
    $("#searchLayerModalTable tr").remove();
      
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.innerHTML = "שדה:";
    tr.appendChild(td);
    td = document.createElement("td");
    var select = document.createElement("select");
    select.setAttribute("id", "searchFieldSelect");
    var opt = document.createElement("option");
    opt.appendChild(document.createTextNode("בחר שדה"));
    select.appendChild(opt);
    td.appendChild(select);
    tr.appendChild(td);
      
    table.appendChild(tr);

    tr = document.createElement("tr");
    td = document.createElement("td");
    td.innerHTML = "פעולה:";
    tr.appendChild(td);
    td = document.createElement("td");

    select = document.createElement("select");
    select.setAttribute("id", "searchFunctionSelect");

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("שווה"));
    
    opt.value = "=";
    select.appendChild(opt);

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("בחר פעולה"));
    select.appendChild(opt);
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("גדול מ"));
    opt.value = ">";
    select.appendChild(opt);

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("קטן מ"));
    opt.value = "<";
    select.appendChild(opt);

    

    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("דומה"));
    opt.value = "LIKE";
    select.appendChild(opt);

    td.appendChild(select);
    tr.appendChild(td);
        
    table.appendChild(tr);

    tr = document.createElement("tr");
    td = document.createElement("td");
    td.innerHTML = "ערך";
    td.width = "20%";
    tr.appendChild(td);
    td = document.createElement("td");
    td.width = "80%";
    var input = document.createElement("input");
    input.type = "text";
    input.id = "txtSearchLayerValue";
    td.appendChild(input);
    tr.appendChild(td);
        
    table.appendChild(tr);

    tr = document.createElement("TR");
    td = document.createElement("TD");
    td.appendChild(document.createTextNode("פעולה:"));
    tr.appendChild(td);
    td = document.createElement("TD");
    select = document.createElement("select");
    select.setAttribute("id", "searchAnotherCondition" );
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("בחר פעולה נוספת"));
    select.appendChild(opt);
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("או"));
    opt.value = " OR ";
    select.appendChild(opt);
    opt = document.createElement("option");
    opt.appendChild(document.createTextNode("וגם"));
    opt.value = " AND ";
    select.appendChild(opt);
    select.onchange = function () {
        AddAnotherCondition(selectedlayer);
    };
    td.appendChild(select);
    tr.appendChild(td);

    
    table.appendChild(tr);
    $("#searchlayertypehead")[0].value = "";

}
function PointToPolygon1(x, y, r)
{
    var halfradius = r / 2;
    var x1 = parseInt( x - halfradius);
    var y1 = parseInt( y + halfradius);
    var x2 = parseInt( x + halfradius);
    var y2 = parseInt( y + halfradius);
    var x3 = parseInt( x + halfradius);
    var y3 = parseInt( y - halfradius);
    var x4 = parseInt( x - halfradius);
    var y4 = parseInt( y - halfradius);
    var x5 = parseInt( x - halfradius);
    var y5 = parseInt( y + halfradius);
    var wkt = "POLYGON((" + x1 + " " + y1 + ", " + x2 + " " + y2 + "," + x3 + " " + y3 + "," + x4 + " " + y4 + "," + x1 + " " + y1 + "))";
    return wkt;

}
function PointToPolygon(x, y, r) {

    
    x1 = x - r;
    y1 = y;
    x2 = x - (((r / 2)) / (2)) - ((r / 2));
    y2 = y + (((r / 2)) / (2)) + ((r / 2));
    x3 = x;
    y3 = y + r;
    x4 = x + (((r / 2)) / (2)) + ((r / 2));
    y4 = y + (((r / 2)) / (2)) + ((r / 2));
    x5 = x + 10;
    y5 = y;
    x6 = x + (((r / 2)) / (2)) + ((r / 2));
    y6 = y - (((r / 2)) / (2)) - ((r / 2));
    x7 = x;
    y7 = y - r;
    x8 = x - (((r / 2)) / (2)) - ((r / 2));
    y8 = y - (((r / 2)) / (2)) - ((r / 2));
    wkt = "POLYGON((" + x1 + " " + y1 + ", " + x2 + " " + y2 + ", " + x3 + " " + y3 + ", " + x4 + " " + y4 + ", " + x5 + " " + y5 + ", " + x6 + " " + y6 + ", " + x7 + " " + y7 + ", " + x8 + " " + y8 + ", " + x1 + " " + y1 + "))";
    return wkt;
}
function enableDisableRadioProject(obj)
{
    var buttonPoint = document.getElementById("btnPointProject");

    var field = document.getElementById("searchFieldSelectSpatialProject");
    var func = document.getElementById("searchFunctionSelectSpatialProject");
    var value = document.getElementById("txtSearchLayerValueSpatialProject");

    
    var lname = $("#searchlayertypehead2")[0].value;
    
    
    if (obj.value == "numeric")
    {
        if (obj.checked == true)
        {
            field.disabled = false;
            func.disabled = false;
            value.disabled = false;
            buttonPoint.disabled = true;
            
        }
        else
        {
            field.disabled = true;
            func.disabled = true;
            value.disabled = true;
            buttonPoint.disabled = false;
        }
    }
    else // geo 
    {

        if (obj.checked == true) {
            field.disabled = true;
            func.disabled = true;
            value.disabled = true;
            buttonPoint.disabled = false;
        }
        else {

            field.disabled = false;
            func.disabled = false;
            value.disabled = false;
            buttonPoint.disabled = true;
        }
    }
}
function enableDisableRadio(obj) {
    var buttonPoint = document.getElementById("btnPoint");
    var buttonRect = document.getElementById("btnRect");
    var field = document.getElementById("searchFieldSelectSpatial");
    var func = document.getElementById("searchFunctionSelectSpatial");
    var value = document.getElementById("txtSearchLayerValueSpatial");
    var button = document.getElementById("btnRunSpatialQuery");

    var lname = $("#searchlayertypehead2")[0].value;


    if (obj.value == "numeric") {
        if (obj.checked == true) {
            field.disabled = false;
            func.disabled = false;
            value.disabled = false;
            buttonPoint.disabled = true;
             buttonRect.disabled = true;
             button.disabled = false;
             loadSpatialFilterFieldCombo(lname);

        }
        else {
            field.disabled = true;
            func.disabled = true;
            value.disabled = true;
            buttonPoint.disabled = false;
            buttonRect.disabled = false;
              button.disabled = true;
        }
    }
    else 
    {

        if (obj.checked == true) {
            field.disabled = true;
            func.disabled = true;
            value.disabled = true;
            buttonPoint.disabled = false;
            buttonRect.disabled = false;
             button.disabled = true;
        }
        else {

            field.disabled = false;
            func.disabled = false;
            value.disabled = false;
            buttonPoint.disabled = true;
            buttonRect.disabled = true;
            button.disabled = false;
            loadSpatialFilterFieldCombo(lname);
        }
    }
}

function loadSpatialFilterFieldCombo(lname)
{
    
    var layerslist = lname;
   
    var selectName = 'searchFieldSelectSpatial';
    
    if (layerslist != "בחר שכבה") {
        var fieldsList = document.getElementById(selectName);
        fieldsList.innerHTML = "";
       

        var lnameEng = layerHebEng[layerslist];

        var opt1 = document.createElement('option');
        opt1.value = "בחר שדה";
        opt1.innerHTML = "בחר שדה";
        fieldsList.appendChild(opt1);
        var opt2 = document.createElement('option');
        opt2.value = "בחר שדה";
        opt2.innerHTML = "בחר שדה";
       

        for (i = 0; i < identifyFields[lnameEng].length; i++) {
            var fldEng = identifyFields[lnameEng][i];
            var fldHeb = identifyFieldsEngHeb[lnameEng +'_'+ fldEng];
            var opt3 = document.createElement('option');
            opt3.value = fldEng;
            opt3.innerHTML = fldHeb;
            fieldsList.appendChild(opt3);
            var opt4 = document.createElement('option');
            opt4.value = fldEng;
            opt4.innerHTML = fldHeb;
       
        }

    }
}
function loadSpatialFilterFieldComboProject(lname)
{

    var layerslist = lname;

    var selectName = 'searchFieldSelectSpatialProject';

    if (layerslist != "בחר שכבה") {
        var fieldsList = document.getElementById(selectName);
        fieldsList.innerHTML = "";


        var lnameEng = layerHebEng[layerslist];


        var opt1 = document.createElement('option');
        opt1.value = "בחר שדה";
        opt1.innerHTML = "בחר שדה";
        fieldsList.appendChild(opt1);
        var opt2 = document.createElement('option');
        opt2.value = "בחר שדה";
        opt2.innerHTML = "בחר שדה";


        for (i = 0; i < identifyFields[lnameEng].length; i++) {
            var fldEng = identifyFields[lnameEng][i];
            var fldHeb = identifyFieldsEngHeb[lnameEng + '_' + fldEng];
            var opt3 = document.createElement('option');
            opt3.value = fldEng;
            opt3.innerHTML = fldHeb;
            fieldsList.appendChild(opt3);
            var opt4 = document.createElement('option');
            opt4.value = fldEng;
            opt4.innerHTML = fldHeb;

        }

    }
}
function RunSpatialQuery1(geo,identifylayers)
{
    var lname1 = $("#searchlayertypehead1")[0].value;
    if (lname1 == "")
    {
        $("#searchLayerSpatialFooterText").text("יש לבחור שכבת יעד");
        return false;
    }
    var lname2 = $("#searchlayertypehead2")[0].value;
    if (lname2 == "") {
        $("#searchLayerSpatialFooterText").text("יש לבחור שכבת מקור");
        return false;
    }
    var field = document.getElementById("searchFieldSelectSpatial");
    if (field.value == "בחר שדה")
    {
        $("#searchLayerSpatialFooterText").text("יש לבחור שדה");
        return false;
    }
    var func = document.getElementById("searchFunctionSelectSpatial");
    if (func.value == "בחר פעולה") {
        $("#searchLayerSpatialFooterText").text("יש לבחור פעולה");
        return false;
    }
    var value = document.getElementById("txtSearchLayerValueSpatial");
    if (value.value == "")
    {
        $("#searchLayerSpatialFooterText").text("יש להזין ערך");
        return false;
    }
    var textboxSQL = field.value + " " + func.value + " " + value.value;

    var l2 = layerHebEng[lname2];
    var l1 = layerHebEng[lname1];
    var objectIds = [];
    var params = {
        geometry: geo,
        layerName: l2,
        fields: identifyFields[l2],
        getShapes: true,
        whereClause: textboxSQL
    };
    turnOneLyrOn(l1, identifylayers,'down');
    turnOneLyrOn(l2, identifylayers,'down');

    var res = govmap.intersectFeatures(params)
                .then(function (e) {
                    if (e.data != null) {
                        results = e;
                        for (j = 0; j < results.data.length; j++) {
                            var geoLocation = results.data[j].Values.length;
                            var geo = results.data[j].Values[geoLocation - 1];
                            govmap.intersectFeatures({ 'geometry': geo, 'layerName': l1, 'fields': ['OBJECTID'], 'getShapes': true })
                               .then(function (res) {
                                   if (res.data != null) {
                                       for (i = 0; i < res.data.length; i++) {
                                           objectIds.push(res.data[i].ObjectId);
                                       }
                                   }
                                   govmap.searchInLayer({ 'layerName': l1, 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                               });
                        }
                    }
                });
   
}

function RunSpatialQueryNew(identifylayers, arrowDirection, queryType, val, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, fieldFilterSqlArray, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    
    document.getElementById('SQErrorMsg').innerHTML = "";
    hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);
    var sourceLayer = $("#SQLyer1TypeHead")[0].value;
    sourceLayer = layerHebEng[sourceLayer];
    if (sourceLayer == undefined)
    {
        var td = document.getElementById('QueriesSearchedInLayerTD3');
        td.style.display = "block";
        td.innerHTML = 'יש לבחור נושא לחיפוש';
        return;
    }
    var objectIds = [];
    var pointsArray = [];  
    var sqlFilterQuery = "";
    // make sure user selected search objects layer
    var targerlayer = $("#SQLyer1TypeHead")[0].value;
    if (targerlayer == "") {
        var td = document.getElementById('QueriesSearchedInLayerTD3');
        td.innerHTML = 'יש לבחור נושא לחיפוש';
        return;
    }
    if (fieldFilterSqlArray != undefined)
    {
        for (l = 0; l < fieldFilterSqlArray.length; l++) {
            //fieldFilterSqlArray.push({ lyr: lname, field: fldname, sql: SQL });
            if (fieldFilterSqlArray[l].lyr == sourceLayer)
            {
                sqlFilterQuery = fieldFilterSqlArray[l].sql;
                break;
            }
        }
    }
 
    switch (queryType)
    {
        case ("layerSelect"):
            {
                    pointsArray.length = 0;
                    var searchedPolygon;
                    
                    turnlayerOnOff('chk' + sourceLayer, true, identifylayers);
                    var secondLayer = $("#SQLayerTypeHead")[0].value;
                    secondLayer = layerHebEng[secondLayer];
                    if (secondLayer == undefined) {
                        var tderror = document.getElementById('SQTHLayerErrorTD');
                        tderror.style.display = "block";
                        tderror.innerHTML = 'יש לבחור שכבה';
                        return;
                    }
                    else
                    {
                        var tderror = document.getElementById('SQTHLayerErrorTD');
                        tderror.style.display = "none";
                        tderror.innerHTML = '';

                    }

                    turnlayerOnOff('chk' + secondLayer, true, identifylayers);
                    var td = document.getElementById('QueriesSearchedInLayerTD3');
                    td.innerHTML = '';
                    
                    for (m = 0; m < identifyFields[sourceLayer].length; m++) {
                        arrowDirection.push('up');
                    }
                    // unbind identify from click
                    govmap.unbindEvent(govmap.events.CLICK);

                    govmap.draw(govmap.drawType.Point).progress(function (e) {

                        // rebind identify to click
                        clickEventType.value = "identify";
                        govmap.onEvent(govmap.events.CLICK).progress(function (e)
                        {
                            var pt = "POINT(" + e.mapPoint.x + " " + e.mapPoint.y + ")";
                            identifyGeo = pt;
                            identifyGeoType = "Point";
                            DoTheIntersectNew(identifyGeo, identifylayers, identifyGeoType, "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, true, routeSteps);
                        });

                        var geo = e.wkt;
                        govmap.intersectFeatures({ 'geometry': geo, 'layerName': secondLayer, 'fields': ['OBJECTID'], getShapes: true })
                            .then(function (res) {
                                if (res.data != null)
                                {
                                    var polygon = res.data[0].Values[2];
                                    objectIds.length = 0;
                                    objectIds.push(res.data[0].ObjectId)
                                    var sqlQ = 'OBJECTID=' + res.data[0].ObjectId;
                                   // govmap.filterLayer()
                                    //var params = {
                                    //    'geometry': polygon,
                                    //    layerName: secondLayer,
                                    //    whereClause: sqlQ,
                                    //    zoomToExtent: true
                                    //}

                                    ////filterlayerbyfield(fldval, identifylayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable)
                                    //govmap.filterLayers(params);
                                    //fieldFilterSqlArray.push({ lyr: secondLayer, field: "OBJECTID", sql: sqlQ });
                                    
                                    govmap.searchInLayer({ 'layerName': secondLayer, 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                                    govmap.intersectFeaturesLongGeom({ 'geometry': polygon, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false, 'maxResults': 500})
                                        .then(function (result)
                                        {
                                            if (result.data != null) {
                                                var fieldValues = [];
                                                fieldValues.push({ 'layer': sourceLayer, 'data': result.data });
                                                DisplayIdentifyresults(fieldValues, sourceLayer, identifylayers, arrowDirection, "all", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);
                                                document.getElementById('SQErrorMsg').style.display = "none";
                                            }
                                            else
                                            {
                                                document.getElementById('SQErrorMsg').innerHTML = "לא נמצאו תוצאות לתישאול זה";
                                                document.getElementById('SQErrorMsg').style.display = "block";
                                            }
                                            
                                        })
                                     // blabla
                                }
                                
                            });


                        
                    })
            }
            break;
        case ("layerAlfaNumeric"):
            {
                pointsArray.length = 0;
                var searchedPolygon;
                //sourceLayer = layerHebEng[sourceLayer];
                turnlayerOnOff('chk' + sourceLayer, true, identifylayers);
                var secondLayer = $("#SQLayerTypeHead")[0].value;
                secondLayer = layerHebEng[secondLayer];
                if (secondLayer == undefined) {
                    var tderror = document.getElementById('SQTHLayerErrorTD');
                    tderror.innerHTML = 'יש לבחור שכבה';
                    tderror.style.display = "block";
                    return;
                }
                else {
                    var tderror = document.getElementById('SQTHLayerErrorTD');
                    tderror.innerHTML = '';
                    tderror.style.display = "none";
                }

                turnlayerOnOff('chk' + secondLayer, true, identifylayers);
                var td = document.getElementById('QueriesSearchedInLayerTD3');
                td.innerHTML = '';

                for (m = 0; m < identifyFields[sourceLayer].length; m++) {
                    arrowDirection.push('up');
                }
                //
                
                var fldVal = document.getElementById('SQFieldText').value;
                if (fldVal == "") {
                    var tderror = document.getElementById('SQTHFieldErrorTD');
                    tderror.innerHTML = 'יש להזין ערך';
                    tderror.style.display = "block";
                    return;
                }
                else
                {
                    var tderror = document.getElementById('SQTHFieldErrorTD');
                    tderror.innerHTML = '';
                    tderror.style.display = "none";
                }
                var fldName = spatialQueryField[secondLayer];
                var sql = '';
                if (isFieldString[secondLayer + '_' + fldName])
                    sql = "'" + fldName + "'=" + fldVal;
                else
                    sql = fldName + "=" + fldVal;

                govmap.intersectFeaturesByWhereClause({ 'layerName': secondLayer, 'fields': ["OBJECTID"], getShapes: true, 'whereClause': sql })
                     .then(function (res) {
                         if (res.data != null) {
                             var polygon = res.data[0].Values[0];
                             objectIds.length = 0;
                             objectIds.push(res.data[0].ObjectId);
                             // govmap.filterLayer()
                             var params = {
                                 'geometry': polygon,
                                 layerName: secondLayer,
                                 whereClause: '',
                                 zoomToExtent: true
                             }
                             //govmap.filterLayers(params);

                             govmap.searchInLayer({ 'layerName': secondLayer, 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                             govmap.intersectFeaturesLongGeom({ 'geometry': polygon, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false, 'maxResults': 500})
                                 .then(function (result) {
                                     if (result.data != null) {
                                         var fieldValues = [];
                                         fieldValues.push({ 'layer': sourceLayer, 'data': result.data });
                                         DisplayIdentifyresults(fieldValues, sourceLayer, identifylayers, arrowDirection, "all", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);
                                         document.getElementById('SQErrorMsg').style.display = "block";
                                     }
                                     else
                                     {
                                         document.getElementById('SQErrorMsg').innerHTML = "לא נמצאו תוצאות לתישאול זה";
                                         document.getElementById('SQErrorMsg').style.display = "none";
                                     }
                                 })
                             // blabla
                         }
                         else {
                            
                         }
                    });

                //


                break;
            }
        case ("gush"):
            {
                //
                var gush = val;
                var gushObjectID = SQGushIDlist[val];
                var sql = 'OBJECTID =' + gushObjectID;
                objectIds.length = 0;
                objectIds.push(gushObjectID);
                //
                //var sql = '';
                pointsArray.length = 0;
                //var gush = document.getElementById('SQGush').value;
                if (gush.length == 0 || isNaN(gush)) {
                    document.getElementById("SQGushError").innerHTML = 'מספר גוש לא תקין';
                    return;
                }
                else
                {
                    document.getElementById("SQGushError").innerHTML = '';
                    sql = 'GUSH_NUM=' + gush; 
                }
                
                turnlayerOnOff('chkSUB_GUSH_ALL', true, identifylayers); 
                turnlayerOnOff('chk'+ sourceLayer, true, identifylayers); 
               
                //govmap.intersectFeatures({ 'geometry': israelExtentPolygonGeo, 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': sql })
                govmap.intersectFeaturesByWhereClause({ 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': sql })
                      .then(function (e) {
                        if (e.data != null && e.data.length > 0)
                        {
                            var geoPolygon = e.data[0].Values[0];
                            objectIds.length = 0;
                            objectIds.push(e.data[0].ObjectId)
                            govmap.searchInLayer({ 'layerName': "SUB_GUSH_ALL", 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                            //
                            govmap.intersectFeaturesLongGeom({ 'geometry': geoPolygon, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false,'maxResults':500 })
                                .then(function (result) {
                                    if (result.data != null) {
                                        var fieldValues = [];
                                        fieldValues.push({ 'layer': sourceLayer, 'data': result.data });

                                        objectIds.length = 0;
                                        for (k = 0; k < result.data.length; k++) {
                                            pointsArray.push(result.data[k].Values[0]);

                                        }
                                        DisplayIdentifyresults(fieldValues, sourceLayer, identifylayers, arrowDirection, "all", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);

                                        
                                    }
                                })
                            //
                        }
                    })
            }
            break;
        case ("helka"):
            {
                {
                    
                    var helka = val;
                    var sql = '';
                                        
                    var gush = document.getElementById('SQGushTypeHead').value;
                    if (helka.length == 0 || isNaN(helka)) {
                        document.getElementById("SQGushError").innerHTML = 'מספר גוש לא תקין';
                        return;
                    }
                    else {
                        document.getElementById("SQGushError").innerHTML = '';
                        sql = 'GUSH_NUM=' + gush + ' AND PARCEL=' + helka ;
                    }

                    turnlayerOnOff('chkPARCEL_ALL', true, identifylayers);
                    turnlayerOnOff('chk' + sourceLayer, true, identifylayers);
                    
                    govmap.intersectFeaturesByWhereClause({ 'layerName': 'PARCEL_ALL', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': sql })
                        .then(function (e) {
                            if (e.data != null && e.data.length > 0) {
                                var geoPolygon = e.data[0].Values[0];
                                objectIds.length = 0;
                                objectIds.push(e.data[0].ObjectId)
                                govmap.searchInLayer({ 'layerName': "PARCEL_ALL", 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                                //
                                govmap.intersectFeaturesLongGeom({ 'geometry': geoPolygon, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false, 'maxResults': 500 })
                                    .then(function (result) {
                                        if (result.data != null) {
                                            var fieldValues = [];
                                            fieldValues.push({ 'layer': sourceLayer, 'data': result.data });

                                            objectIds.length = 0;
                                            for (k = 0; k < result.data.length; k++) {
                                                pointsArray.push(result.data[k].Values[0]);

                                            }
                                            DisplayIdentifyresults(fieldValues, sourceLayer, identifylayers, arrowDirection, "all", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);


                                        }
                                    })
                                //
                            }
                        })
                }
               



                        
            }
            break;
        case ("city"):
            {
                var cityname = val;
                //sourceLayer = layerHebEng[sourceLayer];
                var cityObjectID = SQIDlist[val];
                var sql = 'OBJECTID =' + cityObjectID;
                objectIds.length = 0; 
                objectIds.push(cityObjectID);

                turnlayerOnOff('chkMUNI', true, identifylayers);
                turnlayerOnOff('chk' + sourceLayer, true, identifylayers);

                govmap.intersectFeaturesByWhereClause({ 'layerName': 'MUNI', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': sql })
                    .then(function (result)
                    {
                        if (result.data != null)
                        {
                            var geo = result.data[0].Values[0];
                            govmap.searchInLayer({ 'layerName': "MUNI", 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                            //

                            //govmap.intersectFeatures({ 'geometry': geo, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false})
                            govmap.intersectFeaturesLongGeom({ 'geometry': geo, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false, 'maxResults': 500 })
                                .then(function (result) {
                                    if (result.data != null) {
                                        var fieldValues = [];
                                        fieldValues.push({ 'layer': sourceLayer, 'data': result.data });

                                        objectIds.length = 0;
                                        for (k = 0; k < result.data.length; k++) {
                                            pointsArray.push(result.data[k].Values[0]);

                                        }
                                        DisplayIdentifyresults(fieldValues, sourceLayer, identifylayers, arrowDirection, "all", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);
                                        document.getElementById('SQErrorMsg').style.display = "none";

                                    }
                                    else
                                    {
                                        document.getElementById('SQErrorMsg').innerHTML = "לא נמצאו תוצאות לתישאול זה";
                                        document.getElementById('SQErrorMsg').style.display = "block";

                                    }
                                    

                                })
                                        //

                        }
                        
                    })

            }
            break;
        case ('juri'):
            {
                var jurisdictionArea = val;
                //sourceLayer = layerHebEng[sourceLayer];
                var juriCode = SQJuriIDlist[val];
                var sql = "MUNI_CODE ='" + juriCode + "'";
                objectIds.length = 0;
                objectIds.push(juriCode);
                var searchedInLayer = 'REGION_AUTH';
                
                turnlayerOnOff('chkREGION_AUTH', true, identifylayers);
                turnlayerOnOff('chk' + sourceLayer, true, identifylayers);
                var arrayofQueries = [];
                var multipleQueryResults = [];
                
                govmap.intersectFeaturesByWhereClause({ 'layerName': searchedInLayer, 'fields': ["OBJECTID"], getShapes: true, 'whereClause': sql })
                    .then(function (result) {
                        if (result.data != null)
                        {
                            //
                            var objectIds = [];
                            for (m = 0; m < result.data.length; m++)
                            {
                                var geom = result.data[m].Values[0];
                                objectIds.push(result.data[m].ObjectId);
                                
                                (function (geom)
                                    {
                                    arrayofQueries.push(govmap.intersectFeaturesLongGeom(
                                        { 'geometry': geom, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false, 'maxResults': 500 })
                                        .then(function (results)
                                        {
                                            multipleQueryResults.push(results.data);
                                        }))})(geom);


                                
                                $.when.apply($, arrayofQueries).done(function () {         
                                    if (multipleQueryResults.length > 0)
                                    {
                                        var ResultsAll = [];
                                        for (k = 0; k < multipleQueryResults.length; k++)
                                        {
                                            var numOfobj = (multipleQueryResults[k] === null) ? 0 : multipleQueryResults[k].length;
                                            for (l = 0; l < numOfobj; l++)
                                            {
                                                ResultsAll.push(multipleQueryResults[k][l]);
                                            }
                                            
                                        }
                                        if (ResultsAll.length > 0)
                                        {
                                            var fieldValues = [];
                                            fieldValues.push({ 'layer': sourceLayer, 'data': ResultsAll });
                                            DisplayIdentifyresults(fieldValues, sourceLayer, identifylayers, arrowDirection, "all", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,true);
                                            document.getElementById('SQErrorMsg').style.display = "none";
                                        }
                                        else
                                        {
                                            document.getElementById('SQErrorMsg').innerHTML = "לא נמצאו תוצאות לתישאול זה";
                                            document.getElementById('SQErrorMsg').style.display = "block";

                                        }
                                        
                                    }
                                    

                                });
                            }
                            govmap.searchInLayer({ 'layerName': searchedInLayer, 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                            //

                            //var geom = result.data[0].Values[0];
                            //govmap.searchInLayer({ 'layerName': searchedInLayer, 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgb(0,255,255)" });
                            
                            //govmap.intersectFeaturesLongGeom({ 'geometry': geom, 'layerName': sourceLayer, 'fields': identifyFields[sourceLayer], 'getShapes': false, 'maxResults': 500 })
                            //    .then(function (result) {
                            //        if (result.data != null) {
                            //            var fieldValues = [];
                            //            fieldValues.push({ 'layer': sourceLayer, 'data': result.data });
                            //            DisplayIdentifyresults(fieldValues, sourceLayer, identifylayers, arrowDirection, "all");

                            //        }
                            //    })
                           
                            
                        }
                        else
                            document.getElementById('SQErrorMsg').innerHTML = "לא נמצאו תוצאות לתישאול זה";
                    })

            }

    }
    

 };


function selectFeatureFromLayer(geo, arrowDirection)
{ 
    var pointsArray = [];
    var objectIds = [];
    var sourcelname = spatialFilterLayers[0];
    var sourcelnameUpper = sourcelname.toUpperCase();
    var sourcefields=['OBJECTID'] ;

    var targetlname = spatialFilterLayers[1];
    var targetlnameUpper = targetlname.toUpperCase();
    var targetfields = identifyFields[targetlname];

    if (geo.substring(0, 3).toUpperCase() == "POI" && polygonsLayers.indexOf(sourcelnameUpper)==-1)
    {

        var firstbracket = geo.indexOf("(");
        var lastbracket = geo.indexOf(")");
        var point =geo.substring(firstbracket+1,lastbracket); 
        var xval = parseFloat(point.split(" ")[0]);
        var yval = parseFloat(point.split(" ")[1]);
        var newGeo = PointToPolygon1(xval, yval, 50);
        geo = newGeo;
    }
    
    

    var params = {
        geometry: geo,
        layerName: sourcelnameUpper,
        fields: sourcefields,
        getShapes: true
    };

    var res = govmap.intersectFeatures(params)
                .then(function (e) {
                    if (e.data != null) {
                        results = e;
                        for (j = 0; j < results.data.length; j++)
                        {
                            var geoLocation = results.data[j].Values.length;
                            var resgeo = results.data[j].Values[geoLocation - 1];
                            govmap.intersectFeatures({ 'geometry': resgeo, 'layerName': targetlname, 'fields': targetfields, 'getShapes': false })
                               .then(function (res)
                                {
                                    if(res.data!=null)
                                    {
                                        for(i=0;i<res.data.length;i++)
                                        {
                                            objectIds.push(res.data[i].ObjectId);
                                            pointsArray.push();
                                        }
                                   }
                                   var identifyModalBody = document.getElementById("identifyAccordionNew");
                                   identifyModalBody.innerHTML = "";
                                  // DisplayIdentifyresults(e.data, targetlname, identifylayers, arrowDirection);
                                  // govmap.searchInLayer({ 'layerName': targetlname, 'fieldName': 'ObjectId', 'fieldValues': objID, 'highlight': true, 'outLineColor': "rgb(0,255,255)" });
                                   drawPoint(pointsArray);

                                });
                        }
                    }
                });
        
   // govmap.clearDrawings();
}

function reducePolygonSizeInDigits(polygon)
{
    var poly = polygon;
    var firstOpenBracket = poly.indexOf('(');
    var firstCloseBracket = poly.indexOf(')');
    poly = poly.substring(firstOpenBracket + 2, firstCloseBracket - 1);
    var polyInPoints = poly.split(',');
    var newPoly = 'POLYGON((';
    for (i = 0; i < polyInPoints.length; i++)
    {
        var point = polyInPoints[i].substring(1, polyInPoints[i].length);
        var pointx = point.split(' ')[0];
        var pointy = point.split(' ')[1];
        var xNoRemainder = pointx.split('.')[0];
        var yNoRemainder = pointy.split('.')[0];
        newPoly += xNoRemainder + ' ' + yNoRemainder + ",";
    }
    newPoly = newPoly.substring(0, newPoly.length - 1);
    newPoly += '))';
    return newPoly; 

}
function ZoomToLayer()
{
    var lyrLevel;
    if (downloadLayerName == "") return;
    var lname = downloadLayerName.slice(0, -4);
    if (LayerData[lname] == undefined) return;
    scale =  parseInt(LayerData[lname][0]); 
    var X = LayerData[lname][1];
    var Y = LayerData[lname][2];
    
    if (scale == 0)
    {
        scale = 3000000;
       
    }
    lyrLevel = getLevelFromScale(scale);
    govmap.zoomToXY({ x: X, y: Y, level: lyrLevel, marker: false });
    var message = document.getElementById('infoModalMessageDiv');
    message.style.visibility = 'hidden';
   // message.style.display = 'none';
  }
function ZoomToBufferLayer(lnameH)
{
    var lname = "";
    if (lnameH != undefined )
    {
        if (layerHebEng[lnameH] != undefined)
        {
            lname = layerHebEng[lnameH];
            scale = parseInt(LayerData[lname][0]);
            var X = LayerData[lname][1];
            var Y = LayerData[lname][2];

            if (scale == 0) {
                scale = 3000000;

            }
            lyrLevel = getLevelFromScale(scale);
            govmap.zoomToXY({ x: X, y: Y, level: lyrLevel, marker: false });
        }
    }
    
    
}
function ZoomToLayer1(lname) {
    
    if (lname != undefined || lname.length > 0)
        lname = lname.substring(1, lname.length);
    if (LayerData[lname] == undefined) return;
    scale = parseInt(LayerData[lname][0]);
    var X = LayerData[lname][1];
    var Y = LayerData[lname][2];

    if (scale == 0) {
        scale = 3000000;

    }
    lyrLevel = getLevelFromScale(scale);
    govmap.zoomToXY({ x: X, y: Y, level: lyrLevel, marker: false });
    //var message = document.getElementById('infoModalMessageDiv');
    //message.style.visibility = 'hidden';
    //message.style.display = 'none';
}

function ZoomToLayerMobile(lname) {

    if (lname == undefined || lname.length == 0) return;
    if (LayerData[lname] == undefined) return;

    scale = parseInt(LayerData[lname][0]);
    var X = LayerData[lname][1];
    var Y = LayerData[lname][2];

    if (scale == 0) {
        scale = 3000000;

    }
    lyrLevel = getLevelFromScale(scale);
    govmap.zoomToXY({ x: X, y: Y, level: lyrLevel, marker: false });
    
}

function getLevelFromScale(scale)
{
    switch (scale)
    {
        case 1250:
            return 10;
           
        case 2500:
            return 9;
           
        case 5000:
            return 8;
           
        case 10000:
            return 7;
           
        case 25000:
            return 6;
           
        case 50000:
            return 5;
           
        case 100000:
            return 4;
           
        case 250000:
            return 3;
           
        case 500000:
            return 2;
           
        case 1000000:
            return 1;
           
        case 3000000:
            return 0;
    }
        

}
function computeExtent()
{
    var obj = govmap.getLayerData("LRT_Jer_Station_MOT");
}
function callLoadFieldsCombo()
{
    if (selectedLayer != "")
        loadFieldsCombo(selectedLayer);
}

function changecss(id,homeTabStatus,star) {
    var button = document.getElementById(id);
    var currentText = document.getElementById('homeTab').innerHTML;
   
    if (homeTabStatus.value < 0) homeTabStatus.value = 0;
    
    if (button.name == "")
    {
        // button was clicked on 
        $(button).css('background', 'rgb(109,176,64)');
        button.name = "checked";
        
        if(homeTabStatus.value == 0)
            document.getElementById('homeTab').innerHTML = currentText + star;
        homeTabStatus.value += 1;

    }
    else {
        // button was clicked off
        $(button).css('background','rgb(210,222,242)' );
        button.name = "";
        homeTabStatus.value -= 1;
        if (homeTabStatus.value < 0) homeTabStatus.value = 0;
        if (homeTabStatus.value == 0)
            document.getElementById('homeTab').innerHTML = "תאגיד";
    }
  
}
function changecss1(id, subProjectTabStatus, star) {
    var button = document.getElementById(id);
    var currentText = document.getElementById('subProjectTab').innerHTML;
    //var star = "<font size='3' color='red'>*</font>";
    if (subProjectTabStatus.value < 0) subProjectTabStatus.value = 0;

    if (button.name == "") {
        // button was clicked on 
        $(button).css('background', 'rgb(109,176,64)');
        button.name = "checked";
       
        if (subProjectTabStatus.value == 0)
            document.getElementById('subProjectTab').innerHTML = currentText + star;
        subProjectTabStatus.value += 1;

    }
    else {
        // button was clicked off
        $(button).css('background', 'rgb(210,222,242)');
        button.name = "";
        subProjectTabStatus.value -= 1;

        if (subProjectTabStatus.value < 0) subProjectTabStatus.value = 0;
        if (subProjectTabStatus.value == 0)
            document.getElementById('subProjectTab').innerHTML = "תת פרויקט";
    }
   
}
function buildTocNew(identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama) //changed
{

    var AccordionDiv = document.getElementById("allLayers");
    var lnameEng = "";
    var blnameEng = "";
    var counter = { value: 1 };
    for (var i in TOC_Content) {
        var groupDiv = document.createElement('div');
        groupDiv.setAttribute('width', '100%');
        groupDiv.className = 'panel panel-default';
        groupDiv.setAttribute('width', '90%');
        var groupButtonDiv = document.createElement('div');
        groupButtonDiv.setAttribute('width', '90%');

        var gbTable = document.createElement('table');
        gbTable.setAttribute('width', '100%');
        var gbTR = document.createElement('tr');
        gbTR.style.borderBottomStyle = 'solid';
        gbTR.style.borderBottomColor = 'lightgrey';
        gbTR.style.borderBottomWidth = '1px';

        gbTR.setAttribute('width', '100%');


        var gbTD = document.createElement('td');
        gbTD.setAttribute('id', 'btncollapse' + counter.value + '_selectedNum')
        gbTD.className = "numberCircle";
        //gbTD.style.width='15%';
        //gbTD.style.height= '100%';



        gbTR.appendChild(gbTD);
        gbTable.appendChild(gbTR);


        gbTD = document.createElement('td');
        gbTD.style.width = '85%';
        var groupButton = document.createElement('button');
        groupButton.setAttribute('class', 'btnToc');
        groupButton.setAttribute('name', 'collapse' + counter.value);
        groupButton.setAttribute('id', 'btncollapse' + counter.value);
        groupButton.setAttribute('data-toggle', 'collapse');
        groupButton.setAttribute('data-target', "#" + "collapse" + counter.value);
        // groupButton.setAttribute('title', i);
        groupButton.innerHTML = i + "   ";
        groupButton.onclick = function (evt) {
            openLayersSectionClick(this.id, "MAIN_TOC_BRANCH");
        };

        var glyphArrow = document.createElement("i");
        glyphArrow.setAttribute('class', 'fa fa-chevron-down');
        glyphArrow.style.fontSize = "1.1vw";
        glyphArrow.style.color = "rgba(29, 103, 217, 1)";
        glyphArrow.onmouseover = "this.style.cursor='pointer'";
        //glyph.style.position = 'relative';
        glyphArrow.style.right = '88%';
        groupButton.appendChild(glyphArrow);
        gbTD.appendChild(groupButton);
        gbTR.appendChild(gbTD);

        groupButtonDiv.appendChild(gbTable);
        var groupCheckBoxDiv = document.createElement('div');

        groupCheckBoxDiv.className = 'panel-collapse collapse';
        groupCheckBoxDiv.setAttribute('id', 'collapse' + counter.value);

        groupCheckBoxDiv.style.paddingRight = "2%";
        groupCheckBoxDiv.setAttribute('width', '70%');
        groupCheckBoxDiv.setAttribute('overflow-y', 'auto');

        for (var j in TOC_Content[i]) {
            if (isbranch[TOC_Content[i][j]]) {
                counter.value += 1;
                var branchName = TOC_Content[i][j]
                //
                var bGroupDiv = document.createElement('div');
                bGroupDiv.setAttribute('width', '100%');
                bGroupDiv.className = 'panel panel-default';
                bGroupDiv.setAttribute('width', '90%');
                var bGroupButtonDiv = document.createElement('div');
                bGroupButtonDiv.setAttribute('width', '90%');

                var bgbTable = document.createElement('table');
                bgbTable.setAttribute('width', '100%');
                var bgbTR = document.createElement('tr');
                //bgbTR.style.borderBottomStyle = 'solid';
                //bgbTR.style.borderBottomColor = 'lightgrey';
                //bgbTR.style.borderBottomWidth = '1px';

                bgbTR.setAttribute('width', '100%');

                var bgbTD = document.createElement('td');
                bgbTD.setAttribute('id', 'btncollapse' + counter.value + '_selectedNum')
                bgbTD.className = "numberCircleBranch";
                //bgbTD.style.width = '15%';
                //bgbTD.style.height = '100%';

                bgbTR.appendChild(bgbTD);
                bgbTable.appendChild(bgbTR);

                bgbTD = document.createElement('td');
                bgbTD.style.width = '85%';
                var bgroupButton = document.createElement('button');
                bgroupButton.setAttribute('class', 'btnBranch');
                bgroupButton.setAttribute('name', 'collapse' + counter.value);
                bgroupButton.setAttribute('id', 'btncollapse' + counter.value);
                bgroupButton.setAttribute('data-toggle', 'collapse');
                bgroupButton.setAttribute('data-target', "#" + "collapse" + counter.value);
                // groupButton.setAttribute('title', i);
                bgroupButton.innerHTML = branchName;
                bgroupButton.onclick = function (evt) {
                    openLayersSectionClick(this.id, "SUB_BRANCH");
                };

                var bglyphArrow = document.createElement("i");
                bglyphArrow.setAttribute('class', 'fa fa-chevron-down');
                bglyphArrow.style.color = "rgba(29, 103, 217, 1)";
                bglyphArrow.onmouseover = "this.style.cursor='pointer'";
                //glyph.style.position = 'relative';
                bglyphArrow.style.right = '88%';
                bgroupButton.appendChild(bglyphArrow);
                bgbTD.appendChild(bgroupButton);
                bgbTR.appendChild(bgbTD);

                bGroupButtonDiv.appendChild(bgbTable);
                var bgroupCheckBoxDiv = document.createElement('div');

                bgroupCheckBoxDiv.className = 'panel-collapse collapse';
                bgroupCheckBoxDiv.setAttribute('id', 'collapse' + counter.value);

                bgroupCheckBoxDiv.style.paddingRight = "2%";
                bgroupCheckBoxDiv.setAttribute('width', '70%');
                bgroupCheckBoxDiv.setAttribute('overflow-y', 'auto');


                for (var m = 0; m < Toc_Sub_Content[branchName].length; m++) {
                    var blnameHeb = Toc_Sub_Content[branchName][m];
                    if (blnameHeb == "סמן הכל")
                        blnameEng = branchName;
                    else
                        blnameEng = layerHebEng[blnameHeb];

                    var bcheckboxDiv = document.createElement("div");
                    bcheckboxDiv.setAttribute('id', 'chkDiv' + blnameEng);
                    // we want the toc sub branch checkboxes to be a little inside 
                    bcheckboxDiv.style.paddingRight = "2%";
                    var bcheckbox = document.createElement('input');
                    bcheckbox.setAttribute("collapseName", 'collapse' + counter.value);
                    AddCheckboxToGroupCheckboxDiv(bcheckboxDiv, bcheckbox, blnameHeb, counter.value, blnameEng, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, Toc_Sub_Content, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    bgroupCheckBoxDiv.appendChild(bcheckboxDiv);
                }

                bGroupDiv.appendChild(bGroupButtonDiv);
                bGroupDiv.appendChild(bgroupCheckBoxDiv);

                groupCheckBoxDiv.appendChild(bGroupDiv);

                //

            }
            else {
                var lnameHeb = TOC_Content[i][j];
                if (lnameHeb == "סמן הכל")
                    lnameEng = i;
                else
                    lnameEng = layerHebEng[lnameHeb];

                var checkboxDiv = document.createElement("div");
                checkboxDiv.setAttribute('id', 'chkDiv' + lnameEng);
                var checkbox = document.createElement('input');
                checkbox.setAttribute("collapseName", 'collapse' + counter.value);
                AddCheckboxToGroupCheckboxDiv(checkboxDiv, checkbox, lnameHeb, counter.value, lnameEng, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, TOC_Content, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                groupCheckBoxDiv.appendChild(checkboxDiv);
            }
        }




        groupDiv.appendChild(groupButtonDiv);
        groupDiv.appendChild(groupCheckBoxDiv);
        AccordionDiv.appendChild(groupDiv);
        counter.value += 1;
    }




}
function buildTocNewFix(identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama ) //changed
{
 
    var AccordionDiv = document.getElementById("allLayers");
    var lnameEng = "";
    var blnameEng = "";
    var counter = { value: 1 };
    for (var i in TOC_Content)
    {
        var groupDiv = document.createElement('div');
        groupDiv.setAttribute('width', '100%');
        groupDiv.className = 'panel panel-default';
        groupDiv.setAttribute('width', '90%');
        var groupButtonDiv = document.createElement('div');
        groupButtonDiv.setAttribute('width', '90%');

        var gbTable = document.createElement('table');
        gbTable.setAttribute('width', '100%');
        var gbTR = document.createElement('tr');
        gbTR.style.borderBottomStyle = 'solid';
        gbTR.style.borderBottomColor = 'lightgrey';
        gbTR.style.borderBottomWidth = '1px';

        gbTR.setAttribute('width', '100%');


        var gbTD = document.createElement('td');
        gbTD.setAttribute('id', 'btncollapse' +Math.trunc(  counter.value) + '_selectedNum')
        gbTD.className = "numberCircle";
        //gbTD.style.width='15%';
        //gbTD.style.height= '100%';
        
       
        
        gbTR.appendChild(gbTD);
        gbTable.appendChild(gbTR);


        gbTD = document.createElement('td');
        gbTD.style.width = '85%';
        var groupButton = document.createElement('button');
        groupButton.setAttribute('class', 'btnToc');
        groupButton.setAttribute('name', 'collapse' + Math.trunc( counter.value));
        groupButton.setAttribute('id', 'btncollapse' + Math.trunc(counter.value));
        groupButton.setAttribute('data-toggle', 'collapse');
        groupButton.setAttribute('data-target', "#" + "collapse" + Math.trunc(counter.value));
       // groupButton.setAttribute('title', i);
        groupButton.innerHTML = i + "   ";
        groupButton.onclick = function (evt) {
            openLayersSectionClick(this.id,"MAIN_TOC_BRANCH");
        };

        var glyphArrow = document.createElement("i");
        glyphArrow.setAttribute('class', 'fa fa-chevron-down');
        glyphArrow.style.color = "rgba(29, 103, 217, 1)";
        glyphArrow.onmouseover = "this.style.cursor='pointer'";
        //glyph.style.position = 'relative';
        glyphArrow.style.right = '88%';
        groupButton.appendChild(glyphArrow);
        gbTD.appendChild(groupButton);
        gbTR.appendChild(gbTD);
      
        groupButtonDiv.appendChild(gbTable);
        var groupCheckBoxDiv = document.createElement('div');
        
        groupCheckBoxDiv.className = 'panel-collapse collapse';
        groupCheckBoxDiv.setAttribute('id', 'collapse' + Math.trunc(counter.value));
                
        groupCheckBoxDiv.style.paddingRight = "2%";
        groupCheckBoxDiv.setAttribute('width', '70%');
        groupCheckBoxDiv.setAttribute('overflow-y', 'auto');

        for (var j in TOC_Content[i])
        {
            if (isbranch[TOC_Content[i][j]])
            {
                if (j == 0)
                    counter.value += 1;
                else
                    counter.value += 0.1;
                var branchName = TOC_Content[i][j]
                //
                var bGroupDiv = document.createElement('div');
                bGroupDiv.setAttribute('width', '100%');
                bGroupDiv.className = 'panel panel-default';
                bGroupDiv.setAttribute('width', '90%');
                var bGroupButtonDiv = document.createElement('div');
                bGroupButtonDiv.setAttribute('width', '90%');

                var bgbTable = document.createElement('table');
                bgbTable.setAttribute('width', '100%');
                var bgbTR = document.createElement('tr');
                //bgbTR.style.borderBottomStyle = 'solid';
                //bgbTR.style.borderBottomColor = 'lightgrey';
                //bgbTR.style.borderBottomWidth = '1px';

                bgbTR.setAttribute('width', '100%');

                var bgbTD = document.createElement('td');
                bgbTD.setAttribute('id', 'btncollapse' + counter.value + '_selectedNum')
                bgbTD.className = "numberCircleBranch";
                //bgbTD.style.width = '15%';
                //bgbTD.style.height = '100%';

                bgbTR.appendChild(bgbTD);
                bgbTable.appendChild(bgbTR);

                bgbTD = document.createElement('td');
                bgbTD.style.width = '85%';
                var bgroupButton = document.createElement('button');
                bgroupButton.setAttribute('class', 'btnBranch');
                bgroupButton.setAttribute('name', 'collapse' + counter.value);
                bgroupButton.setAttribute('id', 'btncollapse' + counter.value);
                bgroupButton.setAttribute('data-toggle', 'collapse');
                bgroupButton.setAttribute('data-target', "#" + "collapse" + counter.value);
                // groupButton.setAttribute('title', i);
                bgroupButton.innerHTML = branchName;
                bgroupButton.onclick = function (evt) {
                    openLayersSectionClick(this.id,"SUB_BRANCH");
                };

                var bglyphArrow = document.createElement("i");
                bglyphArrow.setAttribute('class', 'fa fa-chevron-down');
                bglyphArrow.style.color = "rgba(29, 103, 217, 1)";
                bglyphArrow.onmouseover = "this.style.cursor='pointer'";
                //glyph.style.position = 'relative';
                bglyphArrow.style.right = '88%';
                bgroupButton.appendChild(bglyphArrow);
                bgbTD.appendChild(bgroupButton);
                bgbTR.appendChild(bgbTD);

                bGroupButtonDiv.appendChild(bgbTable);
                var bgroupCheckBoxDiv = document.createElement('div');

                bgroupCheckBoxDiv.className = 'panel-collapse collapse';
                bgroupCheckBoxDiv.setAttribute('id', 'collapse' + counter.value);

                bgroupCheckBoxDiv.style.paddingRight = "2%";
                bgroupCheckBoxDiv.setAttribute('width', '70%');
                bgroupCheckBoxDiv.setAttribute('overflow-y', 'auto');


                for (var m = 0; m < Toc_Sub_Content[branchName].length; m++)
                {
                    var blnameHeb = Toc_Sub_Content[branchName][m];
                    if (blnameHeb == "סמן הכל")
                        blnameEng = branchName;
                    else
                        blnameEng = layerHebEng[blnameHeb];

                    var bcheckboxDiv = document.createElement("div");
                    bcheckboxDiv.setAttribute('id', 'chkDiv' + blnameEng);
                    // we want the toc sub branch checkboxes to be a little inside 
                    bcheckboxDiv.style.paddingRight = "2%";
                    var bcheckbox = document.createElement('input');
                    bcheckbox.setAttribute("collapseName", 'collapse' + counter.value);
                    AddCheckboxToGroupCheckboxDiv(bcheckboxDiv, bcheckbox, blnameHeb, counter.value, blnameEng, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, Toc_Sub_Content, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    bgroupCheckBoxDiv.appendChild(bcheckboxDiv);
                }

                bGroupDiv.appendChild(bGroupButtonDiv);
                bGroupDiv.appendChild(bgroupCheckBoxDiv);

                groupCheckBoxDiv.appendChild(bGroupDiv);
               
                //

            }
            else
            {
                var lnameHeb = TOC_Content[i][j];
                if (lnameHeb == "סמן הכל")
                    lnameEng = i;
                else
                    lnameEng = layerHebEng[lnameHeb];

                var checkboxDiv = document.createElement("div");
                checkboxDiv.setAttribute('id', 'chkDiv' + lnameEng);
                var checkbox = document.createElement('input');
                checkbox.setAttribute("collapseName", 'collapse' + Math.trunc( counter.value));
                AddCheckboxToGroupCheckboxDiv(checkboxDiv, checkbox, lnameHeb, Math.trunc(counter.value), lnameEng, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, TOC_Content, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                groupCheckBoxDiv.appendChild(checkboxDiv);
            }
        }
            



        groupDiv.appendChild(groupButtonDiv);
        groupDiv.appendChild(groupCheckBoxDiv);
        AccordionDiv.appendChild(groupDiv);
        counter.value += 1;
    }

    
 
    
}
function AddCheckboxToGroupCheckboxDiv(checkboxDiv, checkbox, lnameHeb, counter, lnameEng, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, obj, heatmapLayer, heatmapField, drawTextData, drawTextItems) // changed
{
        
    checkbox.setAttribute('type', 'checkbox');
    if (lnameHeb == "סמן הכל")
    {
        checkbox.setAttribute('id', "all" + lnameEng);
    }
    else
    {
        checkbox.setAttribute('id', 'chk' + lnameEng);
    }
    checkbox.setAttribute('class', 'chkmodal');
    checkbox.setAttribute('value', 'a');

    checkbox.onclick = function (evt)
    {
        var threeletters = this.id.substring(0, 3);
        if (threeletters == 'all')
        {
            var tmpid = this.id.substring(3, this.id.length);
            //if(TOC_Content[tmpid] != undefined)
            TurnTocGroupOfLayersOnOff(tmpid, this.checked, identifylayers);
            //else
            //    TurnTocSubGroupOfLayersOnOff(tmpid,groupchecked,identifylayers)
        }
        else
            turnlayerOnOff(this.id, this.checked, identifylayers);

    };

    var answerLabel = document.createElement('label');
    answerLabel.setAttribute('class', 'checkboxlabel');
    answerLabel.appendChild(document.createTextNode(" " + lnameHeb));
    if (lnameHeb == "סמן הכל") {
        answerLabel.style.fontWeight = "bold";
    }
    answerLabel.setAttribute('id', 'lbl' + lnameEng);
    answerLabel.onclick = function () {

        var stripedName = this.id.substring(3, this.id.length);
        if (TocGroups.indexOf(stripedName) > -1) {
            var index = TocGroups.indexOf(stripedName);
            var chkallname = "all" + index;
            var checkedstatus = !(document.getElementById(chkallname).checked);
            
            $("#" + chkallname).trigger('click');
            
        }
        else {
            var checkboxtocheck = 'chk' + this.id.substring(3, this.id.length);
            var checkedstatus = !(document.getElementById(checkboxtocheck).checked);
            turnlayerOnOff(checkboxtocheck, checkedstatus, identifylayers);
        }

    }
    // glyph identify
    var glyphI = document.createElement("IMG");
    glyphI.title = "מידע";
    glyphI.setAttribute("src", "icons/i_transparant.png");
    glyphI.setAttribute("width", "15");
    glyphI.setAttribute("height", "15");
    glyphI.style.marginTop = "3px";
    glyphI.style.position = 'absolute';
    glyphI.style.left = '60px';
    glyphI.style.visibility = "hidden";
    if (lnameHeb != 'סמן הכל')
        glyphI.setAttribute('id', 'i' + lnameEng);
    else
        glyphI.setAttribute('id', lnameEng);
    glyphI.onclick = function () {
        // hideLayers();
        openLayersInformation(this.id);
    };
    // glyph download
    var glyphD = document.createElement("IMG");
    glyphD.title = "הורדת שכבה";
    glyphD.setAttribute("src", "icons/download_transparant.png");
    glyphD.setAttribute("width", "15");
    glyphD.setAttribute("height", "15");
    glyphD.style.marginTop = "3px";
    glyphD.style.position = 'absolute';
    glyphD.style.left = '0px';
    glyphD.style.visibility = "hidden";
    if (lnameHeb != 'סמן הכל')
        glyphD.setAttribute('id', 'd' + lnameEng);
    else
        glyphD.setAttribute('id', lnameEng);
    glyphD.onclick = function () {
        // hideLayers();
        openLayerDownload(this.id);
    };
    // glyph focus
    var glyphF = document.createElement("IMG");
    glyphF.title = "התמקדות לשכבה";
    glyphF.setAttribute("src", "icons/zoomto_transparant.png");
    glyphF.setAttribute("width", "15");
    glyphF.setAttribute("height", "15");
    glyphF.style.marginTop = "3px";
    glyphF.style.position = 'absolute';
    glyphF.style.left = '20px';
    glyphF.style.visibility = "hidden";
    if (lnameHeb != 'סמן הכל')
        glyphF.setAttribute('id', 'f' + lnameEng);
    else
        glyphF.setAttribute('id', lnameEng);
    glyphF.onclick = function () {
        ZoomToLayer1(this.id);
    };
    // glyph filter
    var glyphT = document.createElement("IMG");
    glyphT.title = "סינון שכבה";

    glyphT.setAttribute("src", "icons/filter_transparant.png");
    glyphT.setAttribute("width", "15");
    glyphT.setAttribute("height", "15");
    glyphT.style.marginTop = "3px";
    glyphT.style.position = 'absolute';
    glyphT.style.left = '40px';
    glyphT.style.visibility = "hidden";
    if (lnameHeb != 'סמן הכל')
        glyphT.setAttribute('id', 't' + lnameEng);
    else
        glyphT.setAttribute('id', lnameEng);
    glyphT.onclick = function () {
        // hideLayers();
        var tname = this.id.substring(1, this.id.length);
        if (identifyFields[tname] != undefined) {
            openLayersFilter(this.id);
            buildFielFiltedList(this.id, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        }

    };

    checkboxDiv.appendChild(glyphT);
    checkboxDiv.appendChild(glyphF);
    checkboxDiv.appendChild(glyphI);
    checkboxDiv.appendChild(glyphD);
    checkboxDiv.appendChild(answerLabel);
    checkboxDiv.appendChild(checkbox);

    checkboxDiv.onmouseenter = function (evt) {
        this.style.backgroundColor = "rgba(242, 244, 250, 1)";
        if (this.id.substring(6, this.id.length) != "undefined")
            showLayerPossibilities("", this, "", fieldFilterSqlArray);
    };

    checkboxDiv.onmouseleave = function (evt) {
        this.style.backgroundColor = "rgba(255, 255, 255, .4)";
        if (this.id.substring(6, this.id.length) != "undefined")
            hideLayerPossibilities("", this, "");
    };
}
function fieldWasFiltered(lname, fieldname, fieldFilterSqlArray)
{
    if (fieldFilterSqlArray == undefined) return false;
    if (FieldFilter[lname + "_" + fieldname][0] == 2)
        fieldname = "OBJECTID";
    for (l = 0; l < fieldFilterSqlArray.length; l++)
    {
        //fieldFilterSqlArray.push({ lyr: lname, field: fldname, sql: SQL });
        if (fieldFilterSqlArray[l].lyr == lname && fieldFilterSqlArray[l].field == fieldname)
            return true;

    }
    return false;
}
function subFieldWasFiltered(lname, fieldname, fieldFilterSqlArray, subfieldval) {
    if (fieldFilterSqlArray == undefined) return false;
    for (m = 0; m < fieldFilterSqlArray.length; m++) {
        if (fieldFilterSqlArray[m].lyr == lname && fieldFilterSqlArray[m].field == fieldname)
        {
            var values = fieldFilterSqlArray[m].sql.split("OR");
            for (n = 0; n < values.length; n++) {
                var val = values[n].split("=")[1].trim();
                if (isNaN(val))
                {
                    // the value is string with opening and closing apostroph so we need to remove first and last chars befor comparing
                    if (val.substring(1, val.length - 1) == subfieldval)
                        return true;
                }
                // we have a number 
                if (val == subfieldval)
                    return true;
                     
            }

        }
        

    }
    return false;
}
function layerWasFiltered(lname, fieldFilterSqlArray)
{
    if (fieldFilterSqlArray == undefined) return false;
    for (l = 0; l < fieldFilterSqlArray.length; l++) {
        //fieldFilterSqlArray.push({ lyr: lname, field: fldname, sql: SQL });
        if (fieldFilterSqlArray[l].lyr == lname)
            return true;

    }
    return false;
}
function buildFielFiltedList(lname, identifyLayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var AccordionDiv = document.getElementById("fieldListDiv");
    AccordionDiv.innerHTML = '';   
    lname = lname.substring(1, lname.length);
    for (i = 0; i < FilterFieldsList[lname].length; i++) {

        var curField = FilterFieldsList[lname][i];

        if (FieldFilter[lname + "_"+ curField][0] > 0)
        {
            var fieldButton = document.createElement('button');
            fieldButton.setAttribute('class', 'btnField');
            fieldButton.style.width = '95%';
            fieldButton.setAttribute('id', lname + "_" + FilterFieldsList[lname][i]);
            var hebname = identifyFieldsEngHeb[lname + '_' + FilterFieldsList[lname][i]];
            fieldButton.innerHTML = hebname;

            var glyph = document.createElement("i");
            glyph.setAttribute('class', 'fa fa-chevron-left');
            glyph.style.color = "rgba(29, 103, 217, 1)";
            glyph.onmouseover = "this.style.cursor='pointer'";
           //glyph.style.position = 'relative';
            glyph.style.right = '88%';

            fieldButton.appendChild(glyph);

            fieldButton.value = lname + "$" + FilterFieldsList[lname][i];
            fieldButton.onclick = function (evt) {
                fieldfilterlist.length = 0;
                fieldfilterIDlist.length = 0;
                var fieldname = this.value.split('$')[1];
               
                var filename = this.value.split('$')[0];
                var fieldcode = getFieldID(filename, fieldname);
                var filecode = layerEngHeb[filename][1];
                var fieldtype = FieldFilter[filename + "_" + fieldname][0];

                if (fieldtype == 1) {

                    document.getElementById("errorMsgTD").innerHTML = "";
                    document.getElementById('filterFreeText').style.display = 'block';
                    document.getElementById('subfieldsForm').style.display = 'none';
                    document.getElementById('filterAutocompleteForm').style.display = 'none';
                    
                    document.getElementById('timeSliderform').style.display = 'none';
                    openFieldFilter(filename, fieldname, fieldtype, identifyLayers);
                    document.getElementById('dateFilterForm').style.display = 'none';
                }
                else if (fieldtype == 2 || fieldtype == 3) {
                    document.getElementById('filterFreeText').style.display = 'none';
                    getDataFromServer(fieldtype, fieldcode, filecode, identifyLayers, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    document.getElementById('filterAutocompleteForm').style.display = 'block';
                    document.getElementById('sliderform').style.display = 'none';
                    document.getElementById('timeSliderform').style.display = 'none';

                    document.getElementById('subfieldsForm').style.display = 'none';
                    document.getElementById('dateFilterForm').style.display = 'none';
                }
                else if (fieldtype == 5) {
                    // numeric range
                    getDataFromServer(fieldtype, fieldcode, filecode, identifyLayers, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    document.getElementById('filterFreeText').style.display = 'none';
                    document.getElementById('filterAutocompleteForm').style.display = 'none';
                    document.getElementById('sliderform').style.display = 'block';
                    document.getElementById('timeSliderform').style.display = 'none';
                    document.getElementById('subfieldsForm').style.display = 'none';
                    document.getElementById('dateFilterForm').style.display = 'none';
                }
                else if (fieldtype == 6)
                {
                    // date range
                    getDataFromServer(fieldtype, fieldcode, filecode, identifyLayers, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    document.getElementById('filterFreeText').style.display = 'none';
                    document.getElementById('filterAutocompleteForm').style.display = 'none';
                    document.getElementById('sliderform').style.display = 'none';
                    document.getElementById('timeSliderform').style.display = 'none';
                    document.getElementById('subfieldsForm').style.display = 'none';
                    document.getElementById('dateFilterForm').style.display = 'block';
                    
                }
                else if (fieldtype == 7)
                {

                    //
                                        
                    openFieldFilter(filename, fieldname, fieldtype, identifyLayers);
                    //createSlider(0, 1440,"timeSliderform","timeSlider");
                    //

                    document.getElementById('filterFreeText').style.display = 'none';
                    document.getElementById('filterAutocompleteForm').style.display = 'none';
                    document.getElementById('sliderform').style.display = 'none';
                    document.getElementById('timeSliderform').style.display = 'block';
                    document.getElementById('subfieldsForm').style.display = 'none';
                    document.getElementById('dateFilterForm').style.display = 'none';
                }
                else if (fieldtype == 4) {

                    var values = FieldFilter[filename + "_" + fieldname][1].split("$");
                    var subfieldsAcordion = document.getElementById('subfieldsList');
                    subfieldsAcordion.innerHTML = '';
                    for (k = 0; k < values.length; k++) {

                        var subfieldButton = document.createElement('label');
                        subfieldButton.setAttribute('class', 'btnSubField');
                        subfieldButton.setAttribute('id', "subfield$" + lname + "$" + fieldname + '$' + values[k]);
                        subfieldButton.innerHTML = values[k];
                        subfieldButton.onclick = function () {
                            this.style.color = "white";
                            this.style.backgroundColor = "rgba(31, 54, 90, 1)";
                            var values = this.id.split('$');
                            var cancel = document.getElementById('subfieldCancel$' + values[1] + '$' + values[2] + '$' + values[3]);

                            cancel.style.display = 'block';
                            filterlayerbyfield(values[3], identifyLayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                        };

                        var subfieldButtonTable = document.createElement('table');
                        subfieldButtonTable.style.width = '100%';
                        var subfieldtr = document.createElement('tr');
                        subfieldButtonTable.appendChild(subfieldtr);
                        var subfieldtd1 = document.createElement('td');
                        subfieldtd1.appendChild(subfieldButton);
                        subfieldtd1.style.width = '100%';
                        var subfieldtd2 = document.createElement('td');
                        //

                        var cancelsubfieldImg = document.createElement("img");
                        cancelsubfieldImg.title = "לחץ לביטול הסינון";
                        cancelsubfieldImg.id = "subfieldCancel$" + lname + "$" + fieldname + '$' + values[k];
                        cancelsubfieldImg.style.cursor = "pointer";
                        cancelsubfieldImg.src = "icons/cancel.png";

                        //var lblCancelsubFltr = document.createElement('label');
                        //lblCancelsubFltr.setAttribute('width', '15%');
                        //lblCancelsubFltr.innerText = "בטל";
                        //lblCancelsubFltr.title = "לחץ לביטול הסינון";
                        //lblCancelsubFltr.style.color = 'fuchsia';
                        //lblCancelsubFltr.id = "subfieldCancel$" + lname + "$" + fieldname + '$' + values[k];
                        //lblCancelsubFltr.style.cursor = "pointer";
                        
                        //subFieldWasFiltered
                        var subfldwasfiltered = subFieldWasFiltered(lname, fieldname, fieldFilterSqlArray,values[k]);
                        if (subfldwasfiltered == true)
                        {
                            cancelsubfieldImg.style.display = "block";
                            subfieldButton.style.color = "white";
                            subfieldButton.style.backgroundColor = "rgba(31, 54, 90, 1)";
                        }
                        else
                            cancelsubfieldImg.style.display = "none";


                        cancelsubfieldImg.onclick = function () {
                            deductSubFieldFromFilter(this, identifyLayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                            this.style.display = "none";
                            var sqlParams = this.id.split("$");
                            var lname = sqlParams[1];
                            var fldName = sqlParams[2];
                            var fldval = sqlParams[3];
                            var sfb = document.getElementById("subfield$" + lname + "$" + fldName + '$' + fldval);
                            var sfb = document.getElementById("subfield$" + lname + "$" + fldName + '$' + fldval);
                            sfb.style.color = "black";
                            sfb.style.backgroundColor = "white";
                        };
                        subfieldtd2.appendChild(cancelsubfieldImg);
                        subfieldtd2.style.width = '5%';
                        subfieldtd2.style.direction = "rtl";
                        subfieldtr.appendChild(subfieldtd2);
                        subfieldtr.appendChild(subfieldtd1);
                        //


                        subfieldsAcordion.appendChild(subfieldButtonTable);
                    }
                    document.getElementById('subfieldsForm').style.display = 'block';
                    document.getElementById('filterAutocompleteForm').style.display = 'none';
                    document.getElementById('sliderform').style.display = 'none';
                    document.getElementById('timeSliderform').style.display = 'none';
                    document.getElementById('filterFreeText').style.display = 'none';
                    openFieldFilter(filename, fieldname, fieldtype, identifyLayers);
                    document.getElementById('dateFilterForm').style.display = 'none';
                }
                else
                    openFieldFilter(filename, fieldname, fieldtype, identifyLayers);

            };
            //var arrow = document.createElement('i');
            //arrow.setAttribute('class', 'arrow_left');
            //fieldButton.appendChild(arrow);
            var buttonTable = document.createElement('table');
            buttonTable.style.width = '100%';

            var buttontr = document.createElement('tr');
            buttonTable.appendChild(buttontr);
            var buttontd1 = document.createElement('td');
            buttontd1.appendChild(fieldButton);
            buttontd1.style.width = '80%';
            var buttontd2 = document.createElement('td');


            var cancelfieldImg = document.createElement("img");
            cancelfieldImg.title = "לחץ לביטול הסינון";
            cancelfieldImg.id = "cancel$" + lname + "$" + FilterFieldsList[lname][i];
            cancelfieldImg.style.cursor = "pointer";
            cancelfieldImg.src = "icons/cancel.png";
                       
            //var lblCancelFltr = document.createElement('label');
            //lblCancelFltr.setAttribute('width', '15%');
            //lblCancelFltr.innerText = "בטל";
            //lblCancelFltr.title = "לחץ לביטול הסינון";
            //lblCancelFltr.style.color = 'fuchsia';
            //lblCancelFltr.id = "cancel$" + lname + "$" + identifyFields[lname][i];
            //lblCancelFltr.style.cursor = "pointer";
            // check if we already filtered this layer and field before
            
            var fldwasfiltered = fieldWasFiltered(lname, curField, fieldFilterSqlArray);
            var ff = document.getElementById(lname + "_" + FilterFieldsList[lname][i]);
            if (fldwasfiltered == true) {
                cancelfieldImg.style.display = "block";
                
                fieldButton.style.color = "white";
                fieldButton.style.backgroundColor = "rgba(31, 54, 90, 1)";
            }
            else
            {
                cancelfieldImg.style.display = "none";
               
            }
            

            cancelfieldImg.onclick = function () {
                deductFieldFromFilter(this, identifyLayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                this.display = "none";
            };
            buttontd2.appendChild(cancelfieldImg);
            buttontd2.style.direction = "rtl";
            buttontd2.style.width = '15%';
            buttontr.appendChild(buttontd2);
            buttontr.appendChild(buttontd1);
            //buttondiv.appendChild(lblCancelFltr);
            //buttondiv.appendChild(fieldButton);
            AccordionDiv.appendChild(buttonTable);
        }
       
    }
   
   
    
}
function getFieldID(lname, fname)
{
    var fields = identifyFields[lname];
    for (i = 0; i < fields.length; i++)
    {
        if (fname == fields[i])
            return i;
    }
    return -1;
}

function getDataFromServerCity( fieldname, filename, identifyLayers, SQTHCitylist, SQIDlist) {

    
    var url = checkUrl() + "/autocompleteField";

    var info = {
        fieldname: fieldname,
        filename: filename


    };
    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {

            
            SQTHCitylist.length = 0;
            
            document.getElementById('SQCityTypeHead').value = '';
            SQIDlist.length = 0;
            

            var value;
            for (i = 1; i < data.length; i++) {
                if (data[i].value != null)
                {
                    value = data[i].value;
                    if (SQTHCitylist.includes(value) == false)
                    {
                        SQTHCitylist.push(value);
                        //SQIDlist.push({ key: value, value: data[i].id });
                        
                        SQIDlist[value] = data[i].id;
                    }
                 }

            }

            if (isNaN(SQTHCitylist[0]))
                SQTHCitylist.sort(); // sort string
            else
                SQTHCitylist.sort(function (a, b) { return a - b }); // sort number

            document.getElementById('SQTHCity').value = filename;
            filename = getLayerNameById(filename);
            fieldname = FieldNameById[filename + "_" + fieldname];
            
        });
}

function getDataFromServerJurisdictionArea(fieldname1, fieldname2, filename, identifyLayers, SQTHJurilist, SQJuriIDlist) {
        
    
    var url = checkUrl() + "/autocomplete2Fields";


    var info =
    {
        fieldname1: fieldname1,
        fieldname2: fieldname2,
        filename: filename
    };
    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {

            SQTHJurilist.length = 0;
            document.getElementById('SQJuriTypeHead').value = '';
            SQJuriIDlist.length = 0;

            var value;
            for (i = 1; i < data.length; i++)
            {
                if (data[i].value1 != null)
                {
                    if (SQTHJurilist.includes(data[i].value1) == false)
                    {
                        SQTHJurilist.push(data[i].value1);
                        SQJuriIDlist[data[i].value1] = data[i].value2;
                    }
                }

            }
            SQTHJurilist.sort(); // sort string
            
            

        });
}
function getDataFromServerGush( fieldname, filename, identifyLayers, SQTHGushlist, SQGushIDlist) {

    
    var url = checkUrl() + "/autocompleteField";

    var info = {
        fieldname: fieldname,
        filename: filename


    };
    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {


            SQTHGushlist.length = 0;

            document.getElementById('SQGushTypeHead').value = '';
            document.getElementById('SQHelkaTypeHead').value = '';
            
            SQIDlist.length = 0;


            var value;
            for (i = 1; i < data.length; i++) {
                if (data[i].value != null) {
                    value = data[i].value;
                    if (SQTHGushlist.includes(value) == false) {
                        SQTHGushlist.push(value);
                        //SQIDlist.push({ key: value, value: data[i].id });

                        SQGushIDlist[value] = data[i].id;
                    }
                }

            }

            if (isNaN(SQTHGushlist[0]))
                SQTHGushlist.sort(); // sort string
            else
                SQTHGushlist.sort(function (a, b) { return a - b }); // sort number

            document.getElementById('SQTHGush').value = filename;
            filename = getLayerNameById(filename);
            fieldname = FieldNameById[filename + "_" + fieldname];

        });
}

function getDataFromServerHelka( searchFld, searchVal,resFld,layer, identifyLayers, SQTHHelkalist, SQTHHelkaIDlist) {

    var searchfieldcode = getFieldID(layer, searchFld);
    var layercode = layerEngHeb[layer][1];
    var resFldcode = getFieldID(layer, resFld);
        
    var url = checkUrl() + "/valuebycondition";
    SQTHHelkalist.length = 0;
    $('#SQTHHelka .typeahead').typeahead('val', '');

    var info = {
        searchFld: searchfieldcode,
        searchVal: searchVal,
        resFld: resFldcode,
        layer: layercode
    };

    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {
            for (i = 0; i < data.length; i++)
            {
                if (data[i] != null)
                {
                    var intVal = parseInt(data[i]);
                    SQTHHelkalist.push(intVal);
                }
            }
            
        })

}


function getDataFromServer(fieldtype, fieldname, filename, identifyLayers, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var url = checkUrl() + "/autocompleteField";
    document.body.style.cursor = 'wait';
        
    var info = {
        fieldname: fieldname,
        filename: filename
       

    };
    $.ajax
        ({
            type: "POST",
            url: url ,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {

            fieldfilterlist.length = 0;
            fieldfilterIDlist.length = 0;
            document.getElementById('fieldfilterTypeaHead').value = '';


            var minVal;//= parseInt(data[0].value);
            var maxVal;//= parseInt(data[0].value);
            
            var value ;
            for (i = 0; i < data.length; i++)
            {
                if (data[i].value != null )
                {
                    value = data[i].value;
                    switch (fieldtype) {
                        case 2:
                            // with objectid
                            var id = data[i].id;
                            if (fieldfilterlist.includes(value) == false) {
                                fieldfilterlist.push(value);
                                fieldfilterIDlist[value] = id;
                            }
                            break;
                        case 3:
                            // without objectid
                            if (fieldfilterlist.includes(value) == false) {
                                fieldfilterlist.push(value);
                                //if (!fieldfilterlist.some(isNaN)) // if numeric array sort 
                                //{
                                //  fieldfilterlist.sort(function (a, b) {
                                //        return a - b;
                                //    });
                                //}
                                    
                                //BusStopsList.push(value);
                            }
                            break;
                        case 5:
                            //numeric range
                            if (isNaN(data[i].value) == false)
                            {
                                // first time 
                                if (maxVal == undefined)
                                {
                                    maxVal = data[i].value;
                                    minVal = data[i].value;
                                }
                                    

                                if (data[i].value > maxVal)
                                    maxVal = data[i].value;
                                if (data[i].value < minVal)
                                    minVal = data[i].value;
                            }
                            break;
                        case 6:
                            //date range
                            var currentdate;
                            if (data[i].value != null)
                            {
                                currentdate = data[i].value;
                                if (maxVal == undefined)
                                {
                                    maxVal = currentdate;
                                    minVal = currentdate;

                                }

                                if (currentdate > maxVal)
                                    maxVal = currentdate;
                                if (currentdate < minVal)
                                    minVal = currentdate;
                                
                                
                            }
                                                    
                            break;
                    }
                }
                
            }
            //if (!fieldfilterlist.some(isNaN)) // if numeric array sort 
            //if (fieldfilterlist.some(isNaN))
            //    fieldfilterlist.sort(); // sort string
            //else
            //{
            //    var tempArray =  fieldfilterlist.map(Number); // convert to numeric array
            //    tempArray.sort(function (a, b) { return a - b }); // sort number
            //    fieldfilterlist = [];
            //    fieldfilterlist = tempArray.slice();
            //}
            

            document.getElementById('fieldfilterlname').value = filename; 
            filename = getLayerNameById(filename);
            fieldname = FieldNameById[filename + "_" + fieldname];
            openFieldFilter(filename, fieldname, fieldtype, identifyLayers);  
            if (fieldtype==5  )
                createSlider(minVal, maxVal, "sliderform", "slider");
            else if (fieldtype == 7)
                createSlider(minVal, maxVal, "tiemSliderform", "timeSliderdiv");
            else if (fieldtype == 6)
            {
                document.getElementById("maxDateVal").value =  parseDateToString(maxVal);
                document.getElementById("minDateVal").value = parseDateToString(minVal);
                openDatePicker('maxDateVal', maxVal, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                openDatePicker('minDateVal', minVal, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
            }
            document.body.style.cursor = 'default';

        });
}




function openMetaDataFile(lname) {
    
    var filename=lname;
        
    fileFullname = "MetaData/" + filename + ".PDF";
    var link = document.createElement('a');
    link.setAttribute('href', fileFullname);
    link.setAttribute('target', "_blank");
    link.click();
        
}


function parseDateToString(thedate)
{
    if (thedate != undefined && thedate != null)
    {
        var dd = parseInt( new Date(thedate).getDate());
        var mm = parseInt( new Date(thedate).getMonth() + 1); //January is 0!
        var yyyy = parseInt(new Date(thedate).getFullYear());
        return (dd + "/" + mm + "/" + yyyy);
    }
    return "";
}
function createSlider(min,max,sliderform,slidertype)
{
    $("input.sliderValue[data-index=0]").val(min);
    $("input.sliderValue[data-index=1]").val(max);

    $('#' + slidertype).slider("option", "min", min);
    $('#' + slidertype).slider("option", "max", max);

    var minval = document.getElementById( slidertype +'MinVal');
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("change", false, true);
    minval.dispatchEvent(evt);
    var maxval = document.getElementById(slidertype+ 'MaxVal');
    maxval.dispatchEvent(evt);
    document.getElementById(sliderform).style.display = "block";
    document.getElementById("filterAutocompleteForm").style.display = "none";

    
    //$("#slider").slider("values", 0, 10);
    //borderradius: 16px
   // #background - color: #0db9f0;
    
}

function createDateSlider()
{
    
}

function layersByGroupLogic(group)
{
    //var groups = {};
    //groups['bus'] = 'אוטובוסים';
    //groups['train'] = 'רכבות';
    //groups['roads'] = 'דרכים';
    //groups['people'] = 'הסעת המונים';
    //groups['prefer'] = 'תשתיות העדפה';
    //groups['bycycle'] = 'אופניים';

    var gname = group.substring(0, group.length - 3);
    selectCarouselIMG(group);
    clearAllCheckedLayers(identifylayers);
    
    var groupnameHeb = GroupsEngHeb[gname];
    loadLayersbyGroup(groupnameHeb, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
    TurnGroupOfLayersOnOff(groupnameHeb, true, identifylayers); 
}

function loadLayersbyGroup(groupname, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems) // changed
{
    var AccordionDiv = document.getElementById("layersByGroupDiv");
    //var GroupHeader = document.getElementById('layersByGroupTableHeader');
    //GroupHeader.innerHTML = groupname;
    AccordionDiv.innerHTML = "";
    var accordionHTML = "";
    var counter = 1;
    
           
    for (var i in layersGroup)
    {
        if (i == groupname)
        {
            for (var j = 0; j < layersGroup[i].length; j++)
            {
                var lnameHeb = layersGroup[i][j];
                var lnameEng = layerHebEng[lnameHeb];
                var checkboxDiv = document.createElement("div");
                checkboxDiv.setAttribute('style', "border-bottom-color:lightgrey;border-bottom-style:solid;border-bottom-width:1px");
                checkboxDiv.setAttribute('id', 'chkDiv' + lnameEng);
                var checkbox = document.createElement('input');
                checkbox.setAttribute('type', 'checkbox');
                checkbox.setAttribute('id', 'chk' + lnameEng);

                checkbox.setAttribute('class', 'chkmodal');
                checkbox.setAttribute('value', 'a');
                checkbox.onclick = function (evt) {
                    turnlayerOnOff(this.id,this.checked, identifylayers);

                };

                var answerLabel = document.createElement('label');
                answerLabel.setAttribute('class', 'checkboxlabel');
                answerLabel.appendChild(document.createTextNode(" " + lnameHeb));
                answerLabel.setAttribute('id', 'lbl' + lnameEng);
                answerLabel.onclick = function () {
                    var checkboxtocheck = 'chk' + this.id.substring(3, this.id.length);
                    var checkedstatus = !(document.getElementById(checkboxtocheck).checked);
                    turnlayerOnOff(checkboxtocheck, checkedstatus, identifylayers);
                }
                // glyph identify
                var glyphI = document.createElement("IMG");
                glyphI.title = "מידע";
                glyphI.setAttribute("src", "icons/i_transparant.png");
                glyphI.setAttribute("width", "15");
                glyphI.setAttribute("height", "15");
                glyphI.style.marginTop = "3px";
                glyphI.style.position = 'absolute';

                glyphI.style.left = '60px';
                glyphI.style.visibility = "hidden";
                
                if (lnameHeb != 'סמן הכל')
                    glyphI.setAttribute('id', 'gi' + lnameEng);
                else
                    glyphI.setAttribute('id', lnameEng);
                                
                glyphI.onclick = function () {
                   // hideLayers();
                    openLayersInformation(this.id.substring(1,this.id.length));
                };
                // glyph download
                var glyphD = document.createElement("IMG");
                glyphD.title = "הורדת שכבה";
                glyphD.setAttribute("src", "icons/download_transparant.png");
                glyphD.setAttribute("width", "15");
                glyphD.setAttribute("height", "15");
                glyphD.style.marginTop = "3px";
                glyphD.style.position = 'absolute';
                glyphD.style.left = '0px';
                glyphD.style.visibility = "hidden";
   
                if (lnameHeb != 'סמן הכל')
                    glyphD.setAttribute('id', 'gd' + lnameEng);
                else
                    glyphD.setAttribute('id', lnameEng);

                
                glyphD.onclick = function () {
                    //hideLayers();
                    openLayerDownload(this.id.substring(1, this.id.length));
                };
                // glyph focus
                var glyphF = document.createElement("IMG");
                glyphF.title = "התמקדות לשכבה";
                glyphF.setAttribute("src", "icons/zoomto_transparant.png");
                glyphF.setAttribute("width", "15");
                glyphF.setAttribute("height", "15");
                glyphF.style.marginTop = "3px";
                glyphF.style.position = 'absolute';
                glyphF.style.left = '20px';
                glyphF.style.visibility = "hidden";
                if (lnameHeb != 'סמן הכל')
                    glyphF.setAttribute('id', 'gf' + lnameEng);
                else
                    glyphF.setAttribute('id', lnameEng);
                
                
                glyphF.onclick = function () {
                    ZoomToLayer1(this.id.substring(1, this.id.length));
                };
                // glyph filter
                var glyphT = document.createElement("IMG");
                glyphT.title = "סינון שכבה";
                glyphT.setAttribute("src", "icons/filter_transparant.png");
                glyphT.setAttribute("width", "15");
                glyphT.setAttribute("height", "15");
                glyphT.style.marginTop = "3px";
                glyphT.style.position = 'absolute';
                glyphT.style.left = '40px';
                glyphT.style.visibility = "hidden";

                glyphT.setAttribute('id', "gt" +  lnameEng);
                glyphT.onclick = function () {
                   // openSearchLayer();
                    var tname1 = this.id.substring(1, this.id.length);
                    var tname = this.id.substring(2, this.id.length);
                    if (identifyFields[tname] != undefined)
                    {
                        openLayersFilter(tname1);
                        buildFielFiltedList(tname1, identifylayers, fieldFilterSqlArray, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    }
                     
                };
            checkboxDiv.appendChild(glyphT);
            checkboxDiv.appendChild(glyphF);
            checkboxDiv.appendChild(glyphI);
            checkboxDiv.appendChild(glyphD);
            checkboxDiv.appendChild(answerLabel);
            checkboxDiv.appendChild(checkbox);
                //checkboxDiv.appendChild(glyphT);
                //checkboxDiv.appendChild(glyphF);
                //checkboxDiv.appendChild(glyphI);
                //checkboxDiv.appendChild(glyphD);
                //checkboxDiv.appendChild(answerLabel);
                //checkboxDiv.appendChild(checkbox);

                checkboxDiv.onmouseenter = function (evt)
                {
                    
                    this.style.backgroundColor = "rgba(242, 244, 250, 1)";
                    if (this.id.substring(6, this.id.length) != "undefined")
                        showLayerPossibilities("", this, "g", fieldFilterSqlArray);
                };

                checkboxDiv.onmouseleave = function (evt)
                {
                    this.style.backgroundColor = "rgba(255, 255, 255, .4)";
                    if (this.id.substring(6, this.id.length) != "undefined")
                        hideLayerPossibilities("", this,"g");
                };

                AccordionDiv.appendChild(checkboxDiv);
            }
            
            break;
        }
    }
}

function runScript(e) {

    
   
    var thep = document.getElementById("additionalresults");
    thep.style.display = 'none';
    document.getElementById("closeAditionalResults").style.display = 'none';
    if (e.keyCode == 13) {
        findAddress(heatmapLayer, heatmapField, drawTextData, drawTextItems);
    }
}


function turnOptionOnOff(id, star)
{
    switch (id)
    {
        case "optFilterbyName":
            {
                txtProjectNumber.disabled = true;
                txtProjectName.disabled = false;
                optNone.disabled = true;
                opttachatz.disabled = true;
                optroads.disabled = true;
                selectSubType.disabled = true;
                datepicker.disabled = true;
                checkTextEntered('txtProjectName', 'projectTab', 'פרויקט', star);
                
            }
            break;
        case "optFilterbyNumber":
            {
                txtProjectNumber.disabled = false;
                txtProjectName.disabled = true;
                optNone.disabled = true;
                opttachatz.disabled = true;
                optroads.disabled = true;
                selectSubType.disabled = true;
                datepicker.disabled = true;
                
                checkTextEntered('txtProjectNumber', 'projectTab', 'פרויקט', star);
                
            }
            break;
        case "optFilterbyDefinitions":
            {
                txtProjectNumber.disabled = true;
                txtProjectName.disabled = true;
                optNone.disabled = false;
                opttachatz.disabled = false;
                optroads.disabled = false;
                selectSubType.disabled = false;
                datepicker.disabled = false;
        

                if (optNone.checked && selectSubType.value == '' && datepicker.value == "")
                    document.getElementById('projectTab').innerHTML = "פרויקט";
                else
                {
                    var currentText = document.getElementById('projectTab').innerHTML;
        
                    document.getElementById('projectTab').innerHTML = "פרויקט" + star;
                }

            }
            
    }
        
}
function restrictTextToHebrewLetters(e)
{
     //1488 -1514 hebrew text 44,45,46,58 
    var text = document.getElementById("txtDraw").value;
    
    var keynum = e.key.charCodeAt(0);
    if ((keynum > 1487 && keynum < 1515) || (keynum == 44) || (keynum == 45) || (keynum == 46) || (keynum == 58) || (keynum == 32) || (keynum == 68) || (keynum == 66) || (keynum == 83))
    {
        if (text.length == 25) // restrict to 25 chars 
        {
            if (keynum != 66 && keynum !==68) // make sure it is not delete key
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        // continue
    }
    else
    {
        e.preventDefault();
        e.stopPropagation();
        return;
    }
  
   
    //var x = event.which || event.keyCode;
    //if (window.event) { // IE                  
    //    //keynum = e.keyCode;
    
    //} else if (e.which) { // Netscape/Firefox/Opera                 
    //    keynum = e.which;
    //}

    //alert(String.fromCharCode(keynum));
}
function restrictTextToNumbers(e)
{
    var keynum = e.key.charCodeAt(0);
    if (keynum != 66 && keynum !== 68) // make sure it is not delete key 
    {

        var validkeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        if (validkeys.indexOf(e.key) < 0) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        else
            document.getElementById("bufferError").innerHTML = "";
        
    }
    
        
}
function checkTextEntered(textboxname, tabName, tabNameHeb, star)
{
    if (document.getElementById(textboxname).value.length > 0) {
        var currentText = document.getElementById('projectTab').innerHTML;
        
        document.getElementById(tabName).innerHTML = tabNameHeb + star;
    }
    else
        document.getElementById(tabName).innerHTML = tabNameHeb;
}
function turnSubProjOnOff(id, levels, star)
{
    switch(id)
    {
        case "optSubproject":
            {
                txtsubproject.disabled = false;
                btnPrimaryplan.disabled = true;
                btnEarlyplan.disabled = true;
                btnDetailedplan.disabled = true;
                btnAuction.disabled = true;
                btnImplementation.disabled = true;
                btnAcountClosing.disabled = true;
                txtMileStone.disabled = true;
                txtQuarter.disabled =  true;
                checkTextEntered('txtsubproject', 'subProjectTab', 'תת פרויקט', star);
            }
            break;
        case "optSubprojectMS":
            {
                txtsubproject.disabled = true;
                btnPrimaryplan.disabled = true;
                btnEarlyplan.disabled = true;
                btnDetailedplan.disabled = true;
                btnAuction.disabled = true;
                btnImplementation.disabled = true;
                btnAcountClosing.disabled = true;
                txtMileStone.disabled = false;
                checkTextEntered('txtMileStone', 'subProjectTab', 'תת פרויקט', star);
            }
            break;
        case "optSubprojectlevel":
            {
                txtsubproject.disabled = true;
                btnPrimaryplan.disabled = false;
                btnEarlyplan.disabled = false;
                btnDetailedplan.disabled = false;
                btnAuction.disabled = false;
                btnImplementation.disabled = false;
                btnAcountClosing.disabled = false;
                txtMileStone.disabled = false;
                txtQuarter.disabled = false;
                if (levels.length > 0)
                {
                    var currentText = document.getElementById('subProjectTab').innerHTML;
                    document.getElementById('subProjectTab').innerHTML = 'תת פרוייקט' + star;
                }
                else
                {
                    document.getElementById('subProjectTab').innerHTML = 'תת פרוייקט';
                }
            }
    }
}
function changeTabColor(obj)
{
    
    document.getElementById("homeTab").style.color= 'black';
    document.getElementById("homeTab").style.backgroundColor = '';
    document.getElementById("projectTab").style.color = 'black';
    document.getElementById("projectTab").style.backgroundColor = '';
    document.getElementById("subProjectTab").style.color = 'black';
    document.getElementById("subProjectTab").style.backgroundColor = '';
    document.getElementById("locationTab").style.color = 'black';
    document.getElementById("locationTab").style.backgroundColor = '';

    obj.style.backgroundColor = 'rgb(210,222,242)';
}
function OnKeyPressed(val, tabName, tabNameHeb, star)
{
    if(val.length>0)
    {
        var currentText = document.getElementById(tabName).innerHTML;
        document.getElementById(tabName).innerHTML = tabNameHeb + star;
    }
    else
    {
        document.getElementById(tabName).innerHTML = tabNameHeb;
    }
        
}

function definitionRadioSelect(id,star)
{
    var currentText;
    switch (id)
    {
        case "optNone":
            if(selectSubType.value == '' && datepicker.value == '')
                document.getElementById('projectTab').innerHTML = "פרויקט";

            break;
        case "opttachatz":
            {
                currentText = document.getElementById('projectTab').innerHTML;
                document.getElementById('projectTab').innerHTML = "פרויקט" + star;
            }
            break;
        case "optroads":
            {
                currentText = document.getElementById('projectTab').innerHTML;
                document.getElementById('projectTab').innerHTML = "פרויקט" + star;
            }
            break;

    }
        
}
function SelectChanged( star)
{
    
    if (selectSubType.value == "" && datepicker.value == "" && optNone.checked)
    {
        document.getElementById('projectTab').innerHTML = "פרויקט";
    }
    else
    {
        var currentText = document.getElementById('projectTab').innerHTML;
        document.getElementById('projectTab').innerHTML = "פרויקט" + star;
    }
}
function drawPolygonFromPoints(identifylayers)
{
    turnOneLyrOn("SUB_GUSH_ALL", identifylayers,'down');
    ZoomToLayer1("SUB_GUSH_ALL");
    
    clickEventType.value = "drawpolygonTest";
    govmap.draw(govmap.drawType.Point).progress(function (response) {


        var pt = response.wkt;
        
        var first = pt.indexOf('(');
        var last = pt.indexOf(')'); 
        var point = pt.substr(first + 1, last-1);
        var x = point.split(" ")[0];
        var y = point.split(" ")[1];
        var params = {
            LayerName: 'SUB_GUSH_ALL',
            Point: { x: x, y: y },
            Radius: 1
        };
        
        var point1 = "POINT (" + x + " " + y + ")";
        
        govmap.intersectFeatures({ 'geometry': pt, 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: true, 'whereClause': '' })
            .then(function (e) {
                if (e.data != null && e.data.length > 0) {
                    
                    var geo = e.data[0].Values[2];
        
                    var simlifiedGeo = [];
                    simlifiedGeo.push(geo);
                    drawPolygon(simlifiedGeo,false);
                }
            }, function (err) {
                var error1 = err;
            });
       
    });

    
}
function drawPoint(geometry)
{
    var wkts = [];
    wkts.push(geometry);
    var data =
    {
        wkts: wkts,
        names: [],
        geometryType: govmap.drawType.Point,
        defaultSymbol:
        {
            
            outlineColor: [255, 99, 71, 0.5],
            outlineWidth:2,
            fillColor: [255, 99, 71, 0.5]
        },
        symbols: [],
        clearExisting: false,
        data:
        {
            tooltips: [],
            headers: [],
            bubbleHTML: "",
            bubbleHTMLParameters: [[], []]
        }
    };
    govmap.displayGeometries(data).then(function (response) {
       // govmap.zoomToDrawing();
    });
    
}

function drawPolygon(geometry) {
    var wkts = [];
    wkts.push(geometry);
    var data =
    {
        wkts: wkts,
        names: [],
        geometryType: govmap.drawType.Polygon,
        defaultSymbol:
        {
            outlineColor: [255, 99, 71, 0.5],
            outlineWidth: 2,
            fillColor: [255, 99, 71, 0.5]
        },
        symbols: [],
        clearExisting: false,
        data:
        {
            tooltips: [],
            headers: [],
            bubbleHTML: "",
            bubbleHTMLParameters: [[], []]
        }
    };
    govmap.displayGeometries(data).then(function (response) {
       
        
    });
    govmap.clearDrawings();
}
function clearSpecificGeometry()
{
    govmap.draw(govmap.drawType.Point).progress(function (response) {

        var pt = response.wkt;
    });

    govmap.clearGeometriesByName(['p1', 'p2']);

}
function clearProjectButtonSelection(dates, homeTabStatus, subProjectTabStatus, filteredLayers)
{

    homeTabStatus.value = 0;
    subProjectTabStatus.value = 0;
    document.getElementById('homeTab').innerHTML = 'תאגיד';
    document.getElementById('subProjectTab').innerHTML = 'תת פרויקט';
    document.getElementById('projectTab').innerHTML = 'פרויקט';
    document.getElementById('locationTab').innerHTML = 'מיקום';

    $('#homeTabContent input[type="button"]').each(function () {
        if (this.name.length > 0)
        {
            changecss(this.id, homeTabStatus, star);
        }
    });
   
    $('#subProjectTabContent input[type="button"]').each(function () {
        if (this.name.length > 0) {
            changecss1(this.id, subProjectTabStatus, star);
        }
    });


    
    $('#txtProjectNumber').val('');
    $('#txtProjectName').val('');
    $('#txtsubproject').val('');
    $('#txtMileStone').val('');
    $('#selectSubType').val('');
    $("#txtroadNumber").val('');
    $("#txtQuarter").val('');
    $("#txtmuniName").val('');
    $("#datepicker").val('');

    
    $('input:radio[id=optFilterbyName]')[0].checked = true;
    $("#optFilterbyName").click();
    $('input:radio[id=optNone]')[0].checked = true;
    $('input:radio[id=optSubproject]')[0].checked = true;
    $("#optSubproject").click();
    
    
    $('#txtSearchLayerValueSpatialProject').val('');
    
    clearFilteredLayers(filteredLayers);
}
function ClearDate(dates)
{

}
function openDatePicker(pickerName, tmpDate, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var value = new Date(tmpDate);
    var minDay = value.getDate();
    var minMonth = value.getMonth() + 1;
    var minYear = value.getFullYear();
    var stringDate = minMonth.toString() + "/" + minDay.toString() + "/" + minYear.toString();
    var computedDate = new Date("'" + stringDate + "'");
    //if("#"+ pickerName)
    $("#" + pickerName).datepicker("destroy");
    $("#" + pickerName).datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        //beforeShowDay: enableAllTheseDays,
        //defaultDate: new Date('7/1/2014'),
        defaultDate: computedDate,
        onSelect: function (date, inst)
        {
            //2015-01-12
            //selectedDate = $.datepicker.formatDate("dd/mm/yy", $(this).datepicker('getDate'));
            selectedDate = $.datepicker.formatDate("yy-dd-mm", $(this).datepicker('getDate'));
            filterLayerbyDate(selectedDate, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        }
    });

}

function minimizeModal(modalname,modalNameheb)
{
    $("#" + modalname).modal('hide');
    $("#minimized" + modalname + "Label").html(modalNameheb);
    $("#minimized" + modalname).css("visibility", "visible");

}
function maximizeModal(modalname)
{
    $("#" + modalname).modal('show');
    $("#minimized" + modalname + "Label").html("");
    $("#minimized" + modalname).css("visibility", "hidden");
}
function clearresultspane()
{

    var AccordionDiv = document.getElementById("identifyAccordionNew");
    AccordionDiv.innerHTML = "";
    $('#idresultsTDNew').empty();

}
function disableLegend() {
   
    var lgn = document.querySelector('body > div.layers.itemNav.ng-scope');
    
}

function hidelayersposibilities()
{
    $('#layersModal').modal('show');
    $('#layersposibilities').modal('hide'); 
}
function checklayerVisibility(name)
{
    var currentScale = parseInt(document.getElementById('scale_p').innerHTML.split(":")[1]);
    if (name !== "" && LayerData[name][0] > 0 && LayerData[name][0] < currentScale ) {
        message = document.getElementById('infoModalMessageDiv');
        message.style.visibility = 'visible';
        setTimeout(clearLayervisibilityMessage, 5000);
    }
    else
    {
        message = document.getElementById('infoModalMessageDiv');
        message.style.visibility = 'hidden';
    }
}

function clearLayervisibilityMessage()
{
    var message = document.getElementById('infoModalMessageDiv');
    //message.style.visibility = 'hidden';
    message.style.visibility = 'hidden';
}


function hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    //exportToExcel('dataTable1');
    document.getElementById("watermrk").style.bottom = "5%";
    document.getElementById("scaleInMeters").style.bottom = "50px";
    document.getElementById("scaleUnit").style.bottom = "50px";
    document.getElementById("scale1").style.bottom = "45px";
    document.getElementById("scale2").style.bottom = "45px";
    document.getElementById("scale3").style.bottom = "45px";
    document.getElementById("scale4").style.bottom = "45px";
    document.getElementById('dataTableModal').style.height = "0%";
    if (document.getElementById('headerTable')!== null) {
        document.getElementById('headerTable').style.height = "0%";
        document.getElementById('headerTable').innerHTML = '';
        
    }
    if (document.getElementById('dataTable1') !==null)
    {
        document.getElementById('dataTable1').style.height = "0%";
    }
    document.getElementById("map_div").className = "mapdivbig";

    currentDataTableLayerName = "";
    //document.getElementById("layerInformation").className = 'rightPanelBig';
    //document.getElementById("layers").className = 'rightPanelBig';

    document.getElementById("layerInformation").className = "rightPanelBig";
    document.getElementById("layerDownload").className = "rightPanelBig";
    document.getElementById("layersFilter").className = "rightPanelBig";
    document.getElementById("fieldFilter").className = "rightPanelBig";
    document.getElementById("layers").className = "rightPanelBig";
    document.getElementById("spatialDiv").className = "rightPanelBig";
    document.getElementById("renderer").className = "rightPanelBig";
    //document.getElementById("statisticsDiv").className = "rightPanelBig";
    document.getElementById('statisticsDiv').style.width = "0%";
    //document.getElementById('statisticsDiv').style.width = "0%";
    // clear selected datatable row id 
    
   // clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
    selectedIDInDatatable.value = '';
    slectedLayerInDatatable.value = '';
    //table.style.position = '';
    document.getElementById('bgOptionsDiv').style.bottom = "32px";
    
}
function reshapeMapToFitIdentifyInfo(lname, data, arrowDirection, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName,clearDrawings)
{
    document.getElementById("map_div").className = "mapdivsmall";
    document.getElementById("layerInformation").className = "rightPanelSmall";
    document.getElementById("layers").className = "rightPanelSmall";
    document.getElementById("layersFilter").className = "rightPanelSmall";
    document.getElementById("fieldFilter").className = "rightPanelSmall";
    document.getElementById("layerDownload").className = "rightPanelSmall";
   // document.getElementById("BufferDiv").className = "rightPanelSmall";

    //document.getElementById('layerInformation').style.width = '0%';
   //document.getElementById('layers').style.width = '0%';

    document.getElementById("watermrk").style.bottom = "35%";
    document.getElementById("scaleInMeters").style.bottom = "35%";
    document.getElementById("scaleUnit").style.bottom = "35%";
    document.getElementById("scale1").style.bottom = "34%";
    document.getElementById("scale2").style.bottom = "34%";
    document.getElementById("scale3").style.bottom = "34%";
    document.getElementById("scale4").style.bottom = "34%";
    document.getElementById('dataTableModal').style.height = "30%";

    document.getElementById('bgOptionsDiv').style.bottom = "35%";



    var headerTable = document.createElement('TABLE');
    headerTable.style.backgroundColor = "white";
    headerTable.style.textAlign = 'right';
    headerTable.style.width = '100%';
    //headerTable.style.position = 'fixed';
    headerTable.style.height = "100%";
    headerTable.id = "headerTable";

    tableBody = document.createElement('TBODY');
    tableBody.style.width = '100%';
    headerTable.appendChild(tableBody);
    var tr = document.createElement('TR');
    tr.style.width = '100%';
    tr.style.borderStyle = 'solid';
    tr.style.borderWidth = '1px';
    tr.style.borderColor = 'lightgrey';

    
    //var closeIMG = document.createElement('img');
    
    //closeIMG.setAttribute('src', 'icons/closeButton.png');
    //closeIMG.style.height = '13px';
    //closeIMG.style.width = '13px';

    
    th = document.createElement('TH');
    th.style.fontWeight = "100";
    th.style.width = '1.5%';
    th.title = "סגור טבלה";
    th.appendChild(document.createTextNode('X'));
    th.onmouseover = function () {
        this.style.cursor = "pointer";
    };
    th.onclick = function () {
        hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);

    };
    tr.appendChild(th);
    th = document.createElement('TH');
    th.style.fontWeight = "100";
    th.style.width = '1.5%';
    th.title = "מזער טבלה";
    th.appendChild(document.createTextNode('-'));
    th.onmouseover = function () {
        this.style.cursor = "pointer";
    };
    th.onclick = function () {
        document.getElementById("btnMaximiseInfoTable").style.display = "block";
        minimiseInfoTable(heatmapLayer, heatmapField, drawTextData, drawTextItems);

    };
    tr.appendChild(th);

    th = document.createElement('TH');
    th.style.fontWeight = "100";
    th.style.width = '30%';
    
    var numoffeatures = 0;
    for (j = 0; j < data.length; j++)
    {
        if (data[j].layer == lname)
        {
            numoffeatures = data[j].data.length;
            break;
        }
    }
    if (numoffeatures == 500)
        th.innerHTML = 'המערכת מחזירה 500 רשומות ראשונות';
    else
        th.innerHTML = "";
    th.style.color = 'red';
    //
    tr.appendChild(th);
    
    th = document.createElement('TH');
    th.style.fontWeight = "100";
    th.style.width = '20%';

    tr.appendChild(th);
    //
    th = document.createElement('TH');
    th.style.fontWeight = "100";
    th.style.width = '10%';
    th.style.fontSize = '13px';
    th.style.fontFamily = "Alef-Regular";
    th.fontWeight = "100";
    th.style.color = 'black';//'rgba(142, 158, 183, 1)';
    th.style.cursor = 'pointer';
    th.appendChild(document.createTextNode('(CSV) הורדת טבלה '))
    th.title = 'הורדת טבלת נתונים בפורמט אקסל';
    th.onclick = function ()
    {
        exportToExcel('identify');
    }
    tr.appendChild(th);

    //
    th = document.createElement('TH');
    th.style.fontWeight = "100";
    var excelButton = document.createElement('img');
    excelButton.setAttribute('id', 'btnExcelidentify');
    excelButton.style.width = '19px';
    excelButton.style.height = '19px';
    excelButton.src = 'icons/download.png'
    excelButton.style.cursor = 'pointer';
    excelButton.title = 'הורדת טבלת נתונים בפורמט אקסל ';
   
    excelButton.onclick = function () {
        exportToExcel('identify');
    }
    th.appendChild(excelButton);
    th.style.textAlign = 'center';
    th.style.width = '2%';
    tr.appendChild(th);
    //
    tr.appendChild(th);
    th = document.createElement('TH');
    th.style.fontWeight = "100";
    th.style.width = '5%';
    tr.appendChild(th);

    th = document.createElement('TH');
    var searchDiv = document.createElement('div');
    searchDiv.classList.add('input-group');
    var select = document.getElementById('identifylayerselect');
    if (select == undefined) {
        select = document.createElement("select");
        select.id = 'identifylayerselect';
        select.style.fontFamily = 'Alef-Regular';
        select.style.fontWeight = 'normal';
        select.style.width = '100%';
        select.style.height = '80%';
        select.style.textAlign = 'right';
        select.style.direction = 'rtl';
    }
    var lnameheb = layerEngHeb[lname][0];

    if (select.innerHTML.indexOf(lnameheb) == -1) {
        var opt = document.createElement('option');
        opt.value = lnameheb;
        opt.text = lnameheb;
        select.appendChild(opt);
        select.selectedIndex = select.length - 1;
    }

    select.onchange = function () {
        var selectedlayer = select.options[select.selectedIndex].value;
        DisplayIdentifyresults(data, layerHebEng[selectedlayer], identifylayers, arrowDirection, "all", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems,clearDrawings);
        document.getElementById('statisticsDiv').style.width = "0%";
    };
    searchDiv.appendChild(select);
    th.appendChild(searchDiv);

    if (lname != 'BUSROUTESTATIONS' && lname != 'BUSROUTES')
    {
       // th.style.width = '40%';
       // th.style.display = "block";
    }
    else if (lname == 'BUSROUTESTATIONS')
    {
        th.style.width = '0%';
        th.style.display = "none";
        tr.appendChild(th);
        th = document.createElement('TH');
        var busNumber = currentBusName.split("@@@")[0];
        var busDesc = currentBusName.split("@@@")[1];
        th.style.textAlign = 'right' ;
        th.appendChild(document.createTextNode('  תחנות קו אוטובוס מספר:  ' + " " + busNumber + "   " + busDesc)); 
        th.style.width = '35%';
        th.style.fontWeight = "800";
        th.style.fontSize = "11pt";
    }
    else if (lname == 'BUSROUTES')
    {
        th.style.width = '0%';
        th.style.display = "none";
        tr.appendChild(th);
        th = document.createElement('TH');
        var busStopNumber = currentBusStopName.split("@@@")[0];
        var busStopDesc = currentBusStopName.split("@@@")[1];
        th.appendChild(document.createTextNode('   אוטובוסים שעוצרים בתחנה :    ' + " " + busStopNumber + " ,מקט-" + busStopDesc));
        th.style.textAlign = 'right';
        th.style.width = '35%';
        th.style.fontWeight = "800";
        th.style.fontSize = "11pt";
    }
    th.style.paddingRight = '5px';
    
    
    tr.appendChild(th);


    th = document.createElement('TH');
    th.style.fontWeight = "800";
    th.id = 'dtableName';
    if (lname != 'BUSROUTESTATIONS' && lname != 'BUSROUTES' && lname !='ROUTING') {
        th.appendChild(document.createTextNode('זיהוי נתונים'));
        th.style.width = '10%';
    }
    else 
        th.style.width = '0%';
   
    th.style.textAlign = 'right';
    th.style.fontSize = "11pt";
    
    tr.appendChild(th);
    th = document.createElement('TH');
    th.style.width = '2%';
    tr.appendChild(th);
    //

    //

    tableBody.appendChild(tr);
    var header = document.getElementById('dataTableModalHeader');
    header.innerHTML = '';
    header.appendChild(headerTable);

}

function createIdentifyTabeleInfoHeader(layerName)
{
    var lnameheb = layerEngHeb[layerName][0];
    var lname = layerName;
    
    var headerTable = document.createElement('TABLE');
    headerTable.style.backgroundColor = "white";
    headerTable.style.textAlign = 'right';
    headerTable.style.width = '100%';
    //headerTable.style.position = 'fixed';
    headerTable.style.height = '100%';
    headerTable.id = "headerTable";

    tableBody = document.createElement('TBODY');
    tableBody.style.width = '100%';
    headerTable.appendChild(tableBody);
    var tr = document.createElement('TR');
    tr.style.width = '100%';
    tr.style.borderStyle = 'solid';
    tr.style.borderWidth = '1.5px';
    tr.style.borderColor = 'black';

    th = document.createElement('TH');
    th.style.width = '3%';
    th.appendChild(document.createTextNode('X'));
    th.onmouseover = function () {
        this.style.cursor = "pointer";
    };
    th.onclick = function () {
        hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);
    };
    tr.appendChild(th);
    th = document.createElement('TH');
    th.style.width = '45%';
    tr.appendChild(th);

    th = document.createElement('TH');
    th.id = 'dtableName';
    th.appendChild(document.createTextNode(' זיהוי נתונים : '));
    th.style.fontSize = "12pt";
    th.style.width = '20%';
    tr.appendChild(th);
    th = document.createElement('TH');

    var select = document.createElement('select');
    select.id = 'lnmaneselect';
    select.style.height = '80%';
    th.appendChild(select);
    th.style.width = '20%';
    tr.appendChild(th);
    //

    //

    tableBody.appendChild(tr);
    var header = document.getElementById('dataTableModalHeader');
    header.innerHTML = '';
    header.appendChild(headerTable);
}
function reshapeMapToFitTableInfo(checked, numoffeatures, withExtentCheckbox, lname, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable,panorama)
{
   
    document.getElementById("map_div").className = "mapdivsmall";
    document.getElementById("layerInformation").className = "rightPanelSmall";
    document.getElementById("layers").className = "rightPanelSmall";
    document.getElementById("layersFilter").className = "rightPanelSmall";
    document.getElementById("fieldFilter").className = "rightPanelSmall";
    document.getElementById("layerDownload").className = "rightPanelSmall";
   // document.getElementById("Queries").className = "rightPanelSmall";
    

    
    //document.getElementById('layerInformation').style.width = '0%';
    //document.getElementById('layers').style.width = '0%';
    //document.getElementById("layersFilter").style.width = "0%";
    //document.getElementById("fieldFilter").style.width = "0%";
    //document.getElementById("layerDownload").style.width = "0%";

    document.getElementById("watermrk").style.bottom = "35%";
    document.getElementById("scaleInMeters").style.bottom = "35%";
    document.getElementById("scaleUnit").style.bottom = "35%";
    document.getElementById("scale1").style.bottom = "34%";
    document.getElementById("scale2").style.bottom = "34%";
    document.getElementById("scale3").style.bottom = "34%";
    document.getElementById("scale4").style.bottom = "34%";
    document.getElementById('dataTableModal').style.height = "30%";

    document.getElementById('bgOptionsDiv').style.bottom = "35%";

    //
    //var lnameheb = document.getElementById('layerInformationHeader').innerHTML;
     var lnameheb = layerEngHeb[lname][0];

    //if (document.getElementById('headerTable') == null || document.getElementById('headerTable').innerHTML == '')
    //{
        var headerTable = document.createElement('TABLE');
        headerTable.style.backgroundColor = "white";
        headerTable.style.textAlign = 'right';
        headerTable.style.width = '100%';
        //headerTable.style.position = 'fixed';
        headerTable.style.height = '100%';
        headerTable.id = "headerTable";

        tableBody = document.createElement('TBODY');
        tableBody.style.width = '100%';
        headerTable.appendChild(tableBody);
        var tr = document.createElement('TR');
        tr.style.width = '100%';
        tr.style.borderStyle = 'solid';
        tr.style.borderWidth = '1px';
        tr.style.borderColor = 'lightgrey';

        th = document.createElement('TH');
        th.style.fontWeight = "100";
        th.style.width = '1.5%';
        th.title = "סגור טבלה";
        th.appendChild(document.createTextNode('X'));
        th.onmouseover = function () {
            this.style.cursor = "pointer";
        };
        th.onclick = function () {
            hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        };
        tr.appendChild(th);
        th = document.createElement('TH');
        th.style.fontWeight = "100";
        th.style.fontSize = "15px";
        th.style.width = '1.5%';
        th.appendChild(document.createTextNode('-'));
        th.title = "מזער טבלה";
        th.onmouseover = function () {
            this.style.cursor = "pointer";
        };
        th.onclick = function () {
            document.getElementById("btnMaximiseInfoTable").style.display = "block";
            minimiseInfoTable(heatmapLayer, heatmapField, drawTextData, drawTextItems);
        };
        tr.appendChild(th);




        th = document.createElement('TH');
        th.style.fontWeight = "100";
        th.style.width = '15%';
        if (numoffeatures == 500)
            th.innerHTML = 'המערכת מחזירה 500 רשומות ראשונות';
        else
        th.innerHTML = "";
        th.style.color = 'red';
        th.style.fontWeight = '100';
        tr.appendChild(th);
        
        th = document.createElement('TH');
        th.style.fontWeight = "100";
        th.style.width = '17%';
        th.innerHTML = ' הצג רק ערכים בתיחום ';
        th.style.textAlign = 'center';
        var chkfilter = document.createElement("input");
        chkfilter.type = "checkbox";
        chkfilter.id = 'chkfilterExtent';
        chkfilter.style.marginTop = '3px';
        chkfilter.onclick = function ()
        {
            showTable(currentDataTableLayerName, currentSortedColumn.value, 'down', this.checked, currentSortedColumn,selectedIDInDatatable,slectedLayerInDatatable,panorama,heatmapLayer,heatmapField,drawTextData,drawTextItems);
        }
        chkfilter.checked = checked;
        var chkfExtentlabel = document.createElement('label');
        chkfExtentlabel.htmlFor = 'chkfilterExtent';
        chkfExtentlabel.innerHTML = 'הצג רק ערכים שמופיעים בתיחום הנוכחי ';
        chkfExtentlabel.style.paddingRight = '10px';
        chkfExtentlabel.style.paddingTop = '5px';
       // th.appendChild(chkfExtentlabel);
        th.appendChild(chkfilter);
        // show chkfilterExtent only on showtable and not on displayidentifyresults
        if (withExtentCheckbox)
            tr.appendChild(th);
        //
        th = document.createElement('TH');
        th.style.fontWeight = "100";
        th.style.width = '10%';
        th.style.fontSize = '13px';
        th.style.fontFamily = "Alef-Regular";
       
        th.style.color = 'black';//'rgba(142, 158, 183, 1)';
        th.style.cursor = 'pointer';
        th.appendChild(document.createTextNode('(CSV) הורדת טבלה '))
        th.title = 'הורדת טבלת נתונים בפורמט אקסל';
        th.onclick = function ()
        {
            exportToExcel('datatable');
        }
        tr.appendChild(th);
        

        th = document.createElement('TH');
        th.style.fontWeight = "100";

        th.style.textAlign = 'center';
        th.style.width = '2%';
        var excelButton = document.createElement('img');
        excelButton.setAttribute('id', 'btnExcel');
        excelButton.style.width = '19px';
        excelButton.style.height = '19px';
        excelButton.src = 'icons/download.png'
        excelButton.style.cursor = 'pointer';
        excelButton.title = 'הורדת טבלת נתונים בפורמט אקסל';
        
        excelButton.onclick = function ()
        {
            exportToExcel('datatable');
        }
        th.appendChild(excelButton);
        tr.appendChild(th);
        //
        th = document.createElement('TH');
        th.style.fontWeight = "100";
        th.style.width = '5%';
        tr.appendChild(th);
        //
        th = document.createElement('TH');
        th.style.fontWeight = "100";
        var btn = document.createElement("input");
        btn.type = "button";
        btn.id = 'btndisableSearch';
        btn.value = "בטל";
        btn.onclick = function () {

           // showTable('cancel','all', arrowDirection,false);
            disableSearch();
        };

        btn.style.height = '80%';
        btn.style.width = '100%';
        th.appendChild(btn);
        th.style.width = '2.5%';
        tr.appendChild(th);


        th = document.createElement('TH');
        var searchDiv = document.createElement('div');
        searchDiv.classList.add('input-group');
        var txbox = document.createElement("input");
        txbox.type = "text";
        txbox.id = 'txtSearchTable';
        txbox.placeholder = 'חיפוש ערך בטבלת המאפיינים';
        txbox.style.width = '100%';
        txbox.style.height = '80%';

        txbox.style.textAlign = 'right';
        txbox.onkeyup = function (e) {
            if (enterKeyPressed(e))
                searchInTable();
        };

        var img = document.createElement('img');
        img.src = "icons/magnifier.png";
        img.style.backgroundRepeat = "no-repeat";
        img.style.left = '5%';
        img.style.top = '15%';
        img.style.width = '16px';
        img.style.height = '16px';
        img.style.position = 'absolute';
        img.style.cursor = 'pointer';
        img.title = 'חפש';
        img.onclick = function (e) {
            searchInTable();
        };
        searchDiv.appendChild(txbox);
        searchDiv.appendChild(img);
        th.appendChild(searchDiv);
        th.style.width = '15%';
        tr.appendChild(th);


        th = document.createElement('TH');
        th.id = 'dtableName';
        //th.style.nowrap = 'nowrap';
        //th.style.overflow = "hidden";
        th.appendChild(document.createTextNode(' טבלת מאפיינים : ' + lnameheb));
        th.style.fontSize = "11pt";
        th.style.fontWeight = "100";
        th.style.width = '30%';
        tr.appendChild(th);
        th = document.createElement('TH');
        th.style.width = '1%';
        tr.appendChild(th);
        //
       
        //

        tableBody.appendChild(tr);
        var header = document.getElementById('dataTableModalHeader');
        header.innerHTML = '';
        header.appendChild(headerTable);


        //objScroll = new SimpleBar(document.getElementById('dataTableModalBody'), { autoHide: false });
        //objScroll1 = new SimpleBar(document.getElementById('dataTable1'), { autoHide: false });
        //objScroll2 = new SimpleBar(document.getElementById('dataTableModal'), { autoHide: false });
}
function showTable(lNameSRC, id, arrowDirection, checked, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName)
{
    //test();
    //return;
    if (panorama != null)
    {
        panorama.setVisible(false);
    }
    
    var lnameheb = "";
    var stSD = 0;
    var stAvreage = 0;
    
    if (lNameSRC == 'fflname' || lNameSRC == 'layerInformationHeader' || lNameSRC =='statistoicsLayer')
        lnameheb = document.getElementById(lNameSRC).innerHTML;
    else
        lnameheb = layerEngHeb[lNameSRC][0];

    if (lnameheb == "") // in case we came from filter and not from TOC 
        lnameheb = document.getElementById("fflname").innerHTML;

    var lname = layerHebEng[lnameheb];
    currentDataTableLayerName = lname;
    
    // check if layer was filtered
    SQL = "";
    for (k = 0; k < fieldFilterSqlArray.length; k++) {
        if (fieldFilterSqlArray[k].lyr == lname) {
            //
                //
            if (SQL.length == 0)
                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1)
                    SQL = '(' + fieldFilterSqlArray[k].sql + ')';
                else
                    SQL = fieldFilterSqlArray[k].sql;
            else
                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1)
                    SQL = SQL + ' AND (' + fieldFilterSqlArray[k].sql + ')';
                else
                    SQL = SQL + ' AND ' + fieldFilterSqlArray[k].sql;
        }

    }
    var extent;
         
    if (checked == false)
        extent = israelExtentPolygonGeo;
    else {
        extent = "POLYGON((" + objExtent.xmin + " " + objExtent.ymin + "," +
            objExtent.xmin + " " + objExtent.ymax + "," +
            objExtent.xmax + " " + objExtent.ymax + "," +
            objExtent.xmax + " " + objExtent.ymin + "," +
            objExtent.xmin + " " + objExtent.ymin + "))";
    }
    var fieldsToIntersect = (identifyFields[lname] == undefined) ? ["OBJECTID"] : identifyFields[lname];
    if (SQL == "")
        SQL= "OBJECTID>0";
    // test
    //SQL = "FRHR_WK_D >= date '1899-12-30 16:00:00'  AND FRHR_WK_D <= date '1899-12-30 23:00:00'";
    //var SQL = fldname + " BETWEEN date '" + minYY + "-" + minMM + "-" + minDD + "' AND date '" + maxYY + "-" + maxMM + "-" + maxDD + "'";
    //SQL = "FRHR_WK_D BETWEEN date '1899-12-30 16:00:00' AND date '1899-12-30 23:00:00'"
        ;    //SQL = "OBJECTID>0";
    //fieldsToIntersect = ["OBJECTID"];
    //SQL = '';
    // end test

   //govmap.intersectFeaturesByWhereClause({ 'layerName': lname, 'fields': fieldsToIntersect, getShapes: false, 'whereClause': SQL })
    govmap.intersectFeatures({ geometry: extent, layerName: lname, fields: fieldsToIntersect, getShapes: false, 'whereClause': SQL })
        .then(function (results)
        {
            if (results.data !== null && results.data.length > 0) {

                document.getElementById('statisticsCount').innerHTML = results.data.length;
                var columnNumber = 0;
                if (id !== currentSortedColumn.value) 
                    columnNumber = parseInt(id.substring(7));
                else
                    columnNumber = parseInt(currentSortedColumn.value.substring(7));
               
                currentSortedColumn.value = "mnuDTH_" + columnNumber;
                results.data.sort(sortByProperty(columnNumber, arrowDirection));
                var fldname = identifyFields[lname][columnNumber];
                if (isFieldString[lname + "_" + fldname])
                {
                    document.getElementById('statisticsMin').innerHTML = 0;
                    document.getElementById('statisticsMax').innerHTML = 0;
                    document.getElementById('statisticsSum').innerHTML = 0;
                    document.getElementById('statisticsAvg').innerHTML = 0;

                }
                else
                {
                    if (arrowDirection == 'up')
                    {
                        var tmp = results.data[results.data.length - 1].Values[columnNumber];
                        
                        document.getElementById('statisticsMin').innerHTML = ToFixed2(results.data[results.data.length - 1].Values[columnNumber]);
                        document.getElementById('statisticsMax').innerHTML = ToFixed2( results.data[0].Values[columnNumber]);
                    }
                    else
                    {
                        document.getElementById('statisticsMin').innerHTML = ToFixed2( results.data[0].Values[columnNumber]);
                        document.getElementById('statisticsMax').innerHTML = ToFixed2(results.data[results.data.length - 1].Values[columnNumber]);
                    }
                }

                // datatable1
                var table = document.createElement('table');
                var wdth = "175px";
                
                table.style.backgroundColor = "white";
                // table.style.textAlign = 'right';
                table.style.width = '100%';
                table.style.overflow = "auto";
                table.style.tableLayout = 'fixed';
                table.id = "dataTable1";

                // loop through results  
                var statisticsDataSum = 0;
                var statisticsDataSD = 0;
                for (i = 0; i < results.data.length; i++) {


                    if ((isFieldString[lname + "_" + fldname] == false) && isNaN(parseInt(results.data[i].Values[columnNumber])) == false)
                    {
                        if (isFloat(results.data[i].Values[columnNumber]))
                            statisticsDataSum += parseFloat(results.data[i].Values[columnNumber]);
                        else
                            statisticsDataSum += parseInt(results.data[i].Values[columnNumber]);
                    }
                    

                    tr = document.createElement('tr');
                    tr.style.borderStyle = "solid";
                    tr.style.borderWidth = "0.5px";
                    tr.style.borderColor = "lightgrey";
                    tr.style.height = "36px";
                    // object id 
                    

                    // rest of fields 
                    for (k = identifyFields[lname].length - 1; k > -1; k--)
                    {
                        // if (identifyFields[lname][k] == 'OBJECTID' && identifyFields[lname].length == 1)
                        //     break;

                        var fldName = identifyFields[lname][k];
                        var fldValue = results.data[i].Values[k];



                        td = document.createElement('TD');
                        td.setAttribute("id", "tdd" + k);
                        td.style.textAlign = "right";
                        td.style.width = wdth;
                        var value;
                        if (urlFields.indexOf(fldName) > -1) {
                            var value = document.createElement("a");

                            if (fldValue == null || fldValue.length == 0) {
                                value.setAttribute("href", "");
                                value.setAttribute("target", "")
                                var linkText = document.createTextNode("");
                            }
                            else {
                                value.setAttribute("href", fldValue);
                                value.setAttribute("target", "_blank")
                                value.style.textDecoration = "underline";
                                value.style.color = "blue";
                                var linkText = document.createTextNode("קישור");
                            }

                            value.appendChild(linkText);
                            td.appendChild(value);
                        }
                        else {
                            value = formatValueForDisplay(fldName, fldValue);
                            td.setAttribute('title', 'לחץ להתמקדות לרשומה ');
                            td.style.cursor = 'pointer';
                            td.onclick = function (evt) {
                                var myparentTr = $(this).closest('tr');
                                $(myparentTr).addClass('selected').siblings().removeClass('selected');
                                zoomToSelectedTableInfoItem(myparentTr[0], selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName,true,routeSteps);
                            };
                            td.appendChild(document.createTextNode(value));
                        }

                        tr.appendChild(td);
                    }
                    // add sfirot download file 
                    
                    var oid = results.data[i].ObjectId;
                    var fileKey = lname + "_" + oid;
                    td = document.createElement('td');
                    td.style.width = wdth;

                    if (lname == 'WPLAN2019Q2' || lname == 'SFIROT') {
                        if (OID_TO_File[fileKey] != undefined) {
                            


                            var filename = OID_TO_File[fileKey][0];
                            var fileType = OID_TO_File[fileKey][1];
                            var fileFullname = "downloadFiles/" + filename + "." + fileType;
                            var link = document.createElement('a');
                            link.setAttribute('href', fileFullname);
                            link.text = filename + "." + fileType;
                            link.style.color = "blue";
                            link.style.textDecoration = "underline";

                            //var glyphattach = document.createElement("IMG");
                            //glyphattach.title = "לחץ להורדה";
                            //glyphattach.setAttribute("href", "icons/attachment.png");
                            //glyphattach.setAttribute("width", "7px");
                            ////glyphattach.setAttribute("height", "20px");
                            //glyphattach.setAttribute("id", fileKey);
                            //glyphattach.onclick = function () {
                            //    var lyrname = this.id.split("_")[0];
                            //    var id = this.id.split("_")[1];
                            //    downloadAttachedFile(lyrname, id);
                            //}
                            //td.appendChild(glyphattach);
                            td.appendChild(link);
                            tr.appendChild(td);
                        }
                    }
                    

                    // add index field to table
                    td = document.createElement('td');
                    td.setAttribute("id", "tdd" + k);
                    td.style.textAlign = "center";
                    td.style.width = "80px";

                    td.appendChild(document.createTextNode(i + 1));
                    tr.appendChild(td);
                    tr.setAttribute("id", lname + '*' + results.data[i].ObjectId);
                    table.appendChild(tr);
                }

                if (isFieldString[lname + "_" + fldname] == false) {
                    stAvreage = statisticsDataSum / results.data.length;
                    document.getElementById('statisticsSum').innerHTML = ToFixed2(statisticsDataSum);
                    document.getElementById('statisticsAvg').innerHTML = ToFixed2(stAvreage);
                }

                for (k = 0; k < results.data.length; k++) {
                    if (isFieldString[lname + "_" + fldname] == false)
                    {
                        if (isNaN(parseInt(results.data[k].Values[columnNumber])) == false)
                        {
                            stSD += Math.pow(parseInt(results.data[k].Values[columnNumber]) - stAvreage, 2);
                        }
                    }
                }
                if (isFieldString[lname + "_" + fldname] == false)
                {
                    stSD = stSD / results.data.length;
                    stSD = Math.sqrt(stSD);
                }
                document.getElementById('statisticsSD').innerHTML = ToFixed2(stSD);

                var dtDiv = document.getElementById('dataTableModalBody');
                dtDiv.innerHTML = '';
                dtDiv.appendChild(table);
                reshapeMapToFitTableInfo(checked, results.data.length, true, lname, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);

                // move datatable1 to right side
                //$("#dataTableModalBody").offset().left += 1;
                var dtdivLeft = dtDiv.scrollWidth;
                dtDiv.scrollLeft = dtdivLeft;
                document.getElementById('dataTableModalBody').scrollLeft += 1;

                // header table 
                table = document.createElement('table');

                table.style.backgroundColor = "white";
                table.style.textAlign = 'center';
                table.style.width = '100%';
                table.style.overflow = "auto";
                table.style.tableLayout = 'fixed';
                table.id = "columnsTable";

                // download connected file clmn
                var tr = document.createElement("tr");

                


                tr.style.borderTopStyle = "solid";
                tr.style.borderTopWidth = "0.5px";
                tr.style.borderTopColor = "lightgrey";
                tr.style.borderBottomStyle = "solid";
                tr.style.borderBottomWidth = "0.5px";
                tr.style.borderBottomColor = "lightgrey";

                // rest of clmns
                for (j = identifyFields[lname].length - 1; j > -1; j--) {
                    if (identifyFields[lname][j] != "OBJECTID") {
                        var th = document.createElement('th');
                        th.style.textAlign = "right";
                        th.style.width = wdth;
                        th.style.cursor = 'pointer';
                        var fldName = lname + '_' + identifyFields[lname][j];
                        th.setAttribute('title', 'מיון ערכים ');
                        th.setAttribute('id', 'DTH_' + j);
                        var tmp = document.getElementById("tdd" + j);
                        $("#DTH_" + j).offset({ left: tmp.offsetLeft });



                        var mnuSelect = document.createElement('select');
                        mnuSelect.setAttribute('class', 'dropdown');
                        mnuSelect.style.direction = 'rtl';
                        mnuSelect.style.border = 'none';
                        mnuSelect.style.outline = 'none';
                        mnuSelect.style.fontFamily = "Alef-Regular";
                        mnuSelect.style.fontWeight = "100";


                        mnuSelect.setAttribute('id', 'mnuDTH_' + j);
                        mnuSelect.style.scrollBehavior = 'smooth';
                        var DDItem = document.createElement('option');
                        DDItem.appendChild(document.createTextNode(identifyFieldsEngHeb[fldName]));
                        mnuSelect.appendChild(DDItem);
                        DDItem = document.createElement('option');
                        DDItem.appendChild(document.createTextNode('מיון בסדר יורד'));
                        //var arrowD = document.createElement('img');
                        //arrowD.src = "icons/Triangle_down.png"
                        //DDItem.appendChild(arrowD);
                        mnuSelect.appendChild(DDItem);
                        DDItem = document.createElement('option');
                        DDItem.appendChild(document.createTextNode('מיון בסדר עולה'));
                        mnuSelect.appendChild(DDItem);
                        DDItem = document.createElement('option');

                        DDItem.appendChild(document.createTextNode('סטטיסטיקה'));
                        if (isFieldString[lname + "_" + identifyFields[lname][j]])
                            DDItem.disabled = 'true';

                        mnuSelect.appendChild(DDItem);

                        mnuSelect.onchange = function () {
                            if (this.children[3].disabled)
                                document.getElementById('statisticsDiv').style.width = "0%";
                           // arrowDirection.length = 0;
                            switch (this.selectedIndex) {

                                case 1:
                                    {
                                        document.getElementById('statisticsDiv').style.width = "0%";
                                        //var clmnName = this.id.substring(3, this.id.length);
                                        showTable(currentDataTableLayerName, this.id, "up", checked, currentSortedColumn,selectedIDInDatatable,slectedLayerInDatatable,panorama,heatmapLayer,heatmapField,drawTextData,drawTextItems);
                                    }
                                    break;
                                case 2:
                                    {
                                        document.getElementById('statisticsDiv').style.width = "0%";
                                        //var clmnName = this.id.substring(3, this.id.length);
                                        showTable(currentDataTableLayerName, this.id, "down", checked, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                                    }
                                    break;
                                case 3:
                                    {
                                        //var clmnName = this.id.substring(3, this.id.length);
                                        showTable(currentDataTableLayerName, this.id, "down", checked, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);

                                        hideLayers();
                                        openStatistics(lname, this.id, identifylayers);
                                    }

                            }
                            this.selectedIndex = 0;

                        }

                        th.appendChild(mnuSelect);


                        tr.appendChild(th);
                    }


                }

                // sfirot download file column

                
                if (lname == 'WPLAN2019Q2' || lname == 'SFIROT')
                {
                    var th = document.createElement('th');
                    th.style.textAlign = "right";
                    th.appendChild(document.createTextNode('קובץ ספירה'));
                    th.style.width = "175px";
                    th.style.cursor = 'pointer';
                    
                    tr.appendChild(th);
                }
                
                

                // index clmn
                var th = document.createElement('th');
                th.style.textAlign = "center";
                th.appendChild(document.createTextNode('מספר סידורי'));
                //th.appendChild(document.createTextNode(''));
                th.style.width = "84px";
                th.style.fontWeight = "normal";
                th.style.cursor = 'pointer';
                tr.appendChild(th);
                //
                table.appendChild(tr);

                var headertableDiv = document.getElementById("columnHeadersTable");
                headertableDiv.innerHTML = "";
                headertableDiv.appendChild(table);
                // var headerLeft = headertableDiv.scrollWidth;
                //headertableDiv.scrollLeft = headerLeft;
                // var dtLeft = $("#dataTableModalBody").scrollLeft;
                // $("#columnHeadersTable").offset({ left: -dtdivLeft  });
                //$("#columnHeadersTable").offset({ left: (1 * this.scrollLeft) - 90 });
                // $("#columnHeadersTable").scrollLeft = $("#dataTableModalBody").scrollLeft;
                //$("#columnHeadersTable")[0].clientWidth = $("#dataTableModalBody")[0].offsetWidth;
                //var leftPos = $('#columnHeadersTable').scrollLeft();
                //$("#columnHeadersTable").offset({ left: dtdivLeft });
            }
            else
            {
                document.getElementById('statisticsMin').innerHTML = 0;
                document.getElementById('statisticsMax').innerHTML = 0;
                document.getElementById('statisticsCount').innerHTML = 0;
                document.getElementById('statisticsSum').innerHTML = 0
                document.getElementById('statisticsAvg').innerHTML = 0;
                document.getElementById('statisticsSD').innerHTML = 0;
                // in case that table was open before and now there are no results 
                // empty table but keep columns 
                
               //$("#columnHeadersTable tr").remove();
                //$("#columnHeadersTable").offset({ left: (-1 * this.scrollLeft) });
                
                //
                // move datatable1 to right side
                //$("#dataTableModalBody").offset().left += 1;
                //var dtdivLeft = dtDiv.scrollWidth;
                //dtDiv.scrollLeft = dtdivLeft;
                //var tbHeader = document.getElementById('columnHeadersTable');
                //var dtdivLeft = tbHeader.scrollWidth;
                //tbHeader.offsetLeft += tbHeader.offsetWidth;
                //$("#columnHeadersTable").offset({ left: ( dtdivLeft) });
                // tbHeader.scrollLeft = tbHeader.scrollWidth;
                //
                var tbHeader = document.getElementById('columnHeadersTable');
                var dtdivLeft = tbHeader.offsetLeft;
                $("#columnHeadersTable").offset({ left: (dtdivLeft) });
                //tbHeader.scrollLeft = dtdivLeft;
                $("#dataTable1 tr").remove();
                //document.getElementById('columnHeadersTable').scrollLeft += 1;
                //tbHeader.animate({
                //    scrollLeft: dtdivLeft,
                //})

            }
        }, function (err)
        {
            var error = err;
        }
        );

    // in case a new table is open hide the maximise button
    document.getElementById("btnMaximiseInfoTable").style.display = "none";
}
function ToFixed2(num)
{
    if (num == null)
        return "";
    else
        return parseInt(num).toLocaleString("en");
    //    if (isInteger(num))
    //    return num.toLocaleString('en');
    //else if (isFloat(num))
    //{
    //    //var res = Number.parseFloat(num).toFixed(2);
    //    //var res = Number.parseFloat(num);
    //    return num.toFixed(2).toLocaleString('en');
    //    //$(this).format({ format: "#,###.00", locale: "us" });

    //}
    //else
    //    return num;

}
function isInteger(f) {
    return typeof (f) === "number" && Math.round(f) == f;
}
function isFloat(f) { return typeof (f) === "number" && !isInteger(f); }


function formatValueForDisplay(fieldname,fieldvalue)
{
    if (fieldvalue != "" && fieldvalue != null && fieldvalue != "null" && fieldvalue != undefined)
    {
        
        if (dateFields.indexOf(fieldname) > -1) // we have a date 
            return parseTaldorReturnedDate(fieldvalue);
        else if (isNaN(fieldvalue))
            return fieldvalue; // we have a string do nothing
        else if (longNumbersFields.indexOf(fieldname) >-1) // we have a long number
            return parseInt(fieldvalue).toLocaleString();
        else
            return fieldvalue;
    }
    return "";
}

function sortByProperty(property, sortOrder)
{
    
    return function (a, b)
    {
        var sortStatus = 0;
        var column = parseInt(property);
        switch (sortOrder)
        {
            case 'down':
                {
                   if (a.Values[column] < b.Values[column])
                        sortStatus = -1;
                   else if (a.Values[column] > b.Values[column])
                        sortStatus = 1;
                   break;
                    
                }
            case 'up':
                {
                   if (a.Values[column] > b.Values[column])
                        sortStatus = -1;
                   else if (a.Values[column] < b.Values[column])
                        sortStatus = 1;
                   break;
                }
        }
        
        return sortStatus;
    };
    
}

function Helper()
{
    var text = 'layersGroup["תשתיות לא תחבורתיות"]=[';
    for (i = 0; i < TOC_Content['תשתיות לא תחבורתיות'].length; i++)
    {
        text += "'" + layerHebEng[TOC_Content['תשתיות לא תחבורתיות'][i]] +"',";
    }
    text += "];";
}

function parseTaldorReturnedDate(thedate)
{
    if (thedate == null)
        return;
    var dateArray = thedate.split("T");

    var day = dateArray[0].split("-")[2];
    var month = dateArray[0].split("-")[1];
    var year = dateArray[0].split("-")[0];
    return day + "/" + month + "/" + year; 

}
function computeLastDayOfTheMonth(month,year)
{
    var intMonth = parseInt(month) +1;
    var intYear = parseInt(year);
    switch (intMonth) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
           
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        case 2:
            if (((intYear % 4 == 0) &&
                !(intYear % 100 == 0))
                || (intYear % 400 == 0))
                return 29;
            else
                return 28;
            

    }
}
function openForm(obj)
{
    var formname = obj.value;
     
    if (formname == 'גוש/חלקה') {
        $('#gushNum').val('');
        $('#parcelNum').val('');
        $('#gushParcel').show();
        $('#Coordinate').hide();
    }
    else if (formname == 'נ"צ') {
        $('#x').val('');
        $('#y').val('');
        $('#Coordinate').show();
        $('#gushParcel').hide();
    }
    else {
            $('#Coordinate').hide();
            $('#gushParcel').hide();
        }
        
}

function showHideHeatmap(status)
{
    hideLayers();
    loadHeatMapLayers();
    loadHeatmapFields();
    document.getElementById("heatmapDiv").style.display = status;
}
function hideForm(formname)
{

    document.getElementById(formname).style.display = 'none';
    //$(formname).hide();
    //if (formname == 'gushParcel') {
    //    $('#gushNum').val('');
    //    $('#parcelNum').val('');
    //    $('#gushParcel').hide();
    //}
    //else if (formname == 'Coordinate') {
    //    $('#x').val('');
    //    $('#y').val('');
    //    $('#Coordinate').hide();

    //}
    //else if (formname == 'Address')
    //{
    //    $('#additionalresults').val('');
    //    $('#Address').hide();
    //}
    

    //var obj = document.getElementById('searchSelect');
    //obj.selectedIndex = "0";
}
function changePlaceholder(coordSys)
{
    var radio;
    if (coordSys == "ITM") {
        radio = document.getElementById("x");
        radio.placeholder = "למשל 220853 ";
        radio = document.getElementById("y");
        radio.placeholder = "למשל 631071 ";
    }
    else {
        radio = document.getElementById("x");
        radio.placeholder = "למשל 35.219214 ";
        radio = document.getElementById("y");
        radio.placeholder = "למשל 31.772223 ";
    }
}
function SearchGushHelkaMobile(gushNum, parcelNum,identifylayers)
{
    var gush = parseInt(gushNum);
    var parcel = parseInt(parcelNum);
    if (isNaN(gush)) {
        document.getElementById('gushhelkaMobileerror').innerHTML = 'גוש לא תקין';
        return;
    }
    if (isNaN(parcel)) {
        //document.getElementById('gushhelkaerror').innerHTML = 'חלקה לא תקינה ';
        //israelExtentPolygonGeo
        //             govmap.intersectFeatures({ 'geometry': israelExtentPolygonGeo, 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: false, 'whereClause': 'GUSH_NUM=' + gush })
        govmap.intersectFeaturesByWhereClause({ 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: false, 'whereClause': 'GUSH_NUM=' + gush })
            .then(function (e) {
                if (e.data != null && e.data.length > 0) {
                    
                    var fieldvalue = [];
                    fieldvalue.push(e.data[0].ObjectId);
                    govmap.searchInLayer({ 'layerName': 'SUB_GUSH_ALL', 'fieldName': 'OBJECTID', 'fieldValues': fieldvalue, 'highlight': true, 'outLineColor': 'rgba(255,0,255,1)' });
                    turnlayerOnOff("chkSUB_GUSH_ALL", true, identifylayers);
                }
                else
                    document.getElementById('gushhelkaMobileerror').innerHTML = ' גוש לא קיים במערכת ';
            });
    }
    else {
        document.getElementById('gushhelkaerror').innerHTML = "";

        var sql = "GUSH_NUM =" + gush + " AND PARCEL=" + parcel;
        govmap.intersectFeaturesByWhereClause({ 'layerName': 'PARCEL_ALL', 'fields': ['OBJECTID'], getShapes: false, 'whereClause': sql })
            .then(function (e) {
                if (e.data != null && e.data.length > 0) {
                    var objectid = e.data[0].ObjectId;
                    var objectIds = [];
                    objectIds.push(objectid);
                    govmap.searchInLayer({ 'layerName': 'PARCEL_ALL', 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                    turnlayerOnOff("chkSUB_GUSH_ALL", true, identifylayers);
                    turnlayerOnOff("chkPARCEL_ALL", true, identifylayers);
                }
                else
                    document.getElementById('gushhelkaMobileerror').innerHTML = "גוש וחלקה לא קיימים במערכת";
            });


    }

    
}

function SearchGushHelka(identifylayers) {
    var gush = parseInt(document.getElementById('gushNum').value);
    var parcel = parseInt(document.getElementById('parcelNum').value);
    if (isNaN(gush)) {
        document.getElementById('gushhelkaerror').innerHTML = 'גוש לא תקין';
        return;
    }
    if (isNaN(parcel)) {
        //document.getElementById('gushhelkaerror').innerHTML = 'חלקה לא תקינה ';
        //israelExtentPolygonGeo
        //             govmap.intersectFeatures({ 'geometry': israelExtentPolygonGeo, 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: false, 'whereClause': 'GUSH_NUM=' + gush })
        govmap.intersectFeaturesByWhereClause({ 'layerName': 'SUB_GUSH_ALL', 'fields': ["OBJECTID"], getShapes: false, 'whereClause': 'GUSH_NUM=' + gush })
            .then(function (e) {
                if (e.data != null && e.data.length > 0)
                {
                    $("#searchAll").toggle();
                    var fieldvalue = [];
                    fieldvalue.push(e.data[0].ObjectId);
                    govmap.searchInLayer({ 'layerName': 'SUB_GUSH_ALL', 'fieldName': 'OBJECTID', 'fieldValues': fieldvalue, 'highlight': true, 'outLineColor': 'rgba(255,0,255,1)' });
                    turnlayerOnOff("chkSUB_GUSH_ALL"  , true, identifylayers);
                }
                else
                    document.getElementById('gushhelkaerror').innerHTML = ' גוש לא קיים במערכת ';  
            });
    }
    else
    {
        document.getElementById('gushhelkaerror').innerHTML = "";

        var sql = "GUSH_NUM =" + gush + " AND PARCEL=" + parcel;
        govmap.intersectFeaturesByWhereClause({ 'layerName': 'PARCEL_ALL', 'fields': ['OBJECTID'], getShapes: false, 'whereClause': sql })
            .then(function (e)
            {
                if (e.data != null && e.data.length > 0)
                {
                        var objectid = e.data[0].ObjectId;
                        var objectIds = [];
                        objectIds.push(objectid);
                        govmap.searchInLayer({ 'layerName': 'PARCEL_ALL', 'fieldName': 'ObjectId', 'fieldValues': objectIds, 'highlight': true, 'outLineColor': "rgba(255, 0, 255, 1)" });
                        turnlayerOnOff("chkSUB_GUSH_ALL", true, identifylayers);
                        turnlayerOnOff("chkPARCEL_ALL", true, identifylayers);
                }
                else
                    document.getElementById('gushhelkaerror').innerHTML = "גוש וחלקה לא קיימים במערכת";  
            });

        
    }
    
};

function getLocation(heatmapLayer, heatmapField, drawTextData, drawTextItems) {
    if (navigator.geolocation) {
        //navigator.geolocation.getCurrentPosition(showPosition);
        navigator.geolocation.getCurrentPosition(
            function (position)
            {
                showPosition(position, heatmapLayer, heatmapField, drawTextData, drawTextItems);
            })

            
    } else {
        showErrorMsg("שירותי מיקום אינם נתמכים");
    }
}
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //x.innerHTML = "User denied the request for Geolocation."
            showErrorMsg("יש להדליק שירותי מיקום");
            break;
        case error.POSITION_UNAVAILABLE:
            //x.innerHTML = "Location information is unavailable."
            showErrorMsg("שירותי מיקום אינם נתמכים");
            break;
        case error.TIMEOUT:
            //x.innerHTML = "The request to get user location timed out."
            showErrorMsg("שירותי מיקום אינם נתמכים");
            break;
        case error.UNKNOWN_ERROR:
            //x.innerHTML = "An unknown error occurred."
            showErrorMsg("שגיאה בשירותי מיקום");
            break;
    }
}
function showPosition(position, heatmapLayer, heatmapField, drawTextData, drawTextItems) {
    
   // govmap.clearGeometriesByName(["currentLocation"]);  // clear prev location
    clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
    var val = WgsToIsrael(position.coords.latitude, position.coords.longitude); 
    var x = parseFloat(val[0]);
    var y = parseFloat(val[1]);
    govmap.zoomToXY({ x:x , y:y , level: 10, marker: false });

    var wkts = [];
    wkts.push("POINT(" + x + " " +y+ ")");

    var data =
    {
        wkts: wkts,
        names: [],
        geometryType: govmap.drawType.Point,
        defaultSymbol:
        {

            outlineColor: [0, 0, 255, 0.8],
            outlineWidth: 2,
            fillColor: [0, 0, 255, 0.8]
        },
        symbols: [],
        clearExisting: false,
        data:
        {
            tooltips: [],
            headers: [],
            bubbleHTML: "",
            bubbleHTMLParameters: [[], []]
        }
    };
    govmap.displayGeometries(data).then(function (response) {
        // govmap.zoomToDrawing();
    });
}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function pow2(x) {
    return x * x;
}

function pow3(x) {
    return x * x * x;
}

function pow4(x) {
    return x * x * x * x;
}

function ITMLocation(easting, northing) {
    this.easting = easting;
    this.northing = northing;
    this.eastingInOldGrid = function () {
        return easting - 50000;
    };
    this.northingInOldGrid = function () {
        var retval = northing - 500000;
        if (retval < 0) {
            retval += 1000000;
        }
        return retval;
    };
}

function WgsToIsrael(latitude, longitude) {
    longitude = degreesToRadians(longitude);
    latitude = degreesToRadians(latitude);
    //LatLongToITM(latitude, longitud);
    // Projection parameters
    var centralMeridian = degreesToRadians(35.2045169444444);  // central meridian of ITM projection
    var k0 = 1.0000067;  // scale factor
    // Ellipsoid constants (WGS 80 datum)
    var a = 6378137;  // equatorial radius
    var b = 6356752.3141; // polar radius
    var e = Math.sqrt(1 - b * b / a / a);  // eccentricity
    var e1sq = e * e / (1 - e * e);
    var n = (a - b) / (a + b);
    // Curvature at specified location
    var tmp = e * Math.sin(latitude);
    var nu = a / Math.sqrt(1 - tmp * tmp);
    // Meridional arc length
    var n3 = pow3(n);
    var n4 = pow4(n);
    var A0 = a * (1 - n + (5 * n * n / 4) * (1 - n) + (81 * n4 / 64) * (1 - n));
    var B0 = (3 * a * n / 2) * (1 - n - (7 * n * n / 8) * (1 - n) + 55 * n4 / 64);
    var C0 = (15 * a * n * n / 16) * (1 - n + (3 * n * n / 4) * (1 - n));
    var D0 = (35 * a * n3 / 48) * (1 - n + 11 * n * n / 16);
    var E0 = (315 * a * n4 / 51) * (1 - n);
    var S = A0 * latitude - B0 * Math.sin(2 * latitude) + C0 * Math.sin(4 * latitude)
        - D0 * Math.sin(6 * latitude) + E0 * Math.sin(8 * latitude);
    // Coefficients for ITM coordinates
    var p = longitude - centralMeridian;
    var Ki = S * k0;
    var Kii = nu * Math.sin(latitude) * Math.cos(latitude) * k0 / 2;
    var Kiii = ((nu * Math.sin(latitude) * pow3(Math.cos(latitude))) / 24) * (5 - pow2(Math.tan(latitude)) + 9 * e1sq * pow2(Math.cos(latitude)) + 4 * e1sq * e1sq * pow4(Math.cos(latitude))) * k0;
    var Kiv = nu * Math.cos(latitude) * k0;
    var Kv = pow3(Math.cos(latitude)) * (nu / 6) * (1 - pow2(Math.tan(latitude)) + e1sq * pow2(Math.cos(latitude))) * k0;
    var easting = Math.round(219529.58 + Kiv * p + Kv * pow3(p) - 60);
    var northing = Math.round(Ki + Kii * p * p + Kiii * pow4(p) - 3512424.41 + 626907.39 - 45);
    return [easting, northing];
}
function toggleAllLayersGroupLayers(tablename)
{
   // $('.carousel').slick('slickNext');
   // $('.carousel').slick('slickPrev');
    var AllLayersTable = document.getElementById("allLayersTable");
    var searchLayerTB = document.getElementById("layersModalTHDiv");
    var groupLayersTable = document.getElementById("layersByGroupTable");
    //var groupLayersTableHeader = document.getElementById("layersByGroupTableHeader");
    var grouplayersImages = document.getElementById('layersByGroupImagesTableDiv');
    var all = document.getElementById('all');
    var group = document.getElementById('group');
    var groupName = document.getElementById('groupName');
    //var AccordionDiv = document.getElementById("layersByGroupDiv");
    var carousel = document.getElementById('carouselWrapper');
    var dynamicDiv = document.getElementById("layersbodey");


    if (tablename == 'all')
    { 
        
        all.style.backgroundColor = 'white';
        all.style.color = 'rgba(210, 18, 135, 1)'; //pink
        all.style.borderWidth = '0px';
        group.style.backgroundColor = 'rgba(242, 244, 250, 1)';
        group.style.color = 'rgba(142, 158, 183, 1)';
        group.style.borderWidth = '0px';
        groupName.style.display = 'none';
        AllLayersTable.style.display = "inline-table";
        groupLayersTable.style.display = 'none';
        //groupLayersTableHeader.style.display = "none";
        grouplayersImages.style.display = 'none';
        searchLayerTB.style.display = "block";
        document.getElementById('txtSearchLayerName').style.visibility = 'visible';
        dynamicDiv.style.height = "70%";
        dynamicDiv.style.maxHeight = "70%";
        // carousel 
        carousel.style.display = 'none';
    }
    else
    {
    
        group.style.backgroundColor = 'white';
        group.style.color = 'rgba(210, 18, 135, 1)';
        group.style.borderWidth = '0px';
        groupName.style.display = 'block';
        all.style.borderWidth = '0px';
        all.style.backgroundColor = 'rgba(242, 244, 250, 1)';
        all.style.color = 'rgba(142, 158, 183, 1)';
        AllLayersTable.style.display = "none";
        groupLayersTable.style.display = 'inline-table';
       // groupLayersTableHeader.style.display = "block";
        grouplayersImages.style.display = 'block';
        searchLayerTB.style.display = "none";
        document.getElementById('txtSearchLayerName').style.visibility = 'hidden';
        dynamicDiv.style.height = "47%";
        dynamicDiv.style.maxHeight = "47%";

        // carousel 
        carousel.style.display = 'block';
        // refresh carosel 
       // $('.carousel').slick("refresh");
        $('.carousel').slick('setPosition');   
       // 
    }
}

function toggleBufferSpatialQuery(tablename) {
    
    var openbufferbtn = document.getElementById('btnOpenBuffer');
    var opnqueriesbtn = document.getElementById('btnOpenQueries');
    var bfrDiv = document.getElementById("BufferDiv");
    var qrsDiv = document.getElementById("spatialQueriesDiv");


    if (tablename == 'spatialQueriesDiv') {

        opnqueriesbtn.style.backgroundColor = 'white';
        opnqueriesbtn.style.color = 'rgba(210, 18, 135, 1)'; //pink
        opnqueriesbtn.style.borderWidth = '0px';

        openbufferbtn.style.backgroundColor = 'rgba(242, 244, 250, 1)';
        openbufferbtn.style.color = 'rgba(142, 158, 183, 1)';
        openbufferbtn.style.borderWidth = '0px';
       
        bfrDiv.style.display = 'none';
        qrsDiv.style.display = "block";
               
        qrsDiv.style.height = "100%";
       
    }
    else {

        opnqueriesbtn.style.backgroundColor = 'rgba(242, 244, 250, 1)';
        opnqueriesbtn.style.color = 'rgba(142, 158, 183, 1)'; //
        opnqueriesbtn.style.borderWidth = '0px';


        openbufferbtn.style.backgroundColor = 'white';
        openbufferbtn.style.color = 'rgba(210, 18, 135, 1)'; //pink
        openbufferbtn.style.borderWidth = '0px';

        bfrDiv.style.display = 'block';
        qrsDiv.style.display = "none";


        bfrDiv.style.height = "100%";
        //bfrDiv.style.maxHeight = "70%";


    }
}
function selectGroup(obj)
{
    for (i = 0; i < groupLayers.length; i++)
    {
        var item = document.getElementById(groupLayers[i]);
        item.style.borderWidth = '0px';
    }
    obj.style.borderStyle = 'solid';
    obj.style.borderWidth = '2px';
}

function enterKeyPressed(e) {
    if (e.keyCode == 13)
        return true;
    else
        return false;
}
function searchInTable()
{
    var table = document.getElementById("dataTable1");
    var filter = document.getElementById("txtSearchTable").value;
    var tr = table.rows;
    var display = 'none';
    for (i = 0; i < tr.length; i++) {
        if (tr[i].id != 'header')
        {
            var numofcells = tr[i].cells.length;
            // Loop over all the cells

            for (var j = 0; j < numofcells; j++) {
                td = tr[i].cells[j];
                // Existing loop
                if (td) {
                    if (td.innerHTML.indexOf(filter) > -1) {
                        display = "";
                       // td.style.backgroundColor = 'lightblue';
                        break;
                    }
                    else {
                        //td.style.backgroundColor = "white";
                        display = 'none';
                    }
                        
                }

            }
            tr[i].style.display = display;
        }
      
    }

   
}
function disableSearch()
{
    var table = document.getElementById("dataTable1");
    
    var tr = table.rows;
    var display = 'none';
    for (i = 0; i < tr.length; i++) {
        if (tr[i].id != 'header') {
            tr[i].style.display = '';
        }
    }
}

function callGoogleMobile()
{
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.draw(govmap.drawType.Point).progress(function (e) {

        startgoogleMobile(e.wkt, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
    });
}
function startgoogle(geo, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems) {

    var lat = "32.030523";
    var long = "34.7461004";
    var mpdiv = document.getElementById('dataTableModal');
    //panorama = "";
    var target = document.getElementById('map_div');
    document.getElementById('layerInformation').style.width = '0%';
    document.getElementById('layers').style.width = '0%';

    document.getElementById("watermrk").style.bottom = "35%";
    document.getElementById("scaleInMeters").style.bottom = "35%";
    document.getElementById("scaleUnit").style.bottom = "35%";
    document.getElementById("scale1").style.bottom = "34%";
    document.getElementById("scale2").style.bottom = "34%";
    document.getElementById("scale3").style.bottom = "34%";
    document.getElementById("scale4").style.bottom = "34%";
    document.getElementById('dataTableModal').style.height = "30%";
    document.getElementById('bgOptionsDiv').style.bottom = "35%";
    document.getElementById("map_div").className = "mapdivsmall";


    // convert screen point to lat long
    var tmp = geo.substring(6, geo.length - 1);
    xval = tmp.split(" ")[0];
    yval = tmp.split(" ")[1];
    try {
        // var coord = JSITM.itmRef2gpsRef(xval.split('.')[0] + " " + yval.split('.')[0]);
        var coord = JSITM.itmRef2gpsRef(xval.split('.')[0] + " " + yval.split('.')[0]);
        lat = parseFloat(coord.split(' ')[0]);
        long = parseFloat(coord.split(' ')[1]);
    }
    catch
    {
        // houston we have a  problem with coordinate 
        //mpdiv.innerHTML = "לא נמצאו נתונים במיקום המבוקש";
    }


    // we need to check if the area that was clicked at has street view data
    
    // this is done using matadata query 
    //var key = "AIzaSyDnPQgEdPjTJ1x-yEnlHgFC1Ow1iZjF7-k";
    var key = "AIzaSyBxVe5eJBDBFxZ9e4o3aRGTDP7_b0NEQYc";
    var checkSteetViewMetaData = "https://maps.googleapis.com/maps/api/streetview/metadata?size=600x300&location=" + lat + ", " + long + "&fov=90&heading=235&pitch=10&key="+ key;

    $.ajax
        ({
            type: "POST",
            url: checkSteetViewMetaData,
            crossDomain: true,
            dataType: "json",

        }).done(function (data) {

            panorama = new google.maps.StreetViewPanorama
            (
            mpdiv,
             {
                        //32.065790, 34.786264
                        position: { lat: lat, lng: long },
                        pov: { heading: 165, pitch: 0 },
                        zoom: 1
             });

            // wait for the window to open and then resize the the map div
            // in order for it to strech over the div properly 
            var observer = new MutationObserver(function () {
                setTimeout(function () {
                    google.maps.event.trigger(panorama, 'resize');
                }, 1000);
            });

            observer.observe(target, {
                attributes: true
            });

            // Get close button and insert it into streetView
            // #button can be anyt dom element
            //var closeButton = document.querySelector('#btnStreetViewClose'),
            //    controlPosition = google.maps.ControlPosition.LEFT_CENTER;
            var closeButton = document.createElement('button'),
                controlPosition = google.maps.ControlPosition.LEFT_CENTER;
            closeButton.setAttribute('class', 'btnStreetViewClose');
           
            
            closeButton.innerHTML = 'x';
            // Assumes map has been initiated
            // var streetView = map.getStreetView();
            // Hide useless and tiny default close button
            panorama.setOptions({ enableCloseButton: false });
            // Add to street view
            panorama.controls[controlPosition].push(closeButton);
            // Listen for click event on custom button
            // Can also be $(document).on('click') if using jQuery
            google.maps.event.addDomListener(closeButton, 'click', function () {
                panorama.setVisible(false);
                hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);
            });

            panorama.addListener("position_changed", function () {
                var googlepoint = panorama.getPosition().toString();
                var ptArray = googlepoint.split(",");
                var lat = ptArray[0];
                lat = lat.substring(1, lat.length);
                var long = ptArray[1];
                long = long.substring(1, long.length - 1);
                ptItm = JSITM.gpsRef2itmRef(parseFloat(lat) + " " + parseFloat(long));
                var ptItmArray = ptItm.split(" ");
                govmap.zoomToXY({ x: parseFloat(ptItmArray[0]), y: parseFloat(ptItmArray[1]), level: 10, marker: true });
            });

            if (data.status == "OK") {
                // do nothing  there is data in coordinate
            }
            else
            {
                // no data found in coordinate
               
                var lblError = document.createElement("label");
                lblError.setAttribute("id", "googleSVError");
                lblError.style.color = "rgb(210, 18, 135)";
                lblError.style.backgroundColor = "rgb(251, 200, 232)";
                //lblError.style.fontSize = "calc(1.5vh + 1.1vw)";
                lblError.style.fontSize = "40px";
                lblError.style.fontFamily = "Alef-Regular";
                lblError.style.fontWeight = "700";
                lblError.innerHTML = "מבט רחוב אינו זמין במיקום המבוקש";

                // location of error msg is also controled by style css
                // look for googleSVError in style.css 
                panorama.controls[google.maps.ControlPosition.RIGHT_CENTER].push(lblError);
                // clear previous marker 
               
                clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
   
            }
        });

   
}

function startgoogleMobile(geo, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems) {

    var lat = "32.030523";
    var long = "34.7461004";
    var mpdiv = document.getElementById('dataTableModalMobile');
    mpdiv.style.height = '40%';
    document.getElementById('mobileTools').style.display = 'none';
    //panorama = "";
    var target = document.getElementById('map_div');
    
    document.getElementById("map_div").className = "mapdivsmall";


    // convert screen point to lat long
    var tmp = geo.substring(6, geo.length - 1);
    xval = tmp.split(" ")[0];
    yval = tmp.split(" ")[1];
    try {
        // var coord = JSITM.itmRef2gpsRef(xval.split('.')[0] + " " + yval.split('.')[0]);
        var coord = JSITM.itmRef2gpsRef(xval.split('.')[0] + " " + yval.split('.')[0]);
        lat = parseFloat(coord.split(' ')[0]);
        long = parseFloat(coord.split(' ')[1]);
    }
    catch
    {
        // houston we have a  problem with coordinate 
        //mpdiv.innerHTML = "לא נמצאו נתונים במיקום המבוקש";
    }


    // we need to check if the area that was clicked at has street view data

    // this is done using matadata query 
    //var key = "AIzaSyDnPQgEdPjTJ1x-yEnlHgFC1Ow1iZjF7-k";
    var key = "AIzaSyBxVe5eJBDBFxZ9e4o3aRGTDP7_b0NEQYc";
    var checkSteetViewMetaData = "https://maps.googleapis.com/maps/api/streetview/metadata?size=600x300&location=" + lat + ", " + long + "&fov=90&heading=235&pitch=10&key=" + key;

    $.ajax
        ({
            type: "POST",
            url: checkSteetViewMetaData,
            crossDomain: true,
            dataType: "json",

        }).done(function (data) {

            panorama = new google.maps.StreetViewPanorama
                (
                    mpdiv,
                    {
                        //32.065790, 34.786264
                        position: { lat: lat, lng: long },
                        pov: { heading: 165, pitch: 0 },
                        zoom: 1
                    });

            // wait for the window to open and then resize the the map div
            // in order for it to strech over the div properly 
            var observer = new MutationObserver(function () {
                setTimeout(function () {
                    google.maps.event.trigger(panorama, 'resize');
                }, 1000);
            });

            observer.observe(target, {
                attributes: true
            });

            // Get close button and insert it into streetView
            // #button can be anyt dom element
            //var closeButton = document.querySelector('#btnStreetViewClose'),
            //    controlPosition = google.maps.ControlPosition.LEFT_CENTER;
            var closeButton = document.createElement('button'),
                controlPosition = google.maps.ControlPosition.LEFT_CENTER;
            closeButton.setAttribute('class', 'btnStreetViewClose');


            closeButton.innerHTML = 'x';
            // Assumes map has been initiated
            // var streetView = map.getStreetView();
            // Hide useless and tiny default close button
            panorama.setOptions({ enableCloseButton: false });
            // Add to street view
            panorama.controls[controlPosition].push(closeButton);
            // Listen for click event on custom button
            // Can also be $(document).on('click') if using jQuery
            google.maps.event.addDomListener(closeButton, 'click', function () {
                panorama.setVisible(false);
               // hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                document.getElementById("map_div").style.height = "calc(100% - 66px)";
                mpdiv.style.height = '0px';

            });

            panorama.addListener("position_changed", function () {
                var googlepoint = panorama.getPosition().toString();
                var ptArray = googlepoint.split(",");
                var lat = ptArray[0];
                lat = lat.substring(1, lat.length);
                var long = ptArray[1];
                long = long.substring(1, long.length - 1);
                ptItm = JSITM.gpsRef2itmRef(parseFloat(lat) + " " + parseFloat(long));
                var ptItmArray = ptItm.split(" ");
                govmap.zoomToXY({ x: parseFloat(ptItmArray[0]), y: parseFloat(ptItmArray[1]), level: 10, marker: true });
            });

            if (data.status == "OK") {
                // do nothing  there is data in coordinate
            }
            else {
                // no data found in coordinate

                var lblError = document.createElement("label");
                lblError.setAttribute("id", "googleSVError");
                lblError.style.color = "rgb(210, 18, 135)";
                lblError.style.backgroundColor = "rgb(251, 200, 232)";
                lblError.style.fontSize = "17px";
                lblError.style.fontFamily = "Alef-Regular";
                lblError.style.fontWeight = "700";
                lblError.innerHTML = "מבט רחוב אינו זמין במיקום המבוקש";

                // location of error msg is also controled by style css
                // look for googleSVError in style.css 
                panorama.controls[google.maps.ControlPosition.RIGHT_CENTER].push(lblError);
                // clear previous marker 

                clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);

            }
        });


}
function refreshDataTable(currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var obj = document.getElementById('dtableName');
    if (document.getElementById('chkfilterExtent') != null)
        var checked = document.getElementById('chkfilterExtent').checked; 
    if (obj != null && obj != undefined && obj.innerHTML.indexOf('טבלת')>-1 && checked )
    {
          
        var lname = obj.innerHTML.split(":")[1];
        showTable(currentDataTableLayerName, currentSortedColumn.value, "down", checked, currentSortedColumn,selectedIDInDatatable,slectedLayerInDatatable,panorama,heatmapLayer,heatmapField,drawTextData,drawTextItems);
    }
}
function exportLayerToGeojson()
{
    
    var onlygeometry = document.getElementById('gjsononlygeometry').checked;
    var lname = document.getElementById('onlygeometrylname').value;
    if (onlygeometry && lname.length > 0) 
        LayerToGeojsonObjectIDOnlyGeometry(lname);
    else
        LayerToGeojsonObjectID();
}
function LayerToGeojson()
{

    document.body.style.cursor = 'wait';
    var lnameheb = document.getElementById('layerInformationHeader').innerHTML;
    var lname = layerHebEng[lnameheb];

    var geom_type;
    var geo_json;
    var empty_features_list = [];
    console.log("start...");
   
    var fields = identifyFields[lname];
    //fields.push('OBJECTID');
    var israelExtentPolygonGeo = "POLYGON((129897.85 818015.41, 287854.42 818015.41, 287854.42 376689.53, 129897.85 376689.53, 129897.85 818015.41))";
    var objectids = [];
    var counter = 0;
    var arrayofdefers = [];
    var polygonswithmoretahn500 = [];
    var frompoly = parseInt(document.getElementById('frompoly').value);
    var topoly = parseInt(document.getElementById('topoly').value);
    var all = document.getElementById('allpolygonstogeojson').checked;
    if (all)
    {
        frompoly = 999;
        topoly = 999;
    }
    for (p = frompoly; p <= topoly; p++)
    {
        polygon = israel_polygons[p];
        (function (polygon,p,counter)
        {
          arrayofdefers.push(  govmap.intersectFeatures({ 'geometry': polygon, 'layerName': lname, 'fields': fields, getShapes: true })
              .then(function (e) {
                  document.getElementById('currentpolygonnumber').innerText = p;
                    if (e.data != null) {
                        //setTimeout(function () {console.log("timeout");}, 5000);
                        e_obj = e;
                        //objectids = [];
                        for (i = 0; i < e_obj.data.length; i++)
                        {
                            if (e_obj.data.length == 500)
                            {
                                if (polygonswithmoretahn500.includes(i) == false)
                                    polygonswithmoretahn500.push(p);
                            }
                            
                            if (objectids.includes(e_obj.data[i].ObjectId) == false) {
                                objectids.push(e_obj.data[i].ObjectId);

                                full_wkt = e_obj.data[i].Values[e_obj.data[0].Values.length - 1];
                                if (full_wkt.includes("POLYGON")) {
                                    feat_wkt = full_wkt.replace("POLYGON  (( ", "").replace("))", "");
                                    geom_type = "Polygon";
                                }
                                if (full_wkt.includes("LINESTRING")) {
                                    feat_wkt = full_wkt.replace("LINESTRING  (( ", "").replace("))", "");
                                    feat_wkt = feat_wkt.replace("LINESTRING  ( ", "").replace(")", "");
                                    feat_wkt = feat_wkt.replace("LINESTRING ZM ( ", "").replace(")", "");
                                    geom_type = "LineString";
                                }
                                if (full_wkt.includes("POINT"))
                                {
                                    feat_wkt = full_wkt.replace("POINT  ( ", "").replace(")", "");
                                    geom_type = "Point";
                                }
                                var coordinates = [];
                                

                                if (document.getElementById('gjsonwithgeometry').checked) {
                                    coords = feat_wkt.split(", ");
                                    for (xy = 0; xy < coords.length; xy++) {
                                        if (coords[xy].split(" ").length > 0) {
                                            coordinates.push(parseFloat(coords[xy].split(" ")[0]), parseFloat(coords[xy].split(" ")[1]));
                                        }
                                    }

                                    if (geom_type == "Polygon") {
                                        coordinates = [coordinates];
                                    }
                                }
                                else
                                {
                                    coordinates.push(0, 0);
                                   // coordinates = [coordinates];
                                }
                                
                                var omit = ['OBJECTID','SHAPE_LENG','SHAPE_AREA'];
                                for (m = 0; m < omit.length; m++)
                                {
                                    var index = fields.indexOf(omit[m]);
                                    if (index > -1)
                                    {
                                        fields.splice(index, 1);
                                    }
                                }
                                //var index = fields.indexOf("OBJECTID");
                                

                                v = e_obj.data[i].Values;
                                properties = {};
                                for (f = 0; f < fields.length; f++) {
                                    properties[fields[f]] = v[f];
                                }
                                properties['OBJECTID'] = e_obj.data[i].ObjectId;
                                var feature = {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": geom_type,
                                        "coordinates":
                                            coordinates

                                    },
                                    "properties": properties
                                };
                                empty_features_list.push(feature);
                                
                            }


                        }
                        
                    }

                }));

          
            
        })(polygon,p,counter);

        
    }
 
    //
    $.when.apply($, arrayofdefers).then(function () {
        // do things that need to wait until ALL gets are done
        document.body.style.cursor = 'default';
        geo_json = {
            "type": "FeatureCollection",
            "features": empty_features_list
        };

        
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geo_json));

    //    // old save start
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        var nammeofgjson = (all)? lname + ".geojson": lname + "_" + frompoly + "_" + topoly + ".geojson";
        dlAnchorElem.setAttribute("download", nammeofgjson);
        dlAnchorElem.click();
        console.log(polygonswithmoretahn500);
    
    
        })
            
    
}

function LayerToGeojsonObjectID()
{
    var getGeometry = document.getElementById('gjsonwithgeometry').checked;
    document.body.style.cursor = 'wait';
    var lnameheb = document.getElementById('layerInformationHeader').innerHTML;
    var lname = layerHebEng[lnameheb];

    var geom_type;
    var geo_json;
    var empty_features_list = [];
    console.log("start...");

    var fields = identifyFields[lname];
        
    var objectids = [];
    var counter = 0;
    var arrayofdefers = [];
    var polygonswithmoretahn500 = [];
    var frompoly = parseInt(document.getElementById('frompoly').value);
    var topoly = parseInt(document.getElementById('topoly').value);
    var all = document.getElementById('allpolygonstogeojson').checked;
    if (all) {
        frompoly = 999;
        topoly = 999;
    }
    // teldor will only return 500 features in a query
    var numofLoops = Math.floor(parseInt(topoly) / 499);

    for (p = frompoly; p <= topoly; p+=499) {
        //polygon = israel_polygons[p];
        (function ( p, counter) {
            var step = p + 499;
            //arrayofdefers.push(govmap.intersectFeatures({ 'geometry': polygon, 'layerName': lname, 'fields': fields, getShapes: true })
            var sql = "OBJECTID >=" + p + " AND OBJECTID <=" + step;
            arrayofdefers.push(govmap.intersectFeaturesByWhereClause({ 'layerName': lname, 'fields': fields, getShapes: getGeometry, 'whereClause': sql })
                 .then(function (e) {
                    document.getElementById('currentpolygonnumber').innerText = p;
                    if (e.data != null) {
                        //setTimeout(function () {console.log("timeout");}, 5000);
                        e_obj = e;
                        //objectids = [];
                        for (i = 0; i < e_obj.data.length; i++) {
                            if (e_obj.data.length == 500) {
                                if (polygonswithmoretahn500.includes(i) == false)
                                    polygonswithmoretahn500.push(p);
                            }

                            if (objectids.includes(e_obj.data[i].ObjectId) == false) {
                                objectids.push(e_obj.data[i].ObjectId);

                                full_wkt = e_obj.data[i].Values[e_obj.data[0].Values.length - 1];
                                if ((typeof full_wkt == "string") && (full_wkt.includes("POLYGON"))) {
                                    feat_wkt = full_wkt.replace("POLYGON  (( ", "").replace("))", "");
                                    geom_type = "Polygon";
                                }
                                if ((typeof full_wkt == "string") && (full_wkt.includes("LINESTRING"))) {
                                    feat_wkt = full_wkt.replace("LINESTRING  (( ", "").replace("))", "");
                                    feat_wkt = feat_wkt.replace("LINESTRING  ( ", "").replace(")", "");
                                    feat_wkt = feat_wkt.replace("LINESTRING ZM ( ", "").replace(")", "");
                                    geom_type = "LineString";
                                }
                                if ((typeof full_wkt == "string") && (full_wkt.includes("POINT"))) {
                                    feat_wkt = full_wkt.replace("POINT  ( ", "").replace(")", "");
                                    geom_type = "Point";
                                }
                                var coordinates = [];


                                if (getGeometry) {
                                    coords = feat_wkt.split(", ");
                                    for (xy = 0; xy < coords.length; xy++) {
                                        if (coords[xy].split(" ").length > 0) {
                                            coordinates.push(parseFloat(coords[xy].split(" ")[0]), parseFloat(coords[xy].split(" ")[1]));
                                        }
                                    }

                                    if (geom_type == "Polygon") {
                                        coordinates = [coordinates];
                                    }
                                }
                                else {
                                    coordinates.push(0, 0);
                                    // coordinates = [coordinates];
                                }

                                //var index = fields.indexOf("OBJECTID");
                                //if (index > -1) {
                                //    fields.splice(index, 1);
                                //}
                                var omit = ['OBJECTID', 'SHAPE_LENG', 'SHAPE_AREA'];
                                for (m = 0; m < omit.length; m++) {
                                    var index = fields.indexOf(omit[m]);
                                    if (index > -1) {
                                        fields.splice(index, 1);
                                    }
                                }
                                v = e_obj.data[i].Values;
                                properties = {};
                                for (f = 0; f < fields.length; f++)
                                {
                                    // sviva mitkanim have small float values , heat map cant work on numbers smaller than 1 
                                    // the smallest number i saw was 0.0004 so  adding   1  shlould solve the issue 
                                    // in heat map values themselves dont matter as long as we keep the ratio 
                                    // avi the king 
                                    if (lname == 'SVIVA_MITKANIM')
                                    {
                                        var tmpVal = parseFloat(v[f]).toFixed(2) ;
                                        properties[fields[f]] = parseFloat( tmpVal) + 1;
                                    }
                                    else
                                        properties[fields[f]] = v[f];
                                }
                                properties['OBJECTID'] = e_obj.data[i].ObjectId;
                                var feature = {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": geom_type,
                                        "coordinates":
                                            coordinates

                                    },
                                    "properties": properties
                                };
                                empty_features_list.push(feature);

                            }


                        }

                    }

                }));



        })( p, counter);


    }

    //
    $.when.apply($, arrayofdefers).then(function () {
        // do things that need to wait until ALL gets are done
        document.body.style.cursor = 'default';
        geo_json = {
            "type": "FeatureCollection",
            "features": empty_features_list
        };


        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geo_json));

        //    // old save start
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        var nammeofgjson = (all) ? lname + ".geojson" : lname + "_" + frompoly + "_" + topoly + ".geojson";
        dlAnchorElem.setAttribute("download", nammeofgjson);
        dlAnchorElem.click();
        console.log(polygonswithmoretahn500);
        //    // old save end
        //    //////////
        //    // new save start
        //    //const blob = new Blob([dataStr]);
        //    //const fileStream = streamSaver.createWriteStream('sample.txt', {
        //    //    size: blob.size // Makes the procentage visiable in the download
    })

    //    // One quick alternetive way if you don't want the hole blob.js thing:
    //    // const readableStream = new Response(
    //    //   Blob || String || ArrayBuffer || ArrayBufferView
    //    // ).body
    //    //const readableStream = blob.stream()

    //    // more optimized pipe version
    //    // (Safari may have pipeTo but it's useless without the WritableStream)
    //    //if (window.WritableStream && readableStream.pipeTo) {
    //    //    return readableStream.pipeTo(fileStream)
    //    //        .then(() => console.log('done writing'))
    //    //}

    //    // Write (pipe) manually
    //    //window.writer = fileStream.getWriter()

    //    //const reader = readableStream.getReader()
    //    //const pump = () => reader.read()
    //    //    .then(res => res.done
    //    //        ? writer.close()
    //    //        : writer.write(res.value).then(pump))

    //    //pump()
    //    //////////
    //});

}

function LayerToGeojsonObjectIDOnlyGeometry(lname) {
    var getGeometry = true;
    document.body.style.cursor = 'wait';
    
    var geom_type;
    var geo_json;
    var empty_features_list = [];
    console.log("start...");

    
    var objectids = [];
    var counter = 0;
    var arrayofdefers = [];
    var polygonswithmoretahn500 = [];
    var frompoly = parseInt(document.getElementById('frompoly').value);
    var topoly = parseInt(document.getElementById('topoly').value);
    var all = document.getElementById('allpolygonstogeojson').checked;
    if (all) {
        frompoly = 999;
        topoly = 999;
    }
    // teldor will only return 500 features in a query
    var numofLoops = Math.floor(parseInt(topoly) / 499);

    for (p = frompoly; p <= topoly; p += 499) {
        //polygon = israel_polygons[p];
        (function (p, counter) {
            var step = p + 499;
            //arrayofdefers.push(govmap.intersectFeatures({ 'geometry': polygon, 'layerName': lname, 'fields': fields, getShapes: true })
            var sql = "OBJECTID >=" + p + " AND OBJECTID <=" + step;
            arrayofdefers.push(govmap.intersectFeaturesByWhereClause({ 'layerName': lname, 'fields': [], getShapes: getGeometry, 'whereClause': sql })
                .then(function (e) {
                    document.getElementById('currentpolygonnumber').innerText = p;
                    if (e.data != null) {
                        //setTimeout(function () {console.log("timeout");}, 5000);
                        e_obj = e;
                        //objectids = [];
                        for (i = 0; i < e_obj.data.length; i++) {
                            if (e_obj.data.length == 500) {
                                if (polygonswithmoretahn500.includes(i) == false)
                                    polygonswithmoretahn500.push(p);
                            }

                            if (objectids.includes(e_obj.data[i].ObjectId) == false) {
                                objectids.push(e_obj.data[i].ObjectId);

                                full_wkt = e_obj.data[i].Values[e_obj.data[0].Values.length - 1];
                                if ((typeof full_wkt == "string") && (full_wkt.includes("POLYGON"))) {
                                    feat_wkt = full_wkt.replace("POLYGON  (( ", "").replace("))", "");
                                    geom_type = "Polygon";
                                }
                                if ((typeof full_wkt == "string") && (full_wkt.includes("LINESTRING"))) {
                                    feat_wkt = full_wkt.replace("LINESTRING  (( ", "").replace("))", "");
                                    feat_wkt = feat_wkt.replace("LINESTRING  ( ", "").replace(")", "");
                                    feat_wkt = feat_wkt.replace("LINESTRING ZM ( ", "").replace(")", "");
                                    geom_type = "LineString";
                                }
                                if ((typeof full_wkt == "string") && (full_wkt.includes("POINT"))) {
                                    feat_wkt = full_wkt.replace("POINT  ( ", "").replace(")", "");
                                    geom_type = "Point";
                                }
                                var coordinates = [];


                                if (getGeometry) {
                                    coords = feat_wkt.split(", ");
                                    for (xy = 0; xy < coords.length; xy++) {
                                        if (coords[xy].split(" ").length > 0) {
                                            coordinates.push(parseFloat(coords[xy].split(" ")[0]), parseFloat(coords[xy].split(" ")[1]));
                                        }
                                    }

                                    if (geom_type == "Polygon") {
                                        coordinates = [coordinates];
                                    }
                                }
                                else {
                                    coordinates.push(0, 0);
                                    // coordinates = [coordinates];
                                }

                                //var index = fields.indexOf("OBJECTID");
                                //if (index > -1) {
                                //    fields.splice(index, 1);
                                //}
                                //var omit = ['OBJECTID', 'SHAPE_LENG', 'SHAPE_AREA'];
                                //for (m = 0; m < omit.length; m++) {
                                //    var index = fields.indexOf(omit[m]);
                                //    if (index > -1) {
                                //        fields.splice(index, 1);
                                //    }
                                //}
                                v = e_obj.data[i].Values;
                                var properties = {};
                                for (f = 0; f < v.length ; f++)
                                {
                                //    // sviva mitkanim have small float values , heat map cant work on numbers smaller than 1 
                                //    // the smallest number i saw was 0.0004 so  adding   1  shlould solve the issue 
                                //    // in heat map values themselves dont matter as long as we keep the ratio 
                                //    // avi the king 
                                //    if (lname == 'SVIVA_MITKANIM') {
                                //        var tmpVal = parseFloat(v[f]).toFixed(2);
                                        properties[f] = v[f];
                                }
                                //    else
                                //        properties[fields[f]] = v[f];
                                //}
                                properties['OBJECTID'] = e_obj.data[i].ObjectId;
                                var feature = {
                                    "type": "Feature",
                                    "geometry": {
                                        "type": geom_type,
                                        "coordinates":
                                            coordinates

                                    },
                                    "properties": properties
                                };
                                empty_features_list.push(feature);

                            }


                        }

                    }

                }));



        })(p, counter);


    }

    //
    $.when.apply($, arrayofdefers).then(function () {
        // do things that need to wait until ALL gets are done
        document.body.style.cursor = 'default';
        geo_json = {
            "type": "FeatureCollection",
            "features": empty_features_list
        };


        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geo_json));

        //    // old save start
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        var nammeofgjson = (all) ? lname + ".geojson" : lname + "_" + frompoly + "_" + topoly + ".geojson";
        dlAnchorElem.setAttribute("download", nammeofgjson);
        dlAnchorElem.click();
        console.log(polygonswithmoretahn500);
        //    // old save end
        //    //////////
        //    // new save start
        //    //const blob = new Blob([dataStr]);
        //    //const fileStream = streamSaver.createWriteStream('sample.txt', {
        //    //    size: blob.size // Makes the procentage visiable in the download
    })

    //    // One quick alternetive way if you don't want the hole blob.js thing:
    //    // const readableStream = new Response(
    //    //   Blob || String || ArrayBuffer || ArrayBufferView
    //    // ).body
    //    //const readableStream = blob.stream()

    //    // more optimized pipe version
    //    // (Safari may have pipeTo but it's useless without the WritableStream)
    //    //if (window.WritableStream && readableStream.pipeTo) {
    //    //    return readableStream.pipeTo(fileStream)
    //    //        .then(() => console.log('done writing'))
    //    //}

    //    // Write (pipe) manually
    //    //window.writer = fileStream.getWriter()

    //    //const reader = readableStream.getReader()
    //    //const pump = () => reader.read()
    //    //    .then(res => res.done
    //    //        ? writer.close()
    //    //        : writer.write(res.value).then(pump))

    //    //pump()
    //    //////////
    //});

}
function testsearchInLayer()
{
    var values = [];
    for (i = 6000; i < 6100; i++)
         values.push(i);
    var result = govmap.searchInLayer({ 'layerName': 'SUB_GUSH_ALL', 'fieldName': 'GUSH_NUM', 'fieldValues': values, 'highlight': true, 'outLineColor': "rgb(0,255,255)" });
}
function filterLayerbyDate(date, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    
    var minDate = document.getElementById("minDateVal").value;
    var minDD = minDate.split("/")[0];
    var minMM = minDate.split("/")[1];
    var minYY = minDate.split("/")[2];
    var maxDate =  document.getElementById("maxDateVal").value ;
    var maxDD = maxDate.split("/")[0];
    var maxMM = maxDate.split("/")[1];
    var maxYY = maxDate.split("/")[2];
    
    var lname = currentfilteredLayer;
    var fldname = currentfilteredField;
    //var SQL = fldname + " BETWEEN date'2016-01-01' AND date'2018-01-01'" ;
    var SQL = fldname + " BETWEEN date '" + minYY + "-" + minMM + "-" + minDD + "' AND date '" + maxYY + "-" + maxMM + "-" + maxDD +"'" ; 
  
    var index = getByValue(fieldFilterSqlArray, lname, currentfilteredField);

    if (index < 0) {
        // first filter on this layer

        fieldFilterSqlArray.push({ lyr: lname, field: fldname, sql: SQL });
        document.getElementById("cancel$" + lname + "$" + currentfilteredField).style.display = "block";

    }
    else if (index > -1)
    // filter was already done on this lyr and field
    {

        for (var i = 0; i < fieldFilterSqlArray.length; i++) {
            if (fieldFilterSqlArray[i].lyr == lname && fieldFilterSqlArray[i].field == fldname) {
                fieldFilterSqlArray[i].sql = SQL;
                break;
            }
        }
    }

    
    SQL = "";
    for (k = 0; k < fieldFilterSqlArray.length; k++) {
        if (fieldFilterSqlArray[k].lyr == lname) {
            if (SQL.length == 0)
                SQL = fieldFilterSqlArray[k].sql;
            else
                SQL = "(" + SQL +") AND  " + fieldFilterSqlArray[k].sql;
        }

    }



    govmap.filterLayers({ 'layerName': lname, 'whereClause': SQL, 'zoomToExtent': false })
        .then(function (e) {
            var obj = e;
        }, function (err) {
            var AccordionDiv = document.getElementById("filterErrorResult");
            AccordionDiv.innerHTML = 'השאילתא נכשלה';
            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
        });

    // in case that datatable is open with current layer  
    if (document.getElementById("map_div").className == "mapdivsmall")
        if (currentDataTableLayerName == lname)
            showTable(lname, 'all', currentSortedColumn.value, false, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable,panorama,heatmapLayer,heatmapField,drawTextData,drawTextitems); 

}
function parsestringHourToNumber(stringHour)
{
    var hourArray = stringHour.split(":");
    var hour = parseInt(hourArray[0]);
    var minute = parseInt(hourArray[1]);
    return hour + minute / 60;
}
function filterlayerbyfieldRange(min, max, identifylayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var SQL;
    var lname = currentfilteredLayer;
    var fldname = currentfilteredField;
    var fldType = currentfilteredFieldType;
    if (fldType == 7) {
       
        SQL = fldname +" >=" + parsestringHourToNumber(min);
        SQL += " AND " + fldname + " <= " + parsestringHourToNumber(max);
       // alert(SQL);
    }
    else
    {
        // regular numeric range 
        if (min != max) {
            min = parseFloat(min);
            max = parseFloat(max);
            SQL = fldname + " >= " + min + " AND " + fldname + " <= " + max;
        }
        else
            SQL = fldname + "=" + fldval;
    }
    

    var index = getByValue(fieldFilterSqlArray, lname, currentfilteredField);

    if (index < 0) {
        // first filter on this layer
        
        fieldFilterSqlArray.push({ lyr: lname, field: fldname, sql: SQL });
        document.getElementById("cancel$" + lname + "$" + currentfilteredField).style.display = "block";
        var ff = document.getElementById(lname + "_" + currentfilteredField);
        ff.style.backgroundColor = "rgba(31, 54, 90, 1)";
        ff.style.color = "white";
        
    }
    else if (index > -1)
    // filter was already done on this lyr and field
    {
        
        for (var i = 0; i < fieldFilterSqlArray.length; i++) {
            if (fieldFilterSqlArray[i].lyr == lname && fieldFilterSqlArray[i].field == fldname) {
                fieldFilterSqlArray[i].sql = SQL;
                break;
            }
        }
    }

    //fieldFilterSqlArray.push({ lyr: lname, field: fldname, sql: SQL });

    SQL = "";
    for (k = 0; k < fieldFilterSqlArray.length; k++) {
        if (fieldFilterSqlArray[k].lyr == lname) {
            if (SQL.length == 0)
                SQL = '(' +  fieldFilterSqlArray[k].sql + ')';
            else
                SQL = SQL + " AND (" + fieldFilterSqlArray[k].sql + ')';
        }

    }   

    
    

    govmap.filterLayers({ 'layerName': lname, 'whereClause': SQL, 'zoomToExtent': true })
        .then(function (e) {
            var obj = e;
        }, function (err) {
            var AccordionDiv = document.getElementById("filterErrorResult");
            AccordionDiv.innerHTML = 'השאילתא נכשלה';
            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
        });

    turnlayerOnOff("chk" + lname, true, identifylayers);

    // in case that datatable is open with current layer  
    if (document.getElementById("map_div").className == "mapdivsmall")
        if (currentDataTableLayerName == lname)
            showTable(lname, currentSortedColumn.value, 'up', false, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable,panorama,heatmapLayer,heatmapField,drawTextData,drawTextItems); 
}

function insertchar(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function filterlayerbyfield(fldval, identifylayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
   // alert("לטפל במצב שכבר תישאלנו את אותו שדה באותה שכבה כבר בעבר");
    //var apostrofIndex = fldval.indexOf('"');
   // if (apostrofIndex > -1)
    //    fldval = insertchar(fldval, apostrofIndex  ,"''");

    if (fldval == '$$$')
    {// free text
        fldval = document.getElementById('txtfilterFreeText').value;
        fldval = fldval.trim();
    }
    str1Apostroph = String.fromCharCode(39);
    str2Apostroph = String.fromCharCode(44);
    strSlash1 = String.fromCharCode(47); // / 
    strSlash2 = String.fromCharCode(92); // \
    var comparesign = " = ";

    // replace all occurrences of  one apostrophe in strring with two 
    // before replace make sure its not a number otherwise it wont work
    if (isNaN(fldval))
    {
        if (fldval.indexOf(str1Apostroph) > 0)
            fldval = fldval.replace(/'/g, str1Apostroph + str1Apostroph);
        if (fldval.indexOf(str2Apostroph) > 0)
            fldval = fldval.replace(/'/g, str2Apostroph + str2Apostroph);
        if (fldval.indexOf('/') > 0)
        {
            fldval = fldval.replace('/', strSlash1);
            comparesign = " LIKE ";
        }
        
        if (fldval.lastIndexOf('\\') > 0)
        {
            fldval = fldval.replace('\\', strSlash2);    
            comparesign = " LIKE ";
        }
        
    }
    
    //  'גשר האצ\ל

    var lname = currentfilteredLayer;
    turnlayerOnOff("chk" + lname, true, identifylayers);


    var fieldtype = currentfilteredFieldType;
    var index;
    if (fieldtype == 2)
        index = getByValue(fieldFilterSqlArray, lname, 'OBJECTID');
    else
        index = getByValue(fieldFilterSqlArray, lname, currentfilteredField);
    var SQL;
    var apostrophe = "";
    var rightapostrophe = "";
    var fldName;
    //var glyph;
    //var obj;
    if (fieldtype == 2)
        fldName = "OBJECTID";
    else if (fieldtype == 3 || fieldtype == 4 || fieldtype ==1 )
        fldName = currentfilteredField;
    if (isFieldString[lname+'_'+ fldName])
    {
        apostrophe = "'";
        
    }
    if (index < 0) {
        // first filter on this layer
        //SQL = fldName.concat(String.fromCharCode(61), String.fromCharCode(92), String.fromCharCode(39), fldval, String.fromCharCode(92), String.fromCharCode(39));
        SQL = fldName.concat(comparesign, apostrophe, fldval,apostrophe);
        fieldFilterSqlArray.push({ lyr: lname, field: fldName, sql: SQL });
        document.getElementById("cancel$" + lname + "$" + currentfilteredField).style.display = "block";
        var ff = document.getElementById(lname + "_" + currentfilteredField);
        ff.style.color = "white";
        ff.style.backgroundColor = "rgba(31, 54, 90, 1)";
       
    }
    else if (index > -1)
    // filter was already done on this lyr and field
    {
        SQL = fldName.concat(comparesign, apostrophe, fldval, apostrophe);
        //SQL = fldName.concat(String.fromCharCode(61), String.fromCharCode(39), fldval, String.fromCharCode(39));
        for (var i = 0; i < fieldFilterSqlArray.length; i++) {
            if (fieldFilterSqlArray[i].lyr == lname && fieldFilterSqlArray[i].field == fldName)
            {


                if (fieldtype == 2 || fieldtype == 3 || fieldtype == 1) {
                    fieldFilterSqlArray[i].sql = SQL;
                }
                else if (fieldtype == 4)
                {

                    //if (fieldFilterSqlArray[i].sql.indexOf(fldval) > -1)// we filtered this value already so do nothing
                    if (ValueExistInOrCondition(fldval, fieldFilterSqlArray[i].sql))
                        break;
                    else {
                        fieldFilterSqlArray[i].sql += " OR " + SQL;
                        break;
                    }
                }
                
                
            }
        }
    }
        
    SQL = "";
    for (k = 0; k < fieldFilterSqlArray.length; k++) {
        if (fieldFilterSqlArray[k].lyr == lname)
        {
            // if we have an OR condition make sure it is in brackets 
            
            if (SQL.length == 0)
                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1) {
                    SQL = '(' + fieldFilterSqlArray[k].sql + ')';
                }
                else
                    SQL = fieldFilterSqlArray[k].sql;
            else

                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1) {
                    SQL = SQL + ' AND (' + fieldFilterSqlArray[k].sql + ')';
                }
                else
                     SQL =  SQL + ' AND ' + fieldFilterSqlArray[k].sql;
        }
        
    }   
   // SQL = "PRJ_NAME LIKE '%חומש%'";
    //SQL = "CITY LIKE '%אבו%'";
    govmap.filterLayers({ 'layerName': lname, 'whereClause': SQL, 'zoomToExtent': true })
        .then(function (err) {

        }, function (err) {
            var AccordionDiv = document.getElementById("filterErrorResult");
            AccordionDiv.innerHTML = 'השאילתא נכשלה';

            
            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
        });

    // in case that datatable is open with current layer  
    if (document.getElementById("map_div").className == "mapdivsmall")
        if (currentDataTableLayerName == lname)
            showTable(lname, currentSortedColumn.value, "down", false, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems); 
    
}

function ValueExistInOrCondition(value, sqlOrCondition)
{
    var orSQlArray = sqlOrCondition.split(" OR ");
    for (k = 0; k < orSQlArray.length; k++)
    {
        tmpVal = orSQlArray[k].split('=')[1];
        if (isNaN(tmpVal))
            // in case we string remove quotation marks
            tmpVal = tmpVal.slice(1, -1);
        if (tmpVal == value)
            return true;
    }
    return false;

}

function deductFieldFromFilter(obj, identifyLayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var SQL = "";
    var lname = obj.id.split("$")[1];
    var fldName = obj.id.split("$")[2];
    // remove red בטל 
    obj = document.getElementById("cancel$" + lname + "$" + fldName);
    obj.style.display = 'none';
    var ff = document.getElementById(lname + "_" + fldName);
    ff.style.color = "black";
    ff.style.backgroundColor = "white";

    if (FieldFilter[lname +'_'+ fldName][0] == 2)
        fldName = 'OBJECTID';
    for (var i = 0; i < fieldFilterSqlArray.length; i++) {
        if (fieldFilterSqlArray[i].lyr == lname && fieldFilterSqlArray[i].field == fldName) {
            fieldFilterSqlArray.splice(i,1);
            break;
        }

    }
    SQL = "";
    for (k = 0; k < fieldFilterSqlArray.length; k++)
    {
        if (fieldFilterSqlArray[k].lyr == lname)
        {

            //
            if (SQL.length == 0)
                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1) {
                    SQL = '(' + fieldFilterSqlArray[k].sql + ')';
                }
                else
                    SQL = fieldFilterSqlArray[k].sql;
            else

                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1) {
                    SQL = SQL + ' AND (' + fieldFilterSqlArray[k].sql + ')';
                }
                else
                    SQL = SQL + ' AND ' + fieldFilterSqlArray[k].sql;
            //


            //if (SQL.length == 0)
            //    SQL = fieldFilterSqlArray[k].sql;
            //else
            //    SQL =  SQL + " AND " + fieldFilterSqlArray[k].sql;
            
        }
        
    }
    if (SQL.length == 0)
        SQL = 'OBJECTID>-1';

    govmap.filterLayers({ 'layerName': lname, 'whereClause': SQL, 'zoomToExtent': false })
        .then(function () {

        }, function (err) {
            var AccordionDiv = document.getElementById("filterErrorResult");
            AccordionDiv.innerHTML = 'השאילתא נכשלה';


            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
        });

    turnlayerOnOff("chk" + lname, true, identifyLayers);

    // in case that datatable is open with current layer  
    if (document.getElementById("map_div").className == "mapdivsmall")
        if (currentDataTableLayerName==lname)
            showTable(lname, currentSortedColumn.value, "down", false, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable,panorama); 
}
function deductSubFieldFromFilter(obj, identifylayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var SQL = "";
    var sqlParams = obj.id.split("$");
    var lname = sqlParams[1];
    var fldName = sqlParams[2];
    var fldval = sqlParams[3];
    // remove red בטל 
    obj = document.getElementById("subfieldCancel$" + lname + "$" + fldName +"$" +fldval);
    obj.style.display = 'none';
    var SFF = document.getElementById(lname + "_" + fldName);
    SFF.style.color = "white";
    SFF.style.backgroundColor = "rgba(31, 54, 90, 1)";


    if (FieldFilter[lname + '_' + fldName][0] == 2)
        fldName = 'OBJECTID';
    for (var i = 0; i < fieldFilterSqlArray.length; i++) {
        if (fieldFilterSqlArray[i].lyr == lname && fieldFilterSqlArray[i].field == fldName)
        {
            if (fieldFilterSqlArray[i].sql.indexOf(" OR ") == -1)
            // there is only only one condition 
            {
                fieldFilterSqlArray.splice(i, 1);
                obj = document.getElementById("cancel$" + lname + "$" + fldName );
                obj.style.display = 'none';
                var sff = document.getElementById(lname + "_" + fldName);
                sff.style.color = "black";
                sff.style.backgroundColor = "white";
            }
            else if (fieldFilterSqlArray[i].sql.indexOf(" OR ") > -1)
            // more than one condition
            {
                var conditions = fieldFilterSqlArray[i].sql.split(" OR ");
                for (m = 0; m < conditions.length; m++)
                {
                    if( ValueExistInOrCondition(fldval,conditions[m]))
                    //if (conditions[m].indexOf(fldval) > -1)
                    {
                        conditions.splice(m, 1);
                        break;
                    }
                }
                var subfldSQl = "";
                for (j = 0; j < conditions.length; j++)
                {
                    if (subfldSQl.length == 0)
                        subfldSQl =  conditions[j];
                    else
                        subfldSQl += ' OR '+ conditions[j];
                }
                fieldFilterSqlArray[i].sql = subfldSQl;

            }
        }

    }
    SQL = "";
    for (k = 0; k < fieldFilterSqlArray.length; k++)
    {
        if (fieldFilterSqlArray[k].lyr == lname)
        {
            //
            // if we have an OR condition make sure it is in brackets 

            if (SQL.length == 0)
                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1) {
                    SQL = '(' + fieldFilterSqlArray[k].sql + ')';
                }
                else
                    SQL = fieldFilterSqlArray[k].sql;
            else

                if (fieldFilterSqlArray[k].sql.indexOf(" OR ") > -1) {
                    SQL = SQL + ' AND (' + fieldFilterSqlArray[k].sql + ')';
                }
                else
                    SQL = SQL + ' AND ' + fieldFilterSqlArray[k].sql;
            //


            //if (SQL.length == 0)
            //    SQL = fieldFilterSqlArray[k].sql;
            //else
            //    SQL = "(" + SQL +") AND " + fieldFilterSqlArray[k].sql;
        }
        
    }
    if (SQL.length == 0)
        SQL = 'OBJECTID>-1';

    govmap.filterLayers({ 'layerName': lname, 'whereClause': SQL, 'zoomToExtent': false })
        .then(function () {

        }, function (err) {
            var AccordionDiv = document.getElementById("filterErrorResult");
            AccordionDiv.innerHTML = 'השאילתא נכשלה';


            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
        });

    turnlayerOnOff("chk"+lname,true,identifylayers );

    // in case that datatable is open with current layer  
    if (document.getElementById("map_div").className == "mapdivsmall")
        if (currentDataTableLayerName == lname)
            showTable(lname, currentSortedColumn.value, "down", false, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems); 
}
function getByValue(arr, lname,field) {

    for (var i = 0, iLen = arr.length; i < iLen; i++) {
        if (arr[i].lyr == lname && arr[i].field == field) return i;
    }
    for (var j = 0, jLen = arr.length; j < jLen; j++)
    {
        if (arr[j].lyr == lname)
            return -1; 
    }
    return -2;
}

function cleanFieldstr(str)
{
    var currenttext = str.toString();
        
    currenttext = currenttext.replace(/'/g, "");
    currenttext = currenttext.replace(/[[\]]/g, '');
    currenttext = currenttext.replace(/,/g, "");
    //currenttext = currenttext.replace(/"/g, "");
    //currenttext = currenttext.replace(/\\/g, "");
    
    return currenttext;
}

function clearFieldFilter() {
    var lname = document.getElementById('fieldfilterlname').value;
    govmap.filterLayers({ 'layerName': lname, 'whereClause': "OBJECTID>-1", 'zoomToExtent': false });
}
function enableDisableConvertToGeoJson()
{
    var crntUrl = window.location.href;
    if (crntUrl.indexOf("localhost") == -1) return;

    $('#btnConvertTableToGeojson').toggle();
    $('#frompoly').toggle();
    $('#frompolylbl').toggle();
    $('#topoly').toggle();
    $('#topolylbl').toggle();
    $('#allpolygonstogeojson').toggle();
    $('#allpolygonstogeojsonlbl').toggle();
    $('#gjsonwithgeometry').toggle();
    $('#gjsonwithgeometrylbl').toggle();
    $('#currentpolygonnumber').toggle();

    $('#gjsononlygeometrylbl').toggle();
    $('#gjsononlygeometry').toggle();
    $('#onlygeometrylname').toggle();
    $('#gjsononlygeometrylnamelbl').toggle();

}
function changeIcon(id , iconName)
{
    document.getElementById(id).src = iconName;
    
}
function changeColor(obj, bgcolor, txtcolor)
{
    obj.style.backgroundColor = bgcolor;
    obj.style.color = txtcolor;
}
function changeIconSRC(name,src)
{
    document.getElementById(name).src = src;
}
function hideAdditionalResults()
{
    hideForm('additionalresults');
    document.getElementById('closeAditionalResults').style.display = 'none';
}

function updateSLVal()
{
    alert("slider value changed");
}
function groupButtonValidate(buttonName,eventname)
{
    var button = document.getElementById(buttonName);
    var clicked = button.attributes.value.nodeValue;
    if ( clicked== "0" & eventname =="onmouseover")
        document.getElementById(buttonName).src = 'icons/' + buttonName + '_blue.png';
    else if (clicked == "0" & eventname == "onmouseout")
        document.getElementById(buttonName).src = 'icons/' + buttonName + '_grey.png';
    else if (clicked == "1")
        document.getElementById(buttonName).src = 'icons/' + buttonName + '_blue.png';
}
function drawColorGroupButtonValidate(buttonName, eventname) {
    var button = document.getElementById(buttonName);
    var clicked = button.attributes.value.nodeValue;
    if (clicked == "0" & eventname == "onmouseover") {
        document.getElementById(buttonName).src = 'icons/' + buttonName + '_blue.png';
        document.getElementById(buttonName).style.width = "35px";
        document.getElementById(buttonName).style.height = "35px";
    }
    else if (clicked == "0" & eventname == "onmouseout") {
        document.getElementById(buttonName).src = 'icons/' + buttonName + '_grey.png';
        document.getElementById(buttonName).style.width = "28px";
        document.getElementById(buttonName).style.height = "28px";
    }
    else if (clicked == "1")
    {
        document.getElementById(buttonName).src = 'icons/' + buttonName + '_blue.png';
        document.getElementById(buttonName).style.width = "35px";
        document.getElementById(buttonName).style.height = "35px";
    }
    
}
function clickUnclickGroupButtons(buttonName)
{
    
    var groupbuttons = ['people', 'roads', 'prefer', 'bycycle', 'bus', 'train'];
    for (i = 0; i < groupbuttons.length; i++)
    {
        var button = document.getElementById(groupbuttons[i]);
        
        if (button.id == buttonName)
            button.attributes.value.nodeValue = "1";
        else
            button.attributes.value.nodeValue = "0";
    }
}

function clickUnclickGroup(buttonName, groupbuttons) {

    
    for (i = 0; i < groupbuttons.length; i++) {
        var button = document.getElementById(groupbuttons[i]);

        if (button.id == buttonName) {
            button.attributes.value.nodeValue = "1";
            button.attributes.src.nodeValue = "icons/" + button.attributes.id.nodeValue + "_blue.png";
           
        }
        else
        {
            button.attributes.value.nodeValue = "0";
            button.attributes.src.nodeValue = "icons/" + button.attributes.id.nodeValue + "_grey.png";
           
        }
        
    }
}
function validateidentifyBufferBackground(obj)
{
    if (obj.name == '0')
        obj.src = "icons/identify_Point_white.png";

}
function clickUnclickBufferDrawShape(buttonName, groupbuttons) {

    var radius = document.getElementById("bufferRadius").value;
    if (radius.length == 0) {
        document.getElementById("bufferError").innerHTML = "יש להזין ערך לרדיוס ";
        return;
    }
    else {
        radius = parseInt(radius);
        document.getElementById("bufferError").innerHTML = "";
    }

    for (i = 0; i < groupbuttons.length; i++) {
        var button = document.getElementById(groupbuttons[i]);

        var geotype = button.id.slice(6, button.id.length);
        if (button.id == buttonName) {
            button.attributes.value.nodeValue = "1";
            
            button.attributes.src.nodeValue = "icons/" + geotype + "_blue.png";
            button.style.width = "35px";
            button.style.height = "35px";
        }
        else {
            button.attributes.value.nodeValue = "0";
            button.attributes.src.nodeValue = "icons/" + geotype + "_grey.png";
            button.style.width = "35px";
            button.style.height = "35px";
        }

    }
}

function clickUnclickColorGroup(buttonName, groupbuttons) {


    for (i = 0; i < groupbuttons.length; i++) {
        var button = document.getElementById(groupbuttons[i]);

        if (button.id == buttonName) {
            button.attributes.value.nodeValue = "1";
            button.attributes.src.nodeValue = "icons/" + button.attributes.id.nodeValue + "_blue.png";
            button.style.width = "35px";
            button.style.height = "35px";
        }
        else {
            button.attributes.value.nodeValue = "0";
            button.attributes.src.nodeValue = "icons/" + button.attributes.id.nodeValue + "_grey.png";
            button.style.width = "28px";
            button.style.height = "28px";
        }

    }
}
function validateNumeric(value)
{
    if (isNaN(parseInt(value)))
        return false;
    else if (parseInt(value) < 1)
        return false;
    else
        return true;
}
function filterNumber(selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    var val = document.getElementById("txtfilterFreeText").value;
    if (validateNumeric(val))
    {
        filterlayerbyfield('$$$', identifylayers, currentSortedColumn, selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        document.getElementById("errorMsgTD").innerHTML = "";

    }
    
    else
    {
        document.getElementById("errorMsgTD").innerHTML = "הערך לא תקין";
    }

}
function enterPressed(e) {
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code == 13) { //Enter keycode
        filterNumber(selectedIDInDatatable,slectedLayerInDatatable,panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        return false;
    }
    return true;
}


function searchInLayerAvi()
{
   
    var params = {
        interfaceName: 'WPLAN2019Q2',
        continous: false,
        drawType: govmap.drawType.Rectangle,
        outLineColor: "[0,255,255]"
    }
    govmap.selectFeaturesOnMap(params.interfaceName, params.drawType, params.continous).then(function (response)
    {
        console.log(response);
    }
    );

}
function getjuriWithoutNode()
{
    var fieldname1 = 'MUNI_HEB';
    var fieldname2 = 'CR_PNIM';
    
    var result = [];

    $.ajax({
        url: "REGIONAL_AUTHORITIES.json",
        dataType: "json",
        success: function (data)
        {
                        
                //var features = [];
                //features = data.features;

                //console.log('there are ' + features.length + ' features');

                //

            var features = [];
            features = data.features;
            //console.log('there are ' + features.length + 'features');
            for (i = 0; i < features.length; i++) {
                //  console.log(features); 
                var feature = features[i];
                //console.log(feature);
                var fldvalue1 = feature.properties[fieldname1];
                var fldvalue2 = feature.properties[fieldname2];
                //console.log("OBJECTID=" + feature.properties['OBJECTID']);
                console.log("fldVal1 =" + fldvalue1);
                console.log("fldVal2 =" + fldvalue2);
                var ob = {};
                ob.id = feature.properties['OBJECTID'];
                ob.value1 = fldvalue1;
                ob.value2 = fldvalue2;
                //if (result.includes(fldvalue1) == false)
                result.push(ob);
            }
                //



                console.log('only  ' + result.length + ' results fit the selected criteria');
                response.setHeader("Content-Type", "text/json");
                // on production change * to server name 
                response.setHeader("Access-Control-Allow-Origin", "*");
                response.end(JSON.stringify(result));
            
        }
    })
}

function buildHeatmapWithoutNode()
{
    var params = {
        points: [],
        options: { valueField: 'value', radius: 'radius' }
    };
    var fieldid = 'Q_CO';
    var result = [];
    $.ajax({
        url: "SVIVA_MITKANIM_MINI.json",
        dataType: "json",
        success: function (data) {
            var jsondata = data;
            var filter = fieldFilterSqlArray;
            //var features = [];
            features = data.features;
            var lyrName = 'ACCIDENTS';            
           

            for ( i = 0; i < features.length; i++)
            {
                //console.log(features); 
                var feature = features[i];
                //console.log(feature);
                var fldvalue;
                if (parseInt(fieldid) == -1)
                    // user didnt select a field so we give value 1 to all features
                    fldvalue = 1;
                else
                    fldvalue = feature.properties[fieldid];
                //console.log("OBJECTID=" + feature.properties['OBJECTID']);
                //console.log("fldVal =" + fldvalue + " ID=" + i);
                var ob = {};
                ob.id = feature.properties['OBJECTID'];
                if (Number.isInteger(fldvalue))
                    ob.value = parseInt(fldvalue);
                else
                    ob.value = parseFloat(fldvalue).toFixed(2);

                geom = feature.geometry['coordinates'];
                //  console.log(utf8.decode( feature.properties['HUMRA']));
                ob.geometry = geom;

                var res = true;

                for (j = 0; j < filter.length; j++) {
                    // make sure filter is on heatmap layer
                    if (filter[j].lyr == lyrName) {
                        var field = filter[j].field;
                        var fldVal = feature.properties[field];

                        //console.log(filter[j].sql);

                        if (filter[j].sql.indexOf(" OR ") > -1) {
                            
                            //return false;
                            if (ValueExistInOrCondition(fldVal, filter[j].sql)==false)
                                res = false;


                        }
                        else {
                            // we dont have OR in the SQL query parse the sql and use exact comparison 
                            var field = filter[j].field;
                            var value = filter[j].sql.split("=")[1];
                            var currentValue;
                            // if filter value is string remove quotations
                            if (isNaN(value)) {
                                value = value.slice(1, -1).trim();
                                currentValue = feature.properties[field].trim();

                            }
                            else {
                                // for some reason if you trim() a number you get an error
                                currentValue = feature.properties[field]
                            }


                            if (currentValue != value) {
                                //console.log(curre);
                                res = false;

                            }
                            else {
                                //console.log('not TA ' + feature.properties[field])
                            }

                        }

                    }


                }

                if (res) {
                    if (ob.value > 0)
                        result.push(ob);
                }


            }

            for (m = 1; m < result.length; m++) {
                if (result[m].value != null)
                {
                    var intVal; 
                    if (Number.isInteger(result[m].value))
                        intVal = parseInt(result[m].value);
                    else
                        intVal = parseFloat(result[m].value).toFixed(2);

                   
                    params.points.push({
                        'point': { 'x': result[m].geometry[0], 'y': result[m].geometry[1] },
                        'attributes': { 'value': intVal, 'radius': intVal * 10, 'opacity': intVal * 20 }
                    });


                }
            }
            govmap.setHeatLayer(params);  
        }
    });



    
}

function checkfilterValues(filter, feature) {
    console.log("inside check filter value");
    var res = true;
    
    for (i = 0; i < filter.length; i++) {
    
        field = filter[i].field;
        console.log(field);

        value = filter[i].sql.split("=")[1];
        value = value.slice(1, -1);
    
    
        if (feature.properties[field] != value) {
    
            res = false;
            return res;
        }
    
    }
    
    return res;

}

Number.isInteger = Number.isInteger || function (value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};
function buildHeatMap(identifylayers, heatmapLayer,heatmapField, lname, fldName) {
       
    //var lname = document.getElementById('optHeatLayer').value;
    //var optionSelect = document.getElementById('optHeatField');
    //var fldName = document.getElementById('optHeatField').value;

    //heatmapObject.push('heatLayer=' + lname + '$$' + 'heatField=' + fldName);
    //var turnLayerOnOff = document.getElementById("chkheatMap").checked;
    //turnlayerOnOff("chk" + lname, turnLayerOnOff, identifylayers);
    heatmapLayer.value = lname;
    heatmapField.value = fldName;
    var multiply1 = 10;
    var multiply2 = 20;
    var fieldcode = getFieldID(lname, fldName);
    var filecode = layerEngHeb[lname][1];

    var params = {
        points: [],
        options: { valueField: 'value', radius :'radius'}
    };
       

    //document.body.style.cursor = 'wait';
    var url = checkUrl() + "/heatmap";

    var info = {
        fieldname: fieldcode,
        filename: filecode,
        filter: fieldFilterSqlArray
    };
    
    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data)
        {
            //for (i = 0; i < 10; i++) {
            for (i = 0; i < data.length; i++) {

                 if (data[i].value != null) {
                    //var intVal = parseInt(data[i].value) ;
                    //
                    var Val;
                    var Val10;
                    var Val20;
                    if (Number.isInteger(data[i].value)) {
                        Val = parseInt(data[i].value);
                        Val10 = Val * multiply1;
                        Val20 = Val * multiply2;
                    }
                    else
                    {
                        Val = parseFloat(data[i].value).toFixed(2);
                        Val10 = parseFloat(Val * multiply1).toFixed(2);
                        Val20 = parseFloat(Val * multiply2).toFixed(2);
                    }
                     if (lname == 'SVIVA_MITKANIM')
                     {
                         val20 = Val*3;
                         Val10 = Val*6;
                         
                     }
                    //
                    if (Val == 0) continue;
                    params.points.push({
                        'point': { 'x': data[i].geometry[0], 'y': data[i].geometry[1] },
                        'attributes': { 'value': Val, 'radius': Val10, 'opacity': Val20}
                    });


                }
            }
            govmap.setHeatLayer(params);  
            
        })
    
}
function GTFS_Get_Bus_Routes_For_Stop(stop_id, currentBusName, currentBusStopName) {

    var url = checkUrl() + "/GTFS_Route_By_StopID";
    var info = {
        stop_id: stop_id,

    };

    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {
            // in case typeahead already exist distroy so we can build again

            
            var fieldValues = [];
            var lname = "BUSROUTES";
            var formatedData = Build_Bus_Route_Data_Format(data);
            fieldValues.push({ 'layer': lname, 'data': formatedData });
            if (isMobile)
            {
               
                DisplayIdentifyresultsMobile(fieldValues, lname, [''], 'down', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, false, routeSteps);
            }

            else
                DisplayIdentifyresults(fieldValues, lname, [''], 'down', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, false);
            $.unblockUI();
            

        });
}

function GTFS_Get_Bus_Options(bus_num, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, clearDrawings,userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS)
{
    
    var url = checkUrl() + "/GTFS_Bus_Options";
    var info = {
        Bus_num: bus_num,

    };

    (function (clearDrawings)
    {
        $.ajax
            ({
                type: "POST",
                url: url,
                crossDomain: true,
                dataType: "json",
                data: JSON.stringify(info)
            }).done(function (data) {
                // in case typeahead already exist distroy so we can build again


                var busOptionsDIv = document.getElementById("busOptionsDIv");

                busOptionsDIv.style.position = "absolute";
                busOptionsDIv.style.display = "block";

                busOptionsDIv.style.zIndex = "1000";

                if (isMobile)
                {
                    busOptionsDIv.style.width = '100%';
                    busOptionsDIv.style.top = '37%';
                    busOptionsDIv.style.maxHeight = "150px";
                    busOptionsDIv.style.overflowY = 'auto';
                    busOptionsDIv.style.left = '';
                }

                if (busOptionsDIv.children.length > 0) {
                    try {
                        //busOptionsDIv.removeChild(busOptionsDIv.children[0]);
                        document.getElementById('busOptionsDIv').innerHTML = "";
                        document.getElementById('busOptionsDIv').style.display = "none";
                    }

                    catch (error) {
                        console.error(error);
                    }
                }

                var busOptionsTable = document.createElement("table");
                busOptionsTable.style.width = "99%";


                for (i = 0; i < data.length; i++) {
                    if (data[i].route_name != null) {
                        var tr = document.createElement("tr");
                        tr.style.borderBottom = '1px solid lightgrey';
                        tr.id = data[i].route_id;
                        tr.dataValue = data[i].route_name;
                        tr.style.backgroundColor = 'white';
                        tr.onmouseover = function () {
                            this.style.backgroundColor = "lightgrey";
                        }
                        tr.onmouseout = function () {
                            this.style.backgroundColor = "white";
                        }
                        tr.onclick = function ()
                        {
                            //if (document.getElementById('identifylayernameMobile') != null)
                            //    document.getElementById('identifylayernameMobile').innerHTML = '';
                            currentBusName = currentBusName + "@@@" + this.dataValue;
                            var myparentTr = $(this).closest('tr');
                            $(myparentTr).addClass('selected').siblings().removeClass('selected');
                            //
                            govmap.clearSelection();
                            govmap.clearDrawings();
                            clearGeometries(drawTextData, drawTextItems,userDrawnPointsWKTS,userDrawnLinesWKTS,userDrawnPolygonsWKTS)
                            //

                            var rt_id = this.id;
                            busOptionsDIv.innerHTML = "";
                            if (isMobile == false)
                                $("#searchAll").toggle();
                            document.getElementById('busOptionsDIv').style.display = 'none';
                            GTFS_Bus_Route_and_Stations(rt_id, heatmapLayer, heatmapField, drawTextData, drawTextItems, true, currentBusName, clearDrawings);

                        }

                        var td1 = document.createElement("td");
                        td1.style.textAlign = "right";
                        td1.style.width = '20%';
                        text = document.createTextNode(data[i].agency_name)
                        td1.appendChild(text);
                        var td3 = document.createElement("td");
                        td3.style.width = '20px';
                        td3.style.width = '5%';
                        tr.appendChild(td1);
                        tr.appendChild(td3);
                        var text = document.createTextNode(data[i].route_name)
                        var td2 = document.createElement("td");
                        td2.appendChild(text);
                        td2.style.textAlign = "right";
                        td2.style.width = '75%';
                        tr.appendChild(td2);
                        busOptionsTable.appendChild(tr);

                    }
                }

                busOptionsDIv.appendChild(busOptionsTable);

            });
    })(clearDrawings);

    
}
function GTFS_Bus_Route( data) {
       
    var wktstring = "LINESTRING(";
    var wkts = []; 
    var xmin = { value: 0 };
    var xmax = { value: 0 };
    var ymin = { value: 0 };
    var ymax = { value: 0 };
    var xarray = [];
    var yarray = [];
    for (i = 0; i < data.length; i++) {

        if (data[i].shape_pt_lat != null && data[i].shape_pt_lon != null )
        {
                    
            var val = WgsToIsrael(data[i].shape_pt_lat, data[i].shape_pt_lon); 
            //
            
            xval = data[i].shape_pt_lat;
            yval = data[i].shape_pt_lon
            
            
            //var coord = JSITM.gpsRef2itmRef(xval.toString() + " " + yval.toString());
            
            //var lat = parseFloat(coord.split(' ')[0]);
            //var long = parseFloat(coord.split(' ')[1]);
            //val[0] = lat;
            //val[1] = long;
            
            //

            if (i == 0)
            {
                xmin.value = val[0];
                xmax.value = val[0]
                ymin.value = val[1];
                ymax.value = val[1];
            }
            else
            {
                if (xmin.value > val[0] )
                    xmin.value = val[0];
                if (xmax.value < val[0])
                    xmax.value = val[0];
                if (ymin.value > val[1])
                    ymin.value = val[1];
                if (ymax.value < val[1])
                    ymax.value = val[1];

            }
                    
            wktstring += val[0] + " " + val[1] + ",";
                              
        }
    }
    // remove last apostroph

    xarray.sort((a, b) => a - b);
    yarray.sort((x, y) => x - y);
    var newwkts = wktstring.slice(0, -1) + ")"; 
    wkts.push(newwkts)
    var data =
    {
        wkts: wkts,
        names: [],
        geometryType: govmap.drawType.Polyline,
        defaultSymbol:
        {
            width: 2,
            color: [255, 38, 127, 1],
            
            fillColor: [255, 38, 127, 1]
        },
        clearExisting: false,
        data:
        {

        }
    };
    
    govmap.displayGeometries(data).then(function (e)
    {
                
    });
                
    govmap.zoomToExtent({ xmin: xmin.value, ymin: ymin.value, xmax: xmax.value, ymax: ymax.value ,level:3});

}

function GTFS_Bus_Route_and_Stations(route_id, heatmapLayer, heatmapField, drawTextData, drawTextItems, showBusStopsInfo, currentBusName,clearDrawings)
{
    
    var url = checkUrl() + "/GTFS_Bus_Route_and_Stations";
    var info = {
        Route_ID: route_id,

    };

    (function (clearDrawings)
    {

        $.ajax
            ({
                type: "POST",
                url: url,
                crossDomain: true,
                dataType: "json",
                data: JSON.stringify(info),
                beforeSend: function () {
                    $.blockUI({
                        message: '<h3> .... מביא נתונים מהשרת</h3>'

                    });


                },
            }).done(function (data) {
                GTFS_Bus_Trip_Stations(data[0]);
                GTFS_Bus_Route(data[1]);
                if (showBusStopsInfo) {
                    var fieldValues = [];
                    var lname = "BUSROUTESTATIONS";
                    var formatedData = Build_Bus_Stations_Data_Format(data);
                    fieldValues.push({ 'layer': lname, 'data': formatedData });
                    DisplayIdentifyresults(fieldValues, lname, [''], 'down', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName,currentBusStopName, clearDrawings);
                }

                $.unblockUI();
            })

    })(clearDrawings);
    
}
function Build_GoogleRouting_DataFormat(data)
{
    var newData = [];
    var rSteps = data.routes[0].legs[0].steps;
    
    for (i = 0; i < rSteps.length; i++) {


        var instructions = rSteps[i].instructions;
        var stringsToRemove = {
            '<b>': ' ',
            '</b>': ' ',
            '<wbr/>': ' ',
            '</div>': ' ',
            '<div style="font-size:0.9em">':' '
        }
        for (key in stringsToRemove) {
            instructions = instructions.replaceAll(key, stringsToRemove[key]);
        }
        
        var Route_Part = {
            index: i, Values: [instructions, rSteps[i].distance.text, rSteps[i].duration, ""]
        };
        newData.push(Route_Part);
    }
    return newData;

}
function Build_Routing_DataFormat(data)
{
    var newData = [];

    for (i = 0; i < data.legs[0].maneuvers.length; i++) {

        var Route_Part = {
            index: i, Values: [data.legs[0].maneuvers[i]['instruction'], data.legs[0].maneuvers[i]['verbal_post_transition_instruction'], data.legs[0].maneuvers[i]['verbal_pre_transition_instruction'], data.legs[0].maneuvers[i]['time']]
        };
        newData.push(Route_Part);
    }
    return newData;
}
function Build_Bus_Stations_Data_Format(data)
{
    var newData = [];
    
    for (i = 0; i < data[0].length; i++)
    {
        
        var station = {
            index: i, Values: [data[0][i]['stop_id'], data[0][i]['stop_name'], data[0][i]['stop_lat'], data[0][i]['stop_lon']]};
        newData.push(station);
    }
    return newData;
}
function Build_Bus_Route_Data_Format(data) {
    var newData = [];

    for (i = 0; i < data.length; i++) {

        var route= {
            index: i, Values: [data[i]['route_short_name'], data[i]['route_long_name'], data[i]['agency_name'], data[i]['route_id'] ]
        };
        
        newData.push(route);
    }
    return newData;
}

function GTFS_Bus_Trip_Stations(data)
{
        
    //var wkts = [];
    var val;
    var point;
    var stopIDS = '';

   
    var xarray = [];
    var yarray = [];


    for (i = 0; i < data.length; i++)
    {

        if (data[i].stop_lat != null && data[i].stop_lon != null && data[i].stop_id != null)
        {
            stopIDS += data[i].stop_id + ",";
        }
    }
    // remove last apostroph 
    stopIDS = stopIDS.substring(0, stopIDS.length - 1);
    govmap.intersectFeaturesByWhereClause({ 'layerName': 'BUS_STOPS_MOT', 'fields': identifyFields['BUS_STOPS_MOT'], getShapes: true, 'whereClause': 'STOP_ID IN(' + stopIDS +')' })
        .then(function (e) {
            if (e.data != null && e.data.length > 0)
            {
                var fieldValues = [];
                var lname = "BUS_STOPS_MOT";
                fieldValues.push({ 'layer': lname, 'data': e.data });
                //if (isMobile )
                //    DisplayIdentifyresultsMobile(fieldValues, lname, [''], 'down', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, false,routeSteps);
                //else
                //    DisplayIdentifyresults(fieldValues, lname, [''], 'down', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, false);

                for (j = 0; j < e.data.length; j++)
                {
                    var wkts = [];
                    wkts.push(e.data[j].Values[e.data[j].Values.length-1]);
                    xarray.push(e.data[j].Values[3].x);
                    yarray.push(e.data[j].Values[3].y);
                    var data =
                    {
                        wkts: wkts,
                        names: [],
                        geometryType: govmap.drawType.Point,
                        defaultSymbol:
                        {

                            outlineColor: [255, 38, 127, 0.5], // red
                            outlineWidth: 10,
                            fillColor: [255, 38, 127, 0.5]    // red
                        },
                        'symbols': [
   
                        ],
                        clearExisting: false,
                        data:
                        {

                        }
                    }
                    govmap.displayGeometries(data).then(function (e) {


                    });
                }

            }
        });
    xarray.sort((a, b) => a - b);
    yarray.sort((x, y) => x - y);
    //var bus_stop_symbol = CheckIconURL();


    turnlayerOnOff("chkBUS_STOPS_MOT", true, identifylayers);
    
    govmap.zoomToExtent({ xmin: xarray[0], ymin: yarray[0], xmax: xarray[xarray.length-1], ymax: yarray[yarray.length-1], level: 3 });

}
function checkUrl()
{
    var crntUrl = window.location.href;
    if (crntUrl.indexOf("localhost") > -1)
        return "http://localhost:443";
    else
        return "https://p.geo.mot.gov.il:443";
}

function authentiateSqlite( email, password)
{
    var url = checkUrl() + "/authenticate";
    
    //document.body.style.cursor = 'wait';

    var info = {
        email: email,
        password: password
    };

    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {

            if (data != null && data.length > 0) {
                $('#modal-signup').modal('hide');

                //alert(" hello : " + data[0].username);
                document.getElementById('username').innerHTML = data[0].username;
                document.getElementById("signErrorlabel").innerHTML = "";

            }
            else
            {
                document.getElementById("signErrorlabel").innerHTML = "מייל או ססמה אינם תקינים , אנא נסה שוב";
                document.getElementById('username').innerHTML ='';
            }
            
                
        })

}

function authentiateMongo(UserMail, UserName,collection) {
    var url = checkUrl() + "/getDataFromMongo";
    
    var collection = collection;
    //var  sql = { "properties.HUMRA": "קשה", "properties.CITY": "חולון" } // where clause
    var sql = { UserName: UserName, UserMail: UserMail };
    var fields = { UserNameHeb: 1 };


    var info = {
        collection: collection,
        sql: sql,
        fields:fields
    };

    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info)
        }).done(function (data) {

            if (data != null && data.length > 0) {
                $('#modal-signup').modal('hide');

                //alert(" hello : " + data[0].username);
                document.getElementById('user').innerHTML = data[0].UserNameHeb;
                document.getElementById("signErrorlabel").innerHTML = "";

            }
            else {
                document.getElementById("signErrorlabel").innerHTML = "מייל או ססמה אינם תקינים , אנא נסה שוב";
                document.getElementById('username').innerHTML = '';
            }


        })

}
function turnHeatMapLayerOnOff( identifylayers)
{
    var heatmaplyrName = document.getElementById('optHeatLayer').value;
    var turnLayerOnOff = document.getElementById("chkheatMap").checked;
    turnlayerOnOff("chk" + heatmaplyrName, turnLayerOnOff, identifylayers);
}

function removeheatMap()
{
    govmap.removeHeatLayer();
}

function loadHeatMapLayers()
{
    var heatLyrOpt = document.getElementById('optHeatLayer');
    heatLyrOpt.length = 0;
    for (var key in HeatMap) {
        var optHeat = document.createElement('option');
        optHeat.value = key;
        optHeat.innerHTML = layerEngHeb[key][0];
        heatLyrOpt.appendChild(optHeat);
    }
}
function loadHeatmapFields()
{
    var heatLyrOpt = document.getElementById('optHeatLayer');
    var lname = heatLyrOpt.value;
    var heatFldsOpt = document.getElementById('optHeatField');
    
    flds = HeatMap[lname]; 
    heatFldsOpt.length = 0;
    heatFldsOpt.options[heatFldsOpt.options.length] = new Option('כמות ישויות', 'none');

    for (i = 0; i < flds.length; i++)
    {
        var option = document.createElement("option");
        option.style.fontFamily = 'Alef-Regular';
        option.style.fontSize = '15px';
        option.text = identifyFieldsEngHeb[lname+ "_" + flds[i]];
        option.value = flds[i];
        heatFldsOpt.appendChild(option);
    }
}

function turnQuerylayerOn(identifylayers)
{
    var querylayer = $("#selectQueriesSearchedInLayer :selected").text(); 
    var lname = layerHebEng[querylayer];
    turnlayerOnOff('chk' + lname, true, identifylayers);
    ZoomToLayer1("z"+ lname);
    
   
}
function showRelevantSearchedDiv(searchedType, identifylayers, SQTHCitylist, SQIDlist)
{
    switch (searchedType)
        {
            case "layer":
                {
                    document.getElementById("gushTR").style.display = 'none';
                    document.getElementById("gushTD").style.display = 'none';
                    document.getElementById("parcelTR").style.display = 'none';
                    document.getElementById("parcelTD").style.display = 'none';
                    document.getElementById("parcellabelTR").style.display = 'none';
                    document.getElementById("gushlabelTR").style.display = 'none';
                    //document.getElementById("SQsearchGush").style.display = 'none';
                    //document.getElementById("SQsearchHelka").style.display = 'none';
                    //document.getElementById("QueriesSearchedInLayerTD6").style.display = 'none';

                    //document.getElementById("QueriesSearchedInLayerTD5").style.display = 'none';
                    document.getElementById("SQTHCitylabelTR").style.display = 'none';
                    document.getElementById("SQTHCityTR").style.display = 'none';
                    document.getElementById("SQTHCityTD").style.display = 'none';

                    document.getElementById('SQsearchedlayer1').style.display = 'block';
                    document.getElementById('SQsearchedlayer2').style.display = 'block';
                    document.getElementById('SQsearchedlayer3').style.display = 'block';
                    document.getElementById('SQsearchedlayer4').style.display = 'block';
                    document.getElementById('QueriesSearchedInLayerTD1').style.display = 'block';
                    document.getElementById('QueriesSearchedInLayerTD2').style.display = 'block';
                    document.getElementById('QueriesSearchedInLayerTD3').style.display = 'block';
                    document.getElementById('QueriesSearchedInLayerTD4').style.display = 'block';
                }
                break;
            case "gush":
                {
                    document.getElementById("gushTR").style.display = 'block';
                    document.getElementById("gushTD").style.display = 'block';
                    document.getElementById("parcelTR").style.display = 'none';
                    document.getElementById("parcelTD").style.display = 'none';
                    document.getElementById("parcellabelTR").style.display = 'none';
                    document.getElementById("gushlabelTR").style.display = 'block';

                    //document.getElementById("SQsearchGush").style.display = 'block';
                    //document.getElementById("SQsearchHelka").style.display = 'none';
                    //document.getElementById("QueriesSearchedInLayerTD6").style.display = 'block';


                    //document.getElementById("QueriesSearchedInLayerTD5").style.display = 'block';
                    document.getElementById("SQTHCitylabelTR").style.display = 'none';
                    document.getElementById("SQTHCityTR").style.display = 'none';
                    document.getElementById("SQTHCityTD").style.display = 'none';

                    document.getElementById('SQsearchedlayer1').style.display = 'none';
                    document.getElementById('SQsearchedlayer2').style.display = 'none';
                    document.getElementById('SQsearchedlayer3').style.display = 'none';
                    document.getElementById('SQsearchedlayer4').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD1').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD2').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD3').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD4').style.display = 'none';
                //
                
                    var fieldcode = getFieldID("SUB_GUSH_ALL", "GUSH_NUM");
                    var filecode = layerEngHeb["SUB_GUSH_ALL"][1];
                   // var fieldtype = FieldFilter["SUB_GUSH_ALL_GUSH_NUM"][0];
                    getDataFromServerGush( fieldcode, filecode, identifylayers, SQTHLayerlist, SQGushIDlist);
                //
                    

                }
                break;
            case "parcel":
                {
                    document.getElementById("gushTR").style.display = 'block';
                    document.getElementById("gushTD").style.display = 'block';
                    document.getElementById("parcelTR").style.display = 'block';
                    document.getElementById("parcelTD").style.display = 'block';
                    document.getElementById("parcellabelTR").style.display = 'block';
                    document.getElementById("gushlabelTR").style.display = 'block';
                    //document.getElementById("SQsearchGush").style.display = 'none';
                    //document.getElementById("SQsearchHelka").style.display = 'block';
                    //document.getElementById("QueriesSearchedInLayerTD6").style.display = 'block';



                    //document.getElementById("QueriesSearchedInLayerTD5").style.display = 'block';
                    document.getElementById("SQTHCitylabelTR").style.display = 'none';
                    document.getElementById("SQTHCityTR").style.display = 'none';
                    document.getElementById("SQTHCityTD").style.display = 'none';

                    document.getElementById('SQsearchedlayer1').style.display = 'none';
                    document.getElementById('SQsearchedlayer2').style.display = 'none';
                    document.getElementById('SQsearchedlayer3').style.display = 'none';
                    document.getElementById('SQsearchedlayer4').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD1').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD2').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD3').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD4').style.display = 'none';

                    var fieldcode = getFieldID("SUB_GUSH_ALL", "GUSH_NUM");
                    var filecode = layerEngHeb["SUB_GUSH_ALL"][1];
                    //var fieldtype = FieldFilter["SUB_GUSH_ALL_GUSH_NUM"][0];
                    getDataFromServerGush(fieldcode, filecode, identifylayers, SQTHLayerlist, SQGushIDlist);

                }
                break;
            case "city":
                {
                    document.getElementById("gushTR").style.display = 'none';
                    document.getElementById("gushTD").style.display = 'none';
                    document.getElementById("parcelTR").style.display = 'none';
                    document.getElementById("parcelTD").style.display = 'none';
                    document.getElementById("parcellabelTR").style.display = 'none';
                    document.getElementById("gushlabelTR").style.display = 'none';
                    //document.getElementById("SQsearchGush").style.display = 'none';
                    //document.getElementById("SQsearchHelka").style.display = 'none';
                    //document.getElementById("QueriesSearchedInLayerTD6").style.display = 'none';
                    //document.getElementById("QueriesSearchedInLayerTD5").style.display = 'block';
                    document.getElementById("SQTHCitylabelTR").style.display = 'block';
                    document.getElementById("SQTHCityTR").style.display = 'block';
                    document.getElementById("SQTHCityTD").style.display = 'block';

                    var fieldcode = getFieldID("MUNI", "SETL_NAME");
                    var filecode = layerEngHeb["MUNI"][1];
                    //var fieldtype = FieldFilter["MUNI_SETTEL_NAM"][0];
                    getDataFromServerCity( fieldcode, filecode, identifylayers,SQTHCitylist,SQIDlist);
                    //
                    
                    //


                    document.getElementById('SQsearchedlayer1').style.display = 'none';
                    document.getElementById('SQsearchedlayer2').style.display = 'none';
                    document.getElementById('SQsearchedlayer3').style.display = 'none';
                    document.getElementById('SQsearchedlayer4').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD1').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD2').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD3').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD4').style.display = 'none';
                }
            break;
            case "none":
                {
                    document.getElementById("gushTR").style.display = 'none';
                    document.getElementById("gushTD").style.display = 'none';
                    document.getElementById("parcelTR").style.display = 'none';
                    document.getElementById("parcelTD").style.display = 'none';
                    document.getElementById("parcellabelTR").style.display = 'none';
                    document.getElementById("gushlabelTR").style.display = 'none';
                    //document.getElementById("SQsearchGush").style.display = 'none';
                    //document.getElementById("SQsearchHelka").style.display = 'none';
                    //document.getElementById("QueriesSearchedInLayerTD6").style.display = 'none';

                //document.getElementById("QueriesSearchedInLayerTD5").style.display = 'none';

                
                    document.getElementById("SQTHCitylabelTR").style.display = 'none';
                    document.getElementById("SQTHCityTR").style.display = 'none';
                    document.getElementById("SQTHCityTD").style.display = 'none';

                    document.getElementById('SQsearchedlayer1').style.display = 'none';
                    document.getElementById('SQsearchedlayer2').style.display = 'none';
                    document.getElementById('SQsearchedlayer3').style.display = 'none';
                    document.getElementById('SQsearchedlayer4').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD1').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD2').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD3').style.display = 'none';
                    document.getElementById('QueriesSearchedInLayerTD4').style.display = 'none';
                }
                break;
        }
}
function getparcelCentroid( gush,parcel) {
    govmap.geocode({ keyword: gush + ' ' + parcel }, govmap.geocodeType.FullResult)
        .then(function (response)
        {
            if (response.data != null && response.data.length > 0)
            {
                var x = response.data[0].X;
                var y = response.data[0].Y;
                var pointgeo = "POINT (" + x + " " + y + ")";
                return pointgeo;
            }
        })
    return null;
}


function exportToExcel(from)
{
    // table info is displayed right to left
    // we need to flip it back  

    var tableName = '';
    if (from == 'datatable')
        tableName = currentDataTableLayerName;
    else if (from == 'identify')
    {
        var e = document.getElementById("identifylayerselect");
        var headertablenanme = e.options[e.selectedIndex].text;
        tableName = layerHebEng[headertablenanme];
    }
        

    var fileName =  tableName + ".csv"
    var mimeType = 'text/csv;encoding:utf-8';
    
   

    var contentTable = document.getElementById('dataTable1');
    var clonedcontentTable = document.createElement('table'); 
    // create header row
    var headerRow = document.createElement('tr');
    var numOfCells = identifyFields[tableName].length;
    
    for (i = 0 ; i < numOfCells; i++)
    {
        var currentcolumn = identifyFields[tableName][i];
        currentcolumn = identifyFieldsEngHeb[tableName + "_" + currentcolumn];
        var newText = document.createTextNode(currentcolumn);
        var headerTD = document.createElement('td');
        headerTD.appendChild(newText);
        headerRow.appendChild(headerTD);
    }
    clonedcontentTable.appendChild(headerRow);
    
    // rest of data rows
    for (j = 0; j < contentTable.rows.length; j++)
    {
        var dataRow = document.createElement('tr');
        for (k = 1; k < numOfCells + 1; k++)
        {
            var dataTD = document.createElement('td');
            var val = contentTable.rows[j].cells[numOfCells - k].innerHTML;
            var val1 = val.replace('&gt;', '-');
            val = val1.replace('&lt;', '-');
            var datacell = document.createTextNode(val);
            
            dataTD.appendChild(datacell);
            dataRow.appendChild(dataTD);
        }
        clonedcontentTable.appendChild(dataRow);
    }


    var wb = XLSX.utils.table_to_book(clonedcontentTable, { Views: [{ RTL: true }] });


    //if (wb.Workbook) {
    //    wb.Workbook.Views[0]['RTL'] = true;
    //} else {
    //    wb.Workbook = {};
    //    wb.Workbook['Views'] = [{ RTL: true }];
    //}
    //set_right_to_left(wb);
    
    //var wb = { Workbook: { Views: [{ RTL: true }] }, Sheets: {}, SheetNames: [] }
    //var worksheet = XLSX.utils.aoa_to_sheet([insert_your_data_here]);
    //wb.View = 'RTL';

    //
    //wb.SheetNames.push("אבי המלך");
    //var ws2 = XLSX.utils.table_to_sheet(document.getElementById('mytable'));
    //wb.Sheets["Test Sheet2"] = ws2;
    //

    var ws1 = wb.Sheets[wb.SheetNames[0]];
    //ws1.RTL = true;
    


    var content = XLSX.utils.sheet_to_csv(ws1, { strip: true, RTL: true });
    var BOM = String.fromCharCode(0xFEFF);
    content = BOM + content;
    var blob = new Blob([content], { type: mimeType });
    if (window.navigator && window.navigator.msSaveOrOpenBlob)
    {

        // ie
        var success = window.navigator.msSaveOrOpenBlob(blob, fileName);
        if (!success) {
            alert("Failed");
        }
    } else {

        // not ie
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

       
    }
}
function set_right_to_left(wb/*:Workbook*/) {
    if (!wb.Workbook) wb.Workbook = {};
    if (!wb.Workbook.Views) wb.Workbook.Views = [];
    if (!wb.Workbook.Views[0]) wb.Workbook.Views[0] = {};
    wb.Workbook.Views[0].RTL = true;
    //wb.Workbook.Views[0].RTL
    
}

function drawText(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, drawTextData, drawTextItems)
{

    wkts = [];
    govmap.unbindEvent(govmap.events.CLICK);
    var letterWidth = 12;
    govmap.draw(govmap.drawType.Point).progress(function (respoint) {

        var xy = respoint.wkt.substring(6, respoint.wkt.length - 1);// "POINT(127799.8475996952 714062.7381254763)"
        var space = xy.indexOf(" ");
        var x = xy.substring(0, space);
        var y = xy.substring(space + 1, xy.length);


        var text = document.getElementById("txtDraw").value;
        var counter = 0;
       

        drawTextData.push({ 'x': x, 'y': y, 'text': text });

        for (i = 0; i < text.length; i++) {

            var letter = text[i].charCodeAt(0).toString();

            if (parseInt(letter) == 32 || parseInt(letter) == 83)
                letter = "transparent";//space

            var delta = computeDrawTextLetersSpace();
            //if (parseInt(letter) == 1497 || parseInt(letter) == 1493)
            //    delta = parseFloat(delta) / 2
            //letterWidth = 10;


            var newX = parseFloat(x) - counter * parseFloat(delta);
            var newPoint = "POINT(" + newX.toString() + " " + y + ")";

            var textID = 'text' + parseInt(drawTextItems.length + 1);
            var names = [];
            names.push(textID);
            drawTextItems.push(textID);


            wkts = [];
            wkts.push(newPoint);
            var data =
            {

                wkts: wkts,
                names: names,
                geometryType: govmap.drawType.Point,
                defaultSymbol:
                {
                    'url': drawTextURL + letter + ".png",
                    'width': letterWidth,
                    'height': 15

                },
                'symbols': [
                    {
                        'url': drawTextURL + letter + ".png",
                        'width': letterWidth,
                        'height': 15

                    }
                ],
                clearExisting: false,
                data:
                {

                }
            };
            govmap.displayGeometries(data).then(function (e) {

            });
            counter += 1;
        }


    });
    
}

function drawBuffer(drShape, identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName)
{

    var radius = document.getElementById("bufferRadius").value;
    if ( radius.length == 0) {
        document.getElementById("bufferError").innerHTML = "יש להזין ערך לרדיוס ";
        return;
    }
    else
    {
        radius = parseInt(radius);
        document.getElementById("bufferError").innerHTML = "";
    }
   // var drShape = document.querySelector("img[name='optDrawShapeBuffer'][value='1']").id;
    
    var x,y;
   // var lname = document.getElementById("txtBufferLayer").value
    
    govmap.unbindEvent(govmap.events.CLICK);

    switch (drShape.toLowerCase()) {
        case "bufferpoint":
            {
              
                govmap.draw(govmap.drawType.Point).progress(function (response)
                {

                    document.getElementById("Bufferpoint").src = "icons/point_grey.png";

                    if (parseInt(radius) == 0) {
                    }
                    else
                    {
                        var polyString = "POLYGON((";
                        var obj = response.wkt;
                        var obj1 = obj.substring(6, obj.length - 1).split(" ");
                        x = parseFloat(obj1[0]);
                        y = parseFloat(obj1[1]);
                        //var coordLatLong = computeITMToLatLng(x, y);
                        //
                        var combinedXY = parseInt(x).toString() + parseInt(y).toString();
                        var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);

                        var coordlatlongArray = coordLatLong.split(" ");
                        // turf is using long lat instead of lat long flip 1 
                        var center = [coordlatlongArray[1], coordlatlongArray[0]];

                        var options = { steps: 100, units: 'meters' };
                        var buffered = turf.circle(center, radius, options).geometry.coordinates[0];

                        for (j = 0; j < buffered.length; j++) {

                            // turf is using long lat instead of lat long flip 2 
                            var itmpt = JSITM.gpsRef2itmRef(buffered[j][1] + " " + buffered[j][0]);
                            var itmptArr = itmpt.split(" ");
                            if (j == 0) {

                                x = parseFloat(itmptArr[0]);
                                y = parseFloat(itmptArr[1]);
                            }

                            polyString += itmpt + ",";
                        }
                        polyString = polyString.substring(0, polyString.length - 1);
                        polyString += "))";
                    }
                    //alert("avi");
                    
                    
                    if ($('#chkIntersectBufferWithLayers').is(':checked')) {
                        if (identifylayers.length > numOfLayersToIdentify)
                        {
                            var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                            errormsg += "\n"
                            errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל מחדש";
                            alert(errormsg);
                            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                            return;
                        }
                        if (parseInt(radius) == 0)
                            DoTheIntersectNew(response.wkt, identifylayers, 'Point', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);
                        else
                            DoTheIntersectNew(polyString, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);
                    }
                    //
                    var geom = [];
                    var geomType;
                    if (parseInt(radius) == 0) {
                        geom.push(response.wkt);
                        geomType = govmap.drawType.Point;
                    }
                    else
                    {
                        geom.push(polyString);
                        geomType = govmap.drawType.Polygon;
                    }
                    var data =
                    {
                        wkts: geom,
                        geometryType: geomType,

                        defaultSymbol:
                        {
                            outlineColor: [0, 80, 255, 1],
                            outlineWidth: 1,
                            fillColor: [138, 43, 226, 0.5]
                        },
                        symbols: [],
                        clearExisting: true,
                        data: {
                            tooltips: [],
                            headers: [],
                            bubbles: [],
                            bubbleUrl: ''
                        }
                    };
                    govmap.displayGeometries(data).then(function () {


                    });

                    


                    govmap.zoomToXY({ x: x, y: y, level: 6, marker: false });
                    

                });
            }
            break;
        case "bufferline":
            {

                govmap.draw(govmap.drawType.Polyline).progress(function (resline) {
                }).done(function (e) {
                    document.getElementById("Bufferline").src = "icons/line_grey.png";

                    if (parseInt(radius) == 0) {
                    }
                    else
                    {
                        var polyString = "POLYGON((";
                        var x = 0
                        var y = 0;
                        var wkt = e.wkt.toString();
                        var polylineArray = [];
                        var tmp = wkt.substring(11, wkt.length - 1);
                        var tmp = tmp.toString();
                        var wktArray = tmp.split(",");
                        var temp = "";
                        var item;

                        for (i = 0; i < wktArray.length; i++) {
                            // check if first char is not empty

                            if (wktArray[i].charAt(0) === " ")
                                wktArray[i] = wktArray[i].substring(1);

                            item = wktArray[i].split(" ");
                            var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();

                            var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);

                            var pt = coordLatLong.split(" ");
                            var ptArray = [];
                            // turf is using long lat instead of lat long flip 1 
                            ptArray.push(parseFloat(pt[1]));
                            ptArray.push(parseFloat(pt[0]));
                            polylineArray.push(ptArray);
                        }

                        var line = turf.lineString(polylineArray);
                        var buffered = turf.buffer(line, radius, { units: 'meters' }).geometry.coordinates[0];

                        for (j = 0; j < buffered.length; j++) {

                            // turf is using long lat instead of lat long flip 2 
                            var itmpt = JSITM.gpsRef2itmRef(buffered[j][1] + " " + buffered[j][0]);
                            if (j == 0) {
                                var itmptArr = itmpt.split(" ");
                                x = parseFloat(itmptArr[0]);
                                y = parseFloat(itmptArr[1]);
                            }


                            polyString += itmpt + ",";
                        }
                        polyString = polyString.substring(0, polyString.length - 1);
                        polyString += "))";
                    }

                   

                    if ($('#chkIntersectBufferWithLayers').is(':checked')) {
                        if (identifylayers.length > numOfLayersToIdentify)
                        {
                            var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                            errormsg += "\n"
                            errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל מחדש";
                            alert(errormsg);
                            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                            return;
                        }
                        if (parseInt(radius) == 0)
                            DoTheIntersectNew(e.wkt, identifylayers, 'Polyline', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps, routeSteps);                            
                        else
                            DoTheIntersectNew(polyString, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps, routeSteps);
                    }


                    var geom = [];
                    var geomType;
                    var symbol = {};
                    if (parseInt(radius) == 0) {
                        geom.push(e.wkt);
                        geomType = govmap.drawType.Polyline;
                        symbol = { width: 1, color: [0, 80, 255, 1], fillColor: [138, 43, 226, 0.5]  };

                    }
                    else {
                        geom.push(polyString);
                        geomType = govmap.drawType.Polygon;
                        symbol = { outlineColor: [0, 80, 255, 1],outlineWidth: 1,fillColor: [138, 43, 226, 0.5] }
                    }

                    var data =
                    {

                        wkts: geom,
                        geometryType: geomType,
                        defaultSymbol:
                        symbol,

                        clearExisting: true,
                        data:
                        {
                            tooltips: [],
                            headers: [],
                            bubbleHTML: "",
                            bubbleHTMLParameters: [[], []]
                        }
                    };
                    govmap.displayGeometries(data).then(function (response) {

                    });
                    govmap.zoomToXY({ x: x, y: y, level: 6, marker: false });

                   
                   
                });
                        
               
                    
                            
                break; 

            }
        case "bufferrectangle":
            {
                
                govmap.draw(govmap.drawType.Rectangle)
                    .progress(function (e)
                    {
                        document.getElementById("Bufferrectangle").src = "icons/rectangle_grey.png";
                        if (parseInt(radius) == 0) {
                        }
                        else
                        {
                            var polyString = "POLYGON((";
                            var x = 0
                            var y = 0;
                            var wkt = e.wkt.toString();
                            //alert(wkt);
                            var polygonArray = [];

                            var tmp = wkt.substring(9, wkt.length - 2);
                            var tmp = tmp.toString();

                            var wktArray = tmp.split(",");
                            var temp = "";
                            var item;

                            for (i = 0; i < wktArray.length; i++) {
                                // check if first char is not empty
                                //alert(wktArray[i])

                                if (wktArray[i].charAt(0) === " ")
                                    wktArray[i] = wktArray[i].substring(1);

                                item = wktArray[i].split(" ");
                                var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();

                                var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);

                                var pt = coordLatLong.split(" ");
                                var ptArray = [];
                                // turf is using long lat instead of lat long flip 1 
                                ptArray.push(parseFloat(pt[1]));
                                ptArray.push(parseFloat(pt[0]));
                                polygonArray.push(ptArray);
                            }


                            var poly = turf.polygon([polygonArray]);

                            var buffered = turf.buffer(poly, radius, { units: 'meters' }).geometry.coordinates[0];

                            for (j = 0; j < buffered.length; j++) {

                                // turf is using long lat instead of lat long flip 2 
                                var itmpt = JSITM.gpsRef2itmRef(buffered[j][1] + " " + buffered[j][0]);
                                if (j == 0) {
                                    var itmptArr = itmpt.split(" ");
                                    x = parseFloat(itmptArr[0]);
                                    y = parseFloat(itmptArr[1]);
                                }


                                polyString += itmpt + ",";
                            }
                            polyString = polyString.substring(0, polyString.length - 1);
                            polyString += "))";
                        }
                        

                        if ($('#chkIntersectBufferWithLayers').is(':checked')) {
                            if (identifylayers.length > numOfLayersToIdentify) {
                                var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                                errormsg += "\n"
                                errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל מחדש";
                                alert(errormsg);
                                clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
                                return;
                            }

                            if (parseInt(radius) == 0)
                                DoTheIntersectNew(e.wkt, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);
                            else
                                DoTheIntersectNew(polyString, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);
                        }

                        var geom = [];
                        
                        if (parseInt(radius) == 0) {
                            geom.push(e.wkt);
                            
                        }
                        else {
                            geom.push(polyString);
                            
                        }

                        var data =
                        {

                            wkts: geom,
                            geometryType: govmap.drawType.Polygon,
                            defaultSymbol:
                            {
                                outlineColor: [0, 80, 255, 1],
                                outlineWidth: 1,
                                fillColor: [138, 43, 226, 0.5]
                            },

                            clearExisting: true,
                            data:
                            {
                                tooltips: [],
                                headers: [],
                                bubbleHTML: "",
                                bubbleHTMLParameters: [[], []]
                            }
                        };
                        govmap.displayGeometries(data).then(function (response) {

                        });

                       


                    }).done(function (e) {

                        
                    });
            }
            break;
        case "bufferpolygon":
            {
                govmap.draw(govmap.drawType.Polygon).progress(function (e)
                {
                    document.getElementById("Bufferpolygon").src = "icons/polygon_grey.png";

                    if (parseInt(radius) == 0) {

                    }
                    else
                    {
                        var polyString = "POLYGON((";
                        var x = 0
                        var y = 0;
                        var wkt = e.wkt.toString();

                        var polygonArray = [];

                        var tmp = wkt.substring(9, wkt.length - 2);
                        var tmp = tmp.toString();

                        var wktArray = tmp.split(",");
                        var temp = "";
                        var item;

                        for (i = 0; i < wktArray.length; i++) {
                            // check if first char is not empty

                            if (wktArray[i].charAt(0) === " ")
                                wktArray[i] = wktArray[i].substring(1);

                            item = wktArray[i].split(" ");

                            var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();

                            var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);
                            var pt = coordLatLong.split(" ");
                            var ptArray = [];
                            // turf is using long lat instead of lat long flip 1 
                            ptArray.push(parseFloat(pt[1]));
                            ptArray.push(parseFloat(pt[0]));
                            polygonArray.push(ptArray);
                        }


                        var poly = turf.polygon([polygonArray]);

                        var buffered = turf.buffer(poly, radius, { units: 'meters' }).geometry.coordinates[0];

                        for (j = 0; j < buffered.length; j++) {

                            // turf is using long lat instead of lat long flip 2 
                            var itmpt = JSITM.gpsRef2itmRef(buffered[j][1] + " " + buffered[j][0]);
                            if (j == 0) {
                                var itmptArr = itmpt.split(" ");
                                x = parseFloat(itmptArr[0]);
                                y = parseFloat(itmptArr[1]);
                            }


                            polyString += itmpt + ",";
                        }
                        polyString = polyString.substring(0, polyString.length - 1);
                        polyString += "))";
                    }
                    

                    if ($('#chkIntersectBufferWithLayers').is(':checked')) {
                        if (identifylayers.length > numOfLayersToIdentify) {
                            var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                            errormsg += "\n"
                            errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל מחדש";
                            alert(errormsg);
                            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                            return;
                        }

                        if (parseInt(radius) == 0)
                            DoTheIntersectNew(e.wkt, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);
                        else
                            DoTheIntersectNew(polyString, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);
                    }
                    var geom = [];
                    if (parseInt(radius) == 0)
                        geom.push(e.wkt);
                    else
                        geom.push(polyString);
                    var data =
                    {

                        wkts: geom,
                        geometryType: govmap.drawType.Polygon,
                        defaultSymbol:
                        {
                            outlineColor: [0, 80, 255, 1],
                            outlineWidth: 1,
                            fillColor: [138, 43, 226, 0.5]
                        },

                        clearExisting: true,
                        data:
                        {
                            tooltips: [],
                            headers: [],
                            bubbleHTML: "",
                            bubbleHTMLParameters: [[], []]
                        }
                    };
                    govmap.displayGeometries(data).then(function (response) {

                    });
                    govmap.zoomToXY({ x: x, y: y, level: 6, marker: false });

                   

                }); 

            }

            break; 
        rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        

    }

    
    
    


    
}

function identifyBuffer(identifylayers, heatmapLayer, heatmapField, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, drawTextData, drawTextItems, currentBusName, currentBusStopName)
{

    var radius = $('#bufferRadius').val();
    if (radius.length == 0)
    {
        document.getElementById('bufferError').innerHTML = "יש להזין ערך מרחק במטרים";
        return;
    }
    else if (radius == 0)
        radius = 1;
    else
    {
        radius = parseInt(radius);
        document.getElementById("bufferError").innerHTML = "";
    }


    var sourcelname = $('#txtBufferSourceLayer').val();
    if (sourcelname.length == 0) {
        document.getElementById('bufferError').innerHTML = "יש להזין ערך ישות משכבה";
        return;
    }

    govmap.unbindEvent(govmap.events.CLICK);
    
    var sourcelnameE = layerHebEng[sourcelname];
    
    turnlayerOnOff("chk" + sourcelnameE, true, identifylayers);

   
    

    var identifyBufferButton = document.getElementById("identifyBufferIMG");
    if (identifyBufferButton.name == '0')
        identifyBufferButton.name = '1';

    identifyBufferButton.src = "icons/identify_Point_pink.png";

    govmap.draw(govmap.drawType.Point).progress(function (response)
    {
        rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
        identifyBufferButton.src = "icons/identify_Point_white.png";
        identifyBufferButton.name = '0';
        var geo = computePolygonForPointIdenify(response.wkt);
        //response.wkt;

      //  govmap.clearDrawings();
        // govmap.intersectFeaturesLongGeom({ geometry: geo, layerName: sourcelnameE, fields: ['OBJECTID'], getShapes: true, 'maxResults': 500 })
        govmap.intersectFeatures({ 'geometry': geo, 'layerName': sourcelnameE, 'fields': ['OBJECTID'], getShapes: true })
            .then(function (results) {
                //alert("avi");

                if (results.data != null) {
                    var res = results.data[0].Values[2];

                    var drShape = "";
                    if (res.includes('POINT') > 0)
                        drShape = "bufferpoint"
                    else if (res.includes('POLYGON') > 0)
                        drShape = "bufferpolygon";
                    else if (res.includes('LINESTRING') > 0)
                        drShape = "bufferline";
                    else
                        return;
                    switch (drShape.toLowerCase()) {
                        case "bufferpoint":
                            {

                                //alert(res.toString());
                                var polyString = "POLYGON((";
                                
                                var lbracket = res.lastIndexOf('(');
                                var rbracket = res.indexOf(')');
                                var tmp = res.substring(lbracket + 1, rbracket - 1);
                                var tmp = tmp.toString();
                                // make sure first char is not " " 
                                if (tmp.charAt(0) === " ")
                                    tmp = tmp.substring(1);

                                var wktArray = tmp.split(" ");
                                x = parseFloat(wktArray[0]);
                                y = parseFloat(wktArray[1]);
                               // var coordLatLong = computeITMToLatLng(x, y);
                                //
                                var combinedXY = parseInt(x).toString() + parseInt(y).toString();
                                var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);

                                var coordlatlongArray = coordLatLong.split(" ");
                                // turf is using long lat instead of lat long flip 1 
                                var center = [coordlatlongArray[1], coordlatlongArray[0]];

                                var options = { steps: 100, units: 'meters' };
                                var buffered = turf.circle(center, radius, options).geometry.coordinates[0];
                                var xmin, xmax, ymin, ymax;
                                for (j = 0; j < buffered.length; j++) {

                                    // turf is using long lat instead of lat long flip 2 
                                    var itmpt = JSITM.gpsRef2itmRef(buffered[j][1] + " " + buffered[j][0]);
                                    var itmptArr = itmpt.split(" ");

                                    x = parseFloat(itmptArr[0]);
                                    y = parseFloat(itmptArr[1]);

                                    if (j == 0)
                                    {
                                        xmin = xmax = x;
                                        ymin = ymax = y;
                                    }
                                    if (x > xmax)
                                        xmax = x;
                                    if (x < xmin)
                                        xmin = x;
                                    if (y > ymax)
                                        ymax = y;
                                    if (y < ymin)
                                        ymin = y;

                                    polyString += itmpt + ",";
                                }
                                polyString = polyString.substring(0, polyString.length - 1);
                                polyString += "))";

                                if ($('#chkIntersectBufferWithLayers').is(':checked')) {
                                    if (identifylayers.length > numOfLayersToIdentify) {
                                        var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                                        errormsg += "\n"
                                        errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל  מחדש";
                                        alert(errormsg);
                                        clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                                        return;
                                    }

                                    DoTheIntersectNew(polyString, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);

                                }

                                var data =
                                {
                                    wkts: [polyString],
                                    geometryType: govmap.drawType.Polygon,

                                    defaultSymbol:
                                    {
                                        outlineColor: [0, 80, 255, 1],
                                        outlineWidth: 1,
                                        fillColor: [138, 43, 226, 0.5]
                                    },
                                    symbols: [],
                                    clearExisting: true,
                                    data: {
                                        tooltips: [],
                                        headers: [],
                                        bubbles: [],
                                        bubbleUrl: ''
                                    }
                                };
                                govmap.displayGeometries(data).then(function () {


                                });
                             

                            }
                            break;
                        case "bufferline":
                            {

                               // alert('avi');
                                var polyString = "POLYGON((";
                                var x = 0
                                var y = 0;
                                var wkt = res;
                                var polylineArray = [];
                                //
                                var lbracket = res.lastIndexOf('(');
                                var rbracket = res.indexOf(')');
                                var tmp = res.substring(lbracket + 1, rbracket - 1);
                                var tmp = tmp.toString();
                                // make sure first char is not " " 
                                if (tmp.charAt(0) === " ")
                                    tmp = tmp.substring(1);
                                //

                                                                
                                var wktArray = tmp.split(",");
                                var temp = "";
                                var item;
                                var xmin; xmax; ymin; ymax;
                                for (i = 0; i < wktArray.length; i++) {
                                    // check if first char is not empty

                                    if (wktArray[i].charAt(0) === " ")
                                        wktArray[i] = wktArray[i].substring(1);

                                    item = wktArray[i].split(" ");
                                    var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();

                                    var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);

                                    var pt = coordLatLong.split(" ");
                                    var ptArray = [];
                                    // turf is using long lat instead of lat long flip 1 
                                    ptArray.push(parseFloat(pt[1]));
                                    ptArray.push(parseFloat(pt[0]));
                                    polylineArray.push(ptArray);
                                }

                                var line = turf.lineString(polylineArray);

                                
                                var buffered = turf.buffer(line, radius, { units: 'meters' }).geometry.coordinates[0];
                                var xmin, xmax, ymin, ymax;
                                for (j = 0; j < buffered.length; j++) {

                                    // turf is using long lat instead of lat long flip 2 
                                    var itmpt = JSITM.gpsRef2itmRef(buffered[j][1] + " " + buffered[j][0]);
                                    var itmptArr = itmpt.split(" ");
                                    x = parseFloat(itmptArr[0]);
                                    y = parseFloat(itmptArr[1]);

                                    if (j == 0) {
                                        xmin = xmax = x;
                                        ymin = ymax = y;
                                    }
                                    if (x > xmax)
                                        xmax = x;
                                    if (x < xmin)
                                        xmin = x;
                                    if (y > ymax)
                                        ymax = y;
                                    if (y < ymin)
                                        ymin = y;


                                    polyString += itmpt + ",";
                                }
                                polyString = polyString.substring(0, polyString.length - 1);
                                polyString += "))";

                                if ($('#chkIntersectBufferWithLayers').is(':checked')) {
                                    if (identifylayers.length > numOfLayersToIdentify) {
                                        var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                                        errormsg += "\n"
                                        errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל  מחדש";
                                        alert(errormsg);
                                        clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                                        return;
                                    }

                                    DoTheIntersectNew(polyString, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);

                                }

                                var data =
                                {

                                    wkts: [polyString],
                                    geometryType: govmap.drawType.Polygon,
                                    defaultSymbol:
                                    {
                                        outlineColor: [0, 80, 255, 1],
                                        outlineWidth: 1,
                                        fillColor: [138, 43, 226, 0.5]
                                    },

                                    clearExisting: true,
                                    data:
                                    {
                                        tooltips: [],
                                        headers: [],
                                        bubbleHTML: "",
                                        bubbleHTMLParameters: [[], []]
                                    }
                                };
                                govmap.displayGeometries(data).then(function (response) {

                                });
                              


                                break;

                            }

                        case "bufferpolygon":
                            {

                                var polyString = "POLYGON((";
                                var x = 0
                                var y = 0;
                                var wkt = res;

                                var polygonArray = [];

                                var lbracket = res.lastIndexOf('(');
                                var rbracket = res.indexOf(')');
                                var tmp = wkt.substring(lbracket + 1, rbracket - 1);
                                var tmp = tmp.toString();

                                var wktArray = tmp.split(",");
                                var temp = "";
                                var item;
                                var xmin; xmax; ymin; ymax;
                                for (i = 0; i < wktArray.length; i++) {
                                    // check if first char is not empty

                                    if (wktArray[i].charAt(0) === " ")
                                        wktArray[i] = wktArray[i].substring(1);

                                    item = wktArray[i].split(" ");

                                    var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();

                                    var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);
                                    var pt = coordLatLong.split(" ");
                                    var ptArray = [];
                                    // turf is using long lat instead of lat long flip 1 
                                    ptArray.push(parseFloat(pt[1]));
                                    ptArray.push(parseFloat(pt[0]));
                                    polygonArray.push(ptArray);
                                }


                                var poly = turf.polygon([polygonArray]);

                                var buffered = turf.buffer(poly, radius, { units: 'meters' }).geometry.coordinates[0];

                                for (j = 0; j < buffered.length; j++) {

                                    // turf is using long lat instead of lat long flip 2 
                                    var itmpt = JSITM.gpsRef2itmRef(buffered[j][1] + " " + buffered[j][0]);
                                    var itmptArr = itmpt.split(" ");

                                    var xmin, xmax, ymin, ymax;
                                    x = parseFloat(itmptArr[0]);
                                    y = parseFloat(itmptArr[1]);
                                    if (j == 0) {
                                        xmin = xmax = x;
                                        ymin = ymax = y;
                                    }
                                    if (x > xmax)
                                        xmax = x;
                                    if (x < xmin)
                                        xmin = x;
                                    if (y > ymax)
                                        ymax = y;
                                    if (y < ymin)
                                        ymin = y;


                                    polyString += itmpt + ",";
                                }
                                polyString = polyString.substring(0, polyString.length - 1);
                                polyString += "))";

                                if ($('#chkIntersectBufferWithLayers').is(':checked')) {
                                    if (identifylayers.length > numOfLayersToIdentify) {
                                        var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
                                        errormsg += "\n"
                                        errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל  מחדש";
                                        alert(errormsg);
                                        clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
                                        return;
                                    }

                                    DoTheIntersectNew(polyString, identifylayers, 'Polygon', "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, false, routeSteps);

                                }

                                var data =
                                {

                                    wkts: [polyString],
                                    geometryType: govmap.drawType.Polygon,
                                    defaultSymbol:
                                    {
                                        outlineColor: [0, 80, 255, 1],
                                        outlineWidth: 1,
                                        fillColor: [138, 43, 226, 0.5]
                                    },

                                    clearExisting: true,
                                    data:
                                    {
                                        tooltips: [],
                                        headers: [],
                                        bubbleHTML: "",
                                        bubbleHTMLParameters: [[], []]
                                    }
                                };
                              //  clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
                                govmap.displayGeometries(data).then(function (response) {

                                });
                               


                            }

                            break;



                    }

                    
                    
                    govmap.zoomToExtent({ xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax, level: 1 });

                }
            });

        

    })

   

    
}
function selectFeatures1(lname, results)
{
    return;
    var objids = [];
    for (i = 0; i < results.data.length; i++)
    {
        objids.push(results.data[i].ObjectId)
    }
    var params = {
        layerName: lname,
        fieldName: 'OBJECTID',
        fieldValues: objids,
        highlight: true,
        outLineColor: [0, 206, 209, 0.8],
        outlineWidth: 5,
        zoomToExtent: false,
        fillColor: [0, 206, 209,0.8]
    };
    govmap.searchInLayer(params);
}
function selectFeatures(lname, results)

{
    var color = [64, 224, 208, 0.5];
    var polylineSYmbol =
    {
        width: 10,
        color: color,
        fillColor: color
    }
    var pointpolygonSymbol =
    {
        outlineColor: color,
        outlineWidth: 3,
        fillColor: color
    }
    var symbol; 
    var numOfFeatures = results.data.length;
    var position = results.data[0].Values.length; 
    var geo = results.data[0].Values[position - 1];
    var geoType; 
    if (geo.indexOf("POINT") > -1) {
        geoType = govmap.drawType.Point;
        symbol = pointpolygonSymbol;
    }

    else if (geo.indexOf("POLYGON") > -1) {
        geoType = govmap.drawType.Polygon;
        symbol = pointpolygonSymbol;
    }

    else
    {
        geoType = govmap.drawType.Polyline;
        symbol = polylineSYmbol;
    }
    


    var wkts = [];
    
    for (i = 0; i < numOfFeatures; i++)
    {
        
        var tmp = results.data[i].Values[position - 1];
        if (tmp.indexOf(geoType) > -1)
            // draw function have problem drawing multilpolyline  
            // in case we have multilinestring replace with linestring 
            if (tmp.indexOf("MULTI") > -1 || tmp.indexOf("ZM") > -1)
            {
                // ignore this feature since we cant use 
                // govmap api doesnt support 
            }
            else
                wkts.push(tmp);

    } 
    // in case all geometries are problematic 
    if (wkts.length == 0) return;
    
    var data =
        {

            wkts: wkts,
            geometryType: geoType,
            defaultSymbol:symbol
            ,
            clearExisting: false,
            data:
            {
                tooltips: [],
                headers: [],
                bubbleHTML: "",
                bubbleHTMLParameters: [[], []]
            }
        };
    //  clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems);
    govmap.displayGeometries(data).then(function (response) {

    });
  
}

function setVisibility(amount)
{
    var sliderCurrentVal = $("#drawvisibilityslideramount").val();
    var sliderval = $("#drawVisibilitySlider").slider("value");



    switch (amount.trim())
    {
        case ("+"):
        {
             sliderCurrentVal = parseInt(sliderCurrentVal) + 10; 
        }
        break;
        case ("-"):
        {
             sliderCurrentVal = parseInt(sliderCurrentVal) - 10;
                
        }
    }
    if (parseInt( sliderCurrentVal) >95)
        sliderCurrentVal = 95;
    if (parseInt(sliderCurrentVal) <5)
        sliderCurrentVal = 5;
    
    $("#drawvisibilityslideramount").val(sliderCurrentVal);
    $("#drawVisibilitySlider").slider('value', parseInt(sliderCurrentVal));

}
function MaximizeDrawDivMobile(displayParameter)
{
    document.getElementById('deleteButtondraw').style.display = 'table-row';
    document.getElementById('visibility1').style.display = 'table-row';
    document.getElementById('visibility2').style.display = 'table-row';
    document.getElementById('color1').style.display = 'table-row';
    document.getElementById('color2').style.display = 'table-row';
    document.getElementById('width1').style.display = 'table-row';
    document.getElementById('width2').style.display = 'table-row';
    document.getElementById('drawdivButtom').style.display = 'table-row';
    document.getElementById('drawDiv').style.height = '100%';
    document.getElementById('maximizeDrawDivMobile').style.display = 'none';
}
function computeCurrentLevel()
{
    var value = document.getElementById('scale_p').innerHTML;
    var scale = parseInt( value.trim().split(":")[1]);

    //
    if (scale <= 100) {
        lvl = 8
    }
    if (scale > 10000 && scale <= 25000) {
        lvl = 7
    }
    if (scale > 25000 && scale <= 50000) {
        lvl = 6
    }
    if (scale > 50000 && scale <= 75000) {
        lvl = 5
    }
    if (scale > 75000 && scale <= 100000) {
        lvl = 4
    }
    if (scale > 100000 && scale <= 250000) {
        lvl = 3
    }
    if (scale > 250000 && scale <= 500000) {
        lvl = 2
    }
    if (scale > 500000 && scale <= 1000000) {
        lvl = 1
    }
    if (scale > 1000000) {
        lvl = 0
    }
    return lvl;
}
function drawCoordPoint()
{
    govmap.unbindEvent(govmap.events.CLICK);
    govmap.onEvent(govmap.events.CLICK).progress(function (e)
    {
        
        var x = e.mapPoint.x;
        var y = e.mapPoint.y;

        document.getElementById('txtXMobileCoord').value = x;
        document.getElementById('txtYMobileCoord').value = y;
        var geoPoint = [];
        geoPoint.push("POINT(" +x + " "+y  + ")");
        var dataPoint =
        {
            wkts: geoPoint,
            names: [],
            geometryType: govmap.drawType.Point,
            defaultSymbol:
            {
                outlineColor: [20, 112, 255, 1],
                outlineWidth: 0.5,
                fillColor: [20, 112, 255, 0.5]
            },
            clearExisting: true,
            data:
            {

            }
        };
        govmap.displayGeometries(dataPoint).then(function (e) {
        });
    });
        // rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
    
}
function closeMeasure(drawMobileGeomerty, heatmapLayer, heatmapField, drawTextData, drawTextitems, identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn,panorama) {
    //cleardrawMobileGeomerty(drawMobileGeomerty, heatmapLayer, heatmapField, drawTextData, drawTextitems);
    clearMapDrawing(heatmapLayer, loadHeatmapFields, drawTextData, drawTextitems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
    document.getElementById('currentLineDist').value = 0;
    document.getElementById('totalLineDist').value = 0;
    document.getElementById('txtXMobileCoord').value = 0;
    document.getElementById('txtYMobileCoord').value = 0;
    document.getElementById('area').value = 0;
    document.getElementById('perimeter').value = 0;
    document.getElementById('tdMeasurePoint').style.border = 0;
    document.getElementById('tdMeasureDistanse').style.border = 0;
    document.getElementById('tdMeasureArea').style.border = 0;
    $('#measuremobilemsg').html('בחר סוג מדידה');
    document.getElementById('areaTable').style.display = 'none';
    document.getElementById('distanceTable').style.display = 'none';
    document.getElementById('coordinateTable').style.display = 'none';

    rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextitems);
}
function cleardrawMobileGeomerty(drawMobileGeomerty)
{
    drawMobileGeomerty.length = 0;
    //drawMeasureLine(drawMobileGeomerty);
   // govmap.unbindEvent(govmap.events.CLICK);
    //document.getElementById('tdMeasurePoint').style.border = 0;
    //document.getElementById('tdMeasureDistanse').style.border = 0;
    //document.getElementById('tdMeasureArea').style.border = 0;
    govmap.clearDrawings();
}
function drawMeasurePolygon(drawMobileGeomerty)
{
    minimizeDrawDiv();
    drawMobileGeomerty.length = 0;
    govmap.unbindEvent(govmap.events.CLICK);
    // govmap.unbindEvent(govmap.events.MOUSE_MOVE);
    // govmap.unbindEvent(govmap.events.DOUBLE_CLICK);
    document.getElementById('currentLineDist').value = 0;
    document.getElementById('totalLineDist').value = 0;
    govmap.onEvent(govmap.events.CLICK).progress(function (e) {
        if (jQuery.inArray(e.mapPoint.x + " " + e.mapPoint.y, drawMobileGeomerty) == -1) {
            drawMobileGeomerty.push(e.mapPoint.x + " " + e.mapPoint.y);
            updateNewMeasurePoint(drawMobileGeomerty, "POLYGON");
        }
    });
}
function drawMeasureLine(drawMobileGeomerty)
{
    minimizeDrawDiv();
    drawMobileGeomerty.length = 0;
    govmap.unbindEvent(govmap.events.CLICK);
    //govmap.unbindEvent(govmap.events.MOUSE_MOVE);
    //govmap.unbindEvent(govmap.events.DOUBLE_CLICK);
    document.getElementById('currentLineDist').value = 0;
    document.getElementById('totalLineDist').value = 0;

    govmap.onEvent(govmap.events.CLICK).progress(function (e)
        {
            if (jQuery.inArray(e.mapPoint.x + " " + e.mapPoint.y, drawMobileGeomerty) == -1) {
                drawMobileGeomerty.push(e.mapPoint.x + " " + e.mapPoint.y);
                updateNewMeasurePoint( drawMobileGeomerty,"LINE");
            }
        });

}
function drawMeasureArea(drawMobileGeomerty) {
    drawMobileGeomerty = [];
    govmap.unbindEvent(govmap.events.CLICK);
    //govmap.unbindEvent(govmap.events.MOUSE_MOVE);
    //govmap.unbindEvent(govmap.events.DOUBLE_CLICK);
    document.getElementById('currentLineDist').value = 0;
    document.getElementById('totalLineDist').value = 0;

    // closure
   
        govmap.onEvent(govmap.events.CLICK).progress(function (e) {
            if (jQuery.inArray(e.mapPoint.x + " " + e.mapPoint.y, drawMobileGeomerty) == -1) {
                drawMobileGeomerty.push(e.mapPoint.x + " " + e.mapPoint.y);
                updateNewMeasurePoint(drawMobileGeomerty,"AREA");
            }
        });
   
}
function addtooltipToCursor()
{
    document.getElementById("mouseTooltip").innerHTML = "הקש על המפה לסימון הגיאומטריה";
    document.getElementById("mouseTooltip").style.display = "block";
}
function replaceUnits(toUnits,txtName )
{ 
    var val;
    if (toUnits == '1' && txtName == 'distance')
    {
        val = parseFloat(document.getElementById('currentLineDist').value);
        document.getElementById('currentLineDist').value = val * 1000;
        val = parseFloat(document.getElementById('totalLineDist').value);
        document.getElementById('totalLineDist').value = val * 1000;
    }
    else if (toUnits == '2' && txtName == 'distance')
    {
        val = parseFloat(document.getElementById('currentLineDist').value);
        document.getElementById('currentLineDist').value = val / 1000;
        val = parseFloat(document.getElementById('totalLineDist').value);
        document.getElementById('totalLineDist').value = val/1000;
    }
    else if (toUnits == '1' && txtName == 'perimeter')
    {
        val = parseFloat(document.getElementById('perimeter').value);
        document.getElementById('perimeter').value = val * 1000;
        
    }
    else if (toUnits == '2' && txtName == 'perimeter')
    {
        val = parseFloat(document.getElementById('perimeter').value);
        document.getElementById('perimeter').value = val / 1000; 
        
    }
    else if (toUnits == '1' && txtName == 'area') {
        val = parseFloat(document.getElementById('area').value);
        document.getElementById('area').value = val * 1000000;

    }
    else if (toUnits == '2' && txtName == 'area') {
        val = parseFloat(document.getElementById('area').value);
        document.getElementById('area').value = val / 1000000;

    }
    
}
function updateNewMeasurePoint( drawMobileGeomerty,geoType) {
    var drawWKTS = [];
    var pointtype = (geoType == 'LINE') ? 'linepoint' : 'polygonpoint';    
    pointtype += drawMobileGeomerty.length;
    var geoPoint = [];
    geoPoint.push( "POINT(" + drawMobileGeomerty[drawMobileGeomerty.length - 1] + ")");
    var dataPoint =
    {
        wkts: geoPoint,
        names: [pointtype],
        geometryType: govmap.drawType.Point,
        defaultSymbol:
        {
            outlineColor: [20, 112, 255 , 1],
            outlineWidth: 0.5,
            fillColor: [20, 112, 255, 0.5]  
        },
        clearExisting: false,
        data:
        {

        }
    };
    govmap.displayGeometries(dataPoint).then(function (e) {
    });
    //

    if (drawMobileGeomerty.length > 1 && geoType == 'LINE')
    {
        var units = document.getElementById('distanceUnits').value; 
        var currentUnits = (units == '1') ? 'meters' : 'kilometers';
        
        var geoPoly = "LINESTRING(";
    
        for (i = 0; i < drawMobileGeomerty.length; i++) {
            geoPoly += drawMobileGeomerty[i] + ",";
            //geoPoint += drawMobileGeomerty[i]
        }
        var current = computeDistatnce(drawMobileGeomerty[drawMobileGeomerty.length - 1], drawMobileGeomerty[drawMobileGeomerty.length - 2],currentUnits);

        document.getElementById("currentLineDist").value = parseFloat(current);
        document.getElementById("totalLineDist").value = parseFloat(current) + parseFloat(document.getElementById("totalLineDist").value);
        // remove last apostroph
        geoPoly = geoPoly.substring(0, geoPoly.length - 1);

        // add right bracket 
        geoPoly += ")"
        drawWKTS.push(geoPoly);
        var dataPolyline =
        {
            wkts: drawWKTS,
            names: ['mobileMeasurePolyline'],
            geometryType: govmap.drawType.Polyline,
            defaultSymbol:
            {
                width: 1,
                color: [20, 112, 255, 1],
                fillColor: [20, 112, 255, 1]
            },
            clearExisting: false,
            data:
            {

            }
        };
        // clear prev polyline
        govmap.clearGeometriesByName(['mobileMeasurePolyline', 'mobileMeasurePolygon']);
        // clear prev points 
        //for (i = 0; i < 20; i++)
        //    govmap.clearGeometriesByName('polygonpoint' + i);
    
        govmap.displayGeometries(dataPolyline).then(function (e) {
        });

    }

    if (drawMobileGeomerty.length > 2 && geoType == 'POLYGON')
    {
        var units = document.getElementById('areaUnits').value;
        var currentUnits = (units == '1') ? 'meters' : 'kilometers';
        var geoPoly = "POLYGON(";
        var polygonArray = [];
        var ptLastArray = [];
        for (i = 0; i < drawMobileGeomerty.length; i++)
        {

            geoPoly += drawMobileGeomerty[i] + ",";
            
            //////
            var lat = drawMobileGeomerty[i].split(" ")[0].split('.')[0];
            var long = drawMobileGeomerty[i].split(" ")[1].split('.')[0];
            var combinedXY = lat.toString() + " " + long.toString();
            //origin = JSITM.itmRef2gpsRef(x.split('.')[0] + " " + y.split('.')[0]);
            var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);
            var pt = coordLatLong.split(" ");

            var ptArray = [];
            
            ptArray.push(parseFloat(pt[0]));
            ptArray.push(parseFloat(pt[1]));
            if (i == 0)
                ptLastArray = ptArray;
            polygonArray.push(ptArray);
            
        }
        // in polygon first and last points are the same
        polygonArray.push(ptLastArray);

        var poly = turf.polygon([polygonArray]);
        var area = turf.area(poly);
        document.getElementById('area').value = area;
        var line = turf.polygonToLine(poly);
        
        var length = turf.length(line, { units: currentUnits });
        document.getElementById('perimeter').value = length;

        // remove last apostroph
        geoPoly = geoPoly.substring(0, geoPoly.length - 1);

        // add right bracket 
        geoPoly += ")"
        drawWKTS.push(geoPoly);
        var data =
        {
            wkts: drawWKTS,
            names: ['mobileMeasurePolygon'],
            geometryType: govmap.drawType.Polygon,
            defaultSymbol:
            {
                
                outlineWidth: 0.8,
                color: [20, 112, 255, 1],
                fillColor: [20, 112, 255, 0.5]
            },
            clearExisting: false,
            data:
            {

            }
        };
        govmap.clearGeometriesByName(['mobileMeasurePolyline', 'mobileMeasurePolygon']);

        //// clear prev points 
        //for (i = 0; i < 20; i++)
        //    govmap.clearGeometriesByName('linepoint' + i);
        govmap.displayGeometries(data).then(function (e) {
        });
    }
}
function computeDistatnce(p1, p2,units)
{
    var lat1 = p1.split(" ")[0].split('.')[0];
    var long1 = p1.split(" ")[1].split('.')[0];
    var combinedXY1 = lat1.toString() + " " + long1.toString();
    //origin = JSITM.itmRef2gpsRef(x.split('.')[0] + " " + y.split('.')[0]);
    var coordLatLong1 = JSITM.itmRef2gpsRef(combinedXY1);
    var coordLatLongArray1 = coordLatLong1.split(" ");
    var pointLatLong1 = [];
    pointLatLong1.push(parseFloat(coordLatLongArray1[0]));
    pointLatLong1.push(parseFloat(coordLatLongArray1[1]));
    var pt1 = turf.geometry("Point", pointLatLong1);

    var lat2 = p2.split(" ")[0].split('.')[0];
    var long2 = p2.split(" ")[1].split('.')[0];
    var combinedXY2 = lat2.toString() + " " + long2.toString();
    var coordLatLong2 = JSITM.itmRef2gpsRef(combinedXY2);
    var coordLatLongArray2 = coordLatLong2.split(" ");
    var pointLatLong2 = [];
    pointLatLong2.push(parseFloat(coordLatLongArray2[0]));
    pointLatLong2.push(parseFloat(coordLatLongArray2[1]));
    var pt2 = turf.geometry("Point", pointLatLong2);
    /////////

   // var currentUnits = (units == '1') ? 'meters' : 'kilometers';
    var options = { units: units };

    return turf.distance(pt1, pt2, options);

}
function minimizeDrawDiv()
{
    // minimize div so user can see where to draw
    document.getElementById('deleteButtondraw').style.display = 'none';
    document.getElementById('visibility1').style.display = 'none';
    document.getElementById('visibility2').style.display = 'none';
    document.getElementById('color1').style.display = 'none';
    document.getElementById('color2').style.display = 'none';
    document.getElementById('width1').style.display = 'none';
    document.getElementById('width2').style.display = 'none';
    document.getElementById('drawdivButtom').style.display = 'none';
    document.getElementById('drawDiv').style.height = '28%';
    document.getElementById('maximizeDrawDivMobile').style.display = 'block';
}
function DrawUserGeometry(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    if (isMobile)
    {
        minimizeDrawDiv();
        
    }
    
    var obj = document.getElementsByClassName("mapXY ng-binding ng-scope");   
    var drShape, drColorName, drSize, drColor, drvisibleVal, drvisible;
    var drShape = document.querySelector("img[name='optDrawShape'][value='1']").id;
    
    //var drColorName = document.querySelector('input[name = "optDrawColor"]:checked').value;
    var drColorName = document.querySelector("img[name ='optDrawColor'][value='1']").id;
    var drSize = document.querySelector('img[name = "optDrawSize"][value="1"]').id;
    var drvisibleVal = parseInt( document.getElementById("drawvisibilityslideramount").value);

    switch (drvisibleVal)
    {
        case "0":
            drvisible = 1;
            break;
        case "1":
            drvisible = 0.1;
            break;
        default :
            drvisible = (100 - drvisibleVal) / 100;
            break;
    }
    
    switch (drColorName.toUpperCase())
    {
        case "RED":
            drColor = [255, 38, 127, drvisible];
            break;
        case "GREEN":
            drColor = [19, 226, 55,drvisible];
            break;
        case "BLUE":
            drColor = [20, 112, 255, drvisible];
            break;
        case "YELLOW":
            drColor = [255, 228, 21, drvisible];
            break;

        case "PURPLE":
            drColor = [155, 112, 255, drvisible];
            

    }
    switch (drSize.toUpperCase())
    {
        case "LINE1":
            drSize = 2;
            break;
        case "LINE2":
            drSize = 10;
            break;
        case "LINE3":
            drSize = 15;
            break;
        case "LINE4":
            drSize = 20;
            break;
        case "LINE5":
            drSize = 35;
            
    }
   
        
    wkts = [];
    govmap.unbindEvent(govmap.events.CLICK);
 
    switch (drShape.toUpperCase())
    {
        
        case "POINT":
            document.getElementById("mouseTooltip").style.display = "none";
            govmap.draw(govmap.drawType.Point).progress(function (respoint)
            {
                wkts.push(respoint.wkt);
                userDrawnPointsWKTS.push(respoint.wkt);
                var data =
                {
                    wkts: wkts,
                    names: [],
                    geometryType: govmap.drawType.Point,
                    defaultSymbol:
                    {
                       // 'url': '/icons/Alef.gif',
                        //'url': 'http://maps.google.com/mapfiles/ms/micons/horsebackriding.png',
                        outlineColor: drColor,
                        outlineWidth: drSize,
                         fillColor: drColor
                    },
                    'symbols': [
                        //{
                        //'url': '/icons/Alef.gif',
                        //'width': 15,
                        //'height': 15
                        //}
                    ],
                    clearExisting: false,
                    data:
                    {
                        
                    }
                };
                govmap.displayGeometries(data).then(function (e) {
                   
                });
                clickUnclickGroup("", drawshapeGroup);
                rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
            });
            break;
        case "LINE":
            document.getElementById("mouseTooltip").style.display = "none";
            govmap.draw(govmap.drawType.Polyline)
                .progress(function (resline)
                {
                    console.log(resline.wkt);
                }).done(function (e)
                {
                    wkts.push(e.wkt);
                    userDrawnLinesWKTS.push(e.wkt);
                    var data =
                   {
                                wkts: wkts,
                                names: [],
                                geometryType: govmap.drawType.Polyline,
                                defaultSymbol:
                                {
                                    width: drSize,
                                    color: drColor,
                                    //outlineColor: [255, 99, 71, 0.5],
                                    //outlineWidth: 2,
                                    fillColor: drColor
                                },
                                clearExisting: false,
                                data:
                                {

                                }
                   };
                   govmap.displayGeometries(data).then(function (e) {

                   });
                    clickUnclickGroup("", drawshapeGroup);
                    rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    govmap.clearDrawings();

                });
              
             break;
        case "POLYGON":
            document.getElementById("mouseTooltip").style.display = "none";
            govmap.draw(govmap.drawType.Polygon)
                .progress(function (e)
                {
                    wkts.push(e.wkt);
                    userDrawnPolygonsWKTS.push(e.wkt);
                    var data =
                    {
                        wkts: wkts,
                        names: [],
                        geometryType: govmap.drawType.Polygon,
                        defaultSymbol:
                        {
                            //width: 2,
                            // color: [255, 99, 71, 1],
                            outlineColor: drColor,
                            outlineWidth: 0.2,
                            fillColor:drColor
                            //fillColor: [255,99,71,0]
                        },
                        clearExisting: false,
                        data:
                        {

                        }
                    };
                    govmap.displayGeometries(data).then(function (e) {

                    });
                    clickUnclickGroup("", drawshapeGroup);
                    rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    govmap.clearDrawings();

                }).done(function (e)
                {
                   

                });
            break;
        case "FREE":
                ////Freehand Polyline
            document.getElementById("mouseTooltip").style.left = "90%";
            document.getElementById("mouseTooltip").style.top = "50%";
            govmap.onEvent(govmap.events.MOUSE_MOVE).progress(function (e)
            {
                var mousetolltipDiv = document.getElementById("mouseTooltip");
                mousetolltipDiv.style.left = e.screenPoint.x + 15 + "px";
                mousetolltipDiv.style.top = e.screenPoint.y + 15 + "px";
            });
            document.getElementById("mouseTooltip").innerHTML = "לחץ כדי להתחיל בשרטוט";
            document.getElementById("mouseTooltip").style.display = "block";
            
            
            var numOfFreePolylines = 0;
            var drawnGeo = "LINESTRING(";
           
            govmap.onEvent(govmap.events.CLICK).progress(function (e)
            {
                //if (isMousePressed)
                {
                    govmap.onEvent(govmap.events.MOUSE_MOVE).progress(function (e) {

                        var mousetolltipDiv = document.getElementById("mouseTooltip");
                        mousetolltipDiv.innerHTML = "לחיצה כפולה להשלמה";
                        mousetolltipDiv.style.left = e.screenPoint.x + 15 + "px";
                        mousetolltipDiv.style.top = e.screenPoint.y + 15 + "px";

                        if (drawnGeo.indexOf(')') > -1)
                            drawnGeo = drawnGeo.slice(0, -1);
                        if (drawnGeo.length == 11)
                            drawnGeo += e.mapPoint.x + " " + e.mapPoint.y + ")";
                        else
                            drawnGeo += "," + e.mapPoint.x + " " + e.mapPoint.y + ")";
                        //var geo = "POINT(" + e.mapPoint.x + " " + e.mapPoint.y + ")";
                        var wkts = [];
                        wkts.push(drawnGeo);
                       // userDrawnLinesWKTS.push(drawnGeo);

                        var data = {
                            wkts: wkts,
                            names: ['p1'],
                            geometryType: govmap.drawType.Polyline,

                            defaultSymbol:
                            {
                                width: drSize,
                                color: [20, 112, 255, 1],
                                fillColor: [20, 112, 255, 1]
                            },
                            symbols: [],
                            clearExisting: false,
                            data: {

                            }
                        };
                        govmap.displayGeometries(data).then(function (response) {

                        });
                        clickUnclickGroup("", drawshapeGroup);
                    });

                }

            })
            //})

            govmap.onEvent(govmap.events.DOUBLE_CLICK).progress(function (e) {

                document.getElementById("mouseTooltip").style.display = "none";
                document.getElementById("mouseTooltip").style.left = "90%";
                document.getElementById("mouseTooltip").style.top = "50%";
                govmap.unbindEvent(govmap.events.click);
                govmap.unbindEvent(govmap.events.MOUSE_MOVE);
                govmap.unbindEvent(govmap.events.DOUBLE_CLICK);

                govmap.clearGeometriesByName(['p1']);
                // alert(drawnGeo);
                var wkts1 = [];
                wkts1.push(drawnGeo);
                var data1 = {
                    wkts: wkts1,
                    names: [],
                    geometryType: govmap.drawType.Polyline,

                    defaultSymbol:
                    {
                        width: drSize,
                        color: drColor,
                        fillColor: drColor
                    },
                    symbols: [],
                    clearExisting: false,
                    data: {

                    }
                };
                govmap.displayGeometries(data1).then(function (response) {
                   
                });

                rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);

            }); 
            
            
            
            break;
        case "RECTANGLE":
            document.getElementById("mouseTooltip").style.display = "none";
            govmap.draw(govmap.drawType.Rectangle)
                .progress(function (e) {
                    wkts.push(e.wkt);
                    userDrawnPolygonsWKTS.push(e.wkt);
                    var data =
                    {
                        wkts: wkts,
                        names: [],
                        geometryType: govmap.drawType.Polygon,
                        defaultSymbol:
                        {

                            outlineColor: drColor,
                            outlineWidth: 0.2,
                            fillColor: drColor
                        },
                        clearExisting: false,
                        data:
                        {

                        }
                    };
                    govmap.displayGeometries(data).then(function (e) {
                        
                    });
                    clickUnclickGroup("", drawshapeGroup);
                    rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    govmap.clearDrawings();

                }).done(function (e) {


                });
            break;
        case "CIRCLE":
            document.getElementById("mouseTooltip").style.display = "none";
            govmap.draw(govmap.drawType.Point)
                .progress(function (resline)
                {

                }).done(function (e)
                {
                    wkts.push(e.wkt);
                    userDrawnPointsWKTS.push(e.wkt);
                    var data =
                    {
                        circleGeometries: [{ x: 183184, y: 669173, radius: 5000 }],
                        names: [],
                        geometryType: govmap.drawType.CIRCLE,
                        defaultSymbol:
                        {
                            outlineColor: [255, 99, 71, 0.5],
                            outlineWidth: 1,
                            fillColor: drColor
                        },
                        clearExisting: false,
                        data:
                        {

                        }
                    };
                    govmap.displayGeometries(data).then(function (e)
                    {
                       
                    });
                    clickUnclickGroup("", drawshapeGroup);
                    rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                    govmap.clearDrawings();

                });

    }

    // rebind identify to click event again 
   // govmap.clearDrawings();
   
}

//

//



function rebindClickEvent(identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    clickEventType.value = "identify";
    govmap.onEvent(govmap.events.CLICK).progress(function (e) {
        var pt = "POINT(" + e.mapPoint.x + " " + e.mapPoint.y + ")";
        var  identifyGeo = pt;
        var identifyGeoType = "Point";
        DoTheIntersectNew(identifyGeo, identifylayers, identifyGeoType, 'down', currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, true, routeSteps);


    });
}
function GetScreenCordinates(obj) {
    var p = {};
    p.x = obj.offsetLeft;
    p.y = obj.offsetTop;
    while (obj.offsetParent) {
        p.x = p.x + obj.offsetParent.offsetLeft;
        p.y = p.y + obj.offsetParent.offsetTop;
        if (obj == document.getElementsByTagName("body")[0]) {
            break;
        }
        else {
            obj = obj.offsetParent;
        }
    }
    return p;
}
function getPosition(e) {
    var posx = 0;
    var posy = 0;

    if (!e) var e = window.event;

    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }

    return {
        x: posx,
        y: posy
    }
}


Math.trunc = Math.trunc || function (x) {
    if (isNaN(x)) {
        return NaN;
    }
    if (x > 0) {
        return Math.floor(x);
    }
    return Math.ceil(x);
};



function test44()
{
    //showBufferDiv()
    //return;
    //var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
    var polygonCoordString = "POLYGON((";
    var lat1 = 179989;
    var long1 = 652546;
    var combinedXY1 = lat1.toString() + long1.toString();
    var coordLatLong1 = JSITM.itmRef2gpsRef(combinedXY1);
    var coordLatLongArray1 = coordLatLong1.split(" ");

    var pointLatLong1 = [];
    pointLatLong1.push(parseInt(coordLatLongArray1[0]));
    pointLatLong1.push(parseInt(coordLatLongArray1[1]));
    var pt1 = turf.geometry("Point", pointLatLong1);

    //
    var lat2 = 181708;
    var long2 = 652388;
    var combinedXY2 = lat2.toString() + long2.toString();

    var coordLatLong2 = JSITM.itmRef2gpsRef(combinedXY2);
    var coordLatLongArray2 = coordLatLong2.split(" ");

    var pointLatLong2 = [];
    pointLatLong2.push(parseFloat(coordLatLongArray2[0]));
    pointLatLong2.push(parseFloat(coordLatLongArray2[1]));
    var pt2 = turf.geometry("Point", pointLatLong2);



    //
    var lat3 = 180438 ;
    var long3 = 651382;
    var combinedXY3 = lat3.toString() + long3.toString();

    var coordLatLong3 = JSITM.itmRef2gpsRef(combinedXY3);
    var coordLatLongArray3 = coordLatLong3.split(" ");

    var pointLatLong3 = [];
    pointLatLong3.push(parseFloat(coordLatLongArray3[0]));
    pointLatLong3.push(parseFloat(coordLatLongArray3[1]));
    var pt3 = turf.geometry("Point", pointLatLong3);
    //


    var lat4 = 179989;
    var long4 = 652546;
    var combinedXY4 = lat4.toString() + long4.toString();
        
    var coordLatLong4 = JSITM.itmRef2gpsRef(combinedXY4);
    var coordLatLongArray4 = coordLatLong4.split(" ");

    var pointLatLong4 = [];
    pointLatLong4.push(parseFloat(coordLatLongArray4[0]));
    pointLatLong4.push(parseFloat(coordLatLongArray4[1]));
    var pt4 = turf.geometry("Point", pointLatLong4);

    //var polygon = turf.polygon([[
    //    [[
    //        [1.275543, 54.464547], // I want to feed these coordinates
    //        [1.275543, 54.489271],
    //        [1.215118, 54.489271],
    //        [1.215118, 54.464547],
    //        [1.275543, 54.464547]
    //    ]]
    //]], ...

    var poly = turf.polygon([[[parseInt( coordLatLongArray1[1]), parseInt(coordLatLongArray1[0])],
                              [parseInt(coordLatLongArray2[1]), parseInt(coordLatLongArray2[0])],
                              [parseInt(coordLatLongArray3[1]), parseInt(coordLatLongArray3[0])],
                              [parseInt(coordLatLongArray1[1]), parseInt(coordLatLongArray1[0])]]]);
    var buffered = turf.buffer(poly, 100, { units: 'meters' });
    var bufferCoordinates = buffered.geometry.coordinates;
    for (i = 0; i < bufferCoordinates[0].length; i++) {
        var tmpPoint = bufferCoordinates[0][i];
        var itmPoint = JSITM.gpsRef2itmRef(tmpPoint[0] + " " + tmpPoint[1]);
        polygonCoordString += itmPoint + ",";
    }
    // remove last apostroph
    polygonCoordString = polygonCoordString.substring(0, polygonCoordString.length - 1);
    polygonCoordString += "))";


    var data =
    {
        //wkts: ["POLYGON((211938 715243, 211954 715241, 211970 715234, 211985 715223, 211998 715208, 212008 715189, 212016 715168, 212021 715145, 212022 715121, 212021 715098, 212016 715075, 212008 715054, 211997 715035, 211985 715020, 211970 715009, 211954 715002, 211938 714999, 211921 715002, 211905 715009, 211891 715020, 211878 715035, 211867 715054, 211860 715075, 211855 715098, 211853 715121, 211855 715145, 211860 715168, 211868 715189, 211878 715208, 211891 715223, 211906 715234, 211921 715241, 211938 715243))"],
        wkts: [polygonCoordString],
        geometryType: govmap.drawType.Polygon,
        defaultSymbol:
        {
            outlineColor: [0, 80, 255, 1],
            outlineWidth: 1,
            fillColor: [138, 43, 226, 0.5]
        },

        clearExisting: false,
        data:
        {
            tooltips: [],
            headers: [],
            bubbleHTML: "",
            bubbleHTMLParameters: [[], []]
        }
    };
    govmap.displayGeometries(data).then(function (response) {

    });
    govmap.zoomToXY({ x: parseInt(lat1), y: parseInt(long1), level: 8, marker: false });

}
function test3()
{
    govmap.unbindEvent(govmap.events.CLICK);  

    govmap.draw(govmap.drawType.Polyline).progress(function (resline)
    {
    }).done(function (e)
    {
    
        var polyString = "POLYGON((";
        var x = 0
        var y = 0;
        var wkt = e.wkt.toString();
        alert(wkt);
        var polylineArray = [];

        var tmp = wkt.substring(11, wkt.length - 1);
        var tmp = tmp.toString();
        alert(tmp);
        var wktArray = tmp.split(",");
        var temp = "";
        var item;

        for (i = 0; i < wktArray.length; i++) {
            // check if first char is not empty
            //alert(wktArray[i])

            if (wktArray[i].charAt(0) === " ")
                wktArray[i] = wktArray[i].substring(1);

            item = wktArray[i].split(" ");
            var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();

            var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);

            var pt = coordLatLong.split(" ");
            var ptArray = [];
            ptArray.push(parseFloat(pt[0]));
            ptArray.push(parseFloat(pt[1]));
            polylineArray.push(ptArray);
        }

        var line = turf.lineString(polylineArray);
        

        var buffered = turf.buffer(line, 100, { units: 'meters' }).geometry.coordinates[0];

        for (j = 0; j < buffered.length; j++) {


            var itmpt = JSITM.gpsRef2itmRef(buffered[j][0] + " " + buffered[j][1]);
            if (j == 0) {
                var itmptArr = itmpt.split(" ");
                x = parseInt(itmptArr[0]);
                y = parseInt(itmptArr[1]);
            }


            polyString += itmpt + ",";
        }
        polyString = polyString.substring(0, polyString.length - 1);
        polyString += "))";

        var data =
        {

            wkts: [polyString],
            geometryType: govmap.drawType.Polygon,
            defaultSymbol:
            {
                outlineColor: [0, 80, 255, 1],
                outlineWidth: 1,
                fillColor: [138, 43, 226, 0.5]
            },

            clearExisting: false,
            data:
            {
                tooltips: [],
                headers: [],
                bubbleHTML: "",
                bubbleHTMLParameters: [[], []]
            }
        };
        govmap.displayGeometries(data).then(function (response) {

        });
        govmap.zoomToXY({ x: x, y: y, level: 6, marker: false });
        //
    });
    return;
        
    govmap.draw(govmap.drawType.Polygon).progress(function (e)
    {
        var polyString = "POLYGON((";
        var x = 0
        var y = 0;
        var wkt = e.wkt.toString(); 
        alert(wkt);
        var polygonArray = [];
       
        var tmp = wkt.substring(9, wkt.length - 2);
        var tmp = tmp.toString();
        
        var wktArray = tmp.split(",");
        var temp = "";
        var item;
        
        for (i = 0; i < wktArray.length; i++)
        {
            // check if first char is not empty
            //alert(wktArray[i])
                
            if (wktArray[i].charAt(0) === " ")
               wktArray[i] = wktArray[i].substring(1);
                
            item = wktArray[i].split(" ");
            var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();
        
            var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);

            var pt = coordLatLong.split(" ");
            var ptArray = [];
            ptArray.push(parseFloat(pt[0]));
            ptArray.push(parseFloat(pt[1]));
            polygonArray.push(ptArray);
        }
        
        
        var poly = turf.polygon([polygonArray]);
       
        var buffered = turf.buffer(poly, 100, { units: 'meters' }).geometry.coordinates[0];
       
        for (j = 0; j < buffered.length; j++) {


            var itmpt = JSITM.gpsRef2itmRef(buffered[j][0] + " " + buffered[j][1]);
            if (j == 0) {
                var itmptArr = itmpt.split(" ");
                x = parseInt(itmptArr[0]);
                y = parseInt(itmptArr[1]);
            }


            polyString += itmpt + ",";
        }
        polyString = polyString.substring(0, polyString.length - 1);
        polyString += "))";
       
        var data =
        {
       
            wkts: [polyString],
            geometryType: govmap.drawType.Polygon,
            defaultSymbol:
            {
                outlineColor: [0, 80, 255, 1],
                outlineWidth: 1,
                fillColor: [138, 43, 226, 0.5]
            },

            clearExisting: false,
            data:
            {
                tooltips: [],
                headers: [],
                bubbleHTML: "",
                bubbleHTMLParameters: [[], []]
            }
        };
        govmap.displayGeometries(data).then(function (response) {

        });
        govmap.zoomToXY({ x: x, y: y, level: 6, marker: false });
        //
    });
       

    
}
function test33()
{
    var polyString = "POLYGON((";
    //var polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
    var wkt = 'POLYGON((207493.21 635813.81,220788.55 642362.26,220788.55 626817.96,207493.21 635813.81))';
    var polygonArray = [];
    var ptArray = [];
    var wktArray = wkt.substring(9, wkt.length - 2).split(",");
    for (i = 0; i < wktArray.length; i++)
    {
        var item = wktArray[i].split(" "); 
        var combinedXY = parseInt(item[0]).toString() + parseInt(item[1]).toString();
        var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);
        var pt = coordLatLong.split(" ");
        
        ptArray.push(parseFloat(pt[0]));
        ptArray.push(parseFloat(pt[1]));
        polygonArray.push(ptArray);
    }
    //var poly = turf.polygon([[[31.81508, 35.07816], [31.8742, 35.21858], [31.73401, 35.21856], [31.81508, 35.07816]]]);
    var poly = turf.polygon([polygonArray]);
    var buffered = turf.buffer(poly, 100, { units: 'meters' }).geometry.coordinates[0];
    //var normalizeBuffer = turf.normalize(buffered);
    for (j = 0; j < buffered.length ; j++)
    {
        var itmpt = JSITM.gpsRef2itmRef(buffered[j][0] + " " + buffered[j][1]);
        polyString += itmpt + ",";
    }
    polyString = polyString.substring(0, polyString.length - 1);
    polyString += "))";
    var data =
    {
        //wkts: ["POLYGON((211938 715243, 211954 715241, 211970 715234, 211985 715223, 211998 715208, 212008 715189, 212016 715168, 212021 715145, 212022 715121, 212021 715098, 212016 715075, 212008 715054, 211997 715035, 211985 715020, 211970 715009, 211954 715002, 211938 714999, 211921 715002, 211905 715009, 211891 715020, 211878 715035, 211867 715054, 211860 715075, 211855 715098, 211853 715121, 211855 715145, 211860 715168, 211868 715189, 211878 715208, 211891 715223, 211906 715234, 211921 715241, 211938 715243))"],
        wkts: [polyString],
        geometryType: govmap.drawType.Polygon,
        defaultSymbol:
        {
            outlineColor: [0, 80, 255, 1],
            outlineWidth: 1,
            fillColor: [138, 43, 226, 0.5]
        },

        clearExisting: false,
        data:
        {
            tooltips: [],
            headers: [],
            bubbleHTML: "",
            bubbleHTMLParameters: [[], []]
        }
    };
    govmap.displayGeometries(data).then(function (response) {

    });
    govmap.zoomToXY({ x: 207457, y: 635703, level: 8, marker: false });
}
function test9()
{
    // "POLYGON((151612.40 534674.88, 215112.52 538643.64, 98431.04 445774.70, 74618.49 521974.85, 80968.50 552931.17, 151612.40 533881.13,151612.40 534674.88))"
    var polygonCoordString = "POLYGON((";
    var lat = 220853;
    var long = 631071;

    var combinedXY = lat.toString() + long.toString();

    var coordLatLong = JSITM.itmRef2gpsRef(combinedXY);
    var coordLatLongArray = coordLatLong.split(" ");

    var pointLatLong = [];
    pointLatLong.push(parseFloat(coordLatLongArray[0]));
    pointLatLong.push(parseFloat(coordLatLongArray[1]));
    var pt = turf.geometry("Point", pointLatLong);

    var buffered = turf.buffer(pt, 100, { units: 'meters' });
    var bufferCoordinates = buffered.geometry.coordinates;
    for (i = 0; i < bufferCoordinates[0].length; i++)
    {
        var tmpPoint = bufferCoordinates[0][i];
        var itmPoint = JSITM.gpsRef2itmRef(tmpPoint[0] + " " + tmpPoint[1]);
        polygonCoordString += itmPoint +",";
    }
    // remove last apostroph
    polygonCoordString = polygonCoordString.substring(0, polygonCoordString.length - 1);
    polygonCoordString += "))";


    var data =
    {
        //wkts: ["POLYGON((211938 715243, 211954 715241, 211970 715234, 211985 715223, 211998 715208, 212008 715189, 212016 715168, 212021 715145, 212022 715121, 212021 715098, 212016 715075, 212008 715054, 211997 715035, 211985 715020, 211970 715009, 211954 715002, 211938 714999, 211921 715002, 211905 715009, 211891 715020, 211878 715035, 211867 715054, 211860 715075, 211855 715098, 211853 715121, 211855 715145, 211860 715168, 211868 715189, 211878 715208, 211891 715223, 211906 715234, 211921 715241, 211938 715243))"],
        wkts : [polygonCoordString],
        geometryType: govmap.drawType.Polygon,
        defaultSymbol:
        {
            outlineColor: [0, 80, 255, 1],
            outlineWidth: 1,
            fillColor: [138, 43, 226, 0.5]
        },

        clearExisting: false,
        data:
        {
            tooltips: [],
            headers: [],
            bubbleHTML: "",
            bubbleHTMLParameters: [[], []]
        }
    };
    govmap.displayGeometries(data).then(function (response) {
        
    });
    govmap.zoomToXY({ x: parseInt(lat), y: parseInt(long), level: 8, marker: false });
        
}
function computeDrawTextLetersSpace()
{
    var currentZ = document.getElementById("scale_p").innerHTML;
    var z = currentZ.split(":")[1];
    var currentScale = parseInt(z);

    switch (currentScale)
    {
        case  3000000:
            return  13000;
        case 1000000:
            return 4500;
        case 500000:
            return 2500;
        case 250000:
            return 1100;
        case 100000:
            return 400;
        case 50000:
            return 200;
        case 25000:
            return 100;
        case 10000:
            return 40;
        case 5000:
            return 20;
        case 2500:
            return 10;
        case 1250:
            return 5;
    }
}
function clearCurrentText(drawTextItems)
{
    var textToClear = [];
    for (i = 0; i < drawTextItems.length; i++)
    {
       textToClear.push(drawTextItems[i]);
       
    }
    govmap.clearGeometriesByName(textToClear);
    drawTextItems.length = 0;
}

function clearAllText(textinfo, drawTextItems)
{
    clearCurrentText(drawTextItems);
    textinfo.length = 0;
}
function redrawCurrentText(textinfo,drawTextItems)
{
    if (textinfo.length == 0) return;
    
    
    clearCurrentText(drawTextItems);
   
    var letterWidth = 12;

    for (j = 0; j < textinfo.length; j++)
    {
        var textInfoItem = textinfo[j];
        var counter = 0;
        for (i = 0; i < textInfoItem.text.length; i++) {
        
            var letter = textInfoItem.text[i].charCodeAt(0).toString();
            if (parseInt(letter) == 32 || parseInt(letter) == 83 )
                letter = "transparent";// space
            
            var delta = computeDrawTextLetersSpace();
            //if (parseInt(letter) == 1497 || parseInt(letter) == 1493)
            //    delta = parseFloat(delta)/2
            ////letterWidth = 10;
            //else
            //    //letterWidth = 15;
            var newX = parseFloat(textInfoItem.x) - counter * parseFloat(delta);
            var newPoint = "POINT(" + newX.toString() + " " + textInfoItem.y + ")";

            
            var textID = 'text' + parseInt(drawTextItems.length + 1);
            var names = [];
            names.push(textID);
            drawTextItems.push(textID);
            
            wkts = [];
            wkts.push(newPoint);
            var data =
            {

                wkts: wkts,
                names: names,
                geometryType: govmap.drawType.Point,
                defaultSymbol:
                {
                    'url': drawTextURL + letter + ".png",
                    'width':letterWidth,
                    'height': 15

                },
                'symbols': [
                    {
                        'url': drawTextURL + letter + ".png",
                        'width': letterWidth,
                        'height': 15

                    }
                ],
                clearExisting: false,
                data:
                {

                }
            };
            govmap.displayGeometries(data).then(function (e) {

            });
            counter += 1;
        }
    }
        
}

function openBackgroundSlider()
{
    document.getElementById("bgDiv").style.display = "block";
    
    document.getElementById("lblbg2005").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2007").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2010").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2018").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2019").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2020").style.color = "rgb(142, 158, 183)"; //"rgb(19, 36, 64)";
    document.getElementById("lblbg2021").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2022").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2023").style.color = "rgb(142, 158, 183)";
        
   // changeBackground(20, 0);// 2005

}
function InitbgSliderLabels()
{
    for (var i = 0; i < 9; i++) {
        var text = "";
        var leftpos = "";
        var color = "";
        switch (i) {     // total width is 107  , we need to devide by num of orthophoto , when start is -10 and end is 97  
            case 0:
                text = "2005";
                leftpos = '-10px';
                color = "rgb(142, 158, 183)";
                break;
            case 1:
                text = "2007";
                leftpos = "10%";
                color = "rgb(142, 158, 183)";
                break;
            case 2:
                text = "2010";
                leftpos = "20%"; 
                color = "rgb(142, 158, 183)";
                break;
            case 3:
                text = "2018";
                leftpos = "34%";
                color = "rgb(142, 158, 183)";
                break;
            case 4:
                text = "2019";
                leftpos = "47%";
                color = "rgb(142, 158, 183)";
                break;
            case 5:
                text = "2020";
                leftpos = "59%";
                color = "rgb(142, 158, 183)";
                break;
            case 6:
                text = "2021";
                leftpos = "72%";
                color = "rgb(142, 158, 183)";
                break;
            case 7:
                text = "2022";
                leftpos = "84%";
                color = "rgb(142, 158, 183)";
                break;

            case 8:
                text = "2023";
                leftpos = "97%";
                color = "rgb(19, 36, 64)";
                break;


        }
         
        var label = document.createElement('label');
        label.id = "lblbg" + text;
        label.style.left=leftpos;
        label.style.position = 'absolute';
        label.style.fontFamily = "Alef-Regular";
        label.style.fontSize = "12px";
        label.style.top = "-25px";
        label.style.color = color;
        label.innerText = text;
        
        $("#bgSliderdiv").append(label);
        $("#bgSliderdiv").slider("value", '8');

    }
}
function changeBackground(bgid,ui)
{
   // var chnBG = govmap.setBackground(bgid);


   
}
function clearQueriesPanel(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    $('#SQTHCity .typeahead').typeahead('val', '');
    $('#SQTHLayer .typeahead').typeahead('val', '');
    $('#SQTHLyer1 .typeahead').typeahead('val', '');
    $('#SQTHJuri .typeahead').typeahead('val', '');
        
    hideTable(selectedIDInDatatable, slectedLayerInDatatable, heatmapLayer, heatmapField, drawTextData, drawTextItems);

    var btn = document.getElementById('SQMarkPolygonButton');
    
    changeColor(btn, 'rgba(242, 244, 250)', ' rgb(31, 54, 90)');
    document.getElementById("btnClearQuery").src = "icons/erasewhite.png";
    
}
function CheckIconURL() {
    //"http://localhost:51332/icons/font/";
    var location = document.createElement("a");
    location.href = window.location.href;

    var crntUrl = window.location.href;
    if (crntUrl.indexOf("localhost") > -1) {
        host = location.host;
        return "http://" + host + "/icons/";
    }
    else
        return "https://geo.mot.gov.il/icons/";

}

function CheckDrawTextURL()
{
   
    var location = document.createElement("a");
    location.href = window.location.href;

    var crntUrl = window.location.href;
    if (crntUrl.indexOf("localhost") > -1)
    {
        host = location.host;
        return "http://"+ host + "/icons/font/";
    }
    else
        return "https://geo.mot.gov.il/icons/font/";
        
}
function turnFreeClosedGeometryToOpen(e)
{

    var geo = e.geometry.rings[0];

    
    var len = geo.length;
    
   
    var newGeo = "LINESTRING((";
       
    for (i = 1; i < len-1 ; i++)
    {
        newGeo += geo[i][0]+" " +geo[i][1]+ ",";
    }
      
    
    newGeo = newGeo.substring(0, newGeo.length - 1);
    newGeo = newGeo + "))";
   // alert(points);
    return newGeo;
    

}

function hidebgslider()
{
    document.getElementById("bgDiv").style.display = "none";
   // govmap.setBackground(0);
    
}
function changebgopacity()
{
    var oldimgsrc = document.getElementById("bgimg").src;
    var oldimgNum = oldimgsrc.substring(oldimgsrc.length - 5, oldimgsrc.length-4);
    var newImgNum = parseInt(oldimgNum) + 1;
    if (parseInt(newImgNum) > 2)
        newImgNum = 0;
    
    document.getElementById("bgimg").src = "icons/bg"+ newImgNum.toString() + ".png"
    
}
function figureBgToChange(bg) {

    // for some reason changing bg needs a delay 
    //setTimeout(function ()
    // {
        var oldimgsrc = document.getElementById("bgimg").src;
        var oldimgNum = oldimgsrc.charAt(oldimgsrc.length - 5);
        var newImgNum = parseInt(oldimgNum) + 1;
        if (newImgNum > 2)
            newImgNum = 0;

        if (oldimgNum == 1) {
            govmap.setBackground(bg.value);
            document.getElementById("bgDiv").style.display = "block";
        }
        else {
            govmap.setBackground(oldimgNum);
            document.getElementById("bgDiv").style.display = "none";
        }


        document.getElementById("bgimg").src = "icons/bg" + newImgNum.toString() + ".png";

    //}, 1000);
       
    
}

function reopenTableinfo()
{
    document.getElementById("map_div").className = "mapdivsmall";
    document.getElementById("layerInformation").className = "rightPanelSmall";
    document.getElementById("layers").className = "rightPanelSmall";
    document.getElementById("layersFilter").className = "rightPanelSmall";
    document.getElementById("fieldFilter").className = "rightPanelSmall";
    document.getElementById("layerDownload").className = "rightPanelSmall";
  //  document.getElementById("Queries").className = "rightPanelSmall";



    document.getElementById('layerInformation').style.width = '0%';
    document.getElementById('layers').style.width = '0%';
    document.getElementById("layersFilter").style.width = "0%";
    document.getElementById("fieldFilter").style.width = "0%";
    document.getElementById("layerDownload").style.width = "0%";

    document.getElementById("watermrk").style.bottom = "35%";
    document.getElementById("scaleInMeters").style.bottom = "35%";
    document.getElementById("scaleUnit").style.bottom = "35%";
    document.getElementById("scale1").style.bottom = "34%";
    document.getElementById("scale2").style.bottom = "34%";
    document.getElementById("scale3").style.bottom = "34%";
    document.getElementById("scale4").style.bottom = "34%";
    document.getElementById('dataTableModal').style.height = "30%";

    document.getElementById('bgOptionsDiv').style.bottom = "35%";

    document.getElementById("btnMaximiseInfoTable").style.display = "none";
}
function minimiseInfoTable(heatmapLayer, heatmapField, drawTextData, drawTextItems)
{
    document.getElementById("watermrk").style.bottom = "5%";
    document.getElementById("scaleInMeters").style.bottom = "50px";
    document.getElementById("scaleUnit").style.bottom = "50px";
    document.getElementById("scale1").style.bottom = "45px";
    document.getElementById("scale2").style.bottom = "45px";
    document.getElementById("scale3").style.bottom = "45px";
    document.getElementById("scale4").style.bottom = "45px";
    document.getElementById('dataTableModal').style.height = "0%";
    //if (document.getElementById('headerTable') !== null) {
    //    document.getElementById('headerTable').style.height = "0%";
    //    document.getElementById('headerTable').innerHTML = '';

    //}
    //if (document.getElementById('dataTable1') !== null) {
    //    document.getElementById('dataTable1').style.height = "0%";
    //}
    document.getElementById("map_div").className = "mapdivbig";

    //currentDataTableLayerName = "";
    //document.getElementById("layerInformation").className = 'rightPanelBig';
    //document.getElementById("layers").className = 'rightPanelBig';

    document.getElementById("layerInformation").className = "rightPanelBig";
    document.getElementById("layerDownload").className = "rightPanelBig";
    document.getElementById("layersFilter").className = "rightPanelBig";
    document.getElementById("fieldFilter").className = "rightPanelBig";
    document.getElementById("layers").className = "rightPanelBig";
  //  document.getElementById("Queries").className = "rightPanelBig";
    document.getElementById("renderer").className = "rightPanelBig";
    //document.getElementById("statisticsDiv").className = "rightPanelBig";
    document.getElementById('statisticsDiv').style.width = "0%";
    //document.getElementById('statisticsDiv').style.width = "0%";
    // clear selected datatable row id 

    clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
    selectedIDInDatatable.value = '';
    slectedLayerInDatatable.value = '';
    //table.style.position = '';
    document.getElementById('bgOptionsDiv').style.bottom = "32px";
}

function changebgMobile(year)
{
    switch (year) {
        case 0:
            {
                govmap.setBackground(0);
                bg.value = '0';
                break;
            }
        case 2:
            {
                govmap.setBackground(2);
                bg.value = '2';
                break;
            }
        case 2005:
            {
                govmap.setBackground(20);
                bg.value = '20';
                break;
            }
        case 2007:
            {
                govmap.setBackground(21);
                bg.value = '21';
                break;
            }
        case 2010:
            {
                govmap.setBackground(19);
                bg.value = '19';
                break;
            }
        case 2018:
            {
                govmap.setBackground(23);
                bg.value = '23';
                break;
            }
        case 2019:
            {
                govmap.setBackground(24);
                bg.value = '24';
                break;
            }

        case 2020:
            {
                govmap.setBackground(26);
                bg.value = '26';
                break;
            }

        case 2021:
            {
                govmap.setBackground(32);
                bg.value = '32';
                break;
            }
        case 2022:
            {
                govmap.setBackground(27);
                bg.value = '27';
                break;
            }
        case 2023:
            {
                govmap.setBackground(1);
                bg.value = '1';
                break;
            }

    }

    document.getElementById('mobilebgOptions').style.display = 'none';
}
function doTheSlide(event, ui, bg)
{
    document.getElementById("lblbg2005").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2007").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2010").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2018").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2019").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2020").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2021").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2022").style.color = "rgb(142, 158, 183)";
    document.getElementById("lblbg2023").style.color = "rgb(142, 158, 183)";



    switch (ui.value) {
        case 0:
            {
                govmap.setBackground(20);
                document.getElementById("lblbg2005").style.color = "rgb(19, 36, 64)";//2005
                bg.value = '20';
                break;
            }
        case 1:
            {
                govmap.setBackground(21);
                document.getElementById("lblbg2007").style.color = "rgb(19, 36, 64)"; // 2007
                bg.value = '21';
                break;
            }
        case 2:
            {
                govmap.setBackground(19);
                document.getElementById("lblbg2010").style.color = "rgb(19, 36, 64)";//2010
                bg.value = '19';
                break;
            }
        case 3:
            {
                govmap.setBackground(23);
                document.getElementById("lblbg2018").style.color = "rgb(19, 36, 64)";//2018
                bg.value = '23';
                break;
            }
        case 4:
            {
                govmap.setBackground(24);
                document.getElementById("lblbg2019").style.color = "rgb(19, 36, 64)"; // 2019
                bg.value = '24';
                break;
            }
            
        case 5:
            {
                govmap.setBackground(26);
                document.getElementById("lblbg2020").style.color = "rgb(19, 36, 64)"; // 2020
                bg.value = '26';
                break;
            }
            
        case 6:
            {
                govmap.setBackground(32);
                document.getElementById("lblbg2021").style.color = "rgb(19, 36, 64)"; // 2021
                bg.value = '32';
                break;
            }
        case 7:
            {
                    govmap.setBackground(27);
                    document.getElementById("lblbg2022").style.color = "rgb(19, 36, 64)"; // 2022
                    bg.value = '27';
                    break;
            }
        case 8:
            {
                govmap.setBackground(1);
                document.getElementById("lblbg2023").style.color = "rgb(19, 36, 64)"; // 2023
                bg.value = '1';
                break;
            }
        
    }
}
function findmaxFor()
{
        
    var arr = [1, 2, 99, 9, 8,7, 6, 0, 5, 4, 3];
   
    var max = arr[0];
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i] > max) {
                max = arr[i]
                
            }
        }
         
    return max;
}
function findmaxWhile() {

    var arr = [1, 2, 99, 9, 8, 7, 6, 0, 5, 4, 3];

    var max = arr[0];
    var arraylen = arr.length;
    while (arraylen > 0)
    {
        if (arr[arraylen - 1] > max)
        {
            max = arr[arraylen - 1]; 
        }
        arraylen -= 1;
    }
    

    return max;
}

////////////////////////////////////////////////////////////////////
//
function loadselectedlayerFields() {
    var lyrselect = document.getElementById("layersSelect");
    var fldselect = document.getElementById("fieldsSelect");
    
    var lyr = lyrselect.options[lyrselect.selectedIndex].innerHTML;
    var fld = fldselect.options[fldselect.selectedIndex].innerHTML;
    if (lyr != "בחר שכבה" && fld != "הוסף שדה") {
        getLayerFieldsFromSqlite(lyr, fld);
       
    }
    else if (lyr != "בחר שכבה" && fld == "הוסף שדה")
    {
        clearFieldsInfo();
       
    }
    
}

function loadselectedlayerInfo(ogroupsArray) {
    var select = document.getElementById("layersSelect");
    //alert(select.value);
    var value =  select.options[select.selectedIndex].innerHTML;
    if (value != "בחר שכבה" && value != "הוסף שכבה חדשה") {
        getLayerInfoFromSqlite(value, ogroupsArray);
    }
    else if (value == "הוסף שכבה חדשה")
    {
        clearLayerInfo();
    }
}
//GetOneRecordFromFields

function clearFieldsInfo() {
    var url = checkUrl() + "/GetOneRecordFromFields";
    $.ajax({
        url: url,
        type: 'post',
        crossDomain: true,
        dataType: "json",
        //data: JSON.stringify(info),

        success: function (data) {
            if (data != null && data.length > 0) {

                var layerInfoTB = document.getElementById("fieldsDataTb")
                layerInfoTB.innerHTML = "";
                var tr, td, lbl, textbox;
                for (const fld in data[0]) {
                    if (fld != 'original_name' && fld != "LayerName")
                    {
                        tr = document.createElement("tr");
                        td = document.createElement("td");

                        td.style.width = "600px";
                        td.style.height = "30px";
                        td.style.textAlign = "left";
                        textbox = document.createElement("input");
                        textbox.setAttribute("type", "text");
                        textbox.setAttribute("id", fld);
                        textbox.style.width = "600px";
                        textbox.style.height = "30px";
                        textbox.value = "";
                        td.appendChild(textbox);
                        tr.appendChild(td);
                        td = document.createElement("td");

                        td.style.width = "150px";
                        td.style.height = "30px";
                        td.style.textAlign = "right";
                        lbl = document.createTextNode(fld);
                        td.appendChild(lbl);
                        tr.appendChild(td);
                        layerInfoTB.appendChild(tr);
                    }
                    

                }





            }

        }
    });
}

function clearLayerInfo()
{
    var url = checkUrl() + "/GetOneRecordFromLayers";
    $.ajax({
        url: url,
        type: 'post',
        crossDomain: true,
        dataType: "json",
        //data: JSON.stringify(info),

        success: function (data) {
            if (data != null && data.length > 0) {

                var layerInfoTB = document.getElementById("layerDataTb")
                layerInfoTB.innerHTML = "";
                var tr, td, lbl, textbox;
                for (const fld in data[0]) {
                    tr = document.createElement("tr");
                    td = document.createElement("td");

                    td.style.width = "600px";
                    td.style.height = "30px";
                    td.style.textAlign = "left";
                    textbox = document.createElement("input");
                    textbox.setAttribute("type", "text");
                    textbox.setAttribute("id", fld);
                    textbox.style.width = "600px";
                    textbox.style.height = "30px";
                    if (fld =="isbranch")
                        textbox.value = "0";
                    else
                        textbox.value = "";
                    td.appendChild(textbox);
                    tr.appendChild(td);
                    td = document.createElement("td");

                    td.style.width = "150px";
                    td.style.height = "30px";
                    td.style.textAlign = "right";
                    lbl = document.createTextNode(fld);
                    td.appendChild(lbl);
                    tr.appendChild(td);
                    layerInfoTB.appendChild(tr);

                }





            }

        }
    });
}

function clearFieldInfo()
{
    var url = checkUrl() + "/GetOneRecordFromFields";
    $.ajax({
        url: url,
        type: 'post',
        crossDomain: true,
        dataType: "json",
        //data: JSON.stringify(info),

        success: function (data) {
            if (data != null && data.length > 0) {

                var fieldsDataTb = document.getElementById("fieldsDataTb")
                fieldsDataTb.innerHTML = "";
                var tr, td, lbl, textbox;
                for (const fld in data[0]) {
                    tr = document.createElement("tr");
                    td = document.createElement("td");

                    td.style.width = "600px";
                    td.style.height = "30px";
                    td.style.textAlign = "left";
                    textbox = document.createElement("input");
                    textbox.setAttribute("type", "text");
                    textbox.setAttribute("id", fld);
                    textbox.style.width = "600px";
                    textbox.style.height = "30px";
                    if (fld =="isbranch")
                        textbox.value = "0";
                    else
                        textbox.value = "";
                    td.appendChild(textbox);
                    tr.appendChild(td);
                    td = document.createElement("td");

                    td.style.width = "150px";
                    td.style.height = "30px";
                    td.style.textAlign = "right";
                    lbl = document.createTextNode(fld);
                    td.appendChild(lbl);
                    tr.appendChild(td);
                    fieldsDataTb.appendChild(tr);

                }





            }

        }
    });
}
function getLayerInfoFromSqlite(layerName, ogroupsArray)
{
    var url = checkUrl() + "/GetLayerInfoSQLITE";
    
    var info =
    {
        lyr: layerName,
        
    };
    $.ajax({
        url: url,
        type: 'post',
        crossDomain: true,
        dataType: "json",
        data: JSON.stringify(info),

        success: function (data) {
            if (data != null && data.length > 0) {

                var layerInfoTB = document.getElementById("layerDataTb") 
                layerInfoTB.innerHTML = "";
                var tr, td, lbl,textbox;
                for (const fld in data[0])
                {
                        tr = document.createElement("tr");
                        td = document.createElement("td");

                        td.style.width = "600px";
                        td.style.height = "30px";
                        td.style.textAlign = "left";
                        
                        
                        
                            textbox = document.createElement("input");
                            textbox.setAttribute("type", "text");
                            textbox.setAttribute("id", fld);
                            textbox.style.width = "600px";
                            textbox.style.height = "30px";
                            textbox.style.borderColor = "lightgrey";
                            textbox.value = data[0][fld];
                            if (fld == 'DescName' || fld == 'SourceName') {
                                textbox.disabled = "true";
                            }
                            td.appendChild(textbox);
                        

                    
                        tr.appendChild(td);
                        td = document.createElement("td");

                        td.style.width = "150px";
                        td.style.height = "30px";
                        td.style.textAlign = "right";
                        lbl = document.createTextNode(fld);
                        td.appendChild(lbl);
                        tr.appendChild(td);
                    

                        layerInfoTB.appendChild(tr);
                        
                    
                    
                }

                
                

                
            }

        }
    });
}


function getLayerFieldsFromSqlite(layerName,field) {
    var url = checkUrl() + "/GetLayerFieldsSQLITE";

    var info =
    {
        lyr: layerName,
        fld:field
    };
    $.ajax({
        url: url,
        type: 'post',
        crossDomain: true,
        dataType: "json",
        data: JSON.stringify(info),

        success: function (data) {
            if (data != null && data.length > 0) {

                var layerInfoTB = document.getElementById("fieldsDataTb")
                layerInfoTB.innerHTML = "";
                var tr, td, lbl, textbox;
                for (const fld in data[0]) {
                    if (fld != 'original_name' && fld != "LayerName" && fld != "fName")
                    {
                        tr = document.createElement("tr");
                        td = document.createElement("td");

                        td.style.width = "600px";
                        td.style.height = "30px";
                        td.style.textAlign = "left";
                        textbox = document.createElement("input");
                        textbox.setAttribute("type", "text");
                        textbox.setAttribute("id", fld);
                        textbox.style.width = "600px";
                        textbox.style.height = "30px";
                        
                        textbox.value = data[0][fld];
                        
                        td.appendChild(textbox);
                        tr.appendChild(td);
                        td = document.createElement("td");

                        td.style.width = "150px";
                        td.style.height = "30px";
                        td.style.textAlign = "right";
                        lbl = document.createTextNode(fld);
                        td.appendChild(lbl);
                        tr.appendChild(td);
                        layerInfoTB.appendChild(tr);
                    }
                   

                }





            }

        }
    });
}


//getListOfFieldsFromSQLITE 
function getListOfFieldsFromSQLITE(obj)
{
    var select = document.getElementById('layersSelect');
    var layer = select.options[select.selectedIndex].innerHTML;
    var url = checkUrl() + "/getListOfFieldsEng";
    var info =
    {
        lyr: layer,

    };

    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify(info),
        dataType: 'json',
        success: function (data) {
           
                var select = document.getElementById('fieldsSelect');
                select.length = 0;
                var opt = document.createElement('option');
                opt.value = "";
                opt.innerHTML = "בחר שדה";
                select.appendChild(opt);
                var opt = document.createElement('option');
                opt.value = "";
                opt.innerHTML = "הוסף שדה";
                select.appendChild(opt);
                

                for (i = 0; i < data.length; i++) {

                    if (data[i] != null) {
                        var opt = document.createElement('option');
                        opt.value = data[i]['fName'];
                        opt.innerHTML = data[i]['fName'];
                        select.appendChild(opt);
                    }
                }
          

        }
    });
}
function getListOfLayersFromSQLITE(layer,addNew) {
    var url = checkUrl() + "/GetListOfLayersEng";


    (function (layer) {

    $.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        success: function (data) {
            if (data != null && data.length > 0)
            {
                var select = document.getElementById('layersSelect');
                select.length = 0;
                var opt = document.createElement('option');
                opt.value = "";
                opt.innerHTML = "בחר שכבה";
                select.appendChild(opt);
                if (addNew)
                {
                    opt = document.createElement('option');
                    opt.value = "";
                    opt.innerHTML = "הוסף שכבה חדשה";
                    select.appendChild(opt);
                }
                

                for (i = 0; i < data.length; i++) {

                    if (data[i] != null) {
                        var opt = document.createElement('option');
                        opt.value = data[i]['DescName'];
                        opt.innerHTML = data[i]['DescName'];
                        select.appendChild(opt);
                    }
                }
                if (layer != "")
                    select.value = layer;
            }

        }
    });

    })(layer);
}




function deletegroup()
{
    var selectVal = document.getElementById("groupSelect")
    var val = selectVal.options[selectVal.selectedIndex].innerHTML;
    if (val == "בחר קבוצה" || val == "הוסף קבוצה")
    {
        alert("יש לבחור קבוצה")
        return;
    }
    var url = checkUrl() + "/deleteGroup";
    $.ajax(
        {
            url: url,
            type: 'post',
            data: JSON.stringify({ groupH: val }),
            dataType: 'json',
            success: function (data) {
                alert(data);
                getOtherGroupsFromSqlite();
                document.getElementById("GroupDataTb").style.display = "none";
            }

        })
}





function updategroup(groupNameH, groupNmaeE)
{
   
    var selectVal = document.getElementById("groupSelect") 
    var val = selectVal.options[selectVal.selectedIndex].innerHTML;
    if (val == "בחר קבוצה") return;
    var url;
    if (val == "הוסף קבוצה")
        url = checkUrl() + "/InsertGroup";
    else
        url = checkUrl() + "/UpdateGroup";
    $.ajax(
        {
            url: url,
            type: 'post',
            data: JSON.stringify({ groupE: groupNmaeE, groupH: groupNameH }),
            dataType: 'json',
            success: function (data)
            {
                alert(data);
                getOtherGroupsFromSqlite();
            }

        })


}

function getOtherGroupsFromSqlite()
{
    var url = checkUrl() + "/GetOtherGroupsSQLITE";
    
        $.ajax(
            {
                url: url,
                type: 'post',
                dataType: 'json',
                success: function (data) {
                    if (data != null && data.length > 0)
                    {

                        var groupSelect = document.getElementById("groupSelect");
                        groupSelect.length = 0;
                        var opt = document.createElement("option");
                        opt.appendChild(document.createTextNode("בחר קבוצה"));
                        groupSelect.appendChild(opt);
                        opt = document.createElement("option");
                        opt.appendChild(document.createTextNode("הוסף קבוצה"));
                        groupSelect.appendChild(opt);
                        for (i = 0; i < data.length; i++) {
                            opt = document.createElement("option");
                            var item = document.createTextNode(data[i]['OtherGroup']);
                            item.text = data[i]['OtherGroupEng'];
                            opt.appendChild(item);
                            groupSelect.appendChild(opt);
                        }

                        var tbgroups = document.getElementById("GroupDataTb");
                        

                            tbgroups.innerHTML = "";
                            var tr, td, lbl, textbox;
                            for (const fld in data[0]) {
                                tr = document.createElement("tr");
                                td = document.createElement("td");

                                td.style.width = "200px";
                                td.style.height = "30px";
                                td.style.textAlign = "left";



                                textbox = document.createElement("input");
                                textbox.setAttribute("type", "text");
                                textbox.setAttribute("id", fld);
                                textbox.style.width = "200px";
                                textbox.style.height = "30px";
                                textbox.style.borderColor = "lightgrey";
                                textbox.value = data[0][fld];
                                td.appendChild(textbox);

                                tr.appendChild(td);
                                td = document.createElement("td");

                                td.style.width = "150px";
                                td.style.height = "30px";
                                td.style.textAlign = "right";
                                lbl = document.createTextNode(fld);
                                td.appendChild(lbl);
                                tr.appendChild(td);


                                tbgroups.appendChild(tr);

                          //  }
                        }
                    }
                }
            })

    
}
function InsertLayerInfo()
{      
    

    var select = document.getElementById('layersSelect');
    var layer = select.options[select.selectedIndex].innerHTML;

    var fields = {};
    $.each($('input[type=text]'), function () {
        fields[this.id] = $(this).val();
    });

    var url = checkUrl() + "/InsertLayerInfo";


    (function (layer) {
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify({ fieldsData: fields, lyr: layer }),
        dataType: 'json',
        success: function (json) {
            if (json[0].indexOf("SQLITE_CONSTRAINT") > -1)
            {
                alert("שכבה בשם זה כבר קיימת בטבלת שכבות יש לבחור שם אחר");
                return;
            }
            // reload list of layers after inset to show newly inserted layer
            getListOfLayersFromSQLITE(layer);
        }
    });
    })(layer);
}
//UpdateFields
function UpdateField() {
    var lyrSelect = document.getElementById('layersSelect');
    var layer = lyrSelect.options[lyrSelect.selectedIndex].innerHTML;


    var requireonezerow = ["Filter", "heatmap", "query","fDisplay"];
    var requireNonEmpty = ["Alias"];
    var requireNumeric = ["Filter","Order"];

    var fldSelect = document.getElementById('fieldsSelect');
    var field = fldSelect.options[fldSelect.selectedIndex].innerHTML;

    if (layer == "בחר שכבה") {
        alert("יש לבחור שכבה לעדכון");
        return;
    }

    if (field == 'בחר שדה')
    {
        alert("יש לבחור שדה לעדכון");
        return;
    }

    

    var fields = {};
    var valid = 1;


    $.each($('#fieldsDataTb input[type=text]'), function () {
        var value = $(this).val();

        if (requireonezerow.includes(this.id)) {
            if (value == "" || value == null || isNaN(value) || value < 0 || value > 1) {
                this.style.borderColor = "red";
                this.value = "יש להזין ערך בין 0-1";

                valid = 0;
            }
            else {
                this.style.borderColor = "lightgrey";

            }


        }
        if (requireNonEmpty.includes(this.id)) {
            if (value == "" || value == null || value.len == 0) {
                this.style.borderColor = "red";
                this.value = "יש להזין ערך ";

                valid = 0;
            }
            else {
                this.style.borderColor = "lightgrey";
                this.style.fontColor = "black";
            }
        }
        if (requireNumeric.includes(this.id))
        {
            if (value == "" || value == null || value.len == 0 || isNaN(value))
            {
                this.style.borderColor = "red";
                this.value = "יש להזין ערך מספרי ";

                valid = 0;
            }
            else {
                this.style.borderColor = "lightgrey";
                this.style.fontColor = "black";
            }
        }
        if (value != undefined && value.length > 0)
            fields[this.id] = $(this).val();
        
    });

    var flt = document.getElementById("Filter");
    var fltVal = document.getElementById("FilterValues");

    // if filter is on make sure filter values are not empty
    if (flt.value == 1 && (fltVal.value == "" || fltVal.value == null || fltVal.value.length ==0)) {

        fltVal.style.borderColor = "red";
        fltVal.value = "יש להזין ערך ";
        valid = 0;
    }
    else
    {
        fltVal.style.borderColor = "lightgrey";
        fltVal.style.fontColor = "black";
    }
    if (flt.value == 0)
        fltVal.value = "";
    

    if (valid == 0) return;

    var serverFunction;
    if (field == "הוסף שדה")
        serverFunction = "/InsertField";
    else
        serverFunction = "/UpdateField";

    var url = checkUrl() + serverFunction;
    
    $.ajax({
        url: url,
        type: 'post',
        data: JSON.stringify({ fieldsData: fields, lyr: layer ,fld:field}),
        dataType: 'json',
        success: function (json)
        {
            getListOfFieldsFromSQLITE();
            alert(json);
            
        }
    });
}

const validateEmail = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function updateLayerInfo()
{
    var select = document.getElementById('layersSelect');
    var layer = select.options[select.selectedIndex].innerHTML;
    var requireonezerow = ["IS_PROD", "Downloadable", "FILTER", "GOVMAP", "heatmap", "display", "query1", "query2", "isbranch"];
    var requireNonEmpty = ["TOCName", "TOCGroup", "TOCGroupOrder", "Source", "Sourceupdate", "Updated", "Description", "Created", "Spatialreferencesystem","Filedate"];
    var Numeric = ["TOCGroupOrder", "SCALERANGE","SCALE","X","Y"];


    if (layer == "בחר שכבה")
    {
        alert("יש לבחור שכבה לעדכון");
        return;
    }

    var fields = {};
    var valid = 1;
    $.each($('#layerDataTb input[type=text]'), function ()
    {
        var value = $(this).val();
        if (requireonezerow.includes(this.id))
        {
            if (value == "" || value == null|| isNaN(value) || value < 0 || value > 1) {
                this.style.borderColor = "red";
                this.value = "יש להזין ערך בין 0-1";
                
                valid = 0;
            }
            else
            {
                this.style.borderColor = "lightgrey";

            }
            

        }
        if (requireNonEmpty.includes(this.id))
        {
            if (value == "" || value == null || value.len == 0)
            {
                this.style.borderColor = "red";
                this.value = "יש להזין ערך ";

                valid = 0;
            }
            else {
                this.style.borderColor = "lightgrey";
                this.style.fontColor = "black";
            }
        }
        if (Numeric.includes(this.id))
        {
            if (value != "" && value != null && value.len > 0 && isNaN(value ))
            {
                this.style.borderColor = "red";
                this.value = "יש להזין ערך מספרי ";

                valid = 0;
            }
            else {
                this.style.borderColor = "lightgrey";
                this.style.fontColor = "black";
            }
        }
        
        fields[this.id] = $(this).val();
    });

    if ( valid == 0) return;
    var serverFunction = "";
    if (layer == "הוסף שכבה חדשה")
    {
        serverFunction = "/InsertLayerInfo";
        layer = fields["DescName"];
    }
    
    else
        serverFunction = "/UpdateLayerInfo";

    var url = checkUrl() + serverFunction;
    (function (layer) {
        $.ajax({
            url: url,
            type: 'post',
            data: JSON.stringify({ fieldsData: fields, lyr: layer }),
            dataType: 'json',
            success: function (json)
            {
                if (json[0].indexOf("CONSTRAINT") > -1) {
                    alert("שכבה בשם זה קיימת כבר במסד הנתונים");
                    return;
                }
                else
                {
                    getListOfLayersFromSQLITE(layer, true);
                    alert(json);
                }
                    // if insert was successfull update list of layers with new layer name
                
               
            },
            error: function(err)
            {
                alert(err);
               
            },    
                    
                    

        })
    })(layer);
}

function deleteLayer()
{
    
    var select = document.getElementById('layersSelect');
    var layer = select.options[select.selectedIndex].innerHTML;
        
    if (layer == "בחר שכבה" || layer == "הוסף שכבה חדשה")
    {
        alert("יש לבחור שכבה למחיקה");
        return;
    }
    
    

    (function (layer) {
    if (confirm("אתה עומד למחוק את שכבת " + layer + " האם להמשיך?")) {
        var url = checkUrl() + "/deleteLayer";
        $.ajax({
            url: url,
            type: 'post',
            data: JSON.stringify({ lyr: layer }),
            dataType: 'json',
            success: function (json) {

                getListOfLayersFromSQLITE("",true);
                clearLayerInfo();
                alert(json);
            }
        });
    }
    else
    {
        // do nothing
    }
    })(layer);
    
}

function DeleteField() {

    var lyrselect = document.getElementById('layersSelect');
    var layer = lyrselect.options[lyrselect.selectedIndex].innerHTML;

    if (layer == "בחר שכבה" ) {
        alert("יש לבחור שכבה ");
        return;
    }
    //fieldsSelect
    var fldselect = document.getElementById('fieldsSelect');
    var field = fldselect.options[fldselect.selectedIndex].innerHTML;

    if (field == 'בחר שדה')
    {
        alert("יש לבחור שדה ");
        return;
    }
    (function (layer) {
        if (confirm("אתה עומד למחוק את שדה " + field + " האם להמשיך?")) {
            var url = checkUrl() + "/deleteField";
            $.ajax({
                url: url,
                type: 'post',
                data: JSON.stringify({ lyr: layer,fld:field }),
                dataType: 'json',
                success: function (json) {

                    getListOfFieldsFromSQLITE();
                    clearFieldInfo();
                    alert(json);
                }
            });
        }
        else {
            // do nothing
        }
    })(layer);

}

function test5()
{
    var obj = document.getElementById("searchedAddress");
    var bgnum = parseInt(obj.value);
    govmap.setBackground(bgnum);
    
}
//function AddText2Cursor(text)
//{
//    document.onmousemove = handleMouseMove;
//    function handleMouseMove(event) {
//        var dot, eventDoc, doc, body, pageX, pageY;

//        event = event || window.event; // IE-ism

//        // If pageX/Y aren't available and clientX/Y
//        // are, calculate pageX/Y - logic taken from jQuery
//        // Calculate pageX/Y if missing and clientX/Y available
//        if (event.pageX == null && event.clientX != null) {
//            eventDoc = (event.target && event.target.ownerDocument) || document;
//            doc = eventDoc.documentElement;
//            body = eventDoc.body;

//            event.pageX = event.clientX +
//                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
//                (doc && doc.clientLeft || body && body.clientLeft || 0);
//            event.pageY = event.clientY +
//                (doc && doc.scrollTop || body && body.scrollTop || 0) -
//                (doc && doc.clientTop || body && body.clientTop || 0);
//        }

//        // Add a dot to follow the cursor
//        dot = document.createElement('div');
//        dot.className = "dot";
//        dot.innerHTML = "hello world";
//        dot.style.left = event.pageX + "px";
//        dot.style.top = event.pageY + "px";
//        document.body.appendChild(dot);
//    }
//}
function test4( )
{       


    
    var data0 = {
        wkts: ['LINESTRING(181638.5702018566 691584.9075372377, 230586.58476455236 683382.807799705)'],
        names: ['p1'],
        geometryType: govmap.geometryType.POLYLINE,
        defaultSymbol:
        {
            color: [255, 0, 80, 1],
            width: 100,
        },
        symbols: [],
        clearExisting: false,
        data: {
            
        }
    };
    govmap.displayGeometries(data0).then(function (response) {
        
    });  


    //
    var data1 = {
        wkts: ["POLYGON((151612.40 534674.88, 215112.52 538643.64, 98431.04 445774.70, 74618.49 521974.85, 80968.50 552931.17, 151612.40 533881.13,151612.40 534674.88))",
            "POLYGON((196062.48 621458.39, 196591.65 622516.72, 197649.99 659293.88, 229929.22 665379.31, 243423.00 632306.33, 196062.48 621458.39))"],
        names: ['p1', 'p2'],
        geometryType: govmap.geometryType.POLYGON,
        defaultSymbol:
        {
            outlineColor: [0, 80, 255, 1],
            outlineWidth: 1,
            fillColor: [138, 43, 226, 0.5]
        },
        symbols: [],
        clearExisting: false,
        data: {
            
        }
    };
    //draw polygon
    //govmap.displayGeometries(data1).then(function (response) {
        
    //    //clear drawings after 3 seconds
       
    //});  
    //
    var data2 = {
        circleGeometries: [{ x: 183184, y: 669173, radius: 5000 }],
        names: ['p1'],
        geometryType: govmap.geometryType.CIRCLE,
        defaultSymbol:
        {
            outlineColor: [0, 0, 255, 1],
            outlineWidth: 1,
            fillColor: [0, 255, 0, 0.5]
        },
        symbols: [],
        clearExisting: false,
        data: {
           
        }
    };
    //govmap.displayGeometries(data2).then(function (response) {
        
    //});  
    //

}

function test(panorama)
{
    var x1 = 179362;
    var y1 = 664571;
    var x2 = 180513;
    var y2 = y1;
    var x3 = x2;
    var y3 = 663195;
    var x4 = x1;
    var y4 = y3;
    var geo = "POLYGON((" + x1 + " " + y1 + ", " + x2 + " " + y2 + "," + x3 + " " + y3 + "," + x4 + " " + y4 + "," + x1 + " " + y1 + "))";
    var lname = "GASSTATIONS";
    var Fields =['OBJECTID'] ;
    govmap.intersectFeatures({ 'geometry': geo, 'layerName': lname, 'fields': Fields, getShapes: false })
        .then(function (results)
        {
            if (results.data != null)
            {
                var fieldValues = [];
                fieldValues.push({ 'layer': lname, 'data': results.data });
                DisplayIdentifyresults(fieldValues, lname, ['GASSTATIONS'], 'down', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems);
                
            }
            

        });

}
function detectChar(e)
{
    alert(e.keyCode);
}
function showSearchItem(itemname )
{
    hideAllOtherSearchItem();
    document.getElementById(itemname).style.display = "inline-table";
    
}

function hideAllOtherSearchItem() {
    
    document.getElementById("searchCoordinateTable").style.display = "none";
    document.getElementById("searchgushhelkaTable").style.display = "none";
    document.getElementById("searchBusStationTable").style.display = "none";
    document.getElementById("findRouteTable").style.display = "none";
    
}

function openDropdown(elementId) {
    var dropdown = document.getElementById(elementId);
    try {
        showDropdown(dropdown);
    } catch (e) {

    }
    return false;
};

showDropdown = function (element) {
    var event;
    event = document.createEvent('MouseEvents');
    event.initMouseEvent('mousedown', true, true, window);
    element.dispatchEvent(event);
};

function toggleSearchPanel() {
    $("#searchAll").toggle();
    document.getElementById('testingDiv').style.display = 'none';
    document.getElementById('busOptionsDIv').innerHTML = "";
    document.getElementById('busOptionsDIv').style.display = "none";
}


function computeLatLngToITM(latitude, longitude) {
    
    var itm_north, itm_east, old_grid_north, old_grid_east;
    if (isNaN(latitude) || isNaN(longitude)) {
        itm_north = 'Invalid';
        itm_east = '';
        old_grid_north = 'Invalid';
        old_grid_east = '';
    }
    else {
        var itm_coords = proj4('EPSG:4326', 'ITM', [longitude, latitude]);
        old_grid_east = (itm_coords[0] - 50000).toFixed(0);
        old_grid_north = itm_coords[1] - 500000;
        if (old_grid_north < 0) {
            old_grid_north += 1000000;
        }
        old_grid_north = old_grid_north.toFixed(0);
        itm_east = itm_coords[0].toFixed(0);
        itm_north = itm_coords[1].toFixed(0);
    }
    var itmcoords = itm_east.toString() +" "+ itm_north.toString();
    return itmcoords;
    //$('itm_east').innerHTML = itm_east;
    //$('itm_north').innerHTML = itm_north;
    //$('oldgrid_east').innerHTML = old_grid_east;
    //$('oldgrid_north').innerHTML = old_grid_north;
}

function computeITMToLatLng(itm_est, itm_nrt) {
    var itm_east = parseFloat(itm_est);
    var itm_north = parseFloat(itm_nrt);
    var latitude, longitude;
    if (isNaN(itm_east) || isNaN(itm_north)) {
        latitude = 'Invalid';
        longitude = 'Invalid';
    } else {
        var lng_lat = proj4('ITM', 'EPSG:4326', [itm_east, itm_north]);
        longitude = lng_lat[0].toFixed(6);
        latitude = lng_lat[1].toFixed(6);
    }
    var latlong = latitude.toString() +" "+ longitude.toString();
    return latlong;
   // $('lat_dest').innerHTML = latitude;
   // $('lng_dest').innerHTML = longitude;
}
function computePolygonForPointIdenify(geo)
{
    var currentScale = computeMapScale();
    var bufferRadius = 50;
    switch (currentScale) {
        case 3000000:
            bufferRadius = 13000;
            break;
        case 1000000:
            bufferRadius = 5000;
            break;
        case 500000:
            bufferRadius = 3500;
            break;
        case 250000:
            bufferRadius = 2000;
            break;
        case 100000:
            bufferRadius = 700;
            break;
        case 50000:
            bufferRadius = 400;
            break;
        case 25000:
            bufferRadius = 240;
            break;
        case 10000:
            bufferRadius = 120;
            break;
        case 5000:
            bufferRadius = 70;
            break;
        case 2500:
            bufferRadius = 30;
            break;
        case 1250:
            bufferRadius = 20;
            break;
    }
    var xval, yval, polygonGeo;
   
    var tmp = geo.substring(6, geo.length - 1);
    xval = parseFloat(tmp.split(" ")[0]);
    yval = parseFloat(tmp.split(" ")[1]);
    polygonGeo = PointToPolygon1(xval, yval, bufferRadius);
   
    return polygonGeo;
}

// carousel 
function selectCarouselIMG(group) {

    //var groups = {};
    //groups['bus'] = 'אוטובוסים';
    //groups['train'] = 'רכבות';
    //groups['roads'] = 'דרכים';
    //groups['people'] = 'הסעת המונים';
    //groups['prefer'] = 'תשתיות העדפה';
    //groups['bycycle'] = 'אופניים';
    
    var groupname = group.substring(0, group.length - 3);
    var mycarousel = document.getElementsByClassName('carousel');
    var index = -1;
    var prevBlue = -1;
    var current = '';

    for (i = 0; i < mycarousel[0].slick.$slides.length; i++)
    {
        for (j in GroupsEngHeb)
        {
            current = j ;
            if (mycarousel[0].slick.$slides[i].innerHTML.indexOf(current+ '_blue') > 0) {
                prevBlue = i;
                break;
            }
        }
        if (prevBlue > -1)
            break;
                
    }
    if ((prevBlue > -1 )&&(current.length>0))
    {
        //remove blue image of previous selection
        $('.carousel').slick('slickRemove', prevBlue);

        var newIMG = createImg(current,'grey',);
        // add grey image 
        $('.carousel').slick('slickAdd', newIMG);


    }
    for (i = 0; i < mycarousel[0].slick.$slides.length; i++)
    {
        if (mycarousel[0].slick.$slides[i].innerHTML.indexOf(groupname) > 0)
        {
            index = i;
          //  var GroupHeader = document.getElementById('layersByGroupTableHeader');
           // GroupHeader.innerHTML = groups[groupname];
            document.getElementById('groupName').innerHTML = GroupsEngHeb[groupname];
            document.getElementById('groupName').style.display = 'block';
            break;
        }
        
    }

    if (index > -1)
    {
        //remove grey image of selected 
        $('.carousel').slick('slickRemove', index);

        // do not refresh it makes the carosel go crazy //   $('.carousel').slick("refresh");
        var newIMG = createImg(group,'blue');
        // add blue image 
        $('.carousel').slick('slickAdd', newIMG);
    }
   
   // $('.carousel').slick('setPosition');
    $('.carousel').slick('slickGoTo', mycarousel[0].slick.$slides.length - 2);
    

    
}
function createImg(name,color)
{
    var newIMG = '';
    if (name.slice(-3) == 'IMG')
        name = name.substring(0, name.length - 3);
    if (color=='grey')
        newIMG = '<div class="slick-slide" style="cursor:pointer" id=';
    else
        newIMG = '<div class="slick-slide"  id=';
    
    newIMG = newIMG.concat('"', name, 'IMG', '"');
    newIMG = newIMG.concat(' onclick="layersByGroupLogic(', "'", name, 'IMG', "')", '">');
    newIMG = newIMG.concat(' <img style="width:90%;height:90%;"');
    newIMG = newIMG.concat(' src = "icons/', name, '_',color,'.png" ></div>');
    return newIMG;
}

function choose_bus_stop_on_map()
{
    govmap.unbindEvent(govmap.events.CLICK);
    ////////////////////

    govmap.draw(govmap.drawType.Point).progress(function (e)
    {
//
        var currentScale = computeMapScale();
        var bufferRadius = 50;
        switch (currentScale) {
            case 3000000:
                bufferRadius = 13000;
                break;
            case 1000000:
                bufferRadius = 5000;
                break;
            case 500000:
                bufferRadius = 3500;
                break;
            case 250000:
                bufferRadius = 2000;
                break;
            case 100000:
                bufferRadius = 700;
                break;
            case 50000:
                bufferRadius = 400;
                break;
            case 25000:
                bufferRadius = 240;
                break;
            case 10000:
                bufferRadius = 120;
                break;
            case 5000:
                bufferRadius = 70;
                break;
            case 2500:
                bufferRadius = 30;
                break;
            case 1250:
                bufferRadius = 20;
                break;
        }
        var xval, yval, polygonGeo;
        var tmp = e.wkt.substring(6, e.wkt.length - 1);
        xval = parseFloat(tmp.split(" ")[0]);
        yval = parseFloat(tmp.split(" ")[1]);
        polygonGeo = PointToPolygon1(xval, yval, bufferRadius);

        //


        //var identifyGeo = e.wkt;
        
        govmap.intersectFeatures({ 'geometry': polygonGeo, 'layerName': "BUS_STOPS_MOT", 'fields': identifyFields['BUS_STOPS_MOT'], getShapes: false })
            .then(function (results) {
                if (results.data != null && results.data.length==1) {
                    var busStopName = results.data[0].Values[1];
                    var busStopID = results.data[0].Values[0];
                    document.getElementById("busStationName").value = busStopName;

                    //////
                    clearGeometries(drawTextData, drawTextItems);
                    //var stop_info = BusStationsList_Info.get(suggestion);
                    stop_id = busStopID;


                    currentBusStopName = busStopName + '@@@' + stop_id;

                    
                    var lname = "BUS_STOPS_MOT";
                    govmap.intersectFeaturesByWhereClause({ 'layerName': lname, 'fields': identifyFields[lname], getShapes: true, 'whereClause': 'STOP_CODE=' + stop_id })
                        .then(function (e) {
                            if (e.data != null && e.data.length > 0) {
                                var point = (e.data[0].Values[e.data[0].Values.length - 1]).toString();
                                var xy = point.substring(8, point.length - 2);

                                currentBusStopGeometry[0] = xy.split(" ")[1];
                                currentBusStopGeometry[1] = xy.split(" ")[2];
                                turnlayerOnOff("chkBUS_STOPS_MOT", true, identifylayers);
                                govmap.zoomToXY({ x: currentBusStopGeometry[0], y: currentBusStopGeometry[1], level: 10, marker: true });
                                $("#searchAll").toggle();
                                GTFS_Get_Bus_Routes_For_Stop(stop_id, currentBusName, currentBusStopName);
                            }
                        });
                    //////
                }
            })

    });

    
    govmap.onEvent(govmap.events.CLICK).progress(function (e) {


        if (identifylayers.length > numOfLayersToIdentify) {
            var errormsg = " המערכת מאפשרת זיהוי של עד  " + numOfLayersToIdentify + " שכבות ";
            errormsg += "\n"
            errormsg += "יש לכבות שכבות לא נחוצות ולהפעיל זיהוי מחדש";
            alert(errormsg);
            clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
            return;
        }
        // govmap.draw(govmap.drawType.Point).progress(function (e) {
        identifyGeo = "POINT(" + e.mapPoint.x + " " + e.mapPoint.y + ")";
        identifyGeoType = 'Point';

        DoTheIntersectNew(identifyGeo, identifylayers, identifyGeoType, "down", currentSortedColumn, "Regular", selectedIDInDatatable, slectedLayerInDatatable, panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, true, routeSteps);


    });

}
function contains_heb(str) {
    return (/[\u0590-\u05FF]/).test(str);
    //\p{Latin}
}
function contain_XY_data(str)
{
    // check if input contain numbers space or dot  only which is coordinate info  200
    return (/[0-9_.]/).test(str);
}

function findroute(heatmapLayer, heatmapField, drawTextData, drawTextItems, routeSteps)
{

    clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
    var fromx;
    var fromy;
    var tox;
    var toy;
    
    
    var orgn = document.getElementById("origin").value;
    var dstn = document.getElementById("destination").value;
    var travelMode = document.getElementById('routePossibilities').value;
    routingGoogle(orgn, dstn, false, travelMode, routeSteps);
    return;


    if (contains_heb(orgn)) // in case we have hebrew geocode address 
    {
        govmap.geocode({ keyword: document.getElementById("origin").value }, govmap.geocodeType.FullResult)
        .then(function (geocodeOrigin)
        {
                if (geocodeOrigin.data == null) // geocode failed 
                {
                    document.getElementById("errOrigin").innerHTML = "כתובת לא נמצאה ניתן לבחור נקודת מוצא על המפה";
                    return;
                }
                else // geocode succeeded
                {
                    fromx = geocodeOrigin.data[0].X;
                    fromy = geocodeOrigin.data[0].Y;
        
                }

            if (contains_heb(dstn)) // in case we have hebrew geocode address 
            {
                govmap.geocode({ keyword: document.getElementById("destination").value }, govmap.geocodeType.FullResult)
                    .then(function (geocodeDestination) {
                        if (geocodeDestination.data == null) // geocode failed 
                        {
                            document.getElementById("errDestination").innerHTML = "כתובת לא נמצאה ניתן לבחור נקודת יעד על המפה";
                            return;
                        }
                        else // geocode succeeded
                        {
                            tox = geocodeDestination.data[0].X;
                            toy = geocodeDestination.data[0].Y;
        
                            routing(fromx, fromy, tox, toy);
                        }
                    })
            }
            else
            {
                if (contain_XY_data(dstn) == false) {
                    document.getElementById("errDestination").innerHTML = "כתובת לא נמצאה ניתן לבחור נקודת יעד על המפה";
                    return;
                }

                tox = dstn.split(" ")[0];
                toy = dstn.split(" ")[1];
        
                routing(fromx, fromy, tox, toy);
            }

        })

        
    }
    else // we have point XY only numbers
    {
        if (contain_XY_data(orgn) == false)
        {
            document.getElementById("errOrigin").innerHTML = "כתובת לא נמצאה ניתן לבחור נקודת מוצא על המפה";
            return;
        }
        fromx = orgn.split(" ")[0];
        fromy = orgn.split(" ")[1];
        
        if (contains_heb(dstn)) // in case we have hebrew geocode address 
        {
            govmap.geocode({ keyword: document.getElementById("destination").value }, govmap.geocodeType.FullResult)
                .then(function (geocodeDestination) {
                    if (geocodeDestination.data == null) // geocode failed 
                    {
                        document.getElementById("errDestination").innerHTML = "כתובת לא נמצאה ניתן לבחור נקודת יעד על המפה";
                        return;
                    }
                    else // geocode succeeded
                    {
                        tox = geocodeDestination.data[0].X;
                        toy = geocodeDestination.data[0].Y;
            
                        routing(fromx, fromy, tox, toy);
                    }
                })

        }
        else
        {

            if (contain_XY_data(dstn) == false) {
                document.getElementById("errDestination").innerHTML = "כתובת לא נמצאה ניתן לבחור נקודת יעד על המפה";
                return;
            }
            tox = dstn.split(" ")[0];
            toy = dstn.split(" ")[1];
            
            routing(fromx, fromy, tox, toy);
        }
        
    }
        

    
}

function routingGoogle(origin, destination, isMobile, travelmode, routeSteps)
{
    routeSteps = [];
    clearMapDrawing(heatmapLayer, heatmapField, drawTextData, drawTextItems, userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS);
    var marker_symbol = CheckIconURL(); 
    var wkts = [];
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsService.route();
    
    directionsRenderer.setMap(null);
    if (contains_heb(origin))
    {
       //// do nothing we have hebrew address 
    }
    else if (contain_XY_data(origin) ) 
    {
        var x = origin.split(" ")[0];
        var y = origin.split(" ")[1];
        origin = JSITM.itmRef2gpsRef(x.split('.')[0] + " " + y.split('.')[0]);
        
    }
    if (contains_heb(destination))
    {
        //// do nothing we have hebrew address 
    }
    else if (contain_XY_data(destination)) // in case we have numeric coordinate
    {
        var x1 = destination.split(" ")[0];
        var y1 = destination.split(" ")[1];
        destination = JSITM.itmRef2gpsRef(x1.split('.')[0] + " " + y1.split('.')[0]);

    }


    var request = {
        origin: origin,
        destination: destination,
        travelMode: 'DRIVING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
            if (result.routes !== null) {
                var startLocation = result.routes[0].legs[0].start_location;
                var endLocation = result.routes[0].legs[0].end_location;
                x_list = [];
                y_list = [];
                var linestring = "LINESTRING(";
                var routeStepsCounter = 0;
                var steps = result.routes[0].legs[0].steps;
                for (i = 0; i < steps.length; i++) {
                    var pts = steps[i].lat_lngs;
                    routeSteps[i] = '';
                    for (j = 0; j < pts.length; j++) {
                        var pt = pts[j];
                        var ptlat = pt.lat();
                        var ptlng = pt.lng();
                        xy_pair = WgsToIsrael(ptlat, ptlng);
                        x = xy_pair[0];
                        y = xy_pair[1];
                        linestring = linestring + x + " " + y + ", ";
                        routeSteps[i] += x + " " + y + ", ";
                        x_list.push(x);
                        y_list.push(y);
                    }
                    routeSteps[i] = routeSteps[i].replace(/,\s*$/, ""); // remove last coma from string
                    
                    
                }

                linestring_r = linestring.substring(0, linestring.length - 1);
                linestring_r = linestring_r + ")";
                wkts.push(linestring_r);

                max_x = Math.max.apply(Math, x_list);
                min_x = Math.min.apply(Math, x_list);
                max_y = Math.max.apply(Math, y_list);
                min_y = Math.min.apply(Math, y_list);
                d_x = max_x - min_x;
                d_y = max_y - min_y;
                radius = Math.floor(Math.max.apply(Math, [d_x, d_y]))
                console.log(radius);
                lvl = 1;
                if (radius <= 100) {
                    lvl = 8
                }
                if (radius > 100 && radius <= 2500) {
                    lvl = 7
                }
                if (radius > 2500 && radius <= 5000) {
                    lvl = 6
                }
                if (radius > 5000 && radius <= 7500) {
                    lvl = 5
                }
                if (radius > 7500 && radius <= 10000) {
                    lvl = 4
                }
                if (radius > 10000 && radius <= 25000) {
                    lvl = 3
                }
                if (radius > 25000 && radius <= 50000) {
                    lvl = 2
                }
                if (radius > 50000 && radius <= 100000) {
                    lvl = 1
                }
                if (radius > 100000) {
                    lvl = 0
                }
                center_x = min_x + ((max_x - min_x) / 2);
                center_y = min_y + ((max_y - min_y) / 2);

                govmap.zoomToXY({ x: center_x, y: center_y, level: lvl, marker: false });
                data1 = {
                    'wkts': wkts,
                    //'names': ['l1'],
                    'geometryType': govmap.drawType.Polyline,
                    'defaultSymbol':
                    {
                        'color': [51, 136, 255, 1],
                        'width': 5,
                    },
                    'symbols': [],
                    'clearExisting': false,
                    'data': {

                    }
                };

                // display route polyline
                govmap.displayGeometries(data1).then(function (e) {
                    //   console.log("lines created");
                });

                // add marker symbol to the start and end points 
                var wktspoints = [];
                //
                xy_pair = WgsToIsrael(startLocation.lat(), startLocation.lng());
                x = xy_pair[0];
                y = xy_pair[1];


                var point1 = "POINT(" + x + " " + y + ")";

                xy_pair = WgsToIsrael(endLocation.lat(), endLocation.lng());
                x = xy_pair[0];
                y = xy_pair[1];

                var point2 = "POINT(" + x + " " + y + ")";

                wktspoints.push(point1);
                wktspoints.push(point2);
                //

                //
                data2 = {
                    wkts: wktspoints,
                    geometryType: govmap.drawType.Point,
                    defaultSymbol:
                    {
                        url: marker_symbol + 'marker.png',
                        height: '34',
                        width: '34',
                        //'color': [51, 136, 255, 1],
                        //'width': 5,
                    },
                    'symbols':
                        [

                        ],
                    'clearExisting': false,
                    'data': {

                    }
                };
                govmap.displayGeometries(data2).then(function (e) {
                    //   console.log("lines created");
                });
                document.getElementById("searchAll").style.display = 'none';

                //
                var fieldValues = [];
                var trip = Build_GoogleRouting_DataFormat(result);
                fieldValues.push({ 'layer': "ROUTING", 'data': trip });
                if (isMobile)
                    DisplayIdentifyresultsMobile(fieldValues, "ROUTING", [''], 'all', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, false, routeSteps);
                else
                    DisplayIdentifyresults(fieldValues, "ROUTING", [''], 'all', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, false,routeSteps);
                //
                document.getElementById('routingErrorMobile').innerHTML = '';
            }

        }
        else
        {
            document.getElementById('routingError').innerHTML = 'המערכת לא הצליחה למצוא מסלול';
            document.getElementById('routingErrorMobile').innerHTML = 'המערכת לא הצליחה למצוא מסלול';
            
        }
           
        
    });
}

function routing(fromx, fromy, tox, toy)
{
    var marker_symbol = CheckIconURL(); 
    from = { "x": fromx, "y": fromy }
    to = { "x": tox, "y": toy };
    var line_data;
    var data =
    {
        "routing_type": govmap.routing_type.routing,
        "locations": [from, to],
        "costing": govmap.costing.auto_shorter

    };
    var shp_encode;
    var wkts = [];
    var pts_itm = "LINESTRING (";
    govmap.getRoutingData(data).then(function (e) {
        // console.log(e);
        //var trip = e.trip;
        /////////////////////////
        var fieldValues = [];
        var trip = Build_Routing_DataFormat(e.trip);
        fieldValues.push({ 'layer': "ROUTING", 'data': trip });

        DisplayIdentifyresults(fieldValues, "ROUTING", [''], 'all', 'mnuDTH_0', "", "", panorama, heatmapLayer, heatmapField, drawTextData, drawTextItems, currentBusName, currentBusStopName, false);


        /////////////////////////
        //alert(e.trip);
        shp_encode = e.trip.legs[0].shape;
        var coordinates = polyline_decode(shp_encode);
        x_list = [];
        y_list = [];
        var linestring = "LINESTRING(";
        for (c = 0; c < coordinates.length; c++) {
            var latitude = coordinates[c][1];
            var longitude = coordinates[c][0];


            xy_pair = WgsToIsrael(longitude, latitude);
            x = xy_pair[0]
            y = xy_pair[1]
            linestring = linestring + x + " " + y + ", ";
            x_list.push(x);
            y_list.push(y);
        }
        linestring_r = linestring.substring(0, linestring.length - 1);
        linestring_r = linestring_r + ")";
        wkts.push(linestring_r);

        max_x = Math.max.apply(Math, x_list);
        min_x = Math.min.apply(Math, x_list);
        max_y = Math.max.apply(Math, y_list);
        min_y = Math.min.apply(Math, y_list);
        d_x = max_x - min_x;
        d_y = max_y - min_y;
        radius = Math.floor(Math.max.apply(Math, [d_x, d_y]))
        console.log(radius);
        lvl = 1;
        if (radius <= 100) {
            lvl = 8
        }
        if (radius > 100 && radius <= 2500) {
            lvl = 7
        }
        if (radius > 2500 && radius <= 5000) {
            lvl = 6
        }
        if (radius > 5000 && radius <= 7500) {
            lvl = 5
        }
        if (radius > 7500 && radius <= 10000) {
            lvl = 4
        }
        if (radius > 10000 && radius <= 25000) {
            lvl = 3
        }
        if (radius > 25000 && radius <= 50000) {
            lvl = 2
        }
        if (radius > 50000 && radius <= 100000) {
            lvl = 1
        }
        if (radius > 100000) {
            lvl = 0
        }
        // console.log(lvl);

        center_x = min_x + ((max_x - min_x) / 2);
        center_y = min_y + ((max_y - min_y) / 2);

        govmap.zoomToXY({ x: center_x, y: center_y, level: lvl, marker: false });


        data1 = {
            'wkts': wkts,
            //'names': ['l1'],
            'geometryType': govmap.drawType.Polyline,
            'defaultSymbol':
            {
                'color': [51, 136, 255, 1],
                'width': 5,
            },
            'symbols': [],
            'clearExisting': false,
            'data': {

            }
        };
        govmap.displayGeometries(data1).then(function (e) {
            //   console.log("lines created");
        });

        var wktspoints = [];
        wktspoints.push('POINT(' + fromx + ' ' + fromy + ')');
        wktspoints.push('POINT(' + tox + ' ' + toy + ')');
        data2 = {
            'wkts': wktspoints,
            //'names': ['l1'],
            'geometryType': govmap.drawType.Point,
            defaultSymbol:
            {
                url: marker_symbol + '/marker.png',
                height: '34',
                width: '34',
                //'color': [51, 136, 255, 1],
                //'width': 5,
            },
            'symbols':
                [

                ],
            'clearExisting': false,
            'data': {

            }
        };
        govmap.displayGeometries(data2).then(function (e) {
            //   console.log("lines created");
        });
        document.getElementById("searchAll").style.display = 'none';
    });
}

function polyline_decode(str, precision) {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
};
function selectPointOnMap(pointname)
{
    var sender = pointname.substring(6, pointname.length);

    govmap.unbindEvent(govmap.events.CLICK);
    ////////////////////
    govmap.draw(govmap.drawType.Point).progress(function (e)
    {
        var tmp = e.wkt;
        var xy = tmp.substring(6, tmp.length - 1);
        var xy = tmp.substring(6, tmp.length - 1);
        if (sender == 'origin') {
            document.getElementById('origin').value = xy;
            document.getElementById('errOrigin').innerHTML = "";
        }
        else {
            document.getElementById('destination').value = xy; 
            document.getElementById('errDestination').innerHTML =""; 
        }
            


    });


}

function computeZoomLevel(x_list, y_list)
{
    max_x = Math.max.apply(Math, x_list);
    min_x = Math.min.apply(Math, x_list);
    max_y = Math.max.apply(Math, y_list);
    min_y = Math.min.apply(Math, y_list);
    d_x = max_x - min_x;
    d_y = max_y - min_y;
    radius = Math.floor(Math.max.apply(Math, [d_x, d_y]))
    
    lvl = 1;
    if (radius <= 100) {
        lvl = 8
    }
    if (radius > 100 && radius <= 2500) {
        lvl = 7
    }
    if (radius > 2500 && radius <= 5000) {
        lvl = 6
    }
    if (radius > 5000 && radius <= 7500) {
        lvl = 5
    }
    if (radius > 7500 && radius <= 10000) {
        lvl = 4
    }
    if (radius > 10000 && radius <= 25000) {
        lvl = 3
    }
    if (radius > 25000 && radius <= 50000) {
        lvl = 2
    }
    if (radius > 50000 && radius <= 100000) {
        lvl = 1
    }
    if (radius > 100000) {
        lvl = 0
    }

    return lvl;
}

function testIdentify()
{
    // run info table on each one of the layers in tree 
    
    var numoflayers = Object.keys(identifyFields).length;
    var SQL = "OBJECTID>0";
    var status = '';
    var results = [];
    var promises = [];
    var layerNames = [];

    results.push('identify test results');
    results.push('------------------------------------------------')

    for (const [key, value] of Object.entries(identifyFields)) {
        // do something with `key` and `value`
        currentlayer = key;

        if (key == 'BUSROUTESTATIONS' || key =='BUSROUTES'|| key=='ROUTING' ) continue; // some layers in list are not in service they are fake layers i have built for specific issues like busroutes or routes 
        layerNames.push(key);
            (function (currentlayer)
            {
                promises.push(govmap.intersectFeaturesByWhereClause({ layerName: currentlayer, fields: identifyFields[currentlayer], getShapes: false, 'whereClause': SQL }));
                            
            }) (currentlayer);    
       
    }

    Promise.all(promises)
        .then((values) => {

            for (i = 0; i < values.length; i++)
            {
                if (values[i].data == null)
                    results.push(layerNames[i] + " failure " + values[i].message);

            }

            writeTestinginfotofile(results);
               
            
        })
        .catch((error) => {
            // This catch block will not be executed
            console.error(error);
    });

    
}

function writeTestinginfotofile(results) {
    var url = checkUrl() + "/testing";
    var info = {
        text: results,

    };
    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info),
        }).done(function () {

        })
}
function testRenderer()
{
    var numoflayers = Object.keys(identifyFields).length;
    
    var results = [];
    var promises = [];
    var layerForRenderer = [];

    results.push('renderer test results');
    results.push('------------------------------------------------')

    for (const [key, value] of Object.entries(identifyFields))
    {
        if (key == 'BUSROUTESTATIONS' || key == 'BUSROUTES' || key == 'ROUTING') continue; // some layers in list are not in service they are fake layers i have built for specific issues like busroutes or routes 
        layerForRenderer.push(key);


        
    }

    var layers = { LayerNames: layerForRenderer };

    govmap.getLayerRenderer(layers)
        .then(function (e)
        {
           
            if (e.errorCode == 0 && e.message == null) {
                results.push(" no problem found in " + layerForRenderer.length + " layers renderers");
                writeTestinginfotofile(results);

            }
            else
            {
                results.push(" problem found in layers renderers");
                results.push(e.message);
                writeTestinginfotofile(results);
            }
            

        });

}
function testFilter()
{

}
function testDownload()
{
    var results = [];
    var numoflayers = Object.keys(Download).length;
    results.push('renderer test results');
    results.push('------------------------------------------------')

    //for (const [key, value] of Object.entries(identifyFields))
    //for (i = 0; i < numoflayers;i++)
    var encodedUrls = [];
    var layers = [];
    $.each(Download, function (key, value)
    {
        if (key != 'BUSROUTESTATIONS' && key != 'BUSROUTES' && key != 'ROUTING')  // some layers in list are not in service they are fake layers i have built for specific issues like busroutes or routes 
            {
                 if (downloadLayer[key] && Download[key] != undefined)
                 {
                     for (i = 0; i < Download[key].length; i++)
                     {

                         encodedUrls.push(encodeURIComponent(Download[key][i]));
                         layers[i] = key;
                         //try
                         //{
                         //    new URL(download[key][i]);
                         //}
                         //catch (err)
                         //{
                         //    console.log("error with download of " + Download[key])
                         //    continue;
                         //}
                     }
                 }
            }
        
    })   

    

    var url = checkUrl() + "/testDownload";
    
    var info =
    {
        'url': encodedUrls,
        'layers': layers,
    };
    $.ajax
        ({
            type: "POST",
            url: url,
            crossDomain: true,
            dataType: "json",
            data: JSON.stringify(info),
        }).done(function () {

    })


    
}
function selectTest()
{

    var e = document.getElementById("tests");
    var value = e.value;
    var testType = e.options[e.selectedIndex].text;

    

    switch (testType)
    {
        case "identify":
            testIdentify();
            break;
        case "renderer":
            testRenderer();
            break;
        case "download":
            testDownload()
            break;
        case "filter":
            testFilter()
            break;
    }
}

function changecolor(id)
{
    if (id == 'interestsTD')
    {
        document.getElementById('interestsTD').style.color = 'rgba(210, 18, 135, 1)';
        document.getElementById('interestsTD').style.backgroundColor = 'white';
        document.getElementById('layersTD').style.color = 'rgba(142, 158, 183, 1)';
        document.getElementById('layersTD').style.backgroundColor = 'rgba(242, 244, 250, 1)';
        document.getElementById('layersModalTHMobile').style.display = 'none';
        document.getElementById('mobileGroupsList').style.display = 'table';
        document.getElementById("showLayerInfoCheck").style.display = 'none';
        document.getElementById("showfilterLayerCheck").style.display = 'none';
        document.getElementById("showLayerInfoChecklabel").style.display = 'none';
        document.getElementById("showfilterLayerChecklabel").style.display = 'none';
        document.getElementById("mobileListOfLayers").style.display = 'none';
    }
    else
    {
        document.getElementById('layersTD').style.color = 'rgba(210, 18, 135, 1)';
        document.getElementById('layersTD').style.backgroundColor = 'white';
        document.getElementById('interestsTD').style.color = 'rgba(142, 158, 183, 1)';
        document.getElementById('interestsTD').style.backgroundColor = 'rgba(242, 244, 250, 1)';
        document.getElementById('layersModalTHMobile').style.display = 'block';
        document.getElementById('mobileGroupsList').style.display = 'none';
        document.getElementById("showLayerInfoCheck").style.display = 'block';
        document.getElementById("showfilterLayerCheck").style.display = 'block';
        document.getElementById("showLayerInfoChecklabel").style.display = 'block';
        document.getElementById("showfilterLayerChecklabel").style.display = 'block';
        document.getElementById("mobileListOfLayers").style.display = 'block';
    }
}
function turnMobileGroupOfLayersOn(groupID)
{
    
    var visibleLayersTable = document.getElementById('currentVisibleLayersMobile');
    if (visibleLayersTable != null)
        $("#currentVisibleLayersMobile tr").remove(); 
    
    var lyr;
    var layersOff = identifylayers.slice();

    identifylayers = [];

    for (i = 0; i < layersGroup[groupID].length; i++)
    {
        lyr = layersGroup[groupID][i];
        if (identifylayers.indexOf(lyr.toUpperCase()) == -1) {
            
            identifylayers.push(layerHebEng[lyr].toUpperCase());
            var layerName = layerHebEng[lyr];
            addLayerToMobileList(layerName);

        }
    }

    
    getNumOfCheckedlayersTotalMobile(identifylayers);
    
    govmap.setVisibleLayers(identifylayers, layersOff);
}
function createMobileGroupLayers(identifylayers)
{
    var mobilegroupstable = document.getElementById('mobileGroupsList');
    var numofgroups = Object.keys(GroupsEngHeb).length
    for (i in GroupsEngHeb )
    {
        var td = document.createElement('td');
        td.style.width = '90%';
        td.style.textAlign = 'right';
        td.style.fontFamily = 'Alef-Regular';
        td.style.fontSize = 'calc(1.5vh + 1.1vw)';
        td.style.cursor = 'pointer';
        td.style.paddingRight = '5%';
        td.id = GroupsEngHeb[i];
        td.onclick = function ()
        {
            turnMobileGroupOfLayersOn(this.id);
        }
        var text = document.createTextNode(GroupsEngHeb[i]);
        td.appendChild(text);
        var tr = document.createElement('tr');
        tr.classList.add('mobileTR');
       // tr.style.borderRadius = '3px';
       // tr.style.boxShadow = '0px 0px 9px 0px rgba(0, 0, 0, 0.3)';
        tr.style.width = '100%';
        
        var td1 = document.createElement('td');
        td1.style.width = '10%';
        var img = document.createElement('img');
        img.src = 'icons/' + i + '.png';
        if (i.toUpperCase() == 'BYCYCLES') {
            img.style.width = '32px';
            img.style.height = '35px';
        }
        else
        {
            img.style.width = '25px';
            img.style.height = '25px';
        }
        
        td1.appendChild(img);
        tr.appendChild(td1);
        tr.appendChild(td);
        mobilegroupstable.appendChild(tr);

        //

        //
    }
}
function openSearchCurrent(name)
{
    closeAllMobileDivs();
    document.getElementById(name).style.display = 'block';
    

}
function closeSearchCurrent(name) {
    closeAllMobileDivs();
    //document.getElementById(name).style.display = 'none';
    document.getElementById('mobileSearchOptions').style.display = 'table';


}
function closeAllMobileDivs(drawMobileGeomerty, heatmapLayer, heatmapField, drawTextData, drawTextItems, identifylayers, selectedIDInDatatable, slectedLayerInDatatable, currentSortedColumn, panorama)
{
    document.getElementById("mobileSearchLayers").style.display = 'none';
    document.getElementById("mobileSearchAddress").style.display = 'none';
    document.getElementById("mobileSearchOptions").style.display = 'none';
    document.getElementById("mobilebgOptions").style.display = 'none';
    document.getElementById("mobilesearchRoute").style.display = 'none';
    document.getElementById("mobileSearchGushHelka").style.display = 'none';
    document.getElementById("mobileSearchCoordinate").style.display = 'none';
    document.getElementById("mobileTools").style.display = 'none';
    document.getElementById("identifyResultMobile").style.display = 'none';
    document.getElementById("searchBusStationMobile").style.display = 'none';
    document.getElementById("maximizeDrawDivMobile").style.display = 'none';
    document.getElementById("drawTextDiv").style.display = 'none';
    document.getElementById("mobileMeasure").style.display = 'none';
    document.getElementById("busOptionsDIv").style.display = 'none';
    hideLayers();
    
    
    //document.getElementById("drawDiv").style.display = 'none';
}

function zoomToBusStation(suggestion, drawTextData, drawTextItems)
{
    clearGeometries(drawTextData, drawTextItems);
    var stop_info = BusStationsList_Info.get(suggestion);
    stop_id = stop_info.stop_id;
    currentBusStopName = suggestion + '@@@' + stop_id;
    var lname = "BUS_STOPS_MOT";

    govmap.intersectFeaturesByWhereClause({ 'layerName': lname, 'fields': identifyFields[lname], getShapes: true, 'whereClause': 'STOP_ID=' + stop_id })
        .then(function (e) {
            if (e.data != null && e.data.length > 0) {
                var point = (e.data[0].Values[e.data[0].Values.length - 1]).toString();
                var xy = point.substring(8, point.length - 2);

                currentBusStopGeometry[0] = xy.split(" ")[1];
                currentBusStopGeometry[1] = xy.split(" ")[2];
                turnlayerOnOff("chkBUS_STOPS_MOT", true, identifylayers);
                govmap.zoomToXY({ x: currentBusStopGeometry[0], y: currentBusStopGeometry[1], level: 10, marker: true });
                if (isMobile == false)
                    $("#searchAll").toggle();
                GTFS_Get_Bus_Routes_For_Stop(stop_id, currentBusName, currentBusStopName);
            }
        });
}

function showlayerinfoMobile(lname)
{
    document.getElementById('layerInformation').style.width = '100%';
    document.getElementById('layerInformation').style.top = '7%';
    document.getElementById('layerInformation').style.right = '0';
        
    var lnameHeb = layerEngHeb[lname][0];
    document.getElementById('layerInformationHeader').innerHTML = lnameHeb;
    concatenateInfoString(lname);
    //
    // clear prev renderer 
    document.getElementById("divResult").innerHTML = "";

    createRenderer("divResult", lname);
    document.getElementById('btnOpeninfoTable').style.display = 'none';

}
function validateMobileCheckBoxes(obj)
{
    var id = obj.id;
    var checked = obj.checked;
    switch (checked)
    {
        case false: // do nothing 
            break;
        case true:
            if (id == 'showLayerInfoCheck' && document.getElementById('showfilterLayerCheck').checked)
                document.getElementById('showfilterLayerCheck').checked = 0;
            else if (id == 'showfilterLayerCheck' && document.getElementById('showLayerInfoCheck').checked)
                document.getElementById('showLayerInfoCheck').checked = 0;
                
        //showLayerInfoCheck
        //showfilterLayerCheck
            
    }
    
}

function Load_Bus_Station_info(BusStationList)
{
    govmap.intersectFeaturesByWhereClause({ 'layerName': 'BUS_STOPS_MOT', 'fields': ["STOP_NAME"], getShapes: true, 'whereClause': "OBJECTID>0" })
        .then(function (result) {
            if (result.data != null)
            {

            }
        });
}

function  checkIfExists(lyr) {
    let isTrue = false;
    
    const activeList = document.querySelectorAll("#currentVisibleLayersMobile tr");
        
    for (let i = 0; i < activeList.length; i++) {
    
            
        if (activeList[i].innerHTML.indexOf(lyr) >0 ) {
            isTrue = true;

        }
    }

    return isTrue;
}
function addLayerToMobileList(lyr)
{
    var lnameHeb = layerEngHeb[lyr][0];
    // make sure layer was not already checked
    if (checkIfExists(lyr)) return;

    var visibleLayersTable = document.getElementById('currentVisibleLayersMobile');
    visibleLayersTable.style.width = "100%";
    visibleLayersTable.id = 'currentVisibleLayersMobile';
    var tr = document.createElement('tr');
    tr.style.textAlign = 'right';
    tr.style.backgroundColor = 'white';
    tr.style.border = '2.5px solid lightgrey';
    tr.style.borderRadius = '5px';
    tr.id = lyr + 'tr';

    var td = document.createElement('td');
    td.appendChild(document.createTextNode("X"));
    td.style.width = '10%';
    td.style.fontSize = '12px';
    td.style.fontFamily = 'Alef-Regular';
    td.id = lyr;
    td.onclick = function () {
        turnlayerOnOff('chk' + this.id, false, identifylayers);
        $('#' + this.id + 'tr').remove();
    }
    tr.appendChild(td);
    td = document.createElement('td');
    td.style.paddingRight = '7%';
    
    td.appendChild(document.createTextNode(lnameHeb));
    td.style.width = '90%';
    tr.appendChild(td);

    visibleLayersTable.appendChild(tr);
    mobileListOfLayers
   // document.getElementById('mobileListOfLayers').style.display = 'block';
}

function openMeasureMobile()
{
    closeAllMobileDivs();
    document.getElementById('mobileMeasure').style.display = 'block';
}

function clearbgMobileBorder()
{
    $("#bgmobileTable tr").each(function () {
        $(this).css('border', '0');
        
    });
}
function drawMeasureLine1() {
    
    //govmap.draw(govmap.drawType.Polyline).progress(function (m) {
    //    alert(m.wkt);
    //});
}

function checkDisclaimerStatus()
{
     const showDisclaimerCookie = document.cookie
        .split("; ")
         .find((row) => row.startsWith("showDisclaimer="))
        ?.split("=")[1];

    if (showDisclaimerCookie == undefined || showDisclaimerCookie=='1' ) {
        // in case that this is first time or if user didnt disable cookie , show cookie
        document.cookie = 'showDisclaimer=1; expires=Sun, 1 Jan 2029 00:00:00 UTC; path=/';

        if (isMobile)
            $('#DisclaimerMobile').css({ 'display': 'block' });
        else
            showAlert();
    }
    else
    {
        //  do not show alert 
    }
    
}
function removeDisclaimer()
{
    document.cookie = 'showDisclaimer=0; expires=Sun, 1 Jan 2029 00:00:00 UTC; path=/';
    hideDisclaimer();
}

function showTestingDiv()
{
    if (window.location.href.indexOf("localhost") > -1)
        $('#testingDiv').show();
}



function removeAllToolbars()
{
    
    document.getElementById('mainToolbar').style.display = 'none';
    document.getElementById('mainToolbarMobile').style.display = 'none';
    document.getElementById('bgOptionsDiv').style.display = 'none';
    document.getElementById('btnMaximiseInfoTable').style.display = 'none';
    document.getElementById('btnOpenDrawText').style.display = 'none';
    document.getElementById('btnStreetView').style.display = 'none';
    document.getElementById('btnOpenDrawGeometry').style.display = 'none';
    document.getElementById('btnMeasure').style.display = 'none';
    document.getElementById('btnHeatMap').style.display = 'none';
    document.getElementById('btnClear').style.display = 'none';
    document.getElementById('btnIdentifyRect').style.display = 'none';
    document.getElementById("bgDiv").style.display = "none";
    //document.getElementById('mot0').style.display = 'none';
    //document.getElementById('mot1').style.display = 'none';
    //document.getElementById('mot2').style.display = 'none';
    //document.getElementById('mot3').style.display = 'none';
    //document.getElementById('mot4').style.display = 'none';
    document.getElementById('searchMain').style.display = 'none';
    document.getElementById('txtlSearchLayerNameMobile').style.display = 'none';
    document.getElementById('mobileGroupsList').style.display = 'none';
    var mpDiv = document.getElementById("map_div");
    mpDiv.style.position = "relative";
    mpDiv.style = "top: 0px !important";
    mpDiv.style = "height: 100% !important";
    
    
    
}
function exportGeometryToGeoJson(userDrawnPointsWKTS, userDrawnLinesWKTS, userDrawnPolygonsWKTS)
{
    // user drawn points 
    var points = [];
    var lines = [];
    var polygons = [];
    
    for (i = 0; i < userDrawnPointsWKTS.length; i++)
    {
        var coordinates = [];
        var point = userDrawnPointsWKTS[i];
        var leftBracket = point.indexOf('(');
        var rightBracket = point.indexOf(')');
        var pointXY = point.substring(leftBracket + 1, rightBracket - 1);
        var x = pointXY.split(' ')[0];
        var y = pointXY.split(' ')[1];
        coordinates.push(parseFloat( x) , +parseFloat(y));
        var properties = { 'FID': i};
        
        var feature = {
            "type": "Feature",
            "id":i,
            "geometry": {
                "type": 'Point',
                "coordinates":
                    coordinates

            },
            "properties": properties
        };
        points.push(feature);
    }
    if (points != null && points.length>0)
    {
        var geo_json_points = {
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": { "name": "EPSG:2039" }
            },
            "features": points
        };


        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geo_json_points));

        //    // old save start
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        var nammeofgjson = "userPoints.json";
        dlAnchorElem.setAttribute("download", nammeofgjson);
        dlAnchorElem.click();
    }
    
    // user drawn polyline
    for (i = 0; i < userDrawnLinesWKTS.length; i++)
    {
        var coordinates = [];
        var line = userDrawnLinesWKTS[i];
        var leftBracket = line.indexOf('(');
        var rightBracket = line.indexOf(')');
        var polyline = line.substring(leftBracket + 1, rightBracket - 1);
        var geom = polyline.split(",");
        for (j = 0; j < geom.length; j++)
        {
            var point = geom[j].trim();
            var x = parseFloat(point.split(" ")[0]);
            var y = parseFloat(point.split(" ")[1]);
            var coordinate = [];
            coordinate.push(x);
            coordinate.push(y);
            coordinates.push(coordinate);
        }
        var properties = { 'FID': i };

        var feature =
        {
            "type": "Feature",
            "id": i,
            "geometry":
            {
                "type": 'LineString',
                "coordinates":
                    coordinates

            },
            "properties": properties
        };
        lines.push(feature);
    }
    if (lines != null && lines.length > 0)
    {
        var geo_json_polylines = {
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": { "name": "EPSG:2039" }
            },
            "features": lines
        };

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geo_json_polylines));
                
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        var nammeofgjson = "userLines.json";
        dlAnchorElem.setAttribute("download", nammeofgjson);
        dlAnchorElem.click();
    }
    // user drawn polygons
    for (i = 0; i < userDrawnPolygonsWKTS.length; i++) {
        var coordinates = [];
        
        
        var polygon = userDrawnPolygonsWKTS[i];
        var leftBracket = polygon.indexOf('(');
        var rightBracket = polygon.indexOf(')');
        var polygon1 = polygon.substring(leftBracket + 2, rightBracket - 1);
        var geom = polygon1.split(",");
        for (j = 0; j < geom.length; j++) {
            var point = geom[j].trim();
            var x = parseFloat(point.split(" ")[0]);
            var y = parseFloat(point.split(" ")[1]);
            var coordinate = [];
            coordinate.push(x);
            coordinate.push(y);
            coordinates.push(coordinate);
        }
        var coordinates1 = [];
        coordinates1.push(coordinates);
        var style = { 'fill': 'blue', 'color': 'blue' ,'opacity':1};
        var properties = { 'FID': i ,'style':style};
        
        
        var feature =
        {
            "type": "Feature",
            "id": i,
            "geometry":
            {
                "type": 'Polygon',
                "coordinates":
                    coordinates1

            },
            
            "properties": properties
        };
        polygons.push(feature);
    }
    if (polygons != null && polygons.length > 0) {
        var geo_json_polygons = {
            "type": "FeatureCollection",
            "crs": {
                "type": "name",
                "properties": { "name": "EPSG:2039" }
            },
            "features": polygons
        };

        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geo_json_polygons));
                
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        var nammeofgjson = "userPolygons.json";
        dlAnchorElem.setAttribute("download", nammeofgjson);
        dlAnchorElem.click();
    }
}
