var investEdgeData = {recordcount:null, columnlist: null, data: null},
    matchUrl = new RegExp("^https://.*/api/([^$\\?]+)\\??(.*)?$", "gi"),
    curRecordIndex = 0,
    curColIndex = 0,
    $pre = $("pre"),
    $btnShowJSON = $("<button id=\"showJSON\" class=\"btn btn-success\">Show raw JSON</button>"),
    $table = $('<table class="table table-striped table-bordered"></table>'),
    $infoTable = $('<table class="table table-striped table-bordered"></table>'),
    $curTr,
    $curTd,
    showJSONToggledOn = false,
    $infoTitle = $("<h1>Info</h1>"),
    $jsonTitle = $("<h1>JSON Data</h1>"),
    $formattedTitle = $("<h1>Formatted Data</h1>"),
    colList,
    curObject;

// Get the JSON into a javascript object
eval("investEdgeData="+$("pre").text());

$pre.hide();

colList = investEdgeData.columnlist.split(',');

// Add headings to table
$curTr = $("<tr></tr>");
for(; curColIndex < colList.length; curColIndex += 1){
    $curTd = $("<th>" + colList[curColIndex] + "</th>");
    $curTr.append($curTd);
}

$table.append($curTr);

// Populate data in formatted data table
for(;curRecordIndex < investEdgeData.recordcount; curRecordIndex+=1){
    $curTr = $("<tr></tr>");

    for(curObject in investEdgeData.data){
        $curTd = $("<td>" + investEdgeData.data[curObject][curRecordIndex] + "</td>");
        $curTr.append($curTd);
    }

    $table.append($curTr);
}

// Display info
$infoTable.append("<tr><th>Resource</th><td>" + window.location.toString().replace(matchUrl, "$1") + "</td></tr>");
$infoTable.append("<tr><th>Query String</th><td>" + window.location.toString().replace(matchUrl, "$2")  + "</td></tr>");
$infoTable.append("<tr><th>Record Count</th><td>" + investEdgeData.recordcount + "</td></tr>");
$infoTable.append("<tr><th>Column List</th><td>" + investEdgeData.columnlist + "</td></tr>");

// Handle Show hide JSON
$("body").delegate("#showJSON", "click", function(){
    var $me = $(this);
    if(showJSONToggledOn){
        $pre.hide();
        $me
            .removeClass("btn-danger")
            .addClass("btn-success")
            .text("Show raw JSON");
    } else{
       $pre.show();
       $me
           .removeClass("btn-success")
           .addClass("btn-danger")
           .text("Hide JSON");
    }

    showJSONToggledOn = !showJSONToggledOn;
})

$pre.remove();
$("body").append($infoTitle);
$("body").append($infoTable);
$("body").append($jsonTitle);
$("body").append($btnShowJSON);
$("body").append($pre);
$("body").append($formattedTitle);
$("body").append($table);

$infoTitle.addClass("animated fadeInLeft");
$jsonTitle.addClass("animated fadeInLeft");
$formattedTitle.addClass("animated fadeInLeft");