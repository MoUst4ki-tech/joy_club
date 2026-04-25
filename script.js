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

// --- JEU 1 ---
function lancerJeu1() {
    let message = document.getElementById("message-jeu1");
    let resultatDe = document.getElementById("resultat-de-jeu1");

    if (userBalance <= 0) {
        message.innerHTML = "<strong>Fonds insuffisants !</strong>";
        return;
    }
    updateBalance(-1);
    let resultat = Math.floor(Math.random() * 6) + 1;
    resultatDe.innerText = "🎲";
    setTimeout(() => {
        resultatDe.innerText = resultat;

        if (resultat === 6) {
            message.innerHTML = "<strong>Bravo ! Tu as gagné 6 œufs.</strong>";
            updateBalance(6);
        } else {
            message.innerHTML = "Raté... Essaie encore !";
        }
    }, 200);
}
