let currentPlayer = 1; // The player whose turn it is (1 to 4)
const totalPlayers = 4;

// Function to update UI based on the current player
function updateUI() {
    // Update throw stack and deck cards
    throwStackDiv.textContent = throwStackTop || "Empty";
    topDeckDiv.textContent = deckTopCard || "Empty";

    // Update player hand and indicate if it's the player's turn
    handDivs.forEach((div, index) => {
        if (index < playerHand.length && playerHand[index]) {
            div.textContent = playerHand[index];
            div.classList.remove("inactive");
            if (currentPlayer === 1) {
                div.classList.add("active");
            } else {
                div.classList.add("inactive");
            }
        } else {
            div.textContent = "Empty";
            div.classList.remove("active");
            div.classList.add("inactive");
        }
    });

    // Show message if win
    if (isWinning) {
        actionMessage.textContent = "You WIN!";
        disableActions();
    } else {
        actionMessage.textContent = currentPlayer === 1 ? "It's your turn. Choose a card to throw." : "Waiting for the next player...";
    }
}

// Add event listeners only for the active player
handDivs.forEach((div, index) => {
    div.addEventListener("click", () => {
        if (currentPlayer === 1 && playerHand[index]) {
            throwCard(index);
        }
    });
});

// Function to move to the next player's turn
function nextTurn() {
    currentPlayer = (currentPlayer % totalPlayers) + 1; // Cycles through 1



    let currentPlayer = 1;

    const totalPlayers = 4;
    const playerDivs = document.querySelectorAll('.player');
    const cardDivs = document.querySelectorAll('.card');
    const throwStackDiv = document.getElementById('throwStack');
    const deckTopDiv = document.getElementById('deckTop');

    const playerHands = {
        1: ['♠', '♥', '♦'], // Example card values for player 1
        2: ['♣', '♠', '♥'],
        3: ['♦', '♣', '♠'],
        4: ['♥', '♦', '♣']
    };

function updateUI() {
    playerDivs.forEach((div, index) => {
        const playerNumber = index + 1;
        if (playerNumber === currentPlayer) {
            div.classList.add('active');
            displayCards(playerHands[playerNumber], div);
        } else {
            div.classList.remove('active');
            dimCards(div);
        }
    });

    throwStackDiv.textContent = "Top card: " + (throwStack.length > 0 ? throwStack[throwStack.length - 1] : "Empty");
    deckTopDiv.textContent = "Deck top: " + (deck.length > 0 ? deck[0] : "Empty");
}

function displayCards(cards, div) {
    const cardElements = div.querySelectorAll('.card');
    cards.forEach((card, index) => {
        cardElements[index].textContent = card;
        cardElements[index].classList.remove('inactive');
        cardElements[index].classList.add('active');
    });
}

function dimCards(div) {
    const cardElements = div.querySelectorAll('.card');
    cardElements.forEach(card => {
        card.textContent = "Hidden";
        card.classList.add('inactive');
    });
}

// Function to handle card picking and checking for a win
function pickCard(playerNumber) {
    if (playerNumber === currentPlayer) {
        const pickedCard = deck.shift(); // Pick the top card from the deck
        playerHands[playerNumber].push(pickedCard);
        checkWin(playerNumber); // Check if player has won after picking
        nextTurn();
    }
}

function throwCard(playerNumber, cardIndex) {
    if (playerNumber === currentPlayer) {
        const thrownCard = playerHands[playerNumber].splice(cardIndex, 1)[0];
        throwStack.push(thrownCard); // Add thrown card to throw stack
        updateUI();
    }
}

function checkWin(playerNumber) {
    // Implement win condition checks here
    const hand = playerHands[playerNumber];
    if (/* Your win conditions logic */) {
        console.log("Player " + playerNumber + " wins!");
        // Handle winning logic
    }
}

function nextTurn() {
    currentPlayer = (currentPlayer % totalPlayers) + 1;
    updateUI();
}

// Example usage
updateUI();


document.addEventListener('DOMContentLoaded', () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    // Utility function to get a random card
    function getRandomCard() {
        const randomValue = values[Math.floor(Math.random() * values.length)];
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        return `${randomValue}-${randomSuit}`;
    }

    // Function to display results in a dynamically created div
    function displayResult(message) {
        const resultDiv = document.getElementById('result');
        if (!resultDiv) {
            // Create result div if it doesn't exist
            const newResultDiv = document.createElement('div');
            newResultDiv.id = 'result';
            newResultDiv.style.border = '1px solid #ccc';
            newResultDiv.style.padding = '10px';
            newResultDiv.style.marginTop = '20px';
            newResultDiv.style.backgroundColor = '#f9f9f9';
            newResultDiv.textContent = message;
            document.body.appendChild(newResultDiv);
        } else {
            // Update existing result div
            resultDiv.textContent = message;
        }
    }

    // Handle card value form submission
    document.getElementById('valueForm').addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from refreshing the page

        const playerCard = document.getElementById('cardValue').value.trim();
        if (!values.includes(playerCard)) {
            displayResult('Invalid card value! Please enter a valid card (e.g., 2, 3, J, Q, K, A).');
            return;
        }

        const computerCard = getRandomCard();
        const computerValue = computerCard.split('-')[0];

        if (playerCard === computerValue) {
            displayResult(`You Win! Computer selected: ${computerCard}`);
        } else {
            displayResult(`Computer Wins! Computer selected: ${computerCard}`);
        }
    });

    // Handle card pair input
    document.getElementById('pairButton').addEventListener('click', () => {
        const playerCard = document.getElementById('cardPair').value.trim();
        const [playerValue, playerSuit] = playerCard.split('-');

        if (!values.includes(playerValue) || !suits.includes(playerSuit)) {
            displayResult('Invalid card pair! Format: value-suit (e.g., 7-hearts).');
            return;
        }

        const computerCard = getRandomCard();
        if (playerCard === computerCard) {
            displayResult(`You Win! Computer selected: ${computerCard}`);
        } else {
            displayResult(`Computer Wins! Computer selected: ${computerCard}`);
        }
    });

    // Handle debug button click
    document.getElementById('debug').addEventListener('click', () => {
        console.log('Debugging game state...');
        console.log('Available values:', values);
        console.log('Available suits:', suits);
        displayResult('Debug info logged in the console.');
    });
});




