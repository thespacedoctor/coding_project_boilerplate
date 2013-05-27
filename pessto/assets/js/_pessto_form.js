// Module Name: _pessto_forms
// Author: Dave Young
// Date created: March 11, 2013
// Summary: Some custom pessto marshall form functions


// ----- FORM VALIDATION FUNCTION - CHECK, RETURN TRUE OR FALSE AND AN ERROR MESSAGE ----- //
// ----------------------------------------------------------------------------------------- //
function check_form_input(regex, input, inputValue, errorDiv, helpMessage) {
    // RESET WARNING TO RED
    errorDiv.css("color", "#dc322f");

    // IF THE WRONG INFORMATION WAS ENTERED, WARN THEM
    if(!regex.test(inputValue)) {
        // ADD NEW WARNING
        errorDiv.text(helpMessage).show().fadeIn(300);
        input.css('background-color', '#D09B9D');
        input.css('color', '#073642');
        return false;
    }
    // IF THE RIGHT INFORMATION WAS ENTERED, CLEAR THE HELP MESSAGE
    else {
        //alert('mathched!');
        if(errorDiv !== null) {
            // Remove any warnings that may exist
            var randomNumber = Math.random();
            var randomComp = "";
            if(randomNumber < 0.1) {
                randomComp = "great";
            } else if(randomNumber < 0.2) {
                randomComp = "lovely shoes";
            } else if(randomNumber < 0.3) {
                randomComp = "nice";
            } else if(randomNumber < 0.4) {
                randomComp = "sweet";
            } else if(randomNumber < 0.5) {
                randomComp = "get a hair cut";
            } else if(randomNumber < 0.6) {
                randomComp = "want fries with that?";
            } else if(randomNumber < 0.7) {
                randomComp = "good job";
            } else if(randomNumber < 0.8) {
                randomComp = "excellent";
            } else if(randomNumber < 0.9) {
                randomComp = "thanks";
            } else {
                randomComp = "you've done this before!";
            }

            errorDiv.css("color", "#859900");
            errorDiv.text(randomComp).fadeOut(1000);
            input.css('background-color', '#BEC989');
            input.css('color', '#073642');
            return true;
        }
    }
}


//CANCEL FLOATING WINDOW
function clear_form_and_return() {
    event.preventDefault();

    var form = $(this).closest('form');
    var thisWindow = $(this).closest('.floatingFormWindow');

    var inputs = form.find('input');

    //FADEOUT AND SLIDEUP
    form.slideToggle(200);
    thisWindow.fadeOut(400);
}


function search_form_validation() {

    $(this).keypress(function(event) {
        if(event.keyCode == 10 || event.keyCode == 13) {
            event.preventDefault();
        }
    });

    var thisInput = $(this);

    thisInput.keyup(function(event) {
        if((event.keyCode == 10 || event.keyCode == 13)) {
            var searchValue = thisInput.val();
            var thisUrl = window.location.pathname;
            var newUrl = thisUrl + '?bi=all&search=' + searchValue;
            window.location.href = newUrl;
        }
    });
}


