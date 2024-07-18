// game.js
const gameContainer = document.getElementById('game-container');
const tractor = document.getElementById('tractor');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');

let score = 0;
let time = 60;
let gameInterval;
let hayBaleInterval;
let rabbitInterval;
let stoneInterval;
let backgroundAnimationInterval;
let fallSpeed = 5; // Initial falling speed of the hay bales
let backgroundSpeed = 5; // Initial background scroll speed (milliseconds per frame)
let backgroundPosition = 0;

document.addEventListener('keydown', moveTractor);

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function moveTractor(event) {
    const tractorLeft = tractor.offsetLeft;
    const tractorWidth = tractor.clientWidth;
    const containerWidth = gameContainer.clientWidth;
    
    if (event.key === 'ArrowLeft' && tractorLeft > 10) {
        tractor.style.left = `${tractorLeft - 10}px`;
    } else if (event.key === 'ArrowRight' && tractorLeft < containerWidth - tractorWidth - 10) {
        tractor.style.left = `${tractorLeft + 10}px`;
    } else if (event.key === 'ArrowUp') {
        fallSpeed = Math.min(fallSpeed + 1, 20); // Maximum falling speed is 20
        backgroundSpeed = Math.max(backgroundSpeed - 1, 2); // Increase background speed, min interval 2ms
    } else if (event.key === 'ArrowDown') {
        fallSpeed = Math.max(fallSpeed - 1, 1); // Minimum falling speed is 1
        backgroundSpeed = Math.min(backgroundSpeed + 1, 20); // Decrease background speed, max interval 20ms
    }
}

function createHayBale() {
    const hayBale = document.createElement('div');
    hayBale.classList.add('hay-bale');
    hayBale.style.left = `${Math.random() * (gameContainer.clientWidth - 60)}px`; // Adjust for larger size
    hayBale.style.top = '0px';
    gameContainer.appendChild(hayBale);
}

function createRabbit() {
    const rabbit = document.createElement('div');
    rabbit.classList.add('rabbit');
    rabbit.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
    rabbit.style.top = '0px';
    gameContainer.appendChild(rabbit);
}

function createStone() {
    const stone = document.createElement('div');
    stone.classList.add('stone');
    stone.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
    stone.style.top = '0px';
    gameContainer.appendChild(stone);
}

function moveObject(object) {
    const objectTop = parseFloat(object.style.top);
    object.style.top = `${objectTop + fallSpeed}px`;
}

function moveObjects() {
    const hayBales = document.querySelectorAll('.hay-bale');
    hayBales.forEach(moveObject);
    const rabbits = document.querySelectorAll('.rabbit');
    rabbits.forEach(moveObject);
    const stones = document.querySelectorAll('.stone');
    stones.forEach(moveObject);
}

function isCaught(object) {
    const objectRect = object.getBoundingClientRect();
    const tractorRect = tractor.getBoundingClientRect();
    return !(
        objectRect.bottom < tractorRect.top ||
        objectRect.top > tractorRect.bottom ||
        objectRect.right < tractorRect.left ||
        objectRect.left > tractorRect.right
    );
}

function updateScore(value) {
    score += value;
    scoreDisplay.textContent = score;
}

function checkCollision() {
    const objects = document.querySelectorAll('.hay-bale, .rabbit, .stone');
    objects.forEach(object => {
        if (isCaught(object)) {
            if (object.classList.contains('hay-bale')) {
                updateScore(1);
            } else if (object.classList.contains('rabbit')) {
                updateScore(10);
            } else if (object.classList.contains('stone')) {
                updateScore(-15);
            }
            object.remove();
        }
    });
}

function startBackgroundAnimation() {
    backgroundAnimationInterval = setInterval(() => {
        backgroundPosition += fallSpeed;
        gameContainer.style.backgroundPositionY = `${backgroundPosition}px`;
        moveObjects();
        checkCollision();
    }, backgroundSpeed);
}

function startGame() {
    startButton.style.display = 'none';
    restartButton.style.display = 'inline';
    resetGameVariables();
    gameInterval = setInterval(() => {
        time -= 1;
        timeDisplay.textContent = time;
        if (time === 0) {
            endGame();
        }
    }, 1000);

    hayBaleInterval = setInterval(createHayBale, 1000);
    rabbitInterval = setInterval(() => {
        if (Math.random() < 0.1) createRabbit(); // 10% chance to create a rabbit
    }, 10000);

    stoneInterval = setInterval(createStone, 15000);
    startBackgroundAnimation();
}

function resetGameVariables() {
    score = 0;
    time = 60;
    backgroundPosition = 0;
    fallSpeed = 5;
    backgroundSpeed = 5;
    scoreDisplay.textContent = score;
    timeDisplay.textContent = time;
    document.querySelectorAll('.hay-bale, .rabbit, .stone').forEach(obj => obj.remove());
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(hayBaleInterval);
    clearInterval(rabbitInterval);
    clearInterval(stoneInterval);
    clearInterval(backgroundAnimationInterval);
    alert(`Game over! Your score is ${score}`);
}

function restartGame() {
    resetGameVariables();
    startGame();
}
