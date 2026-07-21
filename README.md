# 👾 Monster Mayhem Concurrent Board Game

A real-time multiplayer board game developed for the Concurrent Systems Repeat Continuous Assessment.

Monster Mayhem is played on a 10 × 10 grid by two to four players. Each player controls one edge of the board and can place vampires, werewolves and ghosts. The Node.js server manages multiple games, validates every action and sends real-time updates to all connected clients.

---

## ✨ Features

- Real-time multiplayer gameplay
- Support for two to four players
- Multiple games running at the same time
- 10 × 10 interactive board
- Vampire, werewolf and ghost battle rules
- Horizontal, vertical and diagonal movement
- Simultaneous player turns
- Automatic round progression
- Player elimination after ten removed monsters
- Game winner detection
- Live game event history
- Total completed games counter
- Player win and loss statistics
- Server-side action validation
- Independent concurrency queue for every game
- Automated tests for important game rules
- Responsive browser interface

---

## 🛠️ Technologies

- JavaScript
- Node.js
- Express
- Socket.IO
- HTML5
- CSS3
- Node.js Test Runner
- Git
- GitHub
- IntelliJ IDEA

---

## 📁 Project Structure

```text
RepeatCA_ConcSys_Aline
│
├── docs
│   └── Report.doc
│
├── public
│   ├── app.js
│   ├── index.html
│   └── style.css
│
├── src
│   ├── gameEngine.js
│   ├── manager.js
│   └── server.js
│
├── test
│   └── gameEngine.test.js
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🎮 Game Rules

Each player controls one edge of the 10 × 10 board.

During each round, a player can:

- Place one new monster on their own edge
- Move each older monster once
- End their turn when they are finished

A newly placed monster cannot move during the same round.

Monsters can move:

- Any number of squares horizontally
- Any number of squares vertically
- Up to two squares diagonally

A monster can move over monsters belonging to the same player, but it cannot move over an opponent’s monster.

---

## ⚔️ Battle Rules

When two monsters finish on the same square, the server applies these rules:

| Battle | Result |
|--------|--------|
| Vampire vs Werewolf | Vampire wins |
| Werewolf vs Ghost | Werewolf wins |
| Ghost vs Vampire | Ghost wins |
| Two identical monsters | Both are removed |

A player is eliminated when ten of their monsters have been removed.

The final active player wins the game.

---

## 🔄 Client/Server Architecture

The browser acts as the game client. It displays the board and sends player intentions to the server.

The Node.js server is authoritative. This means that the server owns the official game state and validates every action before changing the board.

The client cannot directly change:

- Monster positions
- Player scores
- Turn status
- Round number
- Battle results
- Win or loss statistics

After every valid action, the server broadcasts the latest official state to all clients in the same Socket.IO room.

---

## ⚡ Concurrency Design

Players can take their turns at the same time. This creates a risk of race conditions when two actions reach the server almost together.

The project uses one serial action queue for every game.

```text
Client action
     ↓
Game-specific queue
     ↓
Server validation
     ↓
Official state update
     ↓
Broadcast to all game clients
```

Only one action can change a particular game at a time. The next action waits until the current action has finished.

Different games use different queues. Therefore, actions in Game A do not block actions in Game B.

This design provides:

- Protection against race conditions
- Atomic validation and state changes
- Consistent board information
- Isolation between different games
- Correct game and player statistics
- Real-time updates for every client

---

## 🚀 Installing the Project

Node.js 20 or newer is recommended.

Open the project in IntelliJ IDEA and use the terminal inside the project directory.

Install the dependencies:

```bash
npm install
```

Run the automated tests:

```bash
npm test
```

Start the server:

```bash
npm start
```

Open the following address in a browser:

```text
http://localhost:3000
```

Open the address in two or more browser windows to simulate different players.

---

## 🕹️ Playing the Game

1. Enter a player name.
2. Create a new game.
3. Copy the six-character game code.
4. Open another browser window.
5. Join using another player name and the game code.
6. The host starts the game.
7. Select a monster type.
8. Click a square on your coloured edge to place it.
9. In later rounds, click one of your monsters.
10. Click a valid destination to move it.
11. Select **End My Turn** when finished.

The next round begins when every active player has ended their turn.

---

## ✅ Automated Tests

The test suite checks important game rules, including:

- Vampire, werewolf and ghost battle results
- Placement on the correct player edge
- Prevention of immediate movement by new monsters
- Round progression after all players finish
- Removal of identical monsters
- Opponent blocking a movement path

Run the tests with:

```bash
npm test
```

---

## 📊 Statistics

The interface displays:

- Total number of completed games
- Number of games won by the player
- Number of games lost by the player

The current version stores statistics in server memory. The information resets when the Node.js server is restarted.

A production version could store this information in a transactional database.

---

## ⚠️ Current Limitations

- Game information is stored in memory
- Statistics reset when the server restarts
- Players do not have permanent accounts
- A disconnected player cannot currently reconnect automatically
- The project is designed for one Node.js server process

Possible future improvements include:

- Database persistence
- User authentication
- Automatic reconnection
- Match history
- Spectator mode
- Turn timer
- Redis support for multiple server processes
- Rate limiting and additional security controls

---

## 👩‍💻 Author

**Aline Oliveira**

🎓 BSc (Hons) Computing and IT  
🏫 CCT College Dublin