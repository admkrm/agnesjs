/*
  Name: AgnesJS
  Description: Scripting for Agnes, a lightweight javascript presentation framework
  Author: Kristof Michiels
  Date: june-october 2018
*/

/*  ----------------  */
/*  |   VARIABLES  |  */
/*  ----------------  */

var allSections = document.querySelectorAll("section");
var firstBandName = allSections[0].getAttribute("data-band-name");
var i = 0;
var i2 = 0;
var i3 = 0;
var bandArray = [];
var pixelBreakPoint = 1200;

/*  -------------------  */
/*  |   1. buildGrid  |  */
/*  -------------------  */

var buildGrid = function() {
  i = 0;
  if (firstBandName === null) {
        bandArray.push(["default",allSections.length]);
        while (i < allSections.length) {
          allSections[i].setAttribute("data-band-name","default");
          allSections[i].setAttribute("data-band-id",0);
          allSections[i].setAttribute("data-band-unit",i);
          allSections[i].setAttribute("data-band-length",allSections.length);
          i++;
        }
  } else {
        var currentBand = firstBandName;
        bandArray.push([currentBand,0]);
        var bandId = 0;
        var bandUnit = 0;
        while (i < allSections.length) {
              if (currentBand !== allSections[i].getAttribute("data-band-name")) {
                    currentBand = allSections[i].getAttribute("data-band-name");
                    bandArray.push([currentBand,0]);
                    bandId++;
                    bandUnit = 0;
              }
              allSections[i].setAttribute("data-band-name",currentBand);
              allSections[i].setAttribute("data-band-id",bandId);
              allSections[i].setAttribute("data-band-unit",bandUnit);
              i++;
              bandUnit++;
              bandArray[bandId][1]++;
        }
        i = 0, i3 = 0;
        while(i < bandArray.length) {
              i2 = 1;
              while (i2 <= bandArray[i][1]) {
                    allSections[i3].setAttribute("data-band-length",bandArray[i][1]);
                    i2++;
                    i3++;
              }
              i++;
        }
  }
}

/*  -----------------------  */
/*  |   2. parseMarkdown  |  */
/*  -----------------------  */

var parseMarkdown = function() {
  marked.setOptions({
      highlight: function(code) {
        return (hljs.highlightAuto(code).value.replace(/&amp;/g, "&"));
      },
      gfm: true
  });
  if (document.querySelector("body").getAttribute("data-markdown") === "true") {
      i = 0;
      while (i < allSections.length) {
        allSections[i].innerHTML = marked(allSections[i].innerHTML.replace(/\t{4,7}/g, ""));
        i++;
      }
  }
}

/*  -------------------------  */
/*  |   3. buildNavigation  |  */
/*  -------------------------  */

var buildNavigation = function() {
  var inner = "";
  i = 0;
  while (i < bandArray.length) {
    inner += "<a href='#' class='" + ((i === 0) ? "selected":"") + "'>" + bandArray[i][0] + "</a>";
    i++;
  }
  if (bandArray.length === 1) { inner = "";}
  i = 0;
  while (i < allSections.length) {
    var menu = document.createElement("div");
    if (Number(allSections[i].getAttribute("data-band-unit")) === 0) {
        menu.innerHTML = inner + '<a id="toRight" href="#">&rarr;</a>';
    } else if (Number(allSections[i].getAttribute("data-band-unit")) === Number((allSections[i].getAttribute("data-band-length"))-1)) {
        menu.innerHTML = '<a id="toLeft" href="#">&larr;</a>' + inner;
    } else {
        menu.innerHTML = '<a id="toLeft" href="#">&larr;</a>' + inner + '<a id="toRight" href="#">&rarr;</a>';
    }
    menu.setAttribute("class","navigation");
    allSections[i].appendChild(menu);
    var pagination = document.createElement("div");
    pagination.setAttribute("class","pagination");
    pagination.innerHTML = (Number(allSections[i].getAttribute("data-band-unit"))+1) + " / " + allSections[i].getAttribute("data-band-length");
    allSections[i].appendChild(pagination);
    i++;
  }
  var navLinks = document.querySelectorAll(".navigation a");
  i = 0;
  while (i < navLinks.length) {
    navLinks[i].onclick = function() {
      pageSwitcher(this.innerHTML);
      return false;
    }
    i++;
  }
  document.onkeydown = function(e) {
        if (e.keyCode === 39 || e.keyCode === 32) {
              window.scrollBy({top: 0, left: window.innerWidth, behavior: 'smooth'});
              return false;
        }
        if (e.keyCode === 37) {
              window.scrollBy({top: 0, left: -window.innerWidth, behavior: 'smooth'});
              return false;
        }
  }
  adaptGrid(bandArray[0][1]);
}

/*  -------------------------------------  */
/*  |   4. activateHorizontalScrolling  |  */
/*  -------------------------------------  */

var activateHorizontalScrolling = function() {
  if (window.innerWidth > 1200) {scrollConverter.activate();}
}

/*  -------------------  */
/*  |   pageSwitcher  |  */
/*  -------------------  */

var pageSwitcher = function(page) {
      if (page === "←") {
        window.scrollBy({top: 0, left: -window.innerWidth, behavior: 'smooth'});
      } else if (page === "→") {
        window.scrollBy({top: 0, left: window.innerWidth, behavior: 'smooth'});
      }
      else {
        window.scrollTo({top: 0, left: 0});
        i = 0;
        var unitNumber = 0;
        while (i < allSections.length) {
          if (allSections[i].getAttribute("data-band-name") === page) {
              allSections[i].classList.remove("hidden");
              unitNumber = allSections[i].getAttribute("data-band-length");
          } else {
              allSections[i].classList.add("hidden");
          }
          i++;
        }
        var navLinks = document.querySelectorAll(".navigation a");
        i = 0;
        while (i < navLinks.length) {
          if (navLinks[i].innerHTML === page) {
            navLinks[i].className = "selected";
          } else {
            navLinks[i].className = "";
          }
          i++;
        }
        adaptGrid(unitNumber);
      }
}

/*  ----------------  */
/*  |   adaptGrid  |  */
/*  ----------------  */

var adaptGrid = function(unitNumber) {
  if (window.innerWidth > pixelBreakPoint) {
    document.querySelector("body").style.gridTemplateColumns = "repeat(" + unitNumber + ",100vw)";
  }
}

/*  ------------------------  */
/*  |   APPLICATION LOGIC  |  */
/*  ------------------------  */

buildGrid();
parseMarkdown();
buildNavigation();
activateHorizontalScrolling();
