let tasks = [];
let currentTaskIndex = 0;
let player1Name = '';
let player2Name = '';
let mode = '';
let intensity = '';
let totalRounds = 10;

function startGame() {
  player1Name = document.getElementById('player1').value || 'Player 1';
  player2Name = document.getElementById('player2').value || 'Player 2';
  mode = document.getElementById('mode').value;
  intensity = document.getElementById('intensity').value;
  totalRounds = parseInt(document.getElementById('roundCount').value) || 10;
  
  tasks = generateTasks(mode, intensity, player1Name, player2Name).slice(0, totalRounds);
  
  currentTaskIndex = 0;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  showTask();
}

function showTask() {
  if (currentTaskIndex >= tasks.length) {
    document.getElementById('taskTitle').innerText = 'Game Over';
    document.getElementById('taskText').innerText = 'You have completed all tasks.';
    document.getElementById('timer').innerText = '';
    return;
  }
  const task = tasks[currentTaskIndex];
  document.getElementById('taskTitle').innerText = `Round ${currentTaskIndex + 1} of ${tasks.length}`;
  document.getElementById('taskText').innerText = task;
  startTimer(3 * 60); // 3-minute start timer
}

function nextTask() {
  currentTaskIndex++;
  showTask();
}

function startTimer(duration) {
  let timer = duration, minutes, seconds;
  const display = document.getElementById('timer');
  const interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    display.textContent = minutes + ":" + seconds;
    if (--timer < 0) {
      clearInterval(interval);
      display.textContent = "Time's up!";
    }
  }, 1000);
}