function sort_form_validation() {

    $(this).keypress(function(event) {
        if(event.keyCode == 10 || event.keyCode == 13) {
            event.preventDefault();
        }
    });

    var options = ['peak abs mag', 'peak absolute magnitude', 'abs mag', 'absolute magnitude', 'z', 'distance', 'mpc', 'redshift', 'magnitude', 'mag', 'apparent magnitude', 'app mag', 'classification', 'class', 'spectral type', 'type', 'prediction', 'dec', 'ra', 'id', 'name', 'object id', 'identity', 'mjd', 'obs date', 'obsdate', 'last observed', 'recent obs', 'recent observation'];
    var thisInput = $(this);

    var defaultBackground = thisInput.css('background-color');
    var defaultColour = thisInput.css('color');

    $(this).bind("keyup change", function() {

        var match = 0;
        var sortValue = thisInput.val();
        for(var i = 0; i < options.length; i++) {
            if(sortValue == options[i]) {
                match = 1;
            }
        }

        if(sortValue.length === 0) {
            thisInput.removeAttr('style');
            // thisInput.removeAttr('color');
        } else if(match == 1) {
            thisInput.css('background-color', '#BEC989');
            thisInput.css('color', '#073642');
        } else {
            //alert("not ok");
            thisInput.css('background-color', '#D09B9D');
            thisInput.css('color', '#073642');
        }

        thisInput.keyup(function(event) {
            var newUrl = "";
            if((event.keyCode == 10 || event.keyCode == 13) && match == 1) {
                var thisUrl = $(location).attr('href');
                var regExp = /(sortBy).*(&)/g;
                var regExp2 = /(sortBy)/g;
                var regExp3 = /(index.py)$/;

                if(regExp.test(thisUrl)) {
                    newUrl = thisUrl.replace(regExp, 'sortBy=' + sortValue + '&');
                    window.location.href = newUrl;
                } else if(regExp2.test(thisUrl)) {
                    newUrl = thisUrl.replace(/(sortBy).*/, 'sortBy=' + sortValue);
                    window.location.href = newUrl;
                } else if(regExp3.test(thisUrl)) {
                    newUrl = thisUrl + '?bi=inbox&sortBy=' + sortValue;
                    window.location.href = newUrl;
                } else {
                    newUrl = thisUrl + '&sortBy=' + sortValue;
                    window.location.href = newUrl;
                }
            }
        });
    });
}


