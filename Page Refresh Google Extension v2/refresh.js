document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.querySelector('.start-btn');
  const stopButton = document.querySelector('.stop-btn');
  const radioButtons = document.querySelectorAll('input[name="interval"]');
  const statusMessage = document.getElementById('status-message');
  
  let selectedInterval = 30000; // Default interval of 30 seconds
  let countdownTimer; // For the countdown display
  let refreshIntervalId; // For tracking the refresh interval

  const countdownElement = document.createElement('div');
  countdownElement.style.marginTop = '20px';
  document.body.appendChild(countdownElement);

  function startCountdown() {
    const endTime = Date.now() + selectedInterval;
    countdownTimer = setInterval(() => {
      const timeLeft = Math.round((endTime - Date.now()) / 1000);
      countdownElement.textContent = `Next refresh in: ${timeLeft} seconds`;

      if (timeLeft <= 0) {
        clearInterval(countdownTimer);
      }
    }, 1000);
  }

  radioButtons.forEach(button => {
    button.addEventListener('change', () => {
      const value = button.value;
      switch (value) {
        case '0.5':
          selectedInterval = 30000; // 30 seconds
          break;
        case '1 Minute':
          selectedInterval = 60000; // 1 minute
          break;
        case '2 Minutes':
          selectedInterval = 120000; // 2 minutes
          break;
        case '5 Minutes':
          selectedInterval = 300000; // 5 minutes
          break;
        case '10 Minutes':
          selectedInterval = 600000; // 10 minutes
          break;
      }
    });
  });

  startButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'start', interval: selectedInterval });
    statusMessage.textContent = 'Auto-refresh started';
    statusMessage.style.color = 'green';
    startCountdown();
    refreshIntervalId = setInterval(startCountdown, selectedInterval);
  });

  stopButton.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'stop' });
    statusMessage.textContent = 'Auto-refresh stopped';
    statusMessage.style.color = 'red';
    clearInterval(countdownTimer);
    clearInterval(refreshIntervalId);
    countdownElement.textContent = 'Auto-refresh stopped';
  });
});
