const socket = io(), $ = id => document.getElementById(id);
let me = null, state = null, kind = 'vampire', selected = null;
const icons = {vampire: '🧛', werewolf: '🐺', ghost: '👻'};

function emit(event, payload = {}) {
    socket.emit(event, payload, r => {
        console.log("Server response:", event, r);
        if (!r.ok) {
            msg(r.error);
                if (event === "turn:end") {
                    $("end").disabled = false;
                    $("end").textContent = "End my turn";
                }
                return;
    }
        if (r.player) {
            me = r.player;
            $('lobby').hidden = true;
            $('game').hidden = false;
            $('gameId').textContent = r.gameId
        }
        if (r.stats) {
            $('won').textContent = r.stats.won;
            $('lost').textContent = r.stats.lost
        }
    });
}

function msg(t) {
    $('message').textContent = t;
    $('notice').textContent = t
}

$('create').onclick = () => emit('game:create', {name: $('name').value});
$('join').onclick = () => emit('game:join', {name: $('name').value, gameId: $('code').value});
$('start').onclick = () => emit('game:start');
$("end").onclick = () => {
    if (!state || $("end").disabled) {
        return;
    }
    $("end").disabled = true;
    $("end").textContent = "Waiting turn";
    emit("turn:end", {
        round: state.round
    });
};

document.querySelectorAll('[data-kind]').forEach(b => b.onclick = () => {
    kind = b.dataset.kind;
    document.querySelectorAll('[data-kind]').forEach(x => x.classList.toggle('active', x === b))
});
document.querySelector('[data-kind]').classList.add('active');
socket.on('lobby:state', x => {
    $('total').textContent = x.completed;
    $('games').innerHTML = x.games.map(g => `<button onclick="document.getElementById('code').value='${g.id}'">${g.id} · ${g.host} · ${g.players}/4</button>`).join(' ') || 'No open games yet.'
});
socket.on('game:state', s => {
    state = s;
    render()
});

function render() {
    if (!state) return;
    $('status').textContent = state.status;
    $('round').textContent = state.round;
    $('players').innerHTML = state.players.map(p => `<div class="player"><b>${p.name}${p.id === me?.id ? ' (you)' : ''}</b><br>${p.edge} · removed ${p.removed}/10 ${p.ended ? '· ready' : ''}</div>`).join('');
    $('events').innerHTML = state.events.map(e => `<li>${e.message}</li>`).join('');
    $('start').hidden = state.status !== 'waiting' || state.players[0]?.id !== me?.id;
    $('end').hidden = state.status !== 'playing';

    const currentPlayer = state.players.find(player => player.id === me?.id);
    const waitingTurn = currentPlayer?.ended === true;

    $("end").textContent = waitingTurn
        ? "Waiting turn"
        : "End my turn";
    $("end").disabled = waitingTurn;

    const board = $('board');
    board.innerHTML = '';
    for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
        const cell = document.createElement('button'), m = state.monsters.find(x => x.row === r && x.col === c);
        cell.className = `cell ${r === 0 ? 'top ' : ''}${r === 9 ? 'bottom ' : ''}${c === 0 ? 'left ' : ''}${c === 9 ? 'right ' : ''}${m?.id === selected ? 'selected' : ''}`;
        cell.innerHTML = m ? `${icons[m.kind]}<small class="owner">${state.players.find(p => p.id === m.ownerId)?.name[0] || ''}</small>` : '';
        cell.onclick = () => clickCell(r, c, m);
        board.appendChild(cell)
    }
}

function clickCell(row, col, m) {
    if (state.status !== 'playing') return msg('The game is not running.');
    if (selected) {
        emit('monster:move', {monsterId: selected, row, col});
        selected = null;
        return
    }
    if (m && m.ownerId === me.id) {
        selected = m.id;
        render();
        return
    }
    emit('monster:place', {kind, row, col})
}
