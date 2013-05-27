// WAIT FOR WINDOW TO LOAD AND THEN ADD ALL THE EVENT LISTENERS FOR THE PAGE
window.addEventListener("load", doFirst, false);

// ADD EVENT LISTENERS


function doFirst() {
	//ANIMATE PAGE LOADING
	$('.pmTopNavBar').addClass("pmTopNavBar_slideDown");
	$('.pmLeftNavBar').addClass("pmLeftNavBar_slideIn");
	$('#bigWrapper').animate({
		opacity: 1
	}, 500);

	//ADD EVENT LISTENERS TO BUTTONS AND MENUS
	$('button#expandButton').click(expand_collapse_object_ticket);
	$('button#newCommentButton').click(expand_collapse_comment_form);
	$('form#objectCommentForm').find('button#add').click(add_object_comment);
	$('form#objectCommentForm').find('button#cancel').click(expand_collapse_comment_form);
	$('button#addClassificationButton').click(reveal_classification_form);
	$('div.moveMenuButton').click(moveObjectAndHideRow);
	$('div.alertMenuButton').click(alertObjectAndHideRow);
	$('div[id$="Hover"]').mouseover(revealDropDownMenu);
	$('div[id$="Menu"]').mouseout(hideDropDownMenu);
	$('button#createNew').click(reveal_create_new_form);
	$('input[name="sortInput"]').focus(sortFormValidation);
	$('input[name="searchInput"]').focus(searchFormValidation);


	//AJAX ERROR HANDLING
	// $(function() {
	// 	    $.ajaxSetup({
	// 	        error: function(jqXHR, exception) {
	// 	            if (jqXHR.status === 0) {
	// 	                alert('Not connect.\n Verify Network.');
	// 					alert(exception);
	// 	            } else if (jqXHR.status == 222) {
	// 		            alert('Success. [222]');
	// 		        } else if (jqXHR.status == 333) {
	// 	                alert('Fail. [333]');
	// 	            } else if (jqXHR.status == 404) {
	// 		           alert('Requested page not found. [404]');
	// 		        } else if (jqXHR.status == 500) {
	// 	                alert('Internal Server Error [500].');
	// 	            } else if (exception === 'parsererror') {
	// 	                alert('Requested JSON parse failed.');
	// 	            } else if (exception === 'timeout') {
	// 	                alert('Time out error.');
	// 	            } else if (exception === 'abort') {
	// 	                alert('Ajax request aborted.');
	// 	            } else {
	// 	                alert('Uncaught Error.\n' + jqXHR.responseText);
	// 	            }
	// 	        }
	// 	    });
	// 	});

	// jQuery AJAX Get Error Handler


	// jQuery AJAX post Error Handler



	//ADD EXPAND  IF NEEDED BY TICKET
	var allTickets = $(document).find('div.wfTableRow');
	var llimit = allTickets.length;
	for(var i = 0; i < llimit; i++) {
		//DETERMINE AUTO HEIGHT
		columnWrapper = $(allTickets[i]).find('.columnWrapper')
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

	//SHORTEN CANDIDATE NAMES
	var allNames = $(document).find('a.objectNameLink');
	var llimit = allNames.length;
	for(var i = 0; i < llimit; i++) {
		if($(allNames[i]).text().length > 20) {
			var fsize = 160 / $(allNames[i]).text().length;
			var fsize = Math.round(fsize) / 10;
			$(allNames[i]).css('font-size', fsize + 'em');
		}
	}
}



//EXPAND TICKETS


function expand_collapse_object_ticket() {
	var poid = $(this).closest('.wfTableRow').attr('poid');
	var thisColumnWrapper = $(this).closest('.wfTableRow').find('.columnWrapper');
	var thisExpandButton = $(this).closest('.wfTableRow').find('#expandButton');
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
		var autoHeight = thisColumnWrapper.height();
		thisColumnWrapper.removeAttr("style");
		var fixedHeight = thisColumnWrapper.height();
		thisColumnWrapper.height(autoHeight).animate({
			height: fixedHeight
		}, 300);
	}
}

//EXPAND COMMENT FORM


