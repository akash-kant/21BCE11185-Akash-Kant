const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let gameState = {
  board: Array(5).fill().map(() => Array(5).fill(null)),
  players: { A: [], B: [] },
  currentPlayer: 'A',
};

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const initializeGame = () => {
  gameState.board = Array(5).fill().map(() => Array(5).fill(null));
  gameState.players = { A: [], B: [] };
  gameState.currentPlayer = 'A';
  // Example initial positions
  gameState.players.A = ['A-P1', 'A-H1', 'A-H2', 'A-P2', 'A-P3'];
  gameState.players.B = ['B-P1', 'B-H1', 'B-H2', 'B-P2', 'B-P3'];
  gameState.players.A.forEach((char, index) => gameState.board[0][index] = char);
  gameState.players.B.forEach((char, index) => gameState.board[4][index] = char);
};

const isValidMove = (character, move) => {const [charType, direction] = [character[2], move];

    // Find the character's current position
    const [x, y] = findCharacterPosition(character);
  
    // Ensure the character is found on the board
    if (x === -1 || y === -1) {
      return false;
    }
  
    // Check boundaries
    const isInBounds = (x, y) => x >= 0 && x < 5 && y >= 0 && y < 5;
  
    // Move validation based on character type
    switch (charType) {
      case 'P':
        switch (direction) {
          case 'L': return isInBounds(x, y - 1);
          case 'R': return isInBounds(x, y + 1);
          case 'F': return isInBounds(x - 1, y);
          case 'B': return isInBounds(x + 1, y);
          default: return false;
        }
      case 'H1':
        switch (direction) {
          case 'L': return isInBounds(x, y - 2);
          case 'R': return isInBounds(x, y + 2);
          case 'F': return isInBounds(x - 2, y);
          case 'B': return isInBounds(x + 2, y);
          default: return false;
        }
      case 'H2':
        switch (direction) {
          case 'FL': return isInBounds(x - 2, y - 2);
          case 'FR': return isInBounds(x - 2, y + 2);
          case 'BL': return isInBounds(x + 2, y - 2);
          case 'BR': return isInBounds(x + 2, y + 2);
          default: return false;
        }
      default:
        return false;
    }
};

const processMove = (move) => {
  const [character, direction] = move.split(':');
  const player = character[0];
  const charType = character[2];
  let [x, y] = findCharacterPosition(character);

  if (!isValidMove(character, direction)) {
    return false;
  }

  switch (charType) {
    case 'P':
      movePawn(x, y, direction);
      break;
    case 'H1':
      moveHero1(x, y, direction);
      break;
    case 'H2':
      moveHero2(x, y, direction);
      break;
  }

  gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
  return true;
};

const findCharacterPosition = (character) => {
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (gameState.board[i][j] === character) {
        return [i, j];
      }
    }
  }
  return [-1, -1];
};

const movePawn = (x, y, direction) => {
  gameState.board[x][y] = null;
  switch (direction) {
    case 'L':
      gameState.board[x][y - 1] = gameState.currentPlayer + '-P';
      break;
    case 'R':
      gameState.board[x][y + 1] = gameState.currentPlayer + '-P';
      break;
    case 'F':
      gameState.board[x - 1][y] = gameState.currentPlayer + '-P';
      break;
    case 'B':
      gameState.board[x + 1][y] = gameState.currentPlayer + '-P';
      break;
  }
};

const moveHero1 = (x, y, direction) => {
  gameState.board[x][y] = null;
  switch (direction) {
    case 'L':
      gameState.board[x][y - 2] = gameState.currentPlayer + '-H1';
      break;
    case 'R':
      gameState.board[x][y + 2] = gameState.currentPlayer + '-H1';
      break;
    case 'F':
      gameState.board[x - 2][y] = gameState.currentPlayer + '-H1';
      break;
    case 'B':
      gameState.board[x + 2][y] = gameState.currentPlayer + '-H1';
      break;
  }
};

const moveHero2 = (x, y, direction) => {
  gameState.board[x][y] = null;
  switch (direction) {
    case 'FL':
      gameState.board[x - 2][y - 2] = gameState.currentPlayer + '-H2';
      break;
    case 'FR':
      gameState.board[x - 2][y + 2] = gameState.currentPlayer + '-H2';
      break;
    case 'BL':
      gameState.board[x + 2][y - 2] = gameState.currentPlayer + '-H2';
      break;
    case 'BR':
      gameState.board[x + 2][y + 2] = gameState.currentPlayer + '-H2';
      break;
  }
};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    switch (data.type) {
      case 'init':
        initializeGame();
        ws.send(JSON.stringify({ type: 'init', state: gameState }));
        break;
      case 'move':
        if (processMove(data.move)) {
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ type: 'update', state: gameState }));
            }
          });
        } else {
          ws.send(JSON.stringify({ type: 'invalid', message: 'Invalid move' }));
        }
        break;
    }
  });
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
