// Module Name: pessto_dropdowns
// Author: Dave Young
// Date created: March 13, 2013
// Summary: Functions for the dropdown menus in the pessto marshall

function sort_dropdown_link_click() {

    var







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

