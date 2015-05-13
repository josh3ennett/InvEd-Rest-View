"use strict";

var $restList = $('#restList'),
    $listTitle = $('#listTitle'),
    timeoutVal = 0,
    hasErrors = false,
    $searchModal = $('#search-modal'),
    $searchModalBody = $("#search-modal .modal-body"),
    $errorsAndWarnings = $("#errors-and-warnings"),
    errorsAndWarnings = [],
    baseUrl = localStorage["base-url"] ? localStorage["base-url"].replace(new RegExp("^(https?://[^\.]+\.investedge\.net)/+?$", "gi"), "$1") : null,
    $tr = $($restList.find("tr")),
    $lastSearchClick = null,
    matchUrl = new RegExp("^https://.*/api/([^$\\?]+)\\??(.*)?$", "gi"),
    matchNumber = new RegExp("^")

// Wire form for jQuery Validate
$restList.validate();
$restList.find("input").validate({
    rules: {
        number: true,
        required: true
    }
});

// Form Events
$($restList)
    // Disable <a> clicks
    .delegate('a[href*="/api/"]', "click", function(){
        return false;
    })
    // Mouse In - add Animation
    .delegate('button.get', 'mouseover', function(){
        var $me = $(this);
        $me.addClass('animated tada');
    })
    // Mouse Out - remove Animation
    .delegate('button.get', 'mouseout', function(){
        var $me = $(this);
        $me.removeClass('animated tada');
    })
    // Key Down - remove Animation
    .delegate('input', 'keydown', function(){
        if(event.keyCode == 13){
            var $me = $(this);
            $me.parent().parent().find(".btn.get").trigger("click");
            return false;
        }
    })
    // Handle "GET" click
    .delegate('button.get', 'click', function(){
        if(hasErrors){
            window.scrollTo(0,0);
            $errorsAndWarnings = $("#errors-and-warnings");
            $errorsAndWarnings.attr('class', '')
            requestAnimationFrame(function(){
                $errorsAndWarnings.attr('class', 'animated shake')
            });

            return false;
        }

        var $me = $(this),
            href = $me.parent().parent().find('a').attr('href'),
            matches = href.match(new RegExp("\{([^\}]+)\}", "gi")),
            idErrors =  false;

        if(matches !== null){
            // Loop through all var placeholder
            matches.forEach(function(curmatch){
                var curInputId = curmatch.replace(new RegExp("[\{\}]", "gi"), "");
                // assumes var placeholder in link is id for a text input
                href = href.replace(curmatch, $('#'+ curInputId).val());
            })
        }
        href = baseUrl + href;
        window.open( href)
    })

   // Search button clicked
    .delegate('button.search', 'click', function(){

        var $me = $(this),
            $form = $("<form role='form' onsubmit='return false;'></form>"),
            $curFormGroup = $("<div class='form-group'></div>"),
            $curColLabel = "",
            $curColInput = "",
            $curLabel,
            $curInput,
            searchOptions = this.dataset["search"] ? this.dataset["search"].split(",") : [],
            curSearchOptionIndex = 0,
            curSearchOption = "";

        $lastSearchClick = $me;

        for(; curSearchOptionIndex < searchOptions.length; curSearchOptionIndex += 1){
            curSearchOption = searchOptions[curSearchOptionIndex];
                $curLabel = $("<label for='txt-" + curSearchOption + "'>" + curSearchOption + "</label>");
                $curInput = $("<input type='text' class='form-control' id='txt-" +  curSearchOption + "' name='" + curSearchOption + "' required />");
                $curFormGroup.append($curLabel);
                $curFormGroup.append($curInput);
                $form.append($curFormGroup);
        }

        $searchModalBody.empty();

        $searchModalBody.append($form);

        $searchModal.modal({});

        return false;
    });

    // Modal search button clicked
    $searchModal
        .delegate("button.btn-primary", "click", function(){

            if(hasErrors){
                window.scrollTo(0,0);
                $errorsAndWarnings = $("#errors-and-warnings");
                $errorsAndWarnings.attr('class', '')
                requestAnimationFrame(function(){
                    $errorsAndWarnings.attr('class', 'animated shake')
                });

                return false;
            }

            var $me = $lastSearchClick,
                href = $me.parent().parent().find('a').attr('href'),
                matches = href.match(new RegExp("\{([^\}]+)\}", "gi")),
                queryString = "";

            if(matches !== null){
                // Loop through all var placeholder
                matches.forEach(function(curmatch){
                    var curInputId = curmatch.replace(new RegExp("[\{\}]", "gi"), "");
                    // assumes var placeholder in link is id for a text input
                    href = href.replace(curmatch, $('#'+ curInputId).val());
                })
            }

            $('#search-modal').find("form input").each(function(){
                var $inp = $(this), curQuery;
                if(!$inp.val()){
                    return;
                }

                curQuery = $inp.attr('name') + "=" + $inp.val();
                queryString += queryString === "" ? curQuery : "&" + curQuery;
            })

            queryString = queryString !== "" ? "?"+queryString : "";

            href = baseUrl + href + queryString;

            window.open(href);

            return false;
    })
    .delegate("input", "keydown", function(){
            if(event.keyCode == 13){
                var $me = $(this);
                $me.parent().parent().parent().parent().find(".btn-primary").trigger("click");
                return false;
            }
        })

// Animation
$listTitle.addClass("animated fadeInDown");
$tr.css('opacity', '0');

$tr
    .each( function() {
        var $me = $(this);
        timeoutVal += 50;//Math.abs(Math.random() * 100);

        setTimeout(function(){
            $me.addClass("animated fadeInLeft");
        }, timeoutVal);
    });

displayErrorsAndWarnings();

// Display Error for field left blank
function validateAndDisplayIdField( $input ){
    if($restList.element($input)){

    }
}

// Display Warning and Errors
function displayErrorsAndWarnings(){
    var missingOption = "Set this in the extension's options."

    if(!localStorage["private-key"]){
        errorsAndWarnings.push({level: "error", message: "Private-key is not defined. " + missingOption});
        hasErrors = true;
    }

    if(!localStorage["public-key"]){
        errorsAndWarnings.push({level: "error", message: "Public-key is not defined. " + missingOption});
        hasErrors = true;
    }

    if(!localStorage["user-key"]){
        errorsAndWarnings.push({level: "error", message: "User-key is not defined. " + missingOption});
        hasErrors = true;
    }
    if(!localStorage["user-name"]){
        errorsAndWarnings.push({level: "error", message: "User-name is not defined. " + missingOption});
        hasErrors = true;
    }
    if(!localStorage["base-url"]){
        errorsAndWarnings.push({level: "error", message: "Base url is not defined. " + missingOption});
        hasErrors = true;
    } else if( !(new RegExp("^https?://[^\.]+\.investedge\.net/+?$","gi")).test(localStorage["base-url"]) ){
        errorsAndWarnings.push({level: "error", message: "Base url is not correct format, must match https://(your-sub-domain).investedge.net/. " + missingOption});
        hasErrors = true;
    }

    if(!hasErrors){
        $errorsAndWarnings.hide();
        return;
    }

    var
        $ul = $("<ul></ul>"),
        $curLi = null,
        curIndex = 0;

    for(; curIndex < errorsAndWarnings.length; curIndex += 1){
        $curLi = $("<li></li>");
        $curLi.addClass( "alert" );
        $curLi.addClass( "alert-" + errorsAndWarnings[curIndex].level);
        $curLi.html(errorsAndWarnings[curIndex].message);
        $ul.append($curLi);
    }
    debugger;
    $errorsAndWarnings.append($ul);

}

