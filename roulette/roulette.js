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
