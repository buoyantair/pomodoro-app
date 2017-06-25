// Pomodoro App Script, By @buoyantair (github/twitter)
var settings = document.getElementById("settings");
var trigger = document.getElementById("trigger");
var progress = document.getElementById("prog");
var notification = document.getElementById("notification");
var close_notification = document.getElementById("n-close");
var session_horn = new Audio('media/session_horn.wav');
var break_horn = new Audio('media/break_horn.wav');
var running = false;
var sessiontime = document.getElementById("sessiontime");
var breaktime = document.getElementById("breaktime");
var sessionColor = "linear-gradient(30deg, #FFF88C, transparent, #FFF88C)";
var breakColor = "linear-gradient(30deg, #d32f2f, transparent, #d32f2f)";

var dstme = document.getElementById("stime");
var dbtme = document.getElementById("btime");
notification.style.display = "none";
close_notification.addEventListener("click", function(){
    notification.style.display = "none";
})


function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function hide() {
  settings.style.display = "none";
  //trigger.style.display = "none";
}

function show() {
  settings.style.display = "flex";
  //trigger.style.display = "flex";
}

function valid() {
  if (!sessiontime.value && !breaktime.value) {
    return false;
} else if (sessiontime.value && breaktime.value) {
    return true;
  }
}

function padZero(number) {
 return (number < 10) ? ('0' + number) : number;
}

function parseToMins(secs) {
  var minutes = Math.floor(secs / 60);
  secs %= 60;
 return padZero(minutes) + ':' + padZero(secs);
}

var Round;

trigger.addEventListener("click", function(e){
    var validity = valid();
    if (!running && validity){
        trigger.classList.toggle("ion-ios-navigate-outline");
        trigger.classList.toggle("ion-ios-gear-outline");
        running = true;
        playSound(session_horn)
        hide();
        var stime = sessiontime.value * 60; // Session time in minutes
        var btime = breaktime.value * 60; // Break time in minutes
        progress.style.height = "0px";
        progress.style.background = sessionColor;
        var session = true;
        var brk = false;
        var elapsed = 0;
        Round = setInterval(function(){
            if(session && elapsed != stime && !brk){
                elapsed++;
                var h = elapsed / stime * 100 + "%";
                progress.animate([
                  {height: progress.style.height},
                  {height: h}], {
                  duration: 500
                })
                progress.style.height = h;
                dstme.innerText = "Session | Time left : " + String(parseToMins(stime-elapsed));
            }else if(session && elapsed == stime && !brk){
                progress.style.height = "0px";
                session = false;
                brk = true;
                elapsed = 0;
                dstme.innerText = "";
                progress.style.background = breakColor;
                playSound(break_horn);
            } else if(!session && brk && elapsed != btime){
                elapsed++;
                var h = elapsed / btime * 100 + "%";
                progress.animate([
                  {height: progress.style.height},
                  {height: h}], {
                  duration: 500
                })
                progress.style.height = h;

                dbtme.innerText = "Break | Time left : " + String(parseToMins(btime-elapsed));
            } else if(!session &&  brk && elapsed == btime ){
                progress.style.height = "0px";
                brk = false;
                session = true;
                elapsed = 0;
                dbtme.innerText = "";
                progress.style.background = sessionColor;
                playSound(session_horn);
            }
        }, 1000)
    } else if (!running && !validity){
        notification.style.display = "flex";
    } else if (running) {
        trigger.classList.toggle("ion-ios-navigate-outline");
        trigger.classList.toggle("ion-ios-gear-outline");
        running = false;
        dbtme.innerText = "";
        dstme.innerText = "";
        clearInterval(Round);
        show();
    }
})
