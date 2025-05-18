const emojis = ['🐶', '🐱', '🐭', '🦊', '🐻', '🐼', '🐵', '🐸'];
let cards = [...emojis, ...emojis];
let flipped = [];
let matched = 0;
let timer = 0;
let interval;
let playerName = '';

// DOM references
const grid = document.getElementById('grid');
const playerNameDisplay = document.querySelector('#player-name .name');
const timerDisplay = document.querySelector('.time');
const rankDisplay = document.querySelector('.rank');
const leaderboardList = document.getElementById('leaderboard-list');

// Screen containers
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');

// Start the game after entering name
function startGame() {
  const nameInput = document.getElementById('name-input');
  playerName = nameInput.value.trim();

  if (!playerName) {
    alert('Please enter your name!');
    return;
  }

  // Switch screens
  startScreen.style.display = 'none';
  endScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  // Setup UI
  playerNameDisplay.innerText = playerName;
  timerDisplay.innerText = '0s';
  rankDisplay.innerText = '--';
  leaderboardList.innerHTML = '';

  // Reset game
  cards = shuffle([...emojis, ...emojis]);
  grid.innerHTML = '';
  matched = 0;
  flipped = [];

  // Create cards
  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.innerHTML = '?';
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });

  // Start timer
  timer = 0;
  clearInterval(interval);
  interval = setInterval(() => {
    timer++;
    timerDisplay.innerText = `${timer}s`;
  }, 1000);
}

function flipCard() {
  if (flipped.length >= 2 || this.classList.contains('flipped')) return;

  this.innerHTML = this.dataset.emoji;
  this.classList.add('flipped');
  flipped.push(this);

  if (flipped.length === 2) {
    const [card1, card2] = flipped;
    if (card1.dataset.emoji === card2.dataset.emoji) {
      matched += 2;
      flipped = [];

      if (matched === cards.length) {
        clearInterval(interval);
        saveRank(playerName, timer);
        setTimeout(() => {
          alert(`🎉 Congratulations ${playerName}! You matched all in ${timer} seconds!`);
          showRank();
          gameScreen.style.display = 'none';
          endScreen.style.display = 'block';
        }, 500);
      }
    } else {
      setTimeout(() => {
        card1.innerHTML = '?';
        card2.innerHTML = '?';
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flipped = [];
      }, 800);
    }
  }
}

function restartGame() {
  const nameInputAgain = document.getElementById('name-input-again');
  const newName = nameInputAgain.value.trim();
  if (newName) {
    playerName = newName;
  }

  endScreen.style.display = 'none';
  gameScreen.style.display = 'none';
  startScreen.style.display = 'block';
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function saveRank(name, score) {
  let ranks = JSON.parse(localStorage.getItem('ranks') || '[]');
  ranks.push({ name, score });
  ranks.sort((a, b) => a.score - b.score);
  ranks = ranks.slice(0, 5);
  localStorage.setItem('ranks', JSON.stringify(ranks));
}

function showRank() {
  let ranks = JSON.parse(localStorage.getItem('ranks') || '[]');
  const playerEntry = ranks.find(r => r.name === playerName && r.score === timer);
  const playerRank = ranks.indexOf(playerEntry) + 1;
  rankDisplay.innerText = playerRank ? `#${playerRank}` : '--';

  leaderboardList.innerHTML = '';
  ranks.forEach((r, i) => {
    const li = document.createElement('li');
    li.innerText = `${i + 1}. ${r.name} - ${r.score}s`;
    leaderboardList.appendChild(li);
  });
}
