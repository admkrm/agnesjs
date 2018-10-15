/*
  Name: script-index.js
  Description: Scripting for Agnes, a lightweight javascript presentation framework. Scripting for the start page
  Author: Kristof Michiels
  Date: june-october 2018
*/

/*  ----------------  */
/*  |   VARIABLES  |  */
/*  ----------------  */

var myNav = document.getElementsByTagName("nav")[0];
var myNavLis = myNav.getElementsByTagName("li");
var mySections = document.getElementsByTagName("section");

/*  ------------------------ */
/*  |   SMALLER FUNCTIONS  | */
/*  ------------------------ */

var cleanMenu = function() {
    var i = 0;
    while (i < myNavLis.length) {
      myNavLis[i].className = "";
      i++;}
}

var fadeIn = function(el) {
    el.style.opacity = 0;
    var last = +new Date();
    var tick = function() {
      el.style.opacity = +el.style.opacity + (new Date() - last) / 400;
      last = +new Date();
      if (+el.style.opacity < 1) {
        (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);}
    };
    tick();
}

var getCookie = function(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var setCookie = function(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/*  --------------------- */
/*  |   styleChecker    | */
/*  --------------------- */

var styleChecker = function() {
    var sheetCookie = getCookie("sheetCookie");
    if (sheetCookie != "") {
        var stylesheet = document.getElementById("stylesheet");
        stylesheet.setAttribute("href", sheetCookie);
        console.log("Cookie '" + sheetCookie + "' has been set" );
    }
}

/*  ------------------------- */
/*  |   adaptSectionHeight  | */
/*  ------------------------- */

var adaptSectionHeight = function(factor) {
    var sectionStyle = window.getComputedStyle(mySections[0]);
    var sectionWidth = sectionStyle.width;
    var i = 0;
    while (i < mySections.length) {
      mySections[i].style.height = (Number(sectionWidth.substring(0, 3))/1.6 + "px");
      i++;}
}


/*  ------------------------- */
/*  |   prepareNavigation   | */
/*  ------------------------- */

var prepareNavigation = function() {
    var i = 0;
    myNavLis[0].className="is-checked";
    while (i < myNavLis.length) {
      myNavLis[i].onclick = function() {
          var searchString = this.getAttribute("data-filter");
          cleanMenu();
          this.className = "is-checked";
          var mySections = document.getElementsByTagName("section");
          var ii = 0;
          if (searchString === "*") {
                while (ii < mySections.length) {
                  fadeIn(mySections[ii]);
                  mySections[ii].style.display = '';
                  ii++;
                }
          } else {
                while (ii < mySections.length) {
                  if (mySections[ii].getAttribute("data-filter").indexOf(this.getAttribute("data-filter")) !== -1) {
                    fadeIn(mySections[ii]);
                    mySections[ii].style.display = '';
                  } else {
                    mySections[ii].style.display = 'none';
                  }
                  ii++;
                }
          }
      }
      i++;
    }
}

/*  ------------------------- */
/*  |   styleListActivate   | */
/*  ------------------------- */

var styleListActivate = function() {
    console.log("activated");
    var footer = document.getElementsByTagName("footer")[0];
    var myStyleLis = footer.getElementsByTagName("li");
    var i = 0;
    while (i < myStyleLis.length) {
      myStyleLis[i].onclick = function() {
          console.log("clicked");
          var sheetChangeFile = this.getAttribute("data-stylesheet");
          setCookie("sheetCookie",sheetChangeFile, 365);
          styleChecker();
      }
      i++;
    }
}

/*  ------------------------  */
/*  |   APPLICATION LOGIC  |  */
/*  ------------------------  */

window.onload = function() {
  styleChecker();
  adaptSectionHeight(1.6);
  prepareNavigation();
  styleListActivate();}

window.onresize = function() {
  adaptSectionHeight(1.6);}
