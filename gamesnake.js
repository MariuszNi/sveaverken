```javascript
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const easyButton = document.getElementById('easy-button');
const mediumButton = document.getElementById('medium-button');
const hardButton = document.getElementById('hard-button');
const currentDifficultyDisplay = document.getElementById('current-difficulty');

canvas.width = 400;
canvas.height = 400;

const cellSize = 40;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let pendingDirection = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval = null;
let gameSpeed = 150;
let gameOver = false;

const tractorImg = new Image();
tractorImg.src = 'traktor.png';

const trailerImg = new Image();
trailerImg.src = 'przyczepa.png';

const foodImg = new Image();
foodImg.src = 'siano.png';

document.addEventListener('keydown', changeDirection);
leftButton.addEventListener('click', () => setDirection('ArrowLeft'));
rightButton.addEventListener('click', () => setDirection('ArrowRight'));
upButton.addEventListener('click', () => setDirection('ArrowUp'));
downButton.addEventListener('click', () => setDirection('ArrowDown'));
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
easyButton.addEventListener('click', () => setDifficulty('Easy', 200));
mediumButton.addEventListener('click', () => setDifficulty('Medium', 150));
hardButton.addEventListener('click', () => setDifficulty('Hard', 100));

function startGame() {
  startButton.style.display = 'none';
  restartButton.style.display = 'inline';
  score = 0;
  direction = { x: 1, y: 0 };
  pendingDirection = { ...direction };
  gameOver = false;
  snake = [{ x: 200, y: 200 }];
  scoreDisplay.textContent = score;
  placeFood();
  resetLoop();
  drawGame();
}

function restartGame() {
  clearInterval(gameInterval);
  startGame();
}

function resetLoop() {
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(updateGame, gameSpeed);
}

function updateGame() {
  direction = { ...pendingDirection };

  const head = {
    x: snake[0].x + direction.x * cellSize,
    y: snake[0].y + direction.y * cellSize
  };

  if (outOfBounds(head) || snakeCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  drawGame();
}

function drawGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  snake.forEach((segment, index) => {
    drawSegment(segment.x, segment.y, index === 0 ? tractorImg : trailerImg, getRotationAngle(index));
  });

  drawSegment(food.x, food.y, foodImg.complete ? foodImg : trailerImg, 0);

  if (gameOver) drawGameOver();
}

function drawSegment(x, y, img, angle) {
  context.save();
  context.translate(x + cellSize / 2, y + cellSize / 2);
  context.rotate(angle);
  context.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
  context.restore();
}

function getRotationAngle(index) {
  if (index === 0) {
    if (direction.x === 1) return 0;
    if (direction.x === -1) return Math.PI;
    if (direction.y === 1) return Math.PI / 2;
    if (direction.y === -1) return -Math.PI / 2;
  } else {
    const current = snake[index];
    const next = snake[index - 1];
    if (next.x > current.x) return 0;
    if (next.x < current.x) return Math.PI;
    if (next.y > current.y) return Math.PI / 2;
    if (next.y < current.y) return -Math.PI / 2;
  }
  return 0;
}

function changeDirection(event) {
  setDirection(event.key);
}

function setDirection(keyPressed) {
  const goingUp = direction.y === -1;
  const goingDown = direction.y === 1;
  const goingRight = direction.x === 1;
  const goingLeft = direction.x === -1;

  if (keyPressed === 'ArrowUp' && !goingDown) pendingDirection = { x: 0, y: -1 };
  else if (keyPressed === 'ArrowDown' && !goingUp) pendingDirection = { x: 0, y: 1 };
  else if (keyPressed === 'ArrowLeft' && !goingRight) pendingDirection = { x: -1, y: 0 };
  else if (keyPressed === 'ArrowRight' && !goingLeft) pendingDirection = { x: 1, y: 0 };
}

function setDifficulty(level, speed) {
  currentDifficultyDisplay.textContent = level;
  gameSpeed = speed;
  if (!gameOver && snake.length) resetLoop();
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * (canvas.width / cellSize)) * cellSize,
      y: Math.floor(Math.random() * (canvas.height / cellSize)) * cellSize
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
}

function snakeCollision(head) {
  return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function outOfBounds(p) {
  return p.x < 0 || p.y < 0 || p.x >= canvas.width || p.y >= canvas.height;
}

function endGame() {
  clearInterval(gameInterval);
  gameOver = true;
  drawGame();
  restartButton.style.display = 'inline';
  startButton.style.display = 'inline';
}

function drawGameOver() {
  context.fillStyle = 'rgba(0,0,0,0.7)';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#fff';
  context.font = 'bold 24px Arial';
  context.fillText(`Game Over! Score: ${score}`, 50, canvas.height / 2 - 10);
  context.font = '16px Arial';
  context.fillText('Kliknij Restart, aby zagrać ponownie.', 50, canvas.height / 2 + 20);
}
```