function expand_collapse_comment_form() {
	event.preventDefault();
	var thisForm = $(this).closest('.wfTableRow').find('form#objectCommentForm');
	var poid = $(this).closest('.wfTableRow').attr('poid');
	var thisFormDisplay = thisForm.css('display');
	var thisColumnWrapper = $(this).closest('.wfTableRow').find('.columnWrapper');
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


//REVEAL AN OBJECT SPECIFIC CLASSIFICATION-FORM IN A FLOATING WINDOW


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
	thisWindow.find('button[id*="classify"]').click(function() {
		event.preventDefault();
		var fullCheck = 0;
		var buttonArgs = "";
		var submitted = false;

		var pesstoObjectsId = poid;
		var buttonArgs = buttonArgs + "pesstoObjectsId=" + pesstoObjectsId;

		var objectName = thisWindow.find('div#objectName').text();
		var buttonArgs = buttonArgs + "&objectName=" + objectName;

		var source = thisWindow.find('select#source').val();
		var buttonArgs = buttonArgs + "&source=" + source;

		if($(this).attr('id') == 'justclassify') {
			awfFlag = 'archived%20without%20alert';
		}
		if($(this).attr('id') == 'classify&sendtoalertqueue') {
			awfFlag = 'queued%20for%20alert';
		}

		if(source == 'atel') {
			var atelNumber = thisWindow.find('input[name="number"]').val();
			var fullCheck = fullCheck + !(/^[0-9]{4}$/).test(atelNumber);
			var buttonArgs = buttonArgs + "&atelNumber=" + atelNumber;
			var buttonArgs = buttonArgs + "&cbetNumber=NULL";
		} else if(source == 'cbet') {
			var cbetNumber = thisWindow.find('input[name="number"]').val();
			var fullCheck = fullCheck + !(/^[0-9]{4}$/).test(cbetNumber);
			var buttonArgs = buttonArgs + "&cbetNumber=" + cbetNumber;
			var buttonArgs = buttonArgs + "&atelNumber=NULL";
		} else {
			var buttonArgs = buttonArgs + "&atelNumber=NULL";
			var buttonArgs = buttonArgs + "&cbetNumber=NULL";
		}

		var mjd = thisWindow.find('input[name="mjd"]').val();
		var fullCheck = fullCheck + !(/^[0-9\.]{5,12}$/).test(mjd);
		var buttonArgs = buttonArgs + "&mjd=" + mjd;

		var telescope = thisWindow.find('input[name="telescope"]').val();
		var fullCheck = fullCheck + !(/.{2,}$/).test(telescope);
		var buttonArgs = buttonArgs + "&telescope=" + telescope;

		var instrument = thisWindow.find('input[name="instrument"]').val();
		var fullCheck = fullCheck + !(/.{2,}$/).test(instrument);
		var buttonArgs = buttonArgs + "&instrument=" + instrument;

		var type = thisWindow.find('select#type').val();
		var buttonArgs = buttonArgs + "&type=" + type;

		if(type == 'supernova') {
			var classification = thisWindow.find('select#classification').val();
			if(thisWindow.find('input#peculiar').is(':checked')) {
				classification = classification + " peculiar";
			}
		} else {
			var classification = "NULL";
		}
		var buttonArgs = buttonArgs + "&classification=" + classification;

		var redshift = thisWindow.find('input[name="redshift"]').val();
		var fullCheck = fullCheck + !(/^([0-9]\.[0-9]{1,7}$)|$^/).test(redshift);
		var buttonArgs = buttonArgs + "&redshift=" + redshift;

		var reducer = thisWindow.find('input[name="reducer"]').val();
		var fullCheck = fullCheck + !(/^([A-Za-z\s]{2,40}$)|$^/).test(reducer);
		var buttonArgs = buttonArgs + "&reducer=" + reducer;


		var buttonArgs = "button=classify_object&" + buttonArgs + "&awfFlag=" + awfFlag + "&mwfFlag=review%20for%20followup";
		//alert(fullCheck + ", /scripts/pesstoMarshallButtons.py?" + buttonArgs);

  	if(fullCheck == 0) {
  		var url = "../scripts/pesstoMarshallButtons.py?" + buttonArgs;
  		$.getJSON(url, function(data) {
  			//alert(data.browserAlert);
  		});

			pause(20);
			classificationForm.slideToggle(200);
			thisWindow.fadeOut(400);
			var submitted = true;
			//location.reload();
			return true;


		} else {
			event.preventDefault();
			errorBox.css("color", "#dc322f");
			errorBox.text("there's an error in this form").show().fadeIn(300);
		}
	});
}

//CANCEL FLOATING WINDOW


function clear_form_and_return() {
	event.preventDefault();

	var form = $(this).closest('form');
	thisWindow = $(this).closest('.floatingFormWindow');

	var inputs = form.find('input');

	//FADEOUT AND SLIDEUP
	form.slideToggle(200);
	thisWindow.fadeOut(400);
}


