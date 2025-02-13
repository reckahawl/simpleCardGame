const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];



/*
document.addEventListener('DOMContentLoaded',()=>{
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    let Player = {
        postion: 1,
        cardValues: [],
        cardSuits: [],
        play:true
    }
    // Utility function to get a random card
    function getRandomCard() {
        const randomValue = values[Math.floor(Math.random() * values.length)];
        const randomSuit = suits[Math.floor(Math.random() * suits.length)];
        return `${randomValue}-${randomSuit}`;
    }
    Player.win = true;
    console.log(Player.win)
    
    function print(text){
        dbg = document.getElementById('debug');
        dbg.textContent = text;
        document.body.appendChild(dbg);
    }
    let db = getRandomCard()

    function Win(card, d){
        if (card == d) print(`You win by selecting ${card}`);
        else print('You lost');
    }
    Win(db,db);
})

   
const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let players = [[],[],[],[]]
let currentPlayer =0;

function createDeck(){
    deck = [];

    for(let suit of suits){
        for(let value of values){
            deck.push({suit:value});
        }
    }

    deck.sort(()=>Math.random() -0.5)
}

function dealCards(){
    for(let i=0;i<players.length;i++){
        players[i]=deck.splice(0,(i===0?4:3));
        displayPlayerCards(i);
    }
}

function displayPlayerCards(playerIndex){
    const playerDiv=document.getElementById(`player${playerIndex+1};`)
    playerDiv.innerHTML = players[playerIndex].map(card=>`${card.value} of ${card.suit}`).join('<br>');
}

function checkWinConditios(){
    const playerCards = players[currentPlayer];
    const valueCount = {};
    
    playerCards.forEach(card=>{
        valueCount[card.value]=(valueCount[card.value] || 0)+1;
    });

    const counts = Object.values(valueCount);

    if(counts.includes(3)) return true;

    if(counts.includes(2) && counts.filter(count => count === 2).length === 2) return true;

    if(['A','K','4','7'].every(val => valueCount[val])) return true;

    return false;
}
[
    '\u2660',
     '\u2665',
      '\u2666',
       '\u2663'
    ]

[
  "♠",
  "♥",
  "♦",
  "♣"
]

function startGame(){
    createDeck();
    dealCards();
}

document.getElementById('actionButton').addEventListener('click',()=>{
    if(checkWinConditios()){
        alert(`Player ${currentPlayer+1} wins!`);
        return;
    }

    currentPlayer = (currentPlayer+1)%players.length;
});

startGame();


let card = {
    name: 'ace',
    value: 'A',
    number: 50,
    suiteSymbols : ['\u2660', '\u2665', '\u2666', '\u2663'],
}


let lawrence = {
    name : 'Lawrence',
    age:22,
    greet:function (nam , age){
        //alert(`Hello ${nam}`);
        console.log(this.name);
    }
}

for(let i=1; i<card.suiteSymbols.length; i++){
    lawrence.greet(card.suiteSymbols[i], 10);
}


function createMap(array1, array2) {
    const map = new Map();
    array1.forEach((item, index) => {
        map.set(item, array2[index]);
    });
    return map;
}

const unicodeArray = ['\u2660', '\u2665', '\u2666', '\u2663'];
const symbolArray = ['♠', '♥', '♦', '♣'];

const suiteMap = createMap(unicodeArray, symbolArray);

console.log(suiteMap.get('\u2660')); // Output: ♠


class Queue {
    constructor() {
        this.items = [];
    }

    enqueue(item) {
        this.items.push(item); // Add to the end
    }

    dequeue() {
        return this.items.shift(); // Remove from the front
    }

    peek() {
        return this.items[0]; // Check the next player
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

class Stack {
    constructor() {
        this.items = [];
    }

    push(item) {
        this.items.push(item); // Add to the top
    }

    pop() {
        return this.items.pop(); // Remove from the top
    }

    peek() {
        return this.items[this.items.length - 1]; // View the top card
    }

    size() {
        return this.items.length;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

class Table {
    constructor(id, winningRule) {
        this.id = id;
        this.winningRule = winningRule;
        this.playerQueue = new Queue();
        this.deck = [];
        this.throwStack = new Stack();
        this.history = []; // To store game actions
    }

    addPlayer(player) {
        this.playerQueue.enqueue(player);
    }

    initializeDeck(deck) {
        this.deck = deck;
    }

    recordAction(action) {
        this.history.push(action);
    }

    isWin(player) {
        return this.winningRule(player.hand);
    }
}

function playTurn(table) {
    const currentPlayer = table.playerQueue.dequeue(); // Get the next player
    console.log(`--- ${currentPlayer.name}'s Turn ---`);

    const deckCard = table.deck.pop();
    const throwCard = table.throwStack.pop();

    console.log(`${currentPlayer.name} picked ${deckCard} and ${throwCard}`);

    // Simulate decision-making
    const cardToThrow = Math.random() > 0.5 ? deckCard : throwCard;
    currentPlayer.hand.push(cardToThrow === deckCard ? throwCard : deckCard);
    table.throwStack.push(cardToThrow);

    table.recordAction({
        player: currentPlayer.name,
        action: 'throw',
        card: cardToThrow.toString(),
        remainingDeck: table.deck.length,
        throwStack: [...table.throwStack.items],
    });

    console.log(`${currentPlayer.name} threw ${cardToThrow}`);

    if (table.isWin(currentPlayer)) {
        console.log(`${currentPlayer.name} wins with hand: ${currentPlayer.hand.map(card => card.toString()).join(', ')}`);
        return true;
    }

    table.playerQueue.enqueue(currentPlayer); // Add the player back to the queue
    return false;
}

function checkWinConditions(hand, throwStack) {
    if (throwStack.isEmpty()) return false; // No winning when throw stack is empty

    const cardCounts = hand.reduce((counts, card) => {
        counts[card.rank] = (counts[card.rank] || 0) + 1;
        return counts;
    }, {});

    const uniqueRanks = Object.keys(cardCounts);

    // Condition 1: Two pairs of like values
    const pairs = Object.values(cardCounts).filter(count => count === 2).length;
    if (pairs === 2) return true;

    // Condition 2: Three cards with the same value
    if (Object.values(cardCounts).some(count => count === 3)) return true;

    // Condition 3: Specific card values A, K, 4, 7
    const requiredValues = ['A', 'K', '4', '7'];
    if (requiredValues.every(value => uniqueRanks.includes(value))) return true;

    // Condition 4: All cards have the same value
    if (uniqueRanks.length === 1) return true;

    return false;
}
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

function setupTable(table, players) {
    // Shuffle and distribute
    table.deck = shuffleDeck(createDeck());
    players.forEach(player => {
        for (let i = 0; i < 3; i++) {
            player.hand.push(table.deck.pop());
        }
        table.addPlayer(player);
    });
}
function firstPlayerTurn(table) {
    const currentPlayer = table.playerQueue.dequeue();
    console.log(`--- ${currentPlayer.name}'s Turn ---`);

    const pickedCard = table.deck.pop();
    console.log(`${currentPlayer.name} picked ${pickedCard}`);

    currentPlayer.hand.push(pickedCard);

    if (table.isWin(currentPlayer)) {
        console.log(`${currentPlayer.name} wins with hand: ${currentPlayer.hand.map(card => card.toString()).join(', ')}`);
        return true;
    }

    // Throw one card to remain with 3
    const cardToThrow = currentPlayer.hand.pop(); // Placeholder logic, replace with actual strategy
    table.throwStack.push(cardToThrow);

    console.log(`${currentPlayer.name} threw ${cardToThrow}`);
    table.playerQueue.enqueue(currentPlayer);
    return false;
}
function secondPlayerTurn(table) {
    const currentPlayer = table.playerQueue.dequeue();
    console.log(`--- ${currentPlayer.name}'s Turn ---`);

    const topDeckCard = table.deck.pop();
    const lastThrownCard = table.throwStack.peek();

    console.log(`${currentPlayer.name} chooses between ${lastThrownCard} and ${topDeckCard}`);

    // Placeholder choice logic, replace with actual strategy
    const chosenCard = Math.random() > 0.5 ? topDeckCard : lastThrownCard;
    currentPlayer.hand.push(chosenCard);

    if (chosenCard === lastThrownCard) {
        table.throwStack.pop(); // Remove chosen card from the stack
    }

    console.log(`${currentPlayer.name} picked ${chosenCard}`);

    if (table.isWin(currentPlayer)) {
        console.log(`${currentPlayer.name} wins with hand: ${currentPlayer.hand.map(card => card.toString()).join(', ')}`);
        return true;
    }

    // Throw one card to remain with 3
    const cardToThrow = currentPlayer.hand.pop(); // Placeholder logic
    table.throwStack.push(cardToThrow);

    console.log(`${currentPlayer.name} threw ${cardToThrow}`);
    table.playerQueue.enqueue(currentPlayer);
    return false;
}
function playGame(table) {
    setupTable(table, [
        new Player('Alice'),
        new Player('Bob'),
        new Player('Charlie'),
        new Player('Diana'),
    ]);

    while (true) {
        if (firstPlayerTurn(table)) break;

        for (let i = 1; i < 4; i++) {
            if (secondPlayerTurn(table)) break;
        }

        console.log('Next round begins!');
    }

    console.log('Game over!');
}

document.addEventListener('DOMContentLoaded',()=>{
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    
    function createDeck(){

    }

});
*/
// Card Game Implementation with Good Coding Practices

