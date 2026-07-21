const test = require('node:test'), assert = require('node:assert/strict');
const {GameEngine, winnerOf} = require('../src/gameEngine');

function game() {
    const g = new GameEngine('TEST');
    g.addPlayer('a', 'Ana');
    g.addPlayer('b', 'Ben');
    g.start('a');
    return g
}

test('Battle cycle follows the brief', () => {
    assert.equal(winnerOf('vampire', 'werewolf'), 'vampire');
    assert.equal(winnerOf('werewolf', 'ghost'), 'werewolf');
    assert.equal(winnerOf('ghost', 'vampire'), 'ghost');
    assert.equal(winnerOf('ghost', 'ghost'), null)
});
test('New monster is placed only on own edge and cannot move immediately', () => {
    const g = game();
    assert.throws(() => g.place('a', 'ghost', 3, 3));
    g.place('a', 'ghost', 0, 4);
    assert.throws(() => g.move('a', 'm1', 1, 4), /cannot move/)
});
test('Round advances only after every active player ends', () => {
    const g = game();
    g.endTurn('a');
    assert.equal(g.round, 1);
    g.endTurn('b');
    assert.equal(g.round, 2)
});
test('Same monsters remove each other', () => {
    const g = game();
    g.monsters = [{id: 'x', ownerId: 'a', kind: 'ghost', row: 2, col: 2, created: 0, moved: 0}, {
        id: 'y',
        ownerId: 'b',
        kind: 'ghost',
        row: 2,
        col: 4,
        created: 0,
        moved: 0
    }];
    g.move('a', 'x', 2, 4);
    assert.equal(g.monsters.length, 0);
    assert.equal(g.player('a').removed, 1);
    assert.equal(g.player('b').removed, 1)
});
test('Opponent blocks a straight path', () => {
    const g = game();
    g.monsters = [{id: 'x', ownerId: 'a', kind: 'ghost', row: 2, col: 2, created: 0, moved: 0}, {
        id: 'y',
        ownerId: 'b',
        kind: 'ghost',
        row: 2,
        col: 4,
        created: 0,
        moved: 0
    }];
    assert.throws(() => g.move('a', 'x', 2, 7), /blocks/)
});
