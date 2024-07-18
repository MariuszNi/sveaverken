const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

canvas.width = 400;
canvas.height = 400;

const cellSize = 20;
let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let gameInterval;

document.addEventListener('keydown', changeDirection);
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
    startButton.style.display = 'none';
    restartButton.style.display = 'inline';
    score = 0;
    direction = { x: 1, y: 0 }; // Start with moving to the right
    snake = [{ x: 200, y: 200 }];
    scoreDisplay.textContent = score;
    placeFood();
    gameInterval = setInterval(updateGame, 100);
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
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = '#0f0';
    snake.forEach(segment => context.fillRect(segment.x, segment.y, cellSize, cellSize));

    context.fillStyle = '#f00';
    context.fillRect(food.x, food.y, cellSize, cellSize);
}

function changeDirection(event) {
    const keyPressed = event.key;

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
