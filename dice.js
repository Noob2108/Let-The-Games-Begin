// --- Dirty Dice integration for Carnal Protocol (no voice, HUD-styled) ---

// Simple show/hide helpers just for the dice area
function diceShow(id){ document.getElementById(id).classList.remove('hidden'); }
function diceHide(id){ document.getElementById(id).classList.add('hidden'); }
function diceOnly(showId){
  ['diceForeplay','diceKama'].forEach(id => id === showId ? diceShow(id) : diceHide(id));
}

function initDice(){
  // Wire submenu buttons
  const toF = document.getElementById('diceToForeplay');
  const toK = document.getElementById('diceToKama');
  const back = document.getElementById('diceBack');
  toF.onclick = ()=> diceOnly('diceForeplay');
  toK.onclick = ()=> diceOnly('diceKama');
  back.onclick = ()=> {
    // go back to setup
    document.getElementById('diceArea').style.display = 'none';
    document.getElementById('setup').style.display = 'block';
  };

  // Default to Foreplay on entry
  diceOnly('diceForeplay');

  // Foreplay editor & roll
  setupForeplay();
  wireForeplay();

  // Kamasutra roll
  wireKamasutra();
}

/* ---------- Dice rendering ---------- */
function renderDie(el, val){
  el.innerHTML = '';
  el.classList.remove('roll-anim');
  void el.offsetWidth; // reflow to restart animation
  el.classList.add('roll-anim');
  const spots = {
    1:[[50,50]],
    2:[[25,25],[75,75]],
    3:[[25,25],[50,50],[75,75]],
    4:[[25,25],[75,25],[25,75],[75,75]],
    5:[[25,25],[75,25],[50,50],[25,75],[75,75]],
    6:[[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]]
  };
  const p = spots[val] || [];
  p.forEach(([x,y])=>{
    const d = document.createElement('div');
    d.className='pip';
    d.style.left = `calc(${x}% - 6px)`;
    d.style.top  = `calc(${y}% - 6px)`;
    el.appendChild(d);
  });
}

/* ---------- No-repeat cycle helper (if needed later) ---------- */
function makeCycler(list){
  let pool = list.slice();
  let last = null;
  return function next(){
    if(pool.length===0) pool = list.slice();
    let choice;
    for(let i=0;i<10;i++){
      choice = pool[Math.floor(Math.random()*pool.length)];
      if(choice !== last) break;
    }
    pool.splice(pool.indexOf(choice),1);
    last = choice;
    return choice;
  }
}

/* ---------- Dirty Dice: Foreplay (editable 2–12) ---------- */
const ddFRollBtn = document.getElementById('ddFRoll');
const ddFTask = document.getElementById('ddFTask');
const ddFLabel = document.getElementById('ddFLabel');
const dieA = document.getElementById('dieA');
const dieB = document.getElementById('dieB');

const defaultForeplay = {
  2: "Sit them on a chair, straddle their lap, and grind slowly while kissing deeply for 3 minutes.",
  3: "Blindfold them and drag your tongue from collarbone to ear; whisper exactly what you want to do next.",
  4: "Kiss and tease their nipples for 2 minutes; keep your other hand hovering just above their underwear.",
  5: "Pull underwear aside and blow warm air over their hottest spot before one slow lick. Repeat — short teases only.",
  6: "Lick and suck their inner thighs for 3 minutes, alternating sides, never touching center.",
  7: "Pin them and kiss from neck to hips, stopping just before their favorite spot every time.",
  8: "Trace circles over their nipples with your tongue, then trail kisses down the stomach — stop before going further.",
  9: "Have them lie flat; hover your lips over theirs without fully kissing for 30 seconds, then kiss hard.",
  10:"Suck their fingers one by one, slow and filthy, with steady eye contact.",
  11:"Press them against a wall, grind lightly, and whisper the dirtiest thing you can think of.",
  12:"Lay them back, sit over their thighs, and give a slow, teasing lap dance — no touching allowed."
};

function loadForeplay(){
  try{
    const s = localStorage.getItem('cp_dd_foreplay');
    if(!s) return {...defaultForeplay};
    const obj = JSON.parse(s);
    return {...defaultForeplay, ...obj};
  }catch(e){ return {...defaultForeplay}; }
}
function saveForeplay(map){ localStorage.setItem('cp_dd_foreplay', JSON.stringify(map)); }
function resetForeplay(){
  localStorage.removeItem('cp_dd_foreplay');
  foreplayMap = loadForeplay(); setupForeplayEditor();
}

let foreplayMap = loadForeplay();
function setupForeplay(){
  setupForeplayEditor();
}
function wireForeplay(){
  document.getElementById('editForeplay').onclick = ()=> document.getElementById('editorWrap').classList.remove('hidden');
  document.getElementById('cancelForeplay').onclick = ()=> document.getElementById('editorWrap').classList.add('hidden');
  document.getElementById('resetForeplay').onclick = ()=> { resetForeplay(); ddFTask.textContent=''; ddFLabel.textContent='Reset complete.'; };
  document.getElementById('saveForeplay').onclick = ()=>{
    const ta = document.getElementById('editorGrid').querySelectorAll('textarea');
    ta.forEach(el => { foreplayMap[parseInt(el.dataset.total,10)] = el.value.trim(); });
    saveForeplay(foreplayMap);
    document.getElementById('editorWrap').classList.add('hidden');
    ddFLabel.textContent = 'Saved.';
  };
  ddFRollBtn.onclick = ()=>{
    const a = 1 + Math.floor(Math.random()*6);
    const b = 1 + Math.floor(Math.random()*6);
    renderDie(dieA, a); renderDie(dieB, b);
    const total = a + b;
    ddFLabel.textContent = `Roll: ${a} + ${b} = ${total}`;
    const task = foreplayMap[total] || "Freestyle: combine two foreplay actions of your choice for 2–3 minutes.";
    ddFTask.textContent = task;
  };
}

