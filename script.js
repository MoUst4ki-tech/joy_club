// --- 1. GESTION DU PORTefeuille ---
let userBalance = localStorage.getItem('userBalance') 
    ? parseInt(localStorage.getItem('userBalance')) 
    : 100;

function updateDisplay() {
    const displays = document.querySelectorAll('#gold-eggs-display');
    displays.forEach(d => d.innerText = userBalance);
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

updateDisplay(); // Initialisation

// --- 2. LOGIQUE DU JEU DE DÉ ---
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
        
        setTimeout(() => {
            let res = Math.floor(Math.random() * 6) + 1;
            resDe.innerText = res;
            if (res === 6) {
                let gain = mise * 6;
                msg.innerHTML = "GAGNÉ !";
                updateBalance(gain);
                document.getElementById('popup-texte').innerText = `Tu as gagné ${gain} œufs !`;
                document.getElementById('popup-poule').classList.remove('hidden');
            } else {
                msg.innerText = "Perdu...";
            }
        }, 400);
    };
}

// --- 3. LOGIQUE DE LA ROULETTE ---
const spinBtn = document.getElementById('spin-btn');
if (spinBtn) {
    let currentBet = null;
    document.getElementById('bet-red').onclick = () => currentBet = 'red';
    document.getElementById('bet-black').onclick = () => currentBet = 'black';
    document.getElementById('bet-number-btn').onclick = () => currentBet = 'number';

    spinBtn.onclick = function() {
        let mise = parseInt(document.getElementById('bet-amount').value);
        let msg = document.getElementById('roulette-message');
        let resCir = document.getElementById('roulette-result');

        if (!currentBet || userBalance < mise) { msg.innerText = "Pari invalide !"; return; }

        updateBalance(-mise);
        resCir.innerText = "🎰";
        this.disabled = true;

        setTimeout(() => {
            this.disabled = false;
            let num = Math.floor(Math.random() * 37);
            let reds = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
            let col = num === 0 ? 'green' : (reds.includes(num) ? 'red' : 'black');

            resCir.innerText = num;
            resCir.style.backgroundColor = col === 'red' ? '#ef4444' : (col === 'black' ? '#1e293b' : '#10b981');
            resCir.style.color = "white";

            let win = false;
            if (currentBet === 'red' && col === 'red') win = true;
            else if (currentBet === 'black' && col === 'black') win = true;
            else if (currentBet === 'number' && parseInt(document.getElementById('bet-number-input').value) === num) win = true;

            if (win) {
                let gain = currentBet === 'number' ? mise * 35 : mise * 2;
                msg.innerText = `GAGNÉ ! (+${gain})`;
                updateBalance(gain);
            } else { msg.innerText = "Perdu..."; }
        }, 1000);
    };
}

window.fermerPopup = () => document.getElementById('popup-poule').classList.add('hidden');

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
