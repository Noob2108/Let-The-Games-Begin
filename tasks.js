function saveKinkSettings() {
  const settings = {
    bondage: document.getElementById('bondage').checked,
    toys: document.getElementById('toys').checked,
    anal: document.getElementById('anal').checked,
    edging: document.getElementById('edging').checked,
    public: document.getElementById('public').checked
  };
  localStorage.setItem('kinkSettings', JSON.stringify(settings));
}

function loadKinkSettings() {
  const saved = JSON.parse(localStorage.getItem('kinkSettings'));
  if (saved) {
    document.getElementById('bondage').checked = saved.bondage;
    document.getElementById('toys').checked = saved.toys;
    document.getElementById('anal').checked = saved.anal;
    document.getElementById('edging').checked = saved.edging;
    document.getElementById('public').checked = saved.public;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateTasks(mode, intensity, p1, p2) {
  saveKinkSettings();

  const allowBondage = document.getElementById('bondage').checked;
  const allowToys = document.getElementById('toys').checked;
  const allowAnal = document.getElementById('anal').checked;
  const allowEdging = document.getElementById('edging').checked;
  const allowPublic = document.getElementById('public').checked;

  const standardTasks = [
    `${p1}, slowly unbutton ${p2}'s clothes one at a time, kissing exposed skin as you go.`,
    `${p2}, sit on ${p1}'s lap and grind for 5 minutes — no penetration allowed.`,
    `${p1}, blindfold ${p2} and tease every inch with your mouth.`,
    allowBondage ? `${p2}, tie ${p1}'s hands and make them watch you touch yourself.` : null,
    `${p2}, straddle ${p1} and whisper every filthy thing you want them to do.`,
    `${p1}, kiss ${p2} deeply, pinning their wrists above their head.`,
    `${p2}, make ${p1} beg before they get to touch you.`,
    allowToys ? `${p1}, use a vibrator on ${p2} until they can't think straight.` : null,
    allowPublic ? `${p2}, grind against ${p1} somewhere with the risk of being seen.` : null,
    `${p1}, give ${p2} a lap dance with your hands roaming everywhere.`,
    allowAnal ? `${p2}, tease ${p1}'s ass while you kiss them deeply.` : null
  ];

  const blitzTasks = [
    `${p1}, sit ${p2} on the edge of the bed blindfolded and slowly lick and suck — only lightly — for 7 minutes.`,
    `${p2}, ride ${p1}'s face for 10 minutes while holding their head in place.`,
    `${p1}, press ${p2} against the wall and lick them out for 7 minutes — no orgasm allowed.`,
    allowToys ? `${p2}, use a toy on ${p1}'s most sensitive spots without letting them finish.` : null,
    `${p1}, finger ${p2} slow and deep, stopping every time they moan too loud.`,
    `${p2}, straddle ${p1} and use your hips to grind them to the edge.`,
    `${p1}, worship ${p2}'s body with your mouth, moving from neck to thighs.`,
    allowBondage ? `${p2}, tie ${p1} to the bed and tease them until they beg.` : null,
    allowEdging ? `${p1}, edge ${p2} three times before letting them finish.` : null,
    allowAnal ? `${p2}, take ${p1} anally while holding their hands down.` : null
  ];

  let selected = mode === 'standard' ? standardTasks : blitzTasks;

  if (intensity === 'dirty') {
    selected.push(
      `${p1}, give ${p2} a deep, dirty kiss and use your hands freely.`,
      `${p2}, grind against ${p1} for 5 minutes without penetration.`
    );
  } else if (intensity === 'carnal') {
    if (allowEdging) selected.push(`${p1}, edge ${p2} repeatedly for 10 minutes — they’re not allowed to finish.`);
    selected.push(`${p2}, ride ${p1} until they're begging you to stop — but don’t.`);
    if (allowBondage) selected.push(`${p1}, tie ${p2} up and use your mouth, toys, and hands until they can’t speak.`);
  }

  return shuffleArray(selected.filter(task => task !== null));
}

window.onload = loadKinkSettings;