class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() {
        return `${this.rank}${this.suit}`;
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }

    pickCard(card) {
        this.hand.push(card);
    }

    throwCard(cardIndex) {
        return this.hand.splice(cardIndex, 1)[0];
    }

    displayHand() {
        return this.hand.map(card => card.toString()).join(', ');
    }
}

class Table {
    constructor() {
        this.players = [];
        this.deck = [];
        this.throwStack = [];
        this.roundsCompleted = 0;
    }

    initializeDeck() {
        const suits = ['\u2660', '\u2665', '\u2666', '\u2663']; // Spades, Hearts, Diamonds, Clubs
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.deck = suits.flatMap(suit => ranks.map(rank => new Card(rank, suit)));
        this.shuffleDeck();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    addPlayer(player) {
        this.players.push(player);
    }

    distributeCards() {
        this.players.forEach(player => {
            for (let i = 0; i < 3; i++) {
                player.pickCard(this.deck.pop());
            }
        });
    }

    checkWinConditions(player) {
        if (this.throwStack.length === 0 || this.roundsCompleted === 0) return false;

        const cardCounts = player.hand.reduce((counts, card) => {
            counts[card.rank] = (counts[card.rank] || 0) + 1;
            return counts;
        }, {});

        const uniqueRanks = Object.keys(cardCounts);

        // Two pairs of like values
        if (Object.values(cardCounts).filter(count => count === 2).length === 2) return true;

        // Three cards with the same value
        if (Object.values(cardCounts).some(count => count === 3)) return true;

        // Specific values A, K, 4, 7
        const requiredValues = ['A', 'K', '4', '7'];
        if (requiredValues.every(value => uniqueRanks.includes(value))) return true;

        // All cards the same value
        if (uniqueRanks.length === 1) return true;

        return false;
    }

    playTurn(player) {
        console.log(`--- ${player.name}'s Turn ---`);

        let pickedCard;
        if (this.throwStack.length > 0 && this.players.indexOf(player) > 0) {
            // Option to pick from throw stack or deck for second+ players
            const lastThrownCard = this.throwStack[this.throwStack.length - 1];
            const topDeckCard = this.deck.pop();

            // Simple logic to choose card (can be enhanced)
            pickedCard = Math.random() > 0.5 ? lastThrownCard : topDeckCard;
            if (pickedCard === lastThrownCard) this.throwStack.pop();
            else pickedCard = topDeckCard;
        } else {
            // First player picks from deck
            pickedCard = this.deck.pop();
        }

        console.log(`${player.name} picked ${pickedCard}`);
        player.pickCard(pickedCard);

        if (this.checkWinConditions(player)) {
            console.log(`${player.name} wins with hand: ${player.displayHand()}`);
            return true;
        }

        // Throw a card to remain with 3 cards
        const cardToThrowIndex = Math.floor(Math.random() * player.hand.length); // Replace with strategy
        const thrownCard = player.throwCard(cardToThrowIndex);
        this.throwStack.push(thrownCard);
        console.log(`${player.name} threw ${thrownCard}`);

        return false;
    }

    playGame() {
        this.initializeDeck();
        this.shuffleDeck();
        this.distributeCards();

        let winner = false;
        while (!winner) {
            for (let player of this.players) {
                winner = this.playTurn(player);
                if (winner) break;
            }

            if (this.players[0] === this.players[this.roundsCompleted % this.players.length]) {
                this.roundsCompleted++;
            }
        }

        console.log('Game over!');
    }
}

// Example Usage
const table = new Table();
['Alice', 'Bob', 'Charlie', 'Diana'].forEach(name => table.addPlayer(new Player(name)));
table.playGame();