//REVEAL THE CREATE NEW OBJECT FORM IN A FLOATING WINDOW


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
			thisValue = thisWindow.find('input[name="objectName"]').val();
			check_form_input(/\w{6,100}/, $(this), thisValue, errorBox, 'object name must be 6 characters or longer');
		});
	});

	thisWindow.find('input[name="survey"]').focus(function() {
		$(this).bind("keyup change", function() {
			thisValue = thisWindow.find('input[name="survey"]').val();
			check_form_input(/\w{3,20}/, $(this), thisValue, errorBox, 'survey name must be 3 characters or longer');
		});
	});

	thisWindow.find('input[name="objectUrl"]').focus(function() {
		$(this).bind("keyup change", function() {
			thisValue = thisWindow.find('input[name="objectUrl"]').val();
			//check_form_input(/(^([h][t][t][p][s]?[\:][\/][\/][\w\.]{5,}))|$^/, $(this), thisValue, errorBox, 'please enter a valid source url for the object');
			var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
			check_form_input(expression, $(this), thisValue, errorBox, 'please enter a valid source url for the object');
		});
	});

	thisWindow.find('input[name="objectImageUrl"]').focus(function() {
		$(this).bind("keyup change", function() {
			thisValue = thisWindow.find('input[name="objectImageUrl"]').val();
			var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
			check_form_input(expression, $(this), thisValue, errorBox, 'please enter a valid url for an image of the object');
		});
	});

	thisWindow.find('input[name="ra"]').focus(function() {
		$(this).bind("keyup change", function() {
			thisValue = thisWindow.find('input[name="ra"]').val();
			if((thisValue < 360.) & (thisValue > 0.)) {
				check_form_input(/^\+?\d{1,3}\.\d{1,}$/, $(this), thisValue, errorBox, 'please enter RA in degrees or sexagesimal format');
			} else {
				check_form_input(/^\+?([0-9]|([0-1][0-9])|([2][0-3]))(:| )[0-5][0-9](:| )[0-5][0-9]((\.\d{1,})?)$/, $(this), thisValue, errorBox, 'RA in degrees or sexagesimal format');
			}
		});

		$(this).bind("blur", function() {
			ra = thisWindow.find('input[name="ra"]')
			thisValue = ra.val();
			if(/^\+?([0-9]|([0-1][0-9])|([2][0-3]))(:| )[0-5][0-9](:| )[0-5][0-9]((\.\d{1,})?)$/.test(thisValue)){
				ra.val(ra_sex2degrees(thisValue));
			}
		});
	});

	thisWindow.find('input[name="dec"]').focus(function() {
		$(this).bind("keyup change", function() {
			thisValue = thisWindow.find('input[name="dec"]').val();
			if((thisValue < 90.0) & (thisValue > -90.0)) {
				check_form_input(/^[\-\+]?\d{1,3}\.\d{1,}$/, $(this), thisValue, errorBox, 'please enter DEC in degrees or sexagesimal format');
			} else {
				check_form_input(/^([\+\-]?([0-9]|[0-8][0-9]))(:| )[0-5][0-9](:| )[0-5][0-9](\.\d{1,})?$/, $(this), thisValue, errorBox, 'DEC in degrees or sexagesimal format');
			}
		});

		$(this).bind("blur", function() {
			dec = thisWindow.find('input[name="dec"]')
			thisValue = dec.val();
			if(/^([\+\-]?([0-9]|[0-8][0-9]))(:| )[0-5][0-9](:| )[0-5][0-9](\.\d{1,})?$/.test(thisValue)){
				dec.val(dec_sex2degrees(thisValue));
			}
		});

	});

	thisWindow.find('input[name="discoveryMag"]').focus(function() {
		$(this).bind("keyup change", function() {
			thisValue = thisWindow.find('input[name="discoveryMag"]').val();
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
		var fullCheck = fullCheck + !(/\w{6,100}/).test(objectName);
		var buttonArgs = buttonArgs + "objectName=" + objectName;

		var survey = thisWindow.find('input[name="survey"]').val();
		var fullCheck = fullCheck + !(/\w{3,20}/).test(survey);
		var buttonArgs = buttonArgs + "&survey=" + survey;

		var objectUrl = thisWindow.find('input[name="objectUrl"]').val();
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
		var fullCheck = fullCheck + !(expression).test(objectUrl);
		if(objectUrl.length == 0) {
			objectUrl = "NULL";
		}
		var buttonArgs = buttonArgs + "&objectUrl=" + objectUrl;

		var objectImageUrl = thisWindow.find('input[name="objectImageUrl"]').val();
		var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?|$^/gi;
		var fullCheck = fullCheck + !(expression).test(objectImageUrl);
		if(objectImageUrl.length == 0) {
			objectImageUrl = "NULL";
		}
		var buttonArgs = buttonArgs + "&objectImageUrl=" + objectImageUrl;

		// CHECK RA IS IN THE CORRECT FORMAT
		var ra = thisWindow.find('input[name="ra"]').val();
		if((ra > 360) | (ra < 0)) {
			fullCheck = fullCheck + 1;
		}
		var fullCheck = fullCheck + !(/^\d{1,3}\.\d{1,}/).test(ra);
		var buttonArgs = buttonArgs + "&ra=" + ra;

		// CHECK DEC IS IN THE CORRECT FORMAT
		var dec = thisWindow.find('input[name="dec"]').val();
		if((dec > 90) | (dec < -90)) {
			fullCheck = fullCheck + 1;
		}
		var fullCheck = fullCheck + !(/^[\-\+]?\d{1,3}\.\d{1,}/).test(dec);
		var buttonArgs = buttonArgs + "&dec=" + dec;

		var discoveryMag = thisWindow.find('input[name="discoveryMag"]').val();
		var fullCheck = fullCheck + !(/^\d{1,2}\.\d{1,3}/).test(discoveryMag);
		var buttonArgs = buttonArgs + "&discoveryMag=" + discoveryMag;

		var discoveryFilter = thisWindow.find('input[name="discoveryFilter"]').val();
		var fullCheck = fullCheck + !(/^\w{1,7}/).test(discoveryFilter);
		var buttonArgs = buttonArgs + "&discoveryFilter=" + discoveryFilter;

		var mjd = thisWindow.find('input[name="mjd"]').val();
		var fullCheck = fullCheck + !(/^[0-9\.]{5,12}$/).test(mjd);
		var buttonArgs = buttonArgs + "&mjd=" + mjd;

		var suggestedType = thisWindow.find('select#suggestedType').val();
		var buttonArgs = buttonArgs + "&suggestedType=" + suggestedType;
		var hostRedshift = thisWindow.find('input[name="hostRedshift"]').val();
		var buttonArgs = buttonArgs + "&hostRedshift=" + hostRedshift;
		if(suggestedType != 'variable star') {
			var fullCheck = fullCheck + !(/^([0-9]\.[0-9]{1,5}$)|$^/).test(hostRedshift);
		}

		var createdBy = thisWindow.find('input[name="createdBy"]').val();
		var fullCheck = fullCheck + !(/^.{2,50}/).test(createdBy);
		var buttonArgs = buttonArgs + "&createdBy=" + createdBy;

		var buttonArgs = "button=create_new_ticket&" + buttonArgs;
		//alert(fullCheck+", pesstoMarshallButtons.py?"+buttonArgs);
		if(fullCheck == 0) {
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


//CENTER AN OBJECT IN A FLOATING WINDOW OVER THE HTML PAGE


function center(element) {
	element.css("position", "fixed");
	element.css("top", "50px");
	element.css("left", Math.max(0, (($(window).width() - element.outerWidth()) / 2) + $(window).scrollLeft()) + "px");
}


//VALIDATION AND SUBMISSION OF COMMENT-FORM


function add_object_comment() {
	event.preventDefault();

	var row = $(this).closest(".wfTableRow");
	var poid = row.attr("poid");
	var commentHeader = row.find('#commentsHeader');
	var thisForm = $(this).closest("form");

	var author = thisForm.find('input[name*="author"]').val();
	var comment = thisForm.find('input[name*="comment"]').val();

	if(author.length <= 3) {
		thisForm.find('#commentError').text("Author's name must be longer than 3 characters long.").show().fadeOut(5000);
		return false;
	} else if(comment == "") {
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


function hideRow(id, mwfFlag) {
	// document.getElementById(id).style.visibility = "hidden";
	document.getElementById(id).className = "wfTableRow_hide";

	jQuery.ajax({
		type: "POST",
		url: "../scripts/btnx_change_mwf_flag.py?pesstoObjectsId=" + id + "&mwfFlag=" + mwfFlag
	});

}


function sortFormValidation() {

	$(this).keypress(function(event) {
		if(event.keyCode == 10 || event.keyCode == 13) {
			event.preventDefault();
		}
	});

	var options = ['peak abs mag', 'peak absolute magnitude', 'abs mag', 'absolute magnitude', 'z', 'distance', 'mpc', 'redshift', 'magnitude', 'mag', 'apparent magnitude', 'app mag', 'classification', 'class', 'spectral type', 'type', 'prediction', 'dec', 'ra', 'id', 'name', 'object id', 'identity', 'mjd', 'obs date', 'obsdate', 'last observed', 'recent obs', 'recent observation'];
	thisInput = $(this);

	defaultBackground = thisInput.css('background-color');
	defaultColour = thisInput.css('color');

	$(this).bind("keyup change", function() {

		match = 0;
		sortValue = thisInput.val();
		for(var i = 0; i < options.length; i++) {
			if(sortValue == options[i]) {
				match = 1;
			}
		}

		if(sortValue.length == 0) {
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
			if((event.keyCode == 10 || event.keyCode == 13) && match == 1) {
				var thisUrl = $(location).attr('href');
				regExp = /(sortBy).*(&)/g;
				regExp2 = /(sortBy)/g;
				regExp3 = /(index.py)$/;

				if(regExp.test(thisUrl)) {
					var newUrl = thisUrl.replace(regExp, 'sortBy=' + sortValue + '&');
					window.location.href = newUrl;
				} else if(regExp2.test(thisUrl)) {
					var newUrl = thisUrl.replace(/(sortBy).*/, 'sortBy=' + sortValue);
					window.location.href = newUrl;
				} else if(regExp3.test(thisUrl)) {
					var newUrl = thisUrl + '?bi=inbox&sortBy=' + sortValue;
					window.location.href = newUrl;
				} else {
					var newUrl = thisUrl + '&sortBy=' + sortValue;
					window.location.href = newUrl;
				}
			}
		});
	});
}


function searchFormValidation() {

	$(this).keypress(function(event) {
		if(event.keyCode == 10 || event.keyCode == 13) {
			event.preventDefault();
		}
	});

	thisInput = $(this);

	thisInput.keyup(function(event) {
		if((event.keyCode == 10 || event.keyCode == 13)) {
			searchValue = thisInput.val();
			var thisUrl = window.location.pathname;
			var newUrl = thisUrl + '?bi=all&search=' + searchValue;
			window.location.href = newUrl;
		}
	});
}



// ----------------------- BUTTON TRIGGERS - MOVE TICKETS ------------------------ //
// ------------------------------------------------------------------------------- //


function moveObjectAndHideRow(mwfFlag) {
	var row = $(this).closest(".wfTableRow");
	var poid = row.attr("poid");
	var mwfFlag = $(this).attr('mwfFlag');

	$(row).animate({
		opacity: 0.25
	}, 150);
	$(row).delay(600).slideUp(300);


	jQuery.ajax({
		type: "POST",
		url: "../scripts/pesstoMarshallButtons.py?button=change_mwf_flag&pesstoObjectsId=" + poid + "&mwfFlag=" + mwfFlag
	});
}

function alertObjectAndHideRow() {

	var row = $(this).closest(".wfTableRow");
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


// ----------------------- BUTTON REVEAL/HIDES ------------------------------ //
// -------------------------------------------------------------------------- //


function revealDropDownMenu() {
	//alert('here');
	row = $(this).closest('div[id$="Menu"]');
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
		row = $(this).closest('div[id$="Menu"]');
		var buttons = row.find('div[class$="MenuButton"]');

		for(var i = 0; i < buttons.length; i++) {
			$(buttons[i]).slideUp(300);
		}
	}
}


// ----------------------- GENERIC HELPER FUNCTIONS ------------------------ //
// -------------------------------------------------------------------------- //

// ----- PAUSE FUNCTION ----- //
// -------------------------- //


function pause(millis) {
	var date = new Date();
	var curDate = null;

	do {
		curDate = new Date();
	}
	while (curDate - date < millis);
}


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
		if(errorDiv != null) {
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

// // ENCODE A URL
// function encode_url(url) {
// 	var regex = /[^0-9a-zA-Z]/g;  // THE NON ALPHA NUMERIC CHARACTERS
// 	url = url.replace(regex, function (url) {
//     	var d = url.charCodeAt(0);
//     	return (d < 16 ? '%0' : '%') + d.toString(16);
//     }
//     return url;
// }

