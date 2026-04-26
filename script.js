// --- 1. GESTION DU PORTefeuille ---
let userBalance = 100;

function updateDisplay() {
    const stored = localStorage.getItem('userBalance');
    userBalance = stored !== null ? parseInt(stored) : 100;
    document.querySelectorAll('#gold-eggs-display').forEach(d => d.innerText = userBalance);
}

function updateBalance(amount) {
    userBalance += amount;
    if (userBalance < 0) userBalance = 0;
    localStorage.setItem('userBalance', userBalance);
    updateDisplay();
}

function rechargerFonds() {
    if (userBalance < 10) {
        updateBalance(100);
        alert("La banque vous offre 100 œufs !");
    } else {
        alert("Vous avez assez d'œufs !");
    }
}

updateDisplay();
window.addEventListener('pageshow', updateDisplay);

// --- 2. LOGIQUE DU JEU DE DÉ ---

function getDiceHTML(number) {
    let dots = '';
    let colorClass = (number === 6) ? 'red' : ''; 
    const patterns = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };
    
    for (let i = 0; i < 9; i++) {
        if (patterns[number].includes(i)) {
            dots += `<div class="dot ${colorClass}"></div>`;
        } else {
            dots += `<div></div>`;
        }
    }
    return `<div class="dice-css">${dots}</div>`;
}

const btnLancerDe = document.getElementById('btn-lancer-de');
if (btnLancerDe) {
    btnLancerDe.onclick = function() {
        let mise = parseInt(document.getElementById('mise-de').value);
        let msg = document.getElementById('message-jeu');
        let resDe = document.getElementById('resultat-de');

        if (isNaN(mise) || mise <= 0 || userBalance < mise) {
            msg.innerText = "Mise impossible !"; return;
        }

        updateBalance(-mise);
        
        resDe.innerText = "🎲"; 
        resDe.classList.add("rolling");
        msg.innerText = "Le dé tourne...";
        
        setTimeout(() => {
            resDe.classList.remove("rolling");
            
            let res = Math.floor(Math.random() * 6) + 1;
            resDe.innerHTML = getDiceHTML(res);
            
            if (res === 6) {
                let gain = mise * 6;
                msg.innerHTML = "GAGNÉ !";
                updateBalance(gain);
                document.getElementById('popup-texte').innerText = `Tu as gagné ${gain} œufs !`;
                document.getElementById('popup-poule').classList.remove('hidden');
            } else {
                msg.innerText = "Perdu...";
            }
        }, 800); 
    };
}

// --- 3. LOGIQUE DE LA ROULETTE (VERSION ANIMÉE) ---
const spinBtn = document.getElementById('spin-btn');
const wheelEl = document.getElementById('real-roulette-wheel');
const ballTrack = document.getElementById('ball-track');
const resultInner = document.getElementById('roulette-result-display');
const betNumberInput = document.getElementById('bet-number-input');

