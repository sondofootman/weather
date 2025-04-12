document.addEventListener('DOMContentLoaded', () => {
            const GRID_SIZE = 4;
            let grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
            let score = 0;
            let gameOver = false;
            
            const gridElement = document.getElementById('grid');
            const scoreElement = document.getElementById('score');
            const gameOverElement = document.getElementById('game-over');
            const newGameButton = document.getElementById('new-game');
            const tryAgainButton = document.getElementById('try-again');
            
            // Initialize the game
            function initGame() {
                grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
                score = 0;
                gameOver = false;
                
                updateScore();
                renderGrid();
                
                // Add two initial tiles
                addRandomTile();
                addRandomTile();
                
                // Hide game over message
                gameOverElement.classList.add('hidden');
            }
            
            // Render the grid
            function renderGrid() {
                // Remove all tiles
                document.querySelectorAll('.tile').forEach(tile => tile.remove());
                
                // Create tiles for non-zero cells
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let col = 0; col < GRID_SIZE; col++) {
                        const value = grid[row][col];
                        if (value !== 0) {
                            const tile = document.createElement('div');
                            tile.className = `tile tile-${value} new-tile`;
                            tile.textContent = value;
                            
                            // Position the tile
                            tile.style.top = `${15 + row * 110}px`;
                            tile.style.left = `${15 + col * 110}px`;
                            
                            gridElement.appendChild(tile);
                            
                            // Remove the new-tile class after animation
                            setTimeout(() => {
                                tile.classList.remove('new-tile');
                            }, 200);
                        }
                    }
                }
            }
            
            // Add a random tile (2 or 4) to an empty cell
            function addRandomTile() {
                const emptyCells = [];
                
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let col = 0; col < GRID_SIZE; col++) {
                        if (grid[row][col] === 0) {
                            emptyCells.push({ row, col });
                        }
                    }
                }
                
                if (emptyCells.length > 0) {
                    const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
                    grid[row][col] = Math.random() < 0.9 ? 2 : 4;
                }
            }
            
            // Update the score display
            function updateScore() {
                scoreElement.textContent = score;
            }
            
            // Check if the game is over
            function checkGameOver() {
                // Check if there are any empty cells
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let col = 0; col < GRID_SIZE; col++) {
                        if (grid[row][col] === 0) {
                            return false;
                        }
                    }
                }
                
                // Check if there are any possible merges
                for (let row = 0; row < GRID_SIZE; row++) {
                    for (let col = 0; col < GRID_SIZE; col++) {
                        const value = grid[row][col];
                        
                        // Check right neighbor
                        if (col < GRID_SIZE - 1 && grid[row][col + 1] === value) {
                            return false;
                        }
                        
                        // Check bottom neighbor
                        if (row < GRID_SIZE - 1 && grid[row + 1][col] === value) {
                            return false;
                        }
                    }
                }
                
                return true;
            }
            
            // Move tiles in a direction
            function moveTiles(direction) {
                if (gameOver) return false;
                
                let moved = false;
                const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
                
                // Process based on direction
                if (direction === 'up') {
                    for (let col = 0; col < GRID_SIZE; col++) {
                        let position = 0;
                        for (let row = 0; row < GRID_SIZE; row++) {
                            if (grid[row][col] !== 0) {
                                if (newGrid[position][col] === 0) {
                                    newGrid[position][col] = grid[row][col];
                                } else if (newGrid[position][col] === grid[row][col]) {
                                    newGrid[position][col] *= 2;
                                    score += newGrid[position][col];
                                    position++;
                                } else {
                                    position++;
                                    newGrid[position][col] = grid[row][col];
                                }
                                moved = true;
                            }
                        }
                    }
                } else if (direction === 'down') {
                    for (let col = 0; col < GRID_SIZE; col++) {
                        let position = GRID_SIZE - 1;
                        for (let row = GRID_SIZE - 1; row >= 0; row--) {
                            if (grid[row][col] !== 0) {
                                if (newGrid[position][col] === 0) {
                                    newGrid[position][col] = grid[row][col];
                                } else if (newGrid[position][col] === grid[row][col]) {
                                    newGrid[position][col] *= 2;
                                    score += newGrid[position][col];
                                    position--;
                                } else {
                                    position--;
                                    newGrid[position][col] = grid[row][col];
                                }
                                moved = true;
                            }
                        }
                    }
                } else if (direction === 'left') {
                    for (let row = 0; row < GRID_SIZE; row++) {
                        let position = 0;
                        for (let col = 0; col < GRID_SIZE; col++) {
                            if (grid[row][col] !== 0) {
                                if (newGrid[row][position] === 0) {
                                    newGrid[row][position] = grid[row][col];
                                } else if (newGrid[row][position] === grid[row][col]) {
                                    newGrid[row][position] *= 2;
                                    score += newGrid[row][position];
                                    position++;
                                } else {
                                    position++;
                                    newGrid[row][position] = grid[row][col];
                                }
                                moved = true;
                            }
                        }
                    }
                } else if (direction === 'right') {
                    for (let row = 0; row < GRID_SIZE; row++) {
                        let position = GRID_SIZE - 1;
                        for (let col = GRID_SIZE - 1; col >= 0; col--) {
                            if (grid[row][col] !== 0) {
                                if (newGrid[row][position] === 0) {
                                    newGrid[row][position] = grid[row][col];
                                } else if (newGrid[row][position] === grid[row][col]) {
                                    newGrid[row][position] *= 2;
                                    score += newGrid[row][position];
                                    position--;
                                } else {
                                    position--;
                                    newGrid[row][position] = grid[row][col];
                                }
                                moved = true;
                            }
                        }
                    }
                }
                
                if (moved) {
                    grid = newGrid;
                    updateScore();
                    addRandomTile();
                    renderGrid();
                    
                    if (checkGameOver()) {
                        gameOver = true;
                        gameOverElement.classList.remove('hidden');
                    }
                }
                
                return moved;
            }
            
            // Event listeners
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp') {
                    moveTiles('up');
                } else if (e.key === 'ArrowDown') {
                    moveTiles('down');
                } else if (e.key === 'ArrowLeft') {
                    moveTiles('left');
                } else if (e.key === 'ArrowRight') {
                    moveTiles('right');
                }
            });
            
            newGameButton.addEventListener('click', initGame);
            tryAgainButton.addEventListener('click', initGame);
            
            // Touch controls for mobile
            let touchStartX = 0;
            let touchStartY = 0;
            let touchEndX = 0;
            let touchEndY = 0;
            
            gridElement.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, false);
            
            gridElement.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                touchEndY = e.changedTouches[0].screenY;
                handleSwipe();
            }, false);
            
            function handleSwipe() {
                const dx = touchEndX - touchStartX;
                const dy = touchEndY - touchStartY;
                
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 50) {
                        moveTiles('right');
                    } else if (dx < -50) {
                        moveTiles('left');
                    }
                } else {
                    if (dy > 50) {
                        moveTiles('down');
                    } else if (dy < -50) {
                        moveTiles('up');
                    }
                }
            }
            
            // Start the game
            initGame();
        });