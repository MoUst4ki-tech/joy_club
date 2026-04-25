let userBalance = 100;

function updateDisplay() {
    const display = document.getElementById('gold-eggs-display');
    if(display) {
        display.innerText = userBalance;
    }
}

function updateBalance(amount) {
    userBalance += amount;
    
    if (userBalance < 0) userBalance = 0;
    updateDisplay();
    console.log("Nouveau solde : " + userBalance);
}

let currentBetType = null;

const betRedBtn = document.getElementById('bet-red');
const betBlackBtn = document.getElementById('bet-black');
const betNumberBtn = document.getElementById('bet-number-btn');
const betNumberInput = document.getElementById('bet-number-input');

function clearSelections() {
    betRedBtn.classList.remove('selected');
    betBlackBtn.classList.remove('selected');
    betNumberBtn.classList.remove('selected');
}

betRedBtn.addEventListener('click', () => {
    clearSelections();
    betRedBtn.classList.add('selected');
    currentBetType = 'red';
});

betBlackBtn.addEventListener('click', () => {
    clearSelections();
    betBlackBtn.classList.add('selected');
    currentBetType = 'black';
});

betNumberBtn.addEventListener('click', () => {
    clearSelections();
    betNumberBtn.classList.add('selected');
    currentBetType = 'number';
    betNumberInput.focus();
});

const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

function getRouletteResult() {
    const number = Math.floor(Math.random() * 37);
    let color = 'black';
    
    if (number === 0) {
        color = 'green';
    } else if (redNumbers.includes(number)) {
        color = 'red';
    }
    
    return { number: number, color: color };
}

const spinBtn = document.getElementById('spin-btn');
const betAmountInput = document.getElementById('bet-amount');
const rouletteResult = document.getElementById('roulette-result');
const rouletteMessage = document.getElementById('roulette-message');

spinBtn.addEventListener('click', () => {
    if (!currentBetType) {
        rouletteMessage.innerText = "Veuillez choisir un type de pari !";
        return;
    }

    const betAmount = parseInt(betAmountInput.value);
    
    if (isNaN(betAmount) || betAmount <= 0) {
        rouletteMessage.innerText = "Mise invalide.";
        return;
    }

    if (betAmount > userBalance) {
        rouletteMessage.innerText = "Fonds insuffisants !";
        return;
    }

    let specificNumber = null;
    if (currentBetType === 'number') {
        specificNumber = parseInt(betNumberInput.value);
        if (isNaN(specificNumber) || specificNumber < 0 || specificNumber > 36) {
            rouletteMessage.innerText = "Choisissez un numéro entre 0 et 36.";
            return;
        }
    }

    spinBtn.disabled = true;
    rouletteMessage.innerText = "La roue tourne...";
    rouletteResult.classList.add('spin-animation');
    rouletteResult.innerText = "?";
    rouletteResult.className = 'result-display spin-animation';

    setTimeout(() => {
        rouletteResult.classList.remove('spin-animation');
        const result = getRouletteResult();
        
        rouletteResult.innerText = result.number;
        rouletteResult.classList.add(result.color);

        let winAmount = 0;

        if (currentBetType === 'red' && result.color === 'red') {
            winAmount = betAmount;
        } else if (currentBetType === 'black' && result.color === 'black') {
            winAmount = betAmount;
        } else if (currentBetType === 'number' && specificNumber === result.number) {
            winAmount = betAmount * 35;
        } else {
            winAmount = -betAmount;
        }

        updateBalance(winAmount);

        if (winAmount > 0) {
            rouletteMessage.innerText = `Gagné ! +${winAmount} 🥚`;
        } else {
            rouletteMessage.innerText = `Perdu ! ${winAmount} 🥚`;
        }

        spinBtn.disabled = false;
    }, 1000);
});
