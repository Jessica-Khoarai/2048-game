const grid = document.getElementById("grid");
const scoreElement = document.getElementById("score-value");
const resetButton = document.getElementById("reset");

let gridData;
let score = 0;

// Initialize the grid
function init() {
    score = 0;
    scoreElement.textContent = score;
    gridData = Array(4)
        .fill()
        .map(() => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    updateGrid();
}

// Add a random tile (2 or 4) to the grid
function addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gridData[i][j] === 0) emptyCells.push({ x: i, y: j });
        }
    }
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        gridData[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Update the visual grid
function updateGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.value = gridData[i][j];
            cell.textContent = gridData[i][j] > 0 ? gridData[i][j] : "";
            grid.appendChild(cell);
        }
    }
}

// Slide and merge tiles
function slideAndMerge(row) {
    const newRow = row.filter((value) => value !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            score += newRow[i];
            newRow.splice(i + 1, 1);
        }
    }
    while (newRow.length < 4) newRow.push(0);
    return newRow;
}

// Move tiles
function move(direction) {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        let rowOrColumn = [];
        for (let j = 0; j < 4; j++) {
            rowOrColumn.push(
                direction === "left" || direction === "right"
                    ? gridData[i][j]
                    : gridData[j][i]
            );
        }
        if (direction === "right" || direction === "down") rowOrColumn.reverse();

        const newRowOrColumn = slideAndMerge(rowOrColumn);

        if (direction === "right" || direction === "down") newRowOrColumn.reverse();
        for (let j = 0; j < 4; j++) {
            const value =
                direction === "left" || direction === "right"
                    ? gridData[i][j]
                    : gridData[j][i];
            const newValue =
                direction === "left" || direction === "right"
                    ? newRowOrColumn[j]
                    : newRowOrColumn[j];

            if (value !== newValue) {
                moved = true;
                if (direction === "left" || direction === "right") {
                    gridData[i][j] = newValue;
                } else {
                    gridData[j][i] = newValue;
                }
            }
        }
    }
    if (moved) {
        addRandomTile();
        updateGrid();
        scoreElement.textContent = score;
    }
}

// Check for game over
function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (gridData[i][j] === 0) return false;
            if (j < 3 && gridData[i][j] === gridData[i][j + 1]) return false;
            if (i < 3 && gridData[i][j] === gridData[i + 1][j]) return false;
        }
    }
    alert("Game Over!");
    return true;
}

// Event listeners for keypresses
window.addEventListener("keydown", (e) => {
    if (isGameOver()) return;

    switch (e.key) {
        case "ArrowUp":
            move("up");
            break;
        case "ArrowDown":
            move("down");
            break;
        case "ArrowLeft":
            move("left");
            break;
        case "ArrowRight":
            move("right");
            break;
    }
});

resetButton.addEventListener("click", init);

// Initialize the game on page load
init();