function center(element) {
    element.css("position", "fixed");
    element.css("top", "50px");
    element.css("left", Math.max(0, (($(window).width() - element.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
}

function reveal_create_new_form() {

    /*---ON REVEAL DO THESE FUNCTION ---------------------------------------------------------*/
    /*----------------------------------------------------------------------------------------*/
    //GRAB THE CREATE NEW OBJECT FORM
    var form = $('form#createNewObjectForm');
    //GRAB CREATE NEW OBJECT FORM WINDOW
    var thisWindow = form.closest('.floatingFormWindow');
    //CENTER FORM
    center(form);
    //CANCEL BUTTON FUNCTION - EVENT LISTENER
    thisWindow.find('button#cancel').click(clear_form_and_return);
    //FADEIN AND SLIDEDOWN
    thisWindow.fadeIn(200);
    form.slideToggle(400);

    /*---FORM VALIDATION -----------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------*/
    //GRAB ERROR DIV
    var errorBox = thisWindow.find('div.formError');

    thisWindow.find('input[name="objectName"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="objectName"]').val();
            check_form_input(/\w{6,100}/, $(this), thisValue, errorBox, 'object name must be 6 characters or longer');
        });
    });

    thisWindow.find('input[name="survey"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="survey"]').val();
            check_form_input(/\w{3,20}/, $(this), thisValue, errorBox, 'survey name must be 3 characters or longer');
        });
    });

    thisWindow.find('input[name="objectUrl"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="objectUrl"]').val();
            //check_form_input(/(^([h][t][t][p][s]?[\:][\/][\/][\w\.]{5,}))|$^/, $(this), thisValue, errorBox, 'please enter a valid source url for the object');
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
            check_form_input(expression, $(this), thisValue, errorBox, 'please enter a valid source url for the object');
        });
    });

    thisWindow.find('input[name="objectImageUrl"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="objectImageUrl"]').val();
            var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
            check_form_input(expression, $(this), thisValue, errorBox, 'please enter a valid url for an image of the object');
        });
    });

    thisWindow.find('input[name="ra"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="ra"]').val();
            if((thisValue < 360.0) & (thisValue > 0.0)) {
                check_form_input(/^\+?\d{1,3}\.\d{1,}$/, $(this), thisValue, errorBox, 'please enter RA in degrees or sexagesimal format');
            } else {
                check_form_input(/^\+?([0-9]|([0-1][0-9])|([2][0-3]))(:| )[0-5][0-9](:| )[0-5][0-9]((\.\d{1,})?)$/, $(this), thisValue, errorBox, 'RA in degrees or sexagesimal format');
            }
        });

        $(this).bind("blur", function() {
            var ra = thisWindow.find('input[name="ra"]')
            var thisValue = ra.val();
            if(/^\+?([0-9]|([0-1][0-9])|([2][0-3]))(:| )[0-5][0-9](:| )[0-5][0-9]((\.\d{1,})?)$/.test(thisValue)){
                ra.val(ra_sex2degrees(thisValue));
            }
        });
    });

    thisWindow.find('input[name="dec"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="dec"]').val();
            if((thisValue < 90.0) & (thisValue > -90.0)) {
                check_form_input(/^[\-\+]?\d{1,3}\.\d{1,}$/, $(this), thisValue, errorBox, 'please enter DEC in degrees or sexagesimal format');
            } else {
                check_form_input(/^([\+\-]?([0-9]|[0-8][0-9]))(:| )[0-5][0-9](:| )[0-5][0-9](\.\d{1,})?$/, $(this), thisValue, errorBox, 'DEC in degrees or sexagesimal format');
            }
        });

        $(this).bind("blur", function() {
            var dec = thisWindow.find('input[name="dec"]')
            var thisValue = dec.val();
            if(/^([\+\-]?([0-9]|[0-8][0-9]))(:| )[0-5][0-9](:| )[0-5][0-9](\.\d{1,})?$/.test(thisValue)){
                dec.val(dec_sex2degrees(thisValue));
            }
        });

    });

    thisWindow.find('input[name="discoveryMag"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="discoveryMag"]').val();
            check_form_input(/^\d{1,2}\.\d{1,3}/, $(this), thisValue, errorBox, 'please enter a valid magnitude');
        });
    });

    thisWindow.find('input[name="discoveryFilter"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="discoveryFilter"]').val();
            check_form_input(/^\w{1,7}/, $(this), thisValue, errorBox, 'please enter a 1-7 characters');
        });
    });

    thisWindow.find('input[name="mjd"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="mjd"]').val();
            check_form_input(/^[0-9\.]{5,12}$/, $(this), thisValue, errorBox, 'mjd not in correct format yet');
        });
    });

    //IF TYPE VARIABLE THEN HIDE 'HOST REDSHIFT'
    thisWindow.find('select#suggestedType').change(function() {
        if($(this).val() != 'variable star') {
            thisWindow.find('input[name="hostRedshift"]').animate({
                opacity: 1
            }, 300);
            thisWindow.find('div#host').animate({
                opacity: 1
            }, 300);
        } else {
            thisWindow.find('input[name="hostRedshift"]').animate({
                opacity: 0
            }, 300);
            thisWindow.find('div#host').animate({
                opacity: 0
            }, 300);
        }
    });

    thisWindow.find('input[name="hostRedshift"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="hostRedshift"]').val();
            check_form_input(/^([0-9]\.[0-9]{1,7}$)|$^/, $(this), thisValue, errorBox, 'redshift not in the correct format yet');
        });
    });

    thisWindow.find('input[name="createdBy"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="createdBy"]').val();
            check_form_input(/^.{2,50}/, $(this), thisValue, errorBox, 'please enter more than 2 characters');
        });
    });

    var formSubmitted = thisWindow.find('#formSubmitted');

    //CREATE BUTTON FUNCTION - EVENT LISTENER
    thisWindow.find('button#create').click(function() {
        event.preventDefault();

        var fullCheck = 0;
        var buttonArgs = "";

        var objectName = thisWindow.find('input[name="objectName"]').val();
        fullCheck = fullCheck + !(/\w{6,100}/).test(objectName);
        buttonArgs = buttonArgs + "objectName=" + objectName;

        var survey = thisWindow.find('input[name="survey"]').val();
        fullCheck = fullCheck + !(/\w{3,20}/).test(survey);
        buttonArgs = buttonArgs + "&survey=" + survey;

        var objectUrl = thisWindow.find('input[name="objectUrl"]').val();
        var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
        fullCheck = fullCheck + !(expression).test(objectUrl);
        if(objectUrl.length === 0) {
            objectUrl = "NULL";
        }
        buttonArgs = buttonArgs + "&objectUrl=" + objectUrl;

        var objectImageUrl = thisWindow.find('input[name="objectImageUrl"]').val();
        expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
        fullCheck = fullCheck + !(expression).test(objectImageUrl);
        if(objectImageUrl.length === 0) {
            objectImageUrl = "NULL";
        }
        buttonArgs = buttonArgs + "&objectImageUrl=" + objectImageUrl;

        // CHECK RA IS IN THE CORRECT FORMAT
        var ra = thisWindow.find('input[name="ra"]').val();
        if((ra > 360) | (ra < 0)) {
            fullCheck = fullCheck + 1;
        }
        fullCheck = fullCheck + !(/^\d{1,3}\.\d{1,}/).test(ra);
        buttonArgs = buttonArgs + "&ra=" + ra;

        // CHECK DEC IS IN THE CORRECT FORMAT
        var dec = thisWindow.find('input[name="dec"]').val();
        if((dec > 90) | (dec < -90)) {
            fullCheck = fullCheck + 1;
        }
        fullCheck = fullCheck + !(/^[\-\+]?\d{1,3}\.\d{1,}/).test(dec);
        buttonArgs = buttonArgs + "&dec=" + dec;

        var discoveryMag = thisWindow.find('input[name="discoveryMag"]').val();
        fullCheck = fullCheck + !(/^\d{1,2}\.\d{1,3}/).test(discoveryMag);
        buttonArgs = buttonArgs + "&discoveryMag=" + discoveryMag;

        var discoveryFilter = thisWindow.find('input[name="discoveryFilter"]').val();
        fullCheck = fullCheck + !(/^\w{1,7}/).test(discoveryFilter);
        buttonArgs = buttonArgs + "&discoveryFilter=" + discoveryFilter;

        var mjd = thisWindow.find('input[name="mjd"]').val();
        fullCheck = fullCheck + !(/^[0-9\.]{5,12}$/).test(mjd);
        buttonArgs = buttonArgs + "&mjd=" + mjd;

        var suggestedType = thisWindow.find('select#suggestedType').val();
        buttonArgs = buttonArgs + "&suggestedType=" + suggestedType;
        var hostRedshift = thisWindow.find('input[name="hostRedshift"]').val();
        buttonArgs = buttonArgs + "&hostRedshift=" + hostRedshift;
        if(suggestedType != 'variable star') {
            fullCheck = fullCheck + !(/^([0-9]\.[0-9]{1,5}$)|$^/).test(hostRedshift);
        }

        var createdBy = thisWindow.find('input[name="createdBy"]').val();
        fullCheck = fullCheck + !(/^.{2,50}/).test(createdBy);
        buttonArgs = buttonArgs + "&createdBy=" + createdBy;

        buttonArgs = "button=create_new_ticket&" + buttonArgs;
        //alert(fullCheck+", pesstoMarshallButtons.py?"+buttonArgs);
        if(fullCheck === 0) {
        var url = "../scripts/pesstoMarshallButtons.py?" + buttonArgs;
        $.getJSON(url, function(data) {
            //alert(data.browserAlert);
        });

            pause(20);
            form.slideToggle(200);
            thisWindow.fadeOut(400);
            var submitted = true;
            // location.reload();
            // formSubmitted.attr("checked","checked");
            return true;

        } else {
            event.preventDefault();
            errorBox.css("color", "#dc322f");
            errorBox.text("there's an error in this form").show().fadeIn(300);
        }
    });
}