if (spinBtn && wheelEl) {
    let currentBetType = null;
    let currentWheelRot = 0;
    let currentBallRot = 0;

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    const wheelOrder = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const sliceAngle = 360 / 37;

    // Initialisation de la roue visuelle
    function initWheel() {
        wheelEl.innerHTML = '';
        let gradientParts = [];
        wheelOrder.forEach((num, index) => {
            let color = '#1e293b'; // Noir
            if (num === 0) color = '#22c55e'; // Vert
            else if (redNumbers.includes(num)) color = '#ef4444'; // Rouge
            
            let startAngle = index * sliceAngle;
            let endAngle = (index + 1) * sliceAngle;
            gradientParts.push(`${color} ${startAngle}deg ${endAngle}deg`);

            let numEl = document.createElement('div');
            numEl.classList.add('wheel-number');
            numEl.innerText = num;
            let midAngle = startAngle + (sliceAngle / 2);
            numEl.style.transform = `rotate(${midAngle}deg) translateY(-110px)`;
            wheelEl.appendChild(numEl);
        });
        wheelEl.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    }
    initWheel();

    // Sélection des paris
    const clearBets = () => document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('bet-red').onclick = (e) => { clearBets(); e.target.classList.add('selected'); currentBetType = 'red'; };
    document.getElementById('bet-black').onclick = (e) => { clearBets(); e.target.classList.add('selected'); currentBetType = 'black'; };
    document.getElementById('bet-number-btn').onclick = (e) => { clearBets(); e.target.classList.add('selected'); currentBetType = 'number'; betNumberInput.focus(); };

    spinBtn.onclick = function() {
        let mise = parseInt(document.getElementById('bet-amount').value);
        let msg = document.getElementById('roulette-message');

        if (!currentBetType || isNaN(mise) || mise <= 0 || userBalance < mise) {
            msg.innerText = "Pari ou mise invalide !";
            return;
        }

        let specificNumber = null;
        if (currentBetType === 'number') {
            specificNumber = parseInt(betNumberInput.value);
            if (isNaN(specificNumber) || specificNumber < 0 || specificNumber > 36) {
                msg.innerText = "Numéro entre 0 et 36 requis."; return;
            }
        }

        // Lancement
        updateBalance(-mise);
        spinBtn.disabled = true;
        msg.innerText = "La roue tourne...";
        resultInner.innerText = "?";

        // Calcul du résultat
        const resNum = Math.floor(Math.random() * 37);
        const resCol = resNum === 0 ? 'green' : (redNumbers.includes(resNum) ? 'red' : 'black');
        const winningIndex = wheelOrder.indexOf(resNum);

        // Animation
        const targetAngle = (winningIndex * sliceAngle) + (sliceAngle / 2);
        currentWheelRot += (360 * 5) + (360 - (currentWheelRot % 360)) + (360 - targetAngle);
        currentBallRot -= (360 * 8); // La balle tourne dans l'autre sens

        wheelEl.style.transform = `rotate(${currentWheelRot}deg)`;
        ballTrack.style.transform = `rotate(${currentBallRot}deg)`;

        setTimeout(() => {
            spinBtn.disabled = false;
            resultInner.innerText = resNum;
            
            let win = false;
            if (currentBetType === 'red' && resCol === 'red') win = true;
            else if (currentBetType === 'black' && resCol === 'black') win = true;
            else if (currentBetType === 'number' && specificNumber === resNum) win = true;

            const popup = document.getElementById('popup-resultat-roulette');
            const pText = document.getElementById('popup-texte-roulette');
            const pEmoji = document.getElementById('popup-emoji');
            const pTitre = document.getElementById('popup-titre');

            if (win) {
                let gain = currentBetType === 'number' ? mise * 35 : mise * 2;
                updateBalance(gain);
                fanfareVictoire(); // Utilise le son de victoire existant
                pEmoji.innerText = "🐓💰";
                pTitre.innerText = "LE COQ EST RICHE !";
                pText.innerText = `Le numéro ${resNum} est sorti. Tu gagnes ${gain} œufs !`;
            } else {
                sonDefaite(); // Utilise le son de défaite existant
                pEmoji.innerText = "🐔💨";
                pTitre.innerText = "POULET PLUMÉ...";
                pText.innerText = `Le numéro ${resNum} est sorti. Tu as perdu ta mise.`;
            }
            popup.classList.remove('hidden');
            msg.innerText = "Faites vos jeux !";
        }, 4000);
    };
}

// --- 4. SONS DE LA COURSE ---
let audioCtx = null;
const raceAmbiance = new Audio(encodeURI('ANMLFarm_Poules et ponte (ID 0978)_LaSonotheque.fr.mp3'));
raceAmbiance.loop = true;

function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window['webkitAudioContext'])();
    return audioCtx;
}

function cluck(delaySeconds = 0) {
    const ctx = getAudioCtx();
    const t = ctx.currentTime + delaySeconds;

    // Corps du claquement : bruit blanc filtré
    const bufLen = Math.floor(ctx.sampleRate * 0.07);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(2200, t);
    bpf.frequency.exponentialRampToValueAtTime(400, t + 0.06);
    bpf.Q.value = 1.5;
    const g1 = ctx.createGain();
    g1.gain.setValueAtTime(0.35, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    noise.connect(bpf); bpf.connect(g1); g1.connect(ctx.destination);
    noise.start(t); noise.stop(t + 0.07);

    // Queue oscillante grave
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, t + 0.02);
    osc.frequency.exponentialRampToValueAtTime(280, t + 0.13);
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.12, t + 0.02);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    osc.connect(g2); g2.connect(ctx.destination);
    osc.start(t + 0.02); osc.stop(t + 0.13);
}

