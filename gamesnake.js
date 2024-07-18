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
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval;
let gameSpeed = 150; // Default to medium speed

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
    direction = { x: 1, y: 0 }; // Start with moving to the right
    snake = [{ x: 200, y: 200 }];
    scoreDisplay.textContent = score;
    placeFood();
    gameInterval = setInterval(updateGame, gameSpeed);
}

function restartGame() {
    clearInterval(gameInterval);
    startGame();
}

function updateGame() {
    const head = { x: snake[0].x + direction.x * cellSize, y: snake[0].y + direction.y * cellSize };

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || snakeCollision(head)) {
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

    // Draw each segment of the snake
    snake.forEach((segment, index) => {
        drawSegment(segment.x, segment.y, index === 0 ? 'traktor.png' : 'przyczepa.png', getRotationAngle(index));
    });

    // Draw the food
    drawSegment(food.x, food.y, 'przyczepa.png', 0);
}

function drawSegment(x, y, imgSrc, angle) {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
        context.save();
        context.translate(x + cellSize / 2, y + cellSize / 2);
        context.rotate(angle);
        context.drawImage(img, -cellSize / 2, -cellSize / 2, cellSize, cellSize);
        context.restore();
    }
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
    if (keyPressed === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (keyPressed === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (keyPressed === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (keyPressed === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

function setDifficulty(level, speed) {
    currentDifficultyDisplay.textContent = level;
    gameSpeed = speed;
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * canvas.width / cellSize) * cellSize,
        y: Math.floor(Math.random() * canvas.height / cellSize) * cellSize
    };

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}

function snakeCollision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function endGame() {
    clearInterval(gameInterval);
    alert(`Game over! Your score is ${score}`);
    restartButton.style.display = 'inline';
    startButton.style.display = 'inline';
}
