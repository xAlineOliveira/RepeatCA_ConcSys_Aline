const {randomUUID} = require('node:crypto');
const {GameEngine} = require('./gameEngine');

class Queue {
    constructor() {
        this.tail = Promise.resolve()
    }

    run(fn) {
        const r = this.tail.then(fn);
        this.tail = r.catch(() => {
        });
        return r
    }
}

class Manager {
    constructor() {
        this.games = new Map();
        this.queues = new Map();
        this.completed = 0;
        this.stats = new Map()
    }

    create() {
        const id = randomUUID().slice(0, 6).toUpperCase();
        this.games.set(id, new GameEngine(id));
        this.queues.set(id, new Queue());
        return this.games.get(id)
    }

    get(id) {
        const g = this.games.get(String(id || '').toUpperCase());
        if (!g) throw Error('Game not found');
        return g
    }

    mutate(id, fn) {
        const g = this.get(id);
        return this.queues.get(g.id).run(async () => {
            const v = await fn(g);
            if (g.status === 'finished' && !g.counted) {
                g.counted = true;
                this.completed++;
                for (const p of g.players) {
                    const s = this.stats.get(p.name) || {won: 0, lost: 0};
                    p.id === g.winnerId ? s.won++ : s.lost++;
                    this.stats.set(p.name, s)
                }
            }
            return v
        })
    }

    stat(n) {
        return this.stats.get(n) || {won: 0, lost: 0}
    }

    lobby() {
        return [...this.games.values()].filter(g => g.status === 'waiting').map(g => ({
            id: g.id,
            players: g.players.length,
            host: g.players[0]?.name
        }))
    }
}

module.exports = {Manager, Queue};
