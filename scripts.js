/**
 * interval identifier for setInterval in the substractOneSecond function
 */
let interval = null

const countdown = document.getElementById("countdown")
// get the current minutes and seconds from the countdown
let [initialMin, initialSec] = countdown.innerHTML.trim(' ').split(":")

/**
 * Substruct a second from the countdown element
 * 
 * @returns {void}
 * 
 * @example 01:00 -> 24:59
 */
function substractOneSecond() {
  interval = setInterval(function () {
      
    let [min, sec] = countdown.innerHTML.trim(" ").split(":");
      
    if (sec == 0) {
      if (min == 0) {
        beep("tak"); // beep when the countdown is over
        speak("Tres bien! Prends une pause!"); // speak when the countdown is over'
        // clearInterval(interval); // stop the interval
        incrementCyclesCounter(); // increment the cycles counter
        min = '00'
        sec = initialSec == '15' ? '05' : '15' // set the initial minutes and seconds
        initialSec = sec
        console.log(min, sec)
      }
      speak(`${min} minutes`) // speak the minutes);
      if (!min % 5) { 
        notifyMe(min); // notify the user every 5 minutes
      }
      if (min > 0) {
        min--; // substract one minute
        sec = 59; // set seconds to 59
      }
    }
    else { 
      sec-- // substract one second
      if (sec < 10) { 
        sec = "0" + sec // add a leading zero
      }
    }
    countdown.innerHTML = `${min}:${sec}` // update the countdown
  }, 1000)

  return interval
}

/**
 * Play a beep sound
 * 
 * @param soundName {string}
 * 
 * @returns {void}
 */
function beep(soundName) {
  let audio = new Audio(`assets/notifications/${soundName}.mp3`)
  audio.play()
}

/**
 * Speak a text
 * 
 * @param text {string}
 * @param volume {number}
 * @param lang {string}
 * 
 */
function speak(text, volume = .08, lang = 'fr-FR') { 
  var msg = new SpeechSynthesisUtterance()
  msg.volume = volume // From 0 to 1
  msg.rate = 1 // From 0.1 to 10. Rate is the speed of the speech
  msg.pitch = 2 // From 0 to 2. Pitch is the tone of the voice
  msg.text = text
  msg.lang = lang
  window.speechSynthesis.speak(msg)
}

/** 
 *  Notify the user
 * 
 * @param min {number}
 *  
 */
function notifyMe(min) {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification(`${min} minutes left ...`, {
      body: "Focus!",
      icon: "./assets/check.png",
    })
    setTimeout(() => notification.close(), 5 * 1000);
    // …
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification("Thanks", {
          body: "!!!",
          icon: "./assets/check.png",
        })
        // …
      }
    });
  }
  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them anymore.
}

/**
 * Increment the cycles counter
 */
function incrementCyclesCounter() {
  let cyclesCounter = document.getElementById("cycles-counter")
  cyclesCounter.innerHTML = parseInt(cyclesCounter.innerHTML) + 1
}

/**
 * Start or stop the pomodoro
 */
function startOrStop() { 
  let startButton = document.getElementById("start-btn")
  if (startButton.innerHTML == "START") {
    startButton.innerHTML = "STOP"
    substractOneSecond()
  }
  else {
    startButton.innerHTML = "START"
    clearInterval(interval)
  }
}