let intervalID;
onmessage = function (e) {
  const startTimer = e.data;
  clearInterval(intervalID);
  if (startTimer) {
    intervalID = setInterval(() => {
      postMessage(null);
    }, 1000);
  }
};
