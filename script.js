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

