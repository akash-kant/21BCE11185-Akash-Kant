const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send(JSON.stringify({ type: 'init' }));
};

ws.onmessage = (message) => {
  const data = JSON.parse(message.data);
  switch (data.type) {
    case 'init':
    case 'update':
      renderBoard(data.state.board);
      break;
    case 'invalid':
      alert(data.message);
      break;
  }
};

const renderBoard = (board) => {
  const boardDiv = document.getElementById('board');
  boardDiv.innerHTML = '';
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';
     
      if (cell) {
        cellDiv.textContent = cell;
        cellDiv.classList.add(cell[0]); // 'A' or 'B' to style according to player
      }

      cellDiv.addEventListener('click', () => handleCellClick(rowIndex, colIndex));

      boardDiv.appendChild(cellDiv);
    });
  });
};

const handleCellClick = (row, col) => {
  const selectedCell = document.getElementById('board').children[row * 5 + col];
  const character = selectedCell.textContent;

  if (!character) return; // No character in this cell

  const directions = getValidDirections(character, row, col);
  if (directions.length === 0) return; // No valid moves

  const move = prompt(`Enter move for ${character} (Directions: ${directions.join(', ')})`);

  if (directions.includes(move)) {
    ws.send(JSON.stringify({ type: 'move', move: `${character}:${move}` }));
  } else {
    alert('Invalid move');
  }
};

const getValidDirections = (character, row, col) => {
  const validDirections = [];
  const player = character[0];
  const charType = character[2];

  switch (charType) {
    case 'P':
      if (col > 0) validDirections.push('L');
      if (col < 4) validDirections.push('R');
      if (row > 0) validDirections.push('F');
      if (row < 4) validDirections.push('B');
      break;
    case 'H1':
      if (col > 1) validDirections.push('L');
      if (col < 3) validDirections.push('R');
      if (row > 1) validDirections.push('F');
      if (row < 3) validDirections.push('B');
      break;
    case 'H2':
      if (row > 1 && col > 1) validDirections.push('FL');
      if (row > 1 && col < 3) validDirections.push('FR');
      if (row < 3 && col > 1) validDirections.push('BL');
      if (row < 3 && col < 3) validDirections.push('BR');
      break;
  }

  return validDirections;
};