function pistoletDepart() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;

    // Bang de départ
    const bufLen = Math.floor(ctx.sampleRate * 0.12);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.15));
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(1.0, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    noise.connect(g); g.connect(ctx.destination);
    noise.start(t); noise.stop(t + 0.12);

    // Caquètements de départ
    for (let i = 0; i < 5; i++) cluck(0.15 + i * 0.12);
}

function stopRaceAudio() {
    raceAmbiance.pause();
    raceAmbiance.currentTime = 0;
}

function fanfareVictoire() {
    const ctx = getAudioCtx();
    [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.value = freq;
        const g = ctx.createGain();
        const t0 = ctx.currentTime + i * 0.13;
        g.gain.setValueAtTime(0, t0);
        g.gain.linearRampToValueAtTime(0.18, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t0); osc.stop(t0 + 0.25);
    });
    for (let i = 0; i < 5; i++) cluck(0.6 + i * 0.18);
}

function sonDefaite() {
    const ctx = getAudioCtx();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(420, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.55);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(t); osc.stop(t + 0.55);
    cluck(0.15);
}

// --- 5. LOGIQUE DE LA COURSE DE POULETS ---
let selectedChicken = null;

const pickBtns = document.querySelectorAll('.chicken-btn');
pickBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        selectedChicken = parseInt(this.dataset.chicken);
        pickBtns.forEach(b => b.classList.remove('selected-chicken'));
        this.classList.add('selected-chicken');
    });
});

const btnLancerCourse = document.getElementById('btn-lancer-course');
if (btnLancerCourse) {
    btnLancerCourse.onclick = function() {
        const mise = parseInt(document.getElementById('mise-course').value);
        const msg = document.getElementById('message-course');

        if (!selectedChicken) {
            msg.style.color = 'var(--danger)';
            msg.innerText = "Choisissez un poulet d'abord !";
            return;
        }
        if (isNaN(mise) || mise <= 0 || userBalance < mise) {
            msg.style.color = 'var(--danger)';
            msg.innerText = 'Mise invalide !';
            return;
        }

        updateBalance(-mise);
        btnLancerCourse.disabled = true;
        pickBtns.forEach(b => b.disabled = true);
        msg.style.color = 'var(--accent)';
        msg.innerText = 'Les poulets sont partis ! 🏃';
        pistoletDepart();
        raceAmbiance.currentTime = 0;
        raceAmbiance.play();

        for (let i = 1; i <= 4; i++) {
            const c = document.getElementById(`chicken-${i}`);
            if (c) c.style.left = '0%';
            const lane = document.getElementById(`lane-${i}`);
            if (lane) lane.classList.remove('winner-lane', 'loser-lane');
        }

        const winner = Math.floor(Math.random() * 4) + 1;

        const speeds = Array.from({ length: 4 }, () => Math.random() * 0.4 + 0.3);
        speeds[winner - 1] = 1.0;

        const positions = [0, 0, 0, 0];
        const raceInterval = setInterval(() => {
            let finished = true;
            for (let i = 0; i < 4; i++) {
                if (positions[i] < 88) {
                    finished = false;
                    positions[i] = Math.min(88, positions[i] + speeds[i]);
                    const c = document.getElementById(`chicken-${i + 1}`);
                    if (c) c.style.left = positions[i] + '%';
                }
            }
            if (finished) {
                clearInterval(raceInterval);
                terminerCourse(winner, mise);
                btnLancerCourse.disabled = false;
                pickBtns.forEach(b => b.disabled = false);
            }
        }, 30);
    };
}

function terminerCourse(winner, mise) {
    stopRaceAudio();
    const msg = document.getElementById('message-course');
    for (let i = 1; i <= 4; i++) {
        const lane = document.getElementById(`lane-${i}`);
        if (lane) lane.classList.add(i === winner ? 'winner-lane' : 'loser-lane');
    }
    if (winner === selectedChicken) {
        const gain = mise * 4;
        updateBalance(gain);
        fanfareVictoire();
        msg.style.color = 'var(--success)';
        msg.innerText = `🎉 Poulet ${winner} gagne ! +${gain} 🥚`;
        document.getElementById('popup-texte-course').innerText = `Votre poulet 🐔${winner} a gagné ! +${gain} œufs !`;
        document.getElementById('popup-course').classList.remove('hidden');
    } else {
        sonDefaite();
        msg.style.color = 'var(--danger)';
        msg.innerText = `Poulet ${winner} gagne... Perdu ! 😢`;
    }
}
