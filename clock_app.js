(() => {
  const brkIncBtn = document.getElementById('break-increment');
  const brkDecBtn = document.getElementById('break-decrement');
  const sesIncBtn = document.getElementById('session-increment');
  const sesDecBtn = document.getElementById('session-decrement');
  const sStopBtn = document.getElementById('start_stop');
  const resetBtn = document.getElementById('reset');

  const brkLength = document.getElementById('break-length');
  const sesLength = document.getElementById('session-length');
  const timeLeft = document.getElementById('time-left');
  const timerLabel = document.getElementById('timer-label');

  // Audio element
  const beep = document.getElementById('beep');

  let timer;
  let timerStatus = "begin";
  let isAudioPlayed = false; /* Boolean flag to check audio */
  
  let timerState = {
    isSession: true,
    minutes: parseInt(sesLength.innerText), /* Initialize with session length */
    seconds: 0,
  };

  // Set audio event listener for 'ended' event on audio element
  beep.addEventListener('ended', () => {
    isAudioPlayed = false; /* Reset audio flag when audio ends */
  });

  // Update break or session length
  const updateLength = (element, type, operation) => {
    let length = parseInt(element.innerText);
    if (type === 'break') {
      if (operation === 'decrement' && length > 1) {
        length -= 1;
      } else if (operation === 'increment' && length < 60) {
        length += 1;
      }
      element.innerText = length;
      if (!timerState.isSession && timerStatus === "begin") {
        timerState.minutes = length;
        timeLeft.innerText = formatTime(length * 60); /* Update time-left as well */
      }
    } else if (type === 'session') {
      if (operation === 'decrement' && length > 1) {
        length -= 1;
      } else if (operation === 'increment' && length < 60) {
        length += 1;
      }
      element.innerText = length;
      if (timerState.isSession && timerStatus === "begin") {
        timerState.minutes = length;
        timerState.seconds = 0;
        timeLeft.innerText = formatTime(length * 60); // Update time-left as well
      }
    }
  };

  // Attach event listeners
  brkDecBtn.addEventListener("click", () => updateLength(brkLength, 'break', 'decrement'));
  brkIncBtn.addEventListener("click", () => updateLength(brkLength, 'break', 'increment'));
  sesDecBtn.addEventListener("click", () => updateLength(sesLength, 'session', 'decrement'));
  sesIncBtn.addEventListener("click", () => updateLength(sesLength, 'session', 'increment'));

  // Handle timer countdown
  sStopBtn.addEventListener("click", () => {
    if (timerStatus === "begin" || timerStatus === "stopped") {
      // Start
      console.log("sStopBtn start");
      timerStatus = "counting";
      timer = setInterval(() => {
        timeLeft.innerText = timeDecrmnt();
      }, 1000);
    } else if (timerStatus === "counting") {
      // Stop
      console.log("sStopBtn stopped");
      timerStatus = "stopped";
      clearInterval(timer);
    }
  });

  // Reset timer
  resetBtn.addEventListener("click", () => {
    console.log("reset");
    clearInterval(timer);
    timerStatus = "begin";
    brkLength.innerText = 5;
    sesLength.innerText = 25;
    timerState = {
      isSession: true,
      minutes: 25,
      seconds: 0,
    };
    timeLeft.innerText = formatTime(timerState.minutes * 60);
    timerLabel.innerText = "Session";
    timeLeft.style.color = "";   /* Reset color */
    timerLabel.style.color = ""; /* Reset color */
    beep.pause(); /* Reset audio */
    beep.currentTime = 0; /* Reset audio to start */
    isAudioPlayed = false; /* Reset audio played flag */
  });

  // Initialize Session Timer
  const initSessionTimer = () => {
    timerLabel.innerText = "Session";
    const minutes = parseInt(sesLength.innerText); /* init minutes for session timer */
    const seconds = 0; /* Start seconds at 0 */
    timeLeft.innerText = formatTime(minutes * 60); /* Update time-left to session length */
    return {minutes, seconds};
  };
  
  // Initialize Break Timer
  const initBreakTimer = () => {
    timerLabel.innerText = "Break";
    const minutes = parseInt(brkLength.innerText); /* Init minutes for break timer */
    const seconds = 0; /* Stat seconds at 0 */
    timeLeft.innerText = formatTime(minutes * 60); /* Update time-left to break length */
    return {minutes, seconds};
  };

  // Decrement time
  const timeDecrmnt = () => {
    let {minutes, seconds, isSession} = timerState;

    seconds -= 1;

    if (seconds === -1) {
      seconds = 59;
      minutes -= 1;
    }

    if (minutes === 0 && seconds === 0) {
      clearInterval(timer);
      // Play alarm
      if (!isAudioPlayed) {
        beep.play().then(() => {
          isAudioPlayed = true; /* Set audio flag */
          // Stop beep after 2 seconds
          setTimeout(() => {
            beep.pause();
            beep.currentTime = 0; /* Reset audio to start */
            isAudioPlayed = false; /* Reset audio flag to after 2 seconds */
          }, 2000);
        }).catch((error) => {
          console.error("Audio playback failed:", error);
        });
      };

      // Trasition logic
      if (isSession) {
        timerState = {...initBreakTimer(), isSession: false};
      } else {
        timerState = {...initSessionTimer(), isSession: true};
      }

      timer = setInterval(() => {
        timeLeft.innerText = timeDecrmnt();
      }, 1000);
      return "00:00";
    }

    if (minutes < 0) {
      minutes = 0;
      seconds = 0;
    }

    // Change display color
    if (minutes === 0 && seconds <= 60) {
      timeLeft.style.color = "red";
      timerLabel.style.color = "red";
    } else {
      timeLeft.style.color = "";   /* Reset color */
      timerLabel.style.color = ""; /* Reset color */
    }

    timerState = {isSession, minutes, seconds};
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Format time string to "MM:SS"
  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  console.log("From clock app.");
})();