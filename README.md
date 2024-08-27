# 21BCE11185-Akash-Kant
The game involves two players controlling teams of characters in a 5x5 grid. Each player takes turns moving their characters based on specific movement rules. This project showcases real-time multiplayer capabilities and interactive game mechanics using modern web technologies.

# Features
Multiplayer Support: Play against another player or the computer.
Real-Time Updates: Game state is updated in real-time for all connected players using WebSocket.
Interactive UI: Dynamic game board with clickable cells and movement options.
Character Movement: Move characters with different rules for Pawns, Hero1, and Hero2.
Getting Started
* Prerequisites
Node.js (v14 or later)
npm (Node Package Manager)
* Installation
Clone the Repository

bash
Copy code
git clone https://github.com/your-username/hitwicket.git
cd hitwicket
Install Dependencies

Run the following command to install the necessary dependencies:

bash
Copy code
npm install
Start the Server

Run the server using:

bash
Copy code
npm start
The server will be available at http://localhost:8080.

# Access the Game

Open index.html in your web browser to start playing. You can access it directly from the server or open the file locally.

# Project Structure
server.js: Node.js server file that handles WebSocket connections and game logic.
public/: Contains static files served by the Express server.
index.html: HTML file for the game interface.
client.js: JavaScript file handling client-side logic and interactions.
package.json: npm configuration file with project metadata and dependencies.
Game Logic
Board Initialization: Sets up a 5x5 grid with characters in their starting positions.
Move Processing: Handles character movements based on player input and updates the game state.
Validation: Ensures that moves are valid according to the rules defined for each character type.
