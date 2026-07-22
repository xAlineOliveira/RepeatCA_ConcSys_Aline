# 👾 Monster Mayhem Concurrent Board Game

Mayhem is a real-time multiplayer board game created for the Concurrent Systems Repeat CA. Two to four players use vampires, werewolves and ghosts on a 10 x 10 board while a Node.js server keeps every client updated.

---

## ✨ Main features

- Two to four players
- Multiple games running independently
- Simultaneous turns with real-time updates
- Server-side rule validation
- Vampire, werewolf and ghost battle system
- Player elimination, winner detection and live events
- Completed-game and win/loss statistics
- Automated game-rule tests

---

## 🛠️ Technologies

- JavaScript
- Node.js
- Express
- Socket.IO
- HTML and CSS
- Node.js Test Runner

---

## 📁 Project Structure

```text
RepeatCA_ConcSys_Aline
│
├── docs
│   └── RepeatCA_ConcSys_Aline_Report.doc
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
├── package-lock.json
└── README.md
```

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

1. Enter a name and create a game.
2. Share the six-character game code with the other players.
3. The host starts the game after at least one other player joins.
4. Select a monster and place it on your coloured edge.
5. In later rounds, select one of your monsters and choose a valid destination.
6. Click **End my turn** when finished. The next round starts after every active player ends their turn.

The next round begins when every active player has ended their turn.

---

## ✅ Automated Tests

The tests cover battles, edge placement, movement restrictions, blocked paths and round progression.

Run with:

```bash
npm test
```

---

## 👩‍💻 Author

**Aline Oliveira**

🎓 BSc (Hons) Computing and IT  
🏫 CCT College Dublin