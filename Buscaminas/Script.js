let gridElement = document.getElementById('grid');
let messageElement = document.getElementById('message');
let highScoresElement = document.getElementById('highScores');

let cells, mineLocations, revealedCells, gameOver, timer;
let rows, cols, mines;
let gameStartTime;
let isFirstClick = true; // Nuevo: controlar el primer clic

function startGame() {
    const difficultyValue = document.getElementById("difficulty-menu").dataset.value || '5x5_5';
    
    if (difficultyValue === 'custom') {
        rows = parseInt(document.getElementById('custom-rows').value);
        cols = parseInt(document.getElementById('custom-cols').value);
        mines = parseInt(document.getElementById('custom-mines').value);
    } else {
        [rows, cols, mines] = difficultyValue.split(/x|_/).map(Number);
    }
    
    gameOver = false;
    isFirstClick = true; // Reinicia el control de primer clic
    initializeGrid();
    gameStartTime = null; // Reinicia el tiempo de juego
}

function initializeGrid() {
    gridElement.innerHTML = '';
    messageElement.textContent = '';
    cells = [];
    mineLocations = [];
    revealedCells = 0;

    gridElement.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gridElement.classList.remove('disabled'); // Activa el tablero
    for (let i = 0; i < rows; i++) {
        cells[i] = [];
        for (let j = 0; j < cols; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.dataset.state = 'hidden';
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                toggleFlag(cell);
            });
            gridElement.appendChild(cell);
            cells[i][j] = cell;
        }
    }
}

function handleCellClick(event) {
    let cell = event.target;
    if (gameOver || cell.dataset.state === 'revealed' || cell.classList.contains('flag')) return;

    let row = parseInt(cell.dataset.row);
    let col = parseInt(cell.dataset.col);

    // Colocar minas después del primer clic
    if (isFirstClick) {
        placeMines(row, col); // Excluye la primera celda y sus alrededores
        gameStartTime = new Date(); // Inicia el cronómetro
        isFirstClick = false; // Cambia el estado del primer clic
    }

    // Si la celda contiene una mina después de colocar
    if (cell.dataset.mine === 'true') {
        revealMines();
        showMessage('¡Has perdido!', true);
        gameOver = true;
        gridElement.classList.add('disabled'); // Desactiva el tablero
        saveScore(false);
    } else {
        revealCell(row, col);
        checkWin();
    }
}

// Nueva función: Colocar minas, excluyendo la celda inicial y alrededores
function placeMines(startRow, startCol) {
    const excludePositions = getSurroundingCells(startRow, startCol);
    while (mineLocations.length < mines) {
        let row = Math.floor(Math.random() * rows);
        let col = Math.floor(Math.random() * cols);
        let cellKey = `${row}-${col}`;

        if (!excludePositions.has(cellKey) && cells[row][col].dataset.mine !== 'true') {
            cells[row][col].dataset.mine = 'true';
            mineLocations.push({ row, col });
        }
    }
}

// Nueva función: Obtener celdas alrededor del primer clic
function getSurroundingCells(row, col) {
    const surroundingCells = new Set();
    for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, rows - 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, cols - 1); j++) {
            surroundingCells.add(`${i}-${j}`);
        }
    }
    return surroundingCells;
}

function revealCell(row, col) {
    const cell = cells[row][col];
    if (cell.dataset.state === 'hidden' && !cell.classList.contains('flag')) {
        let count = countAdjacentMines(row, col);
        cell.textContent = count || '';
        cell.dataset.state = 'revealed';
        cell.classList.add('revealed');
        revealedCells++;
        
        // Si no hay minas alrededor, revela automáticamente las celdas adyacentes
        if (count === 0) revealEmptyCells(row, col);
    }
}

function toggleFlag(cell) {
    if (cell.dataset.state === 'hidden' && !cell.classList.contains('flag')) {
        cell.classList.add('flag');
        cell.textContent = '🚩';
    } else if (cell.classList.contains('flag')) {
        cell.classList.remove('flag');
        cell.textContent = '';
    }
}

function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, rows - 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, cols - 1); j++) {
            if (cells[i][j].dataset.mine === 'true') count++;
        }
    }
    return count;
}

function revealEmptyCells(row, col) {
    for (let i = Math.max(0, row - 1); i <= Math.min(row + 1, rows - 1); i++) {
        for (let j = Math.max(0, col - 1); j <= Math.min(col + 1, cols - 1); j++) {
            let cell = cells[i][j];
            if (cell.dataset.state === 'hidden' && !cell.classList.contains('flag')) {
                let count = countAdjacentMines(i, j);
                cell.textContent = count || '';
                cell.dataset.state = 'revealed';
                cell.classList.add('revealed');
                revealedCells++;
                if (count === 0) revealEmptyCells(i, j);
            }
        }
    }
}

function revealMines() {
    mineLocations.forEach(({ row, col }) => {
        let cell = cells[row][col];
        cell.textContent = '💣';
        cell.classList.add('mine', 'revealed');
    });
}

function showMessage(msg, isGameOver) {
    messageElement.textContent = msg;
    messageElement.style.color = isGameOver ? 'red' : 'green';
}

function saveScore(won, time = null) {
    if (won && time !== null) {
        let scores = JSON.parse(localStorage.getItem('scores') || '[]');
        scores.push(time);
        scores.sort((a, b) => a - b);
        if (scores.length > 10) scores.pop();
        localStorage.setItem('scores', JSON.stringify(scores));
    }
    loadScores();
}

function loadScores() {
    let scores = JSON.parse(localStorage.getItem('scores') || '[]');
    highScoresElement.innerHTML = scores.map(time => `<li>${time} segundos</li>`).join('');
}

function resetGame() {
    gameOver = false;
    initializeGrid();
    placeMines();
    gameStartTime = null;
}

function toggleDropdown() {
    document.querySelector(".options-list").classList.toggle("active");
}

function selectDifficulty(difficultyText, difficultyValue) {
    document.getElementById("selected-difficulty").textContent = difficultyText;
    document.getElementById("difficulty-menu").dataset.value = difficultyValue;
    document.querySelector(".options-list").classList.remove("active");
    toggleCustomSettings();
}

function toggleCustomSettings() {
    const difficultyValue = document.getElementById("difficulty-menu").dataset.value;
    document.getElementById("custom-settings").style.display = difficultyValue === 'custom' ? 'block' : 'none';
}

function startGame() {
    const difficultyValue = document.getElementById("difficulty-menu").dataset.value || '5x5_5';
    
    if (difficultyValue === 'custom') {
        rows = parseInt(document.getElementById('custom-rows').value);
        cols = parseInt(document.getElementById('custom-cols').value);
        mines = parseInt(document.getElementById('custom-mines').value);
    } else {
        [rows, cols, mines] = difficultyValue.split(/x|_/).map(Number);
    }
    
    gameOver = false;
    initializeGrid();
    placeMines();
    gameStartTime = new Date();
}

// Función para limitar el valor máximo de columnas a 50
document.getElementById("custom-cols").addEventListener("input", function () {
    if (this.value > 50) {
        this.value = 50;
    }
});

loadScores();
