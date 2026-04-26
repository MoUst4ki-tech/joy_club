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
