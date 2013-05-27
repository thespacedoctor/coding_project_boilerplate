// Module Name: pessto_animations
// Author: Dave Young
// Date created: March 11, 2013
// Summary: Some custom pessto animations


function move_object_and_hide_row() {
    event.preventDefault();

    var thisUrl = $(this).attr('href');
    var row = $(this).closest(".objectTicket");

    $(row).animate({
        opacity: 0.25
    }, 150);
    $(row).delay(600).slideUp(300);

    jQuery.ajax({
        type: "POST",
        url: thisUrl
    });
}


function alert_object_and_hide_row() {

    var row = $(this).closest(".objectTicket");
    var poid = row.attr("poid");
    var awfFlag = $(this).attr('awfFlag');
    var url = "../scripts/pesstoMarshallButtons.py?button=change_awf_flag&pesstoObjectsId=" + poid + "&awfFlag=" + awfFlag;
    //alert(url);

    $(row).animate({
        opacity: 0.25
    }, 150);
    $(row).delay(600).slideUp(300);

    jQuery.ajax({
        type: "POST",
        url: "../scripts/pesstoMarshallButtons.py?button=change_awf_flag&pesstoObjectsId=" + poid + "&awfFlag=" + awfFlag
    });
}


//EXPAND TICKETS
function expand_collapse_object_ticket() {
    // March 11, 2013 USE THE addClass METHOD TO HIDE AND SCALE
    var poid = $(this).closest('.objectTicket').attr('poid');
    var thisColumnWrapper = $(this).closest('.objectTicket').find('.columnWrapper');
    var thisExpandButton = $(this).closest('.objectTicket').find('#expandButton');
    //console.log(this);
    //EXPAND COLUMNBLOCKS TO AUTOHEIGHT
    var fixedHeight = thisColumnWrapper.height();
    thisColumnWrapper.css('height', 'auto');
    var autoHeight = thisColumnWrapper.height();
    thisColumnWrapper.height(fixedHeight);

    if(autoHeight < fixedHeight) {
        autoHeight = fixedHeight;
    }

    if(/enlarge/.test(thisExpandButton.html())) {
        //COLLASE ALL EXPANDED COLUMNBLOCKS ELSEWHERE ON PAGE
        $('.columnWrapper').animate({
            height: fixedHeight
        }, 300);
        thisColumnWrapper.animate({
            height: autoHeight
        }, 300);

        //CHANGE EXPAND BUTTON
        thisExpandButton.html('<span class="icon-contract"></span>');

    } else {
        //SLIDE UP AND CHANGE EXPAND BUTTON
        thisExpandButton.html('<span class="icon-enlarge"></span>');
        //RESET OBJECT TICKET HEIGHT
        autoHeight = thisColumnWrapper.height();
        thisColumnWrapper.removeAttr("style");
        fixedHeight = thisColumnWrapper.height();
        thisColumnWrapper.height(autoHeight).animate({
            height: fixedHeight
        }, 300);
    }
}


function hideRow(id, mwfFlag) {
    // document.getElementById(id).style.visibility = "hidden";
    document.getElementById(id).className = "objectTicket_hide";

    jQuery.ajax({
        type: "POST",
        url: "../scripts/btnx_change_mwf_flag.py?pesstoObjectsId=" + id + "&mwfFlag=" + mwfFlag
    });

}


function revealDropDownMenu() {
    //alert('here');
    var row = $(this).closest('div[id$="Menu"]');
    var buttons = row.find('div[class$="MenuButton"]');

    for(var i = 0; i < buttons.length; i++) {
        $(buttons[i]).slideDown(300);
    }
}


function hideDropDownMenu() {
    // HANDLE MOUSE OUT EVENT CORRECTLY - REMOVE EVENT BUBBLING
    //THIS IS THE ORIGINAL ELEMENT THE EVENT HANDLER WAS ASSIGNED TO
    // e = event.toElement || event.relatedTarget;
    //     if (e.parentNode == this || e == this) {
    //        return;
    //     }
    var e = event.relatedtarget || event.toElement;

    while(e && e != this) {
        e = e.parentNode;
    }

    if(e != this) { // relatedtarget is outside of the div
        var row = $(this).closest('div[id$="Menu"]');
        var buttons = row.find('div[class$="MenuButton"]');

        for(var i = 0; i < buttons.length; i++) {
            $(buttons[i]).slideUp(300);
        }
    }
}

