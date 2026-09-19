const modal = document.getElementById('gameModal');
const closeBtn = document.getElementById('closeModal');
const gameContainer = document.getElementById('gameContainer');

const gameCards = document.querySelectorAll('.game-card');
gameCards.forEach((card) => {
  const open = () => {
    const game = card.dataset.game;
    openGame(game);
  };

  card.addEventListener('click', open);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      open();
    }
  });
});

closeBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  gameContainer.innerHTML = '';
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    gameContainer.innerHTML = '';
  }
});

function openGame(gameName) {
  gameContainer.innerHTML = '';
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  switch (gameName) {
    case 'snake':
      initSnakeGame();
      break;
    case 'tictactoe':
      initTicTacToe();
      break;
    case 'memory':
      initMemoryGame();
      break;
    case 'pong':
      initPongGame();
      break;
    default:
      gameContainer.innerHTML = '<h2>Game unavailable</h2>';
  }
}

function initSnakeGame() {
  const wrap = document.createElement('div');
  wrap.className = 'snake-game-wrap';

  const hud = document.createElement('div');
  hud.className = 'hud';
  hud.innerHTML = '<span>Score: <strong id="snakeScore">0</strong></span><span id="snakeStatus">Playing</span>';

  const board = document.createElement('div');
  board.className = 'game-board';

  wrap.appendChild(hud);
  wrap.appendChild(board);
  gameContainer.appendChild(wrap);

  const gridSize = 20;
  let snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  let dx = 1;
  let dy = 0;
  let food = { x: 15, y: 10 };
  let score = 0;
  let gameLoop;

  function draw() {
    board.innerHTML = '';

    snake.forEach((segment) => {
      const cell = document.createElement('div');
      cell.className = 'cell snake-cell';
      cell.style.left = `${segment.x * 5}%`;
      cell.style.top = `${segment.y * 5}%`;
      board.appendChild(cell);
    });

    const foodCell = document.createElement('div');
    foodCell.className = 'cell food-cell';
    foodCell.style.left = `${food.x * 5}%`;
    foodCell.style.top = `${food.y * 5}%`;
    board.appendChild(foodCell);
  }

  function randomFood() {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };

    while (snake.some((segment) => segment.x === food.x && segment.y === food.y)) {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      };
    }
  }

  function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize) {
      clearInterval(gameLoop);
      document.getElementById('snakeStatus').textContent = 'Game Over';
      return;
    }

    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        clearInterval(gameLoop);
        document.getElementById('snakeStatus').textContent = 'Game Over';
        return;
      }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      score += 10;
      document.getElementById('snakeScore').textContent = score;
      randomFood();
    } else {
      snake.pop();
    }

    draw();
  }

  document.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'ArrowUp':
        if (dy !== 1) {
          dx = 0;
          dy = -1;
        }
        break;
      case 'ArrowDown':
        if (dy !== -1) {
          dx = 0;
          dy = 1;
        }
        break;
      case 'ArrowLeft':
        if (dx !== 1) {
          dx = -1;
          dy = 0;
        }
        break;
      case 'ArrowRight':
        if (dx !== -1) {
          dx = 1;
          dy = 0;
        }
        break;
      default:
        break;
    }
  });

  draw();
  gameLoop = setInterval(update, 120);
}

function initTicTacToe() {
  const board = document.createElement('div');
  board.className = 'tic-tac-toe-board';

  const cells = Array(9).fill('');
  let gameOver = false;

  const status = document.createElement('p');
  status.textContent = 'Player X starts';
  status.style.textAlign = 'center';
  status.style.marginBottom = '18px';

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'ttt-cell';
    cell.addEventListener('click', () => handlePlayerMove(i));
    board.appendChild(cell);
  }

  gameContainer.appendChild(status);
  gameContainer.appendChild(board);

  function updateBoard() {
    const buttons = board.querySelectorAll('button');
    buttons.forEach((button, index) => {
      button.textContent = cells[index] || '';
    });
  }

  function checkWinner() {
    const combos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    for (const [a, b, c] of combos) {
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }

    return null;
  }

  function handlePlayerMove(index) {
    if (gameOver || cells[index]) return;

    cells[index] = 'X';
    updateBoard();

    const winner = checkWinner();
    if (winner) {
      gameOver = true;
      status.textContent = `You win!`;
      return;
    }

    if (cells.every(Boolean)) {
      gameOver = true;
      status.textContent = 'Draw!';
      return;
    }

    status.textContent = 'Computer thinking...';
    setTimeout(() => {
      const emptyIndexes = cells
        .map((value, idx) => (value ? null : idx))
        .filter((value) => value !== null);

      const move = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
      cells[move] = 'O';
      updateBoard();

      const computerWinner = checkWinner();
      if (computerWinner) {
        gameOver = true;
        status.textContent = 'Computer wins!';
        return;
      }

      if (cells.every(Boolean)) {
        gameOver = true;
        status.textContent = 'Draw!';
        return;
      }

      status.textContent = 'Your turn';
    }, 400);
  }

  updateBoard();
}