function reveal_classification_form() {

    //GRAB PESSTOOBJECTSID
    var poid = $(this).attr("poid");
    //GRAB THE CLASSIFICATION FORM WITH THIS ID
    var classificationForm = $('#classificationForm[poid="' + poid + '"]');
    //GRAB CLASSIFICATION-FORM WINDOW
    var thisWindow = $(classificationForm).closest('.floatingFormWindow');
    //GRAB ERROR DIV
    var errorBox = thisWindow.find('div.formError');

    //CANCEL BUTTON FUNCTION - EVENT LISTENER
    thisWindow.find('button#cancel').click(clear_form_and_return);

    //IF SOURCE NOT PESSTO THEN REVEAL 'NUMBER' INPUT
    thisWindow.find('select#source').change(function() {
        if(($(this).val() === 'atel') | ($(this).val() === 'cbet')) {
            thisWindow.find('input[name="number"]').animate({
                opacity: 1
            }, 300);
        } else {
            thisWindow.find('input[name="number"]').animate({
                opacity: 0
            }, 300);
        }
    });

    thisWindow.find('input[name="number"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="number"]').val();
            check_form_input(/^[0-9]{4}$/, $(this), thisValue, errorBox, 'atel/cbet number must be exactly 4 digits long');
        });
    });

    thisWindow.find('input[name="mjd"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="mjd"]').val();
            check_form_input(/^[0-9\.]{5,12}$/, $(this), thisValue, errorBox, 'mjd not in correct format yet');
        });
    });

    thisWindow.find('input[name="telescope"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="telescope"]').val();
            check_form_input(/.{2,}$/, $(this), thisValue, errorBox, 'use 2 or more characters for the telescope name');
        });
    });

    thisWindow.find('input[name="instrument"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="instrument"]').val();
            check_form_input(/.{2,}$/, $(this), thisValue, errorBox, 'use 2 or more characters for the instrument name');
        });
    });

    //IF TYPE NOT SUPERNOVA THEN HIDE 'CLASSIFICATION' & PECULIAR INPUT
    thisWindow.find('select#type').change(function() {
        if($(this).val() != 'supernova') {
            thisWindow.find('select#classification').animate({
                opacity: 0
            }, 300);
            thisWindow.find('div#classification').animate({
                opacity: 0
            }, 300);
            thisWindow.find('div#peculiar').animate({
                opacity: 0
            }, 300);
            thisWindow.find('input#peculiar').animate({
                opacity: 0
            }, 300);
        } else {
            thisWindow.find('select#classification').animate({
                opacity: 1
            }, 300);
            thisWindow.find('div#classification').animate({
                opacity: 1
            }, 300);
            thisWindow.find('div#peculiar').animate({
                opacity: 1
            }, 300);
            thisWindow.find('input#peculiar').animate({
                opacity: 1
            }, 300);
        }

        //IF TYPE VARIABLE THEN HIDE 'REDSHIFT'
        if($(this).val() == 'variable star') {
            thisWindow.find('input[name="redshift"]').animate({
                opacity: 0
            }, 300);
            thisWindow.find('div#redshift').animate({
                opacity: 0
            }, 300);
        } else {
            thisWindow.find('input[name="redshift"]').animate({
                opacity: 1
            }, 300);
            thisWindow.find('div#redshift').animate({
                opacity: 1
            }, 300);
        }

    });


    thisWindow.find('input[name="redshift"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="redshift"]').val();
            check_form_input(/^([0-9]\.[0-9]{1,7}$)|$^/, $(this), thisValue, errorBox, 'redshift not in the correct format yet');
        });
    });

    thisWindow.find('input[name="reducer"]').focus(function() {
        $(this).bind("keyup change", function() {
            var thisValue = thisWindow.find('input[name="reducer"]').val();
            check_form_input(/^([A-Za-z\s]{2,40}$)|$^/, $(this), thisValue, errorBox, 'please enter more than 2 characters');
        });
    });


    //CENTER FORM
    center(classificationForm);

    //FADEIN AND SLIDEDOWN
    thisWindow.fadeIn(200);
    classificationForm.slideToggle(400);


    //CLASSIFY BUTTONS
    thisWindow.find('button[id*="lassify"]').click(function() {
        event.preventDefault();
        var fullCheck = 0;
        var buttonArgs = "";
        var submitted = false;
        var awfFlag;
        var classification;

        var pesstoObjectsId = poid;
        buttonArgs = buttonArgs + "pesstoObjectsId=" + pesstoObjectsId;

        var objectName = thisWindow.find('div#objectName').text();
        buttonArgs = buttonArgs + "&objectName=" + objectName;

        var source = thisWindow.find('select#source').val();
        buttonArgs = buttonArgs + "&source=" + source;

        if($(this).attr('id') == 'justClassify') {
            awfFlag = 'archived%20without%20alert';
        }
        if($(this).attr('id') == 'classifyAlert') {
            awfFlag = 'queued%20for%20alert';
        }

        if(source == 'atel') {
            var atelNumber = thisWindow.find('input[name="number"]').val();
            fullCheck = fullCheck + !(/^[0-9]{4}$/).test(atelNumber);
            buttonArgs = buttonArgs + "&atelNumber=" + atelNumber;
            buttonArgs = buttonArgs + "&cbetNumber=NULL";
        } else if(source == 'cbet') {
            var cbetNumber = thisWindow.find('input[name="number"]').val();
            fullCheck = fullCheck + !(/^[0-9]{4}$/).test(cbetNumber);
            buttonArgs = buttonArgs + "&cbetNumber=" + cbetNumber;
            buttonArgs = buttonArgs + "&atelNumber=NULL";
        } else {
            buttonArgs = buttonArgs + "&atelNumber=NULL";
            buttonArgs = buttonArgs + "&cbetNumber=NULL";
        }

        var mjd = thisWindow.find('input[name="mjd"]').val();
        fullCheck = fullCheck + !(/^[0-9\.]{5,12}$/).test(mjd);
        buttonArgs = buttonArgs + "&mjd=" + mjd;

        var telescope = thisWindow.find('input[name="telescope"]').val();
        fullCheck = fullCheck + !(/.{2,}$/).test(telescope);
        buttonArgs = buttonArgs + "&telescope=" + telescope;

        var instrument = thisWindow.find('input[name="instrument"]').val();
        fullCheck = fullCheck + !(/.{2,}$/).test(instrument);
        buttonArgs = buttonArgs + "&instrument=" + instrument;

        var type = thisWindow.find('select#type').val();
        buttonArgs = buttonArgs + "&type=" + type;

        if(type == 'supernova') {
            classification = thisWindow.find('select#classification').val();
            if(thisWindow.find('input#peculiar').is(':checked')) {
                classification = classification + " peculiar";
            }
        } else {
            classification = "NULL";
        }
        buttonArgs = buttonArgs + "&classification=" + classification;

        var redshift = thisWindow.find('input[name="redshift"]').val();
        fullCheck = fullCheck + !(/^([0-9]\.[0-9]{1,7}$)|$^/).test(redshift);
        buttonArgs = buttonArgs + "&redshift=" + redshift;

        var reducer = thisWindow.find('input[name="reducer"]').val();
        fullCheck = fullCheck + !(/^([A-Za-z\s]{2,40}$)|$^/).test(reducer);
        buttonArgs = buttonArgs + "&reducer=" + reducer;


        buttonArgs = "button=classify_object&" + buttonArgs + "&awfFlag=" + awfFlag + "&mwfFlag=review%20for%20followup";
        //alert(fullCheck + ", /scripts/pesstoMarshallButtons.py?" + buttonArgs);

    if(fullCheck === 0) {
        var url = "../scripts/pesstoMarshallButtons.py?" + buttonArgs;
        $.getJSON(url, function(data) {
            //alert(data.browserAlert);
        });

            pause(20);
            classificationForm.slideToggle(200);
            thisWindow.fadeOut(400);
            submitted = true;
            //location.reload();
            return true;


        } else {
            event.preventDefault();
            errorBox.css("color", "#dc322f");
            errorBox.text("there's an error in this form").show().fadeIn(300);
        }
    });
}


//EXPAND COMMENT FORM
function expand_collapse_comment_form() {
    event.preventDefault();
    var thisForm = $(this).closest('.objectTicket').find('form#objectCommentForm');
    var poid = $(this).closest('.objectTicket').attr('poid');
    var thisFormDisplay = thisForm.css('display');
    var thisColumnWrapper = $(this).closest('.objectTicket').find('.columnWrapper');
    //console.log(this);
    //IF THIS COMMENT-FORM HIDDEN
    if(thisFormDisplay == "none") {
        //HIDE ALL OTHER OPEN COMMENT FORMS
        $('form#objectCommentForm').slideUp(300);

        //MAKE THIS COMMENT-FORM SLIDEDOWN AND CHANGE EXPAND BUTTON
        thisForm.slideDown(600);

        //IF THIS COMMENT FORM NOT HIDDEN
    } else {
        //SLIDE UP COMMENT-FORM AND CHANGE EXPAND BUTTON
        thisForm.slideUp(300);
        //RESET OBJECT TICKET HEIGHT
    }
}

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

        comment = encodeURIComponent(comment)
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
