
// CONVERT SEXIGESIMAL RIGHT ASCENSION TO DECIMAL DEGREES
function ra_sex2degrees(ra){

  ra = ra.replace(/ /g, ":");
  ra = ra.replace(/h/g, ":");
  ra = ra.replace(/m/g, ":");
  ra = ra.replace(/s/g, "");
  var parts = ra.split(':');
  //var parts = dec.split(' ');

  var ra_d = parseInt(parts[0], 10)*15.0;
  var ra_m = parseInt(parts[1], 10)*15.0;
  var ra_s = parseFloat(parts[2], 10)*15.0;

  decimalDegrees = (ra_d + (ra_m / 60.0) + (ra_s / 3600.0));
  return decimalDegrees;
}


// CONVERT SEXIGESIMAL DECLINATION TO DECIMAL DEGREES
function dec_sex2degrees(dec){

  dec = dec.replace(/ /g, ":");
  dec=dec.replace(/d/g, ":");
  dec=dec.replace(/m/g, ":");
  dec=dec.replace(/s/g, "");
  var parts = dec.split(':');
  //var parts = dec.split(' ');

  if(parts[0][0] == "-"){
    var sgn = -1;
  } else {
    var sgn = 1;
  }

  var dec_d = parseInt(parts[0], 10);
  var dec_m = parseInt(parts[1], 10);
  var dec_s = parseFloat(parts[2], 10);

  dec_d = Math.abs(dec_d);
  decimalDegrees = (dec_d + (dec_m / 60.0) + (dec_s / 3600.0)) * sgn;

  return decimalDegrees;
}
