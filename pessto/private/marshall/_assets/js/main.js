// Module Name:
// Author: Dave Young
// Date created: March 11, 2013
// Summary:

// ============  CODEKIT IMPORTS  =========== //
//@codekit-prepend "jquery-1.9.0.min.js";
//@codekit-prepend "_dryx_alert.js";
//@codekit-prepend "_dryx_animations.js";
//@codekit-prepend "_dryx_buttons.js";
//@codekit-prepend "_dryx_dropdowns.js";
//@codekit-prepend "_dryx_forms.js";
//@codekit-prepend "_dryx_images.js";
//@codekit-prepend "_dryx_modals.js";
//@codekit-prepend "_dryx_navigation.js";
//@codekit-prepend "_dryx_tooltips.js";
//@codekit-prepend "_dryx_utils.js";
//@codekit-prepend "_dryx_astro_calc.js";
//@codekit-prepend "_pessto_animations.js";
//@codekit-prepend "_pessto_form.js";

$(function() {
    // ANIMATE PAGE LOADING
    console.log("page loaded");
    $('div#topNavBar').toggleClass("isReady");
    $('div#bigWrapper').toggleClass("isReady")
    $('div#leftNavBar').toggleClass("isReady");

    // ADD EVENT LISTENERS TO BUTTONS AND MENUS
    $('button#expandButton').click(expand_collapse_object_ticket);
    $('button#newCommentButton').click(expand_collapse_comment_form);
    $('form#objectCommentForm').find('button#add').click(add_object_comment);
    $('form#objectCommentForm').find('button#cancel').click(expand_collapse_comment_form);
    $('button#classifyButton').click(reveal_classification_form);
    $('div#moveMenu').find('ul.dropdown-menu').find('a').click(move_object_and_hide_row);
    // $('div.moveMenuButton').click(move_object_and_hide_row);
    $('div.alertMenuButton').click(alert_object_and_hide_row);
    $('div[id$="Hover"]').mouseover(revealDropDownMenu);
    $('div[id$="Menu"]').mouseout(hideDropDownMenu);
    $('button#createNewTicket').click(reveal_create_new_form);
    $('input[name="sortInput"]').focus(sort_form_validation);
    $('input[name="searchInput"]').focus(search_form_validation);


    //AJAX ERROR HANDLING
    // $(function() {
    //      $.ajaxSetup({
    //          error: function(jqXHR, exception) {
    //              if (jqXHR.status === 0) {
    //                  alert('Not connect.\n Verify Network.');
    //                  alert(exception);
    //              } else if (jqXHR.status == 222) {
    //                  alert('Success. [222]');
    //              } else if (jqXHR.status == 333) {
    //                  alert('Fail. [333]');
    //              } else if (jqXHR.status == 404) {
    //                 alert('Requested page not found. [404]');
    //              } else if (jqXHR.status == 500) {
    //                  alert('Internal Server Error [500].');
    //              } else if (exception === 'parsererror') {
    //                  alert('Requested JSON parse failed.');
    //              } else if (exception === 'timeout') {
    //                  alert('Time out error.');
    //              } else if (exception === 'abort') {
    //                  alert('Ajax request aborted.');
    //              } else {
    //                  alert('Uncaught Error.\n' + jqXHR.responseText);
    //              }
    //          }
    //      });
    //  });

    // jQuery AJAX Get Error Handler


    // jQuery AJAX post Error Handler



    //ADD EXPAND  IF NEEDED BY TICKET
    var allTickets = $(document).find('div.objectTicket');
    var llimit = allTickets.length;
    for(var i = 0; i < llimit; i++) {
        //DETERMINE AUTO HEIGHT
        var columnWrapper = $(allTickets[i]).find('.columnWrapper')
        var fixedHeight = columnWrapper.height();
        columnWrapper.css('height', 'auto');
        var autoHeight = columnWrapper.height();
        columnWrapper.height(fixedHeight);

        if(autoHeight > fixedHeight) {
            var button = $(allTickets[i]).find('#expandButton');
            $(button).html('<span class="icon-enlarge"></span>');
        }
    }


    //CHANGE SANDBOX BACKGROUND COLOR
    if((/localpessto/).test(window.location.href)) {
        $('#marshallVersion').text("---- MAC MARSHALL ----");
    } else if((/sandbox/).test(window.location.href)) {
        $('#marshallVersion').text("---- SANDBOX - DEMO PAGES ----");
    } else if((/pesstobranch/).test(window.location.href)) {
        $('#marshallVersion').text("---- MAC SANDBOX ----");
    }

    //SHORTEN CANDIDATE NAMES
    var thisUrl = window.location.pathname;
    var previousLink = $('a#previousLink');

    var nextLink = $('a#nextLink');
    var ticketsPerPage = $('select#ticketsperpage');

    // //SHORTEN CANDIDATE NAMES
    // var allNames = $(document).find('a.objectNameLink');
    // var llimit = allNames.length;
    // for(var i = 0; i < llimit; i++) {
    //  if($(allNames[i]).text().length > 20) {
    //      var fsize = 160 / $(allNames[i]).text().length;
    //      var fsize = Math.round(fsize) / 10;
    //      $(allNames[i]).css('font-size', fsize + 'em');
    //  }
    // }
});




// ----------------------- GENERIC HELPER FUNCTIONS ------------------------ //
// -------------------------------------------------------------------------- //
function htmlEscape(str) {
    str = encodeURIComponent(str)
    str = String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

    return str
}