function setupForeplayEditor(){
  const editorGrid = document.getElementById('editorGrid');
  editorGrid.innerHTML = '';
  for(let t=2;t<=12;t++){
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerHTML = `<div class="sub" style="margin-bottom:6px">Dice Total: <b>${t}</b></div>
      <textarea rows="4" data-total="${t}">${foreplayMap[t]||''}</textarea>`;
    editorGrid.appendChild(cell);
  }
}

/* ---------- Dirty Dice: Kamasutra (safe silhouettes) ---------- */
const ddKRollBtn = document.getElementById('ddKRoll');
const ddKTask = document.getElementById('ddKTask');
const ddKLabel = document.getElementById('ddKLabel');
const kamaImg = document.getElementById('kamaImg');
const dieKA = document.getElementById('dieKA');
const dieKB = document.getElementById('dieKB');

const SVG = (name, path) =>
  `data:image/svg+xml;utf8,` +
  encodeURIComponent(`<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#c53eff"/><stop offset="1" stop-color="#00e7ff"/>
      </linearGradient>
    </defs>
    <rect width="320" height="240" fill="#0d1222"/>
    <g fill="url(#g)" opacity="0.9">
      ${path}
    </g>
    <text x="16" y="220" fill="#dbe6ff" font-family="sans-serif" font-size="18">${name}</text>
  </svg>`);

const KAMA_IMAGES = {
  "Missionary": SVG("Missionary", `<path d="M40,160 q40,-60 100,-60 q60,0 100,60 l-20,10 q-40,-40 -80,-40 q-40,0 -80,40z"/><circle cx="110" cy="90" r="18"/>`),
  "Cowgirl": SVG("Cowgirl", `<path d="M160,80 q40,20 40,60 q0,40 -40,60 q-40,-20 -40,-60 q0,-40 40,-60z"/><circle cx="160" cy="70" r="16"/><path d="M80,170 q40,-30 80,-30 q40,0 80,30" />`),
  "Reverse Cowgirl": SVG("Reverse Cowgirl", `<path d="M160,86 q38,20 38,56 q0,36 -38,56 q-38,-20 -38,-56 q0,-36 38,-56z"/><circle cx="160" cy="78" r="14"/><path d="M70,176 q45,-35 90,-35 q45,0 90,35" />`),
  "Doggy Style": SVG("Doggy Style", `<path d="M60,160 h60 l20,-30 h60 l20,30 h40" /><circle cx="80" cy="140" r="12"/><circle cx="240" cy="140" r="12"/>`),
  "Lotus": SVG("Lotus", `<path d="M160,120 q50,10 70,60 q-40,20 -70,20 q-30,0 -70,-20 q20,-50 70,-60z"/><circle cx="160" cy="110" r="16"/>`),
  "Standing": SVG("Standing", `<rect x="140" y="80" width="40" height="90" rx="10"/><circle cx="160" cy="70" r="14"/><path d="M140,170 q20,10 40,0" />`),
  "Spooning": SVG("Spooning", `<path d="M80,150 q40,-30 80,-30 q40,0 80,30 q-40,30 -80,30 q-40,0 -80,-30z"/><circle cx="90" cy="140" r="12"/><circle cx="230" cy="140" r="12"/>`),
  "Bridge": SVG("Bridge", `<path d="M60,170 q50,-70 100,-70 q50,0 100,70" /><circle cx="160" cy="92" r="12"/>`),
  "Butterfly": SVG("Butterfly", `<path d="M100,110 q40,-40 80,0 q-40,40 -80,0z"/><path d="M60,150 q40,30 100,30 q60,0 100,-30" />`),
  "Pretzel": SVG("Pretzel", `<path d="M120,150 q-30,-40 10,-60 q40,-20 60,10 q20,30 -10,60 q-30,30 -60,-10z"/>`),
  "69": SVG("69", `<path d="M120,110 a30,30 0 1,1 0,60 a30,30 0 1,1 0,-60z M200,110 a30,30 0 1,0 0,60 a30,30 0 1,0 0,-60z"/>`)
};

const KAMA_TABLE = { 2:"Missionary",3:"Cowgirl",4:"Reverse Cowgirl",5:"Doggy Style",6:"Lotus",7:"Standing",8:"Spooning",9:"Bridge",10:"Butterfly",11:"Pretzel",12:"69" };
let kamaLast = null;

function wireKamasutra(){
  const roll = ()=>{
    const a = 1 + Math.floor(Math.random()*6);
    const b = 1 + Math.floor(Math.random()*6);
    renderDie(dieKA, a); renderDie(dieKB, b);
    const total = a + b;
    let pos = KAMA_TABLE[total];
    if(pos === kamaLast){
      const alts = Object.values(KAMA_TABLE).filter(n => n !== kamaLast);
      pos = alts[Math.floor(Math.random()*alts.length)];
    }
    kamaLast = pos;
    ddKLabel.textContent = `Roll: ${a} + ${b} = ${total}`;
    ddKTask.textContent = `Position: ${pos}`;
    kamaImg.src = KAMA_IMAGES[pos] || KAMA_IMAGES["Missionary"];
  };
  document.getElementById('ddKRoll').onclick = roll;
  }
