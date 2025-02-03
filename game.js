const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20; // 每個格子的大小
const tileCount = canvas.width / gridSize; // 每行每列的格子數

let snake = [{ x: 10, y: 10 }]; // 蛇的初始位置
let direction = { x: 0, y: 0 }; // 蛇的移動方向
let food = { x: 5, y: 5 }; // 食物的初始位置
let score = 0; // 分數
let gameOver = false; // 遊戲是否結束

// 遊戲主循環
function gameLoop() {
    if (gameOver) {
        drawGameOver();
        return; // 如果遊戲結束，停止循環
    }

    update();
    draw();
    setTimeout(gameLoop, 200); // 控制遊戲速度
}

// 更新遊戲狀態
function update() {
    // 移動蛇
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 檢查是否撞牆
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }

    // 檢查是否撞到自己（跳過頭部）
    if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver = true;
        return;
    }

    // 添加新的頭部
    snake.unshift(head);

    // 檢查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        // 移除尾部
        snake.pop();
    }
}

// 繪製遊戲畫面
function draw() {
    // 清空畫布
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 繪製蛇
    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // 繪製食物
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // 顯示分數
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);
}

// 繪製遊戲結束畫面
function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px Arial";
    ctx.fillText("Press Space to Restart", canvas.width / 2, canvas.height / 2 + 30);
}

// 放置食物
function placeFood() {
    // 確保食物不會在螢幕邊緣刷新
    food = {
        x: Math.floor(Math.random() * (tileCount - 2)) + 1, // 1 到 tileCount - 2
        y: Math.floor(Math.random() * (tileCount - 2)) + 1 // 1 到 tileCount - 2
    };

    // 確保食物不會出現在蛇的身體上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food = {
            x: Math.floor(Math.random() * (tileCount - 2)) + 1,
            y: Math.floor(Math.random() * (tileCount - 2)) + 1
        };
    }
}

// 監聽鍵盤事件
document.addEventListener("keydown", event => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 }; // 不能反向移動
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 }; // 不能反向移動
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 }; // 不能反向移動
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 }; // 不能反向移動
            break;
        case " ": // 按下空格鍵重新開始遊戲
            if (gameOver) resetGame();
            break;
    }
});

// 重置遊戲
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    score = 0;
    gameOver = false;
    placeFood();
    gameLoop(); // 重新啟動遊戲循環
}

// 開始遊戲
resetGame();