function initMemoryGame() {
  const symbols = ['🍒', '🍋', '🍉', '🍇', '🍊', '🍏', '🍓', '🍎'];
  const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
  const grid = document.createElement('div');
  grid.className = 'memory-grid';

  let flippedCards = [];
  let matches = 0;
  let locked = false;

  const status = document.createElement('p');
  status.textContent = 'Find all matching pairs';
  status.style.textAlign = 'center';
  status.style.marginBottom = '18px';

  deck.forEach((symbol) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'memory-card';
    card.dataset.symbol = symbol;
    card.textContent = '?';
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
  });

  function flipCard(card) {
    if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) {
      return;
    }

    card.textContent = card.dataset.symbol;
    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      locked = true;
      const [first, second] = flippedCards;

      if (first.dataset.symbol === second.dataset.symbol) {
        first.classList.add('matched');
        second.classList.add('matched');
        matches += 1;
        status.textContent = matches === deck.length / 2 ? 'You win!' : 'Nice match!';
        flippedCards = [];
        locked = false;
      } else {
        status.textContent = 'Try again';
        setTimeout(() => {
          first.textContent = '?';
          second.textContent = '?';
          first.classList.remove('flipped');
          second.classList.remove('flipped');
          flippedCards = [];
          locked = false;
        }, 750);
      }
    }
  }

  gameContainer.appendChild(status);
  gameContainer.appendChild(grid);
}

function initPongGame() {
  const wrap = document.createElement('div');
  wrap.className = 'pong-game';

  const scoreBoard = document.createElement('div');
  scoreBoard.textContent = '0 : 0';
  scoreBoard.style.color = '#e2e8f0';
  scoreBoard.style.fontWeight = '700';

  const board = document.createElement('div');
  board.className = 'pong-board';

  const player = document.createElement('div');
  player.className = 'pong-paddle';
  player.style.left = '18px';
  player.style.top = '110px';

  const ai = document.createElement('div');
  ai.className = 'pong-paddle';
  ai.style.right = '18px';
  ai.style.top = '110px';

  const ball = document.createElement('div');
  ball.className = 'pong-ball';

  board.appendChild(player);
  board.appendChild(ai);
  board.appendChild(ball);

  wrap.appendChild(scoreBoard);
  wrap.appendChild(board);
  gameContainer.appendChild(wrap);

  const state = {
    playerY: 110,
    aiY: 110,
    ballX: 280,
    ballY: 150,
    vx: 4,
    vy: 3,
    playerScore: 0,
    aiScore: 0,
  };

  const keys = {};

  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 's') keys[key] = true;
  });

  document.addEventListener('keyup', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 's') keys[key] = false;
  });

  function resetBall() {
    state.ballX = 280;
    state.ballY = 150;
    state.vx = (Math.random() > 0.5 ? 1 : -1) * 4;
    state.vy = (Math.random() > 0.5 ? 1 : -1) * 3;
  }

  function update() {
    const boardHeight = board.clientHeight || 320;
    const paddleHeight = 90;

    if (keys.w) state.playerY = Math.max(0, state.playerY - 6);
    if (keys.s) state.playerY = Math.min(boardHeight - paddleHeight, state.playerY + 6);

    player.style.top = `${state.playerY}px`;

    const aiTarget = state.ballY - 45;
    state.aiY += (aiTarget - state.aiY) * 0.09;
    ai.style.top = `${Math.max(0, Math.min(boardHeight - paddleHeight, state.aiY))}px`;

    state.ballX += state.vx;
    state.ballY += state.vy;

    if (state.ballY <= 0 || state.ballY >= boardHeight - 12) {
      state.vy *= -1;
    }

    if (
      state.ballX <= 18 &&
      state.ballY >= state.playerY &&
      state.ballY <= state.playerY + paddleHeight
    ) {
      state.vx = Math.abs(state.vx) + 0.5;
    }

    if (
      state.ballX >= board.clientWidth - 30 &&
      state.ballY >= state.aiY &&
      state.ballY <= state.aiY + paddleHeight
    ) {
      state.vx = -Math.abs(state.vx) - 0.5;
    }

    if (state.ballX < 0) {
      state.aiScore += 1;
      resetBall();
    }

    if (state.ballX > board.clientWidth) {
      state.playerScore += 1;
      resetBall();
    }

    ball.style.left = `${state.ballX}px`;
    ball.style.top = `${state.ballY}px`;
    scoreBoard.textContent = `${state.playerScore} : ${state.aiScore}`;

    requestAnimationFrame(update);
  }

  resetBall();
  update();
}

// Start page with a simple welcome text if needed
