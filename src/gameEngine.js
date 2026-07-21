const KINDS = new Set(['vampire', 'werewolf', 'ghost']);
const EDGES = ['top', 'right', 'bottom', 'left'];
const inside = (r, c) => Number.isInteger(r) && Number.isInteger(c) && r >= 0 && r < 10 && c >= 0 && c < 10;
const edge = (e, r, c) => (e === 'top' && r === 0) || (e === 'right' && c === 9) || (e === 'bottom' && r === 9) || (e === 'left' && c === 0);

function winnerOf(a, b) {
    if (a === b) return null;
    if ([a, b].includes('vampire') && [a, b].includes('werewolf')) return 'vampire';
    if ([a, b].includes('werewolf') && [a, b].includes('ghost')) return 'werewolf';
    return 'ghost'
}

class GameEngine {
    constructor(id) {
        Object.assign(this, {
            id,
            status: 'waiting',
            round: 0,
            version: 0,
            players: [],
            monsters: [],
            events: [],
            nextId: 1,
            winnerId: null
        })
    }

    addPlayer(id, name) {
        if (this.status !== 'waiting') throw Error('Game already started');
        if (this.players.length >= 4) throw Error('Game is full');
        const p = {
            id,
            name: String(name || 'Player').trim().slice(0, 20),
            edge: EDGES[this.players.length],
            removed: 0,
            ended: false
        };
        this.players.push(p);
        this.log(`${p.name} joined`);
        return p
    }

    start(id) {
        if (this.players[0]?.id !== id) throw Error('Only the host can start');
        if (this.players.length < 2) throw Error('At least two players are required');
        this.status = 'playing';
        this.round = 1;
        this.reset();
        this.log('Game started')
    }

    player(id) {
        const p = this.players.find(x => x.id === id);
        if (!p) throw Error('Player not found');
        return p
    }

    active(id) {
        const p = this.player(id);
        if (this.status !== 'playing' || p.ended || p.removed >= 10) throw Error('You cannot act now');
        return p
    }

    place(id, kind, row, col) {
        const p = this.active(id);
        if (!KINDS.has(kind)) throw Error('Invalid monster');
        if (!inside(row, col) || !edge(p.edge, row, col)) throw Error('Use your own edge');
        if (p.placed) throw Error('One new monster per round');
        if (this.at(row, col)) throw Error('Square is occupied');
        this.monsters.push({
            id: `m${this.nextId++}`,
            ownerId: id,
            kind,
            row,
            col,
            created: this.round,
            moved: this.round
        });
        p.placed = true;
        this.log(`${p.name} placed ${kind}`)
    }

    move(id, monsterId, row, col) {
        const p = this.active(id), m = this.monsters.find(x => x.id === monsterId);
        if (!m || m.ownerId !== id) throw Error('Choose your monster');
        if (m.created === this.round || m.moved === this.round) throw Error('This monster cannot move again this round');
        if (!inside(row, col) || (m.row === row && m.col === col)) throw Error('Invalid destination');
        const dr = row - m.row, dc = col - m.col;
        if (!(dr === 0 || dc === 0) && !(Math.abs(dr) === Math.abs(dc) && Math.abs(dr) <= 2)) throw Error('Move straight, or diagonal up to 2');
        const sr = Math.sign(dr), sc = Math.sign(dc);
        let r = m.row + sr, c = m.col + sc;
        while (r !== row || c !== col) {
            const b = this.at(r, c);
            if (b && b.ownerId !== id) throw Error('Opponent blocks the path');
            r += sr;
            c += sc
        }
        const target = this.at(row, col);
        m.row = row;
        m.col = col;
        m.moved = this.round;
        if (target) this.fight(m, target);
        this.log(`${p.name} moved ${m.kind}`);
        this.check()
    }

    at(r, c) {
        return this.monsters.find(m => m.row === r && m.col === c)
    }

    fight(a, b) {
        const win = winnerOf(a.kind, b.kind), gone = win === null ? [a, b] : [a.kind === win ? b : a];
        for (const m of gone) {
            this.monsters = this.monsters.filter(x => x.id !== m.id);
            this.player(m.ownerId).removed++
        }
        this.log(win ? `${win} won a battle` : `Both ${a.kind}s were removed`)
    }

    endTurn(id) {
        const p = this.active(id);
        p.ended = true;
        this.log(`${p.name} ended turn`);
        if (this.players.filter(x => x.removed < 10).every(x => x.ended)) {
            this.round++;
            this.reset();
            this.log(`Round ${this.round}`)
        }
    }

    reset() {
        for (const p of this.players) {
            p.ended = p.removed >= 10;
            p.placed = false
        }
    }

    check() {
        for (const p of this.players) if (p.removed >= 10) p.ended = true;
        const a = this.players.filter(p => p.removed < 10);
        if (this.players.length > 1 && a.length === 1) {
            this.status = 'finished';
            this.winnerId = a[0].id;
            this.log(`${a[0].name} won`)
        }
    }

    log(message) {
        this.version++;
        this.events.unshift({at: new Date().toISOString(), message});
        this.events = this.events.slice(0, 20)
    }

    state() {
        return structuredClone({
            id: this.id,
            status: this.status,
            round: this.round,
            version: this.version,
            players: this.players,
            monsters: this.monsters,
            events: this.events,
            winnerId: this.winnerId
        })
    }
}

module.exports = {GameEngine, winnerOf};
