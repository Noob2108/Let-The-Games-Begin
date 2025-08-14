let tasks = [];
let currentTaskIndex = 0;
let player1Name = '';
let player2Name = '';
let mode = '';
let intensity = '';
let totalRounds = 10;
let coupleType = '';

function goToSetup() {
  coupleType = document.getElementById('coupleType').value;
  if (!coupleType) return alert('Please select a couple type');

  const nameInputsDiv = document.getElementById('nameInputs');
  if (coupleType === 'mf') {
    nameInputsDiv.innerHTML = `
      <label class="stack"><span class="label">Name (Male)</span><input id="player1" class="input" placeholder="Name (Male)" /></label>
      <label class="stack"><span class="label">Name (Female)</span><input id="player2" class="input" placeholder="Name (Female)" /></label>
    `;
  } else if (coupleType === 'mm') {
    nameInputsDiv.innerHTML = `
      <label class="stack"><span class="label">Name (Male 1)</span><input id="player1" class="input" placeholder="Name (Male 1)" /></label>
      <label class="stack"><span class="label">Name (Male 2)</span><input id="player2" class="input" placeholder="Name (Male 2)" /></label>
    `;
  } else {
    nameInputsDiv.innerHTML = `
      <label class="stack"><span class="label">Name (Female 1)</span><input id="player1" class="input" placeholder="Name (Female 1)" /></label>
      <label class="stack"><span class="label">Name (Female 2)</span><input id="player2" class="input" placeholder="Name (Female 2)" /></label>
    `;
  }

  document.getElementById('coupleTypeStep').style.display = 'none';
  document.getElementById('setup').style.display = 'block';
}

function goBack(){
  document.getElementById('setup').style.display = 'none';
  document.getElementById('coupleTypeStep').style.display = 'block';
}

function startGame() {
  player1Name = document.getElementById('player1').value || 'Player 1';
  player2Name = document.getElementById('player2').value || 'Player 2';
  mode = document.getElementById('mode').value;
  intensity = document.getElementById('intensity').value;
  totalRounds = parseInt(document.getElementById('roundCount').value) || 10;

  if (mode === 'dice') {
    // show dice UI
    document.getElementById('setup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'none';
    document.getElementById('diceArea').style.display = 'block';
    initDice(); // from dice.js
    return;
  }

  // task engine (standard / blitz)
  tasks = generateTasks(mode, intensity, player1Name, player2Name, coupleType).slice(0, totalRounds);

  currentTaskIndex = 0;
  document.getElementById('setup').style.display = 'none';
  document.getElementById('diceArea').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  showTask();
}

function showTask() {
  if (currentTaskIndex >= tasks.length) {
    document.getElementById('taskTitle').innerText = 'Session Complete';
    document.getElementById('taskText').innerText = 'You’ve finished all rounds.';
    return;
  }
  const task = tasks[currentTaskIndex];
  document.getElementById('taskTitle').innerText = `Round ${currentTaskIndex + 1} of ${tasks.length}`;
  document.getElementById('taskText').innerText = task;
}

function nextTask() {
  currentTaskIndex++;
  showTask();
}
