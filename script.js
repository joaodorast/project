const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasSize = 400;
let score = 0;
let highScore = 0;
let snake = [];
let direction = 'RIGHT';
let food = {};
let timer = 0;
let gameInterval;
let isGameRunning = false;

function startGame() {
    score = 0;
    snake = [{ x: box * 5, y: box * 5 }];
    direction = 'RIGHT';
    createFood();
    updateScore();
    resetTimer();
    isGameRunning = true;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, getDifficulty());
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        createFood();
    }
}

function updateScore() {
    document.getElementById('score').innerText = `Pontuação: ${score}`;
    if (score > highScore) {
        highScore = score;
        document.getElementById('highscore').innerText = `Pontuação Máxima: ${highScore}`;
    }
}

function resetTimer() {
    timer = 0;
    document.getElementById('timer').innerText = `Tempo: ${timer}s`;
    setInterval(() => {
        if (isGameRunning) {
            timer++;
            document.getElementById('timer').innerText = `Tempo: ${timer}s`;
        }
    }, 1000);
}

function getDifficulty() {
    const difficulty = document.getElementById('difficulty').value;
    return parseInt(difficulty);
}

function gameLoop() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawFood();
    drawSnake();
    moveSnake();

    if (checkCollision()) {
        gameOver();
    }
}

function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
}

function drawSnake() {
    ctx.fillStyle = "green";
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function moveSnake() {
    const head = { ...snake[0] };

    switch (direction) {
        case 'LEFT': head.x -= box; break;
        case 'UP': head.y -= box; break;
        case 'RIGHT': head.x += box; break;
        case 'DOWN': head.y += box; break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        createFood();
    } else {
        snake.pop();
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        return true;
    }

    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }

    return false;
}

function gameOver() {
    clearInterval(gameInterval);
    isGameRunning = false;
    document.getElementById('gameOverSound').play();
    alert("Game Over! Sua pontuação foi: " + score);
}

document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP';
});
document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN';
});
document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});
document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

document.getElementById('restart').addEventListener('click', startGame);
startGame();
