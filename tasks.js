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

function generateTasks(mode, intensity, p1, p2, coupleType) {
  saveKinkSettings();

  const allowBondage = document.getElementById('bondage').checked;
  const allowToys    = document.getElementById('toys').checked;
  const allowAnal    = document.getElementById('anal').checked;
  const allowEdging  = document.getElementById('edging').checked;
  const allowPublic  = document.getElementById('public').checked;

  const P = {
    mf: [{subj:'he', obj:'him', poss:'his'}, {subj:'she', obj:'her', poss:'her'}],
    mm: [{subj:'he', obj:'him', poss:'his'}, {subj:'he', obj:'him', poss:'his'}],
    ff: [{subj:'she', obj:'her', poss:'her'}, {subj:'she', obj:'her', poss:'her'}]
  }[coupleType || 'mf'];
  const p1p = P[0], p2p = P[1];

  const standardCommon = [
    `${p1}, slowly undress ${p2} one item at a time, kissing exposed skin as you go.`,
    `${p2}, sit on ${p1}'s lap and grind for 5 minutes — no penetration.`,
    `${p1}, blindfold ${p2} and explore ${p2p.poss} body with your mouth.`,
    allowPublic ? `${p2}, tease ${p1} somewhere with a little risk of being seen.` : null,
    `${p1}, give ${p2} a slow lap dance with roaming hands.`,
  ];
  const blitzCommon = [
    `${p1}, sit ${p2} on the edge of the bed blindfolded and tease with your mouth for 7 minutes (light only).`,
    `${p2}, straddle ${p1} and use your hips to grind ${p1p.obj} right to the edge.`,
    `${p1}, worship ${p2}'s body with your mouth from neck to thighs.`
  ];

  // Couple‑specific
  const standardMF = [
    `${p1} (male), pin ${p2} (female) against the wall and kiss ${p2p.obj} breathless.`,
    allowToys ? `${p2} (female), use a vibrator while ${p1} (male) watches from arm’s length.` : null,
  ];
  const blitzMF = [
    `${p2} (female), ride ${p1} (male)'s face for 10 minutes while holding ${p1p.poss} head in place.`,
    `${p1} (male), press ${p2} (female) against the wall and lick ${p2p.obj} out — no orgasm allowed.`
  ];
  const standardMM = [
    `${p1} (male), hold ${p2} (male) close and grind until ${p2p.subj} can’t stand still.`,
    allowBondage ? `${p2} (male), cuff ${p1} (male)'s wrists and make ${p1p.obj} beg before any touch.` : null,
  ];
  const blitzMM = [
    `${p2} (male), get on your knees and take care of ${p1} (male) with your mouth — slow, controlled.`,
    allowAnal ? `${p1} (male), tease ${p2} (male) anally with lube and patience.` : null
  ];
  const standardFF = [
    `${p1} (female), kiss the back of ${p2} (female)'s neck while your hands explore under ${p2p.poss} shirt.`,
    allowToys ? `${p2} (female), use a wand on ${p1} (female) while whispering what you want next.` : null,
  ];
  const blitzFF = [
    `${p2} (female), sit on ${p1} (female)'s face and control the pace with your thighs.`,
    `${p1} (female), hold ${p2} (female) down gently and lick ${p2p.obj} until ${p2p.subj} begs.`
  ];

  let deck = [];
  if (mode === 'standard') {
    deck = standardCommon.concat(
      coupleType === 'mm' ? standardMM :
      coupleType === 'ff' ? standardFF : standardMF
    );
  } else {
    deck = blitzCommon.concat(
      coupleType === 'mm' ? blitzMM :
      coupleType === 'ff' ? blitzFF : blitzMF
    );
  }

  if (allowBondage) deck.push(`${p2}, tie ${p1}'s hands and make ${p1p.obj} watch you touch yourself.`);
  if (allowToys) deck.push(`${p1}, use a toy on ${p2} until ${p2p.subj} can’t think straight.`);
  if (allowEdging) deck.push(`${p1}, edge ${p2} three times before letting ${p2p.obj} finish.`);
  if (allowAnal) deck.push(`${p2}, tease ${p1} anally while kissing ${p1p.obj} deeply.`);

  if (intensity === 'dirty') {
    deck.push(
      `${p1}, give ${p2} a deep, dirty kiss and use your hands freely.`,
      `${p2}, grind against ${p1} for 5 minutes without penetration.`
    );
  } else if (intensity === 'carnal') {
    if (allowEdging) deck.push(`${p1}, edge ${p2} for 10 minutes — ${p2p.subj} may not finish.`);
    deck.push(`${p2}, take control and make ${p1} beg for it.`);
    if (allowBondage) deck.push(`${p1}, bind ${p2} and use mouth, hands, and toys until ${p2p.subj} can’t speak.`);
  }

  return shuffleArray(deck.filter(Boolean));
}

window.onload = loadKinkSettings;
