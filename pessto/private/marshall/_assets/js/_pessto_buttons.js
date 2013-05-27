// Module Name: _pessto_buttons
// Author: Dave Young
// Date created: March 11, 2013
// Summary: Button functions for the pessto marshall

function add_object_comment() {
    event.preventDefault();

    var row = $(this).closest(".objectTicket");
    var poid = row.attr("poid");
    var commentHeader = row.find('#commentsHeader');
    var thisForm = $(this).closest("form");

    var author = thisForm.find('input[name*="author"]').val();
    var comment = thisForm.find('input[name*="comment"]').val();

    if(author.length <= 3) {
        thisForm.find('#commentError').text("Author's name must be longer than 3 characters long.").show().fadeOut(5000);
        return false;
    } else if(comment === "") {
        thisForm.find('#commentError').text("Please enter a comment").show().fadeOut(7000);
        return false;
    } else {

        comment = encodeURIComponent(comment);
        var newComment = '<div class="divVerticalKids" id="oneComment" style="height:0px; overflow:hidden; opacity:0;">' + comment + '<div class="divHorizontalKids" id="commentFooter"> <span id="commentAuthor">' + author + ', </span><span id="commentDate">just now</span></div><!-- /#commentFooter--></div>';
        $(newComment).insertAfter(commentHeader).animate({
            opacity: 1
        }, 300);

        // comment = encode_url(comment);
        // alert(comment);
        // comment = htmlEscape(comment)
        // var comment = comment.replace(/;/g, ":");
        // var comment = comment.replace(/'/g, "\\\'");
        // var comment = comment.replace(/</g, "&lt;");
        // var comment = comment.replace(/>/g, "&gt;");
        // var comment = comment.replace(/"/g, "`");
        var url = "../scripts/pesstoMarshallButtons.py?button=add_object_comment&pesstoObjectsId=" + poid + "&author=" + author + "&comment=" + comment;
        // alert(url);
        //alert(url);
        $.getJSON(url, function(data) {
            //alert(data.browserAlert);
        });

        //$('form#objectCommentForm').slideUp(300);
        thisForm.find('input[name*="author"]');
        thisForm.find('input[name*="comment"]').val();

        thisForm.slideUp(300);

    }

    return false;
}
