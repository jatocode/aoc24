const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const line = data.split('\n')

const puzzle = []
let guard = []
let guarddir = 0
const dir = [[0, -1], [1, 0], [0, 1], [-1, 0]]
let prevs = []
let guardinit = []
line.forEach((line, y) => {
    const x = line.indexOf('^')
    if (x !== -1) {
        guard = [x, y]
        guardinit = [x, y]
    }
    puzzle.push(line.split(''))
})
printPuzzle(puzzle)
let [positions, loop] = moveGuard(guard,[...puzzle])
printPuzzle(puzzle)
console.log('Del 1:', positions)

// Del 2
let loops = 0
for (let y = 0; y < puzzle.length; y++) {
    for (let x = 0; x < puzzle[y].length; x++) {
        // let puzzlecopy = JSON.parse(JSON.stringify(puzzle))
        if (puzzle[y][x] == '.') puzzle[y][x] = 'O'
        else continue
       // printPuzzle(puzzle)

        //console.log('Testing', x, y)
        let [positions, loop] = moveGuard(guardinit, puzzle)
        if (loop) {
            console.log('loop!')
            loops++
        } else {
            puzzle[y][x] = '.'
        }
    }
}
console.log('Del 2:', loops)


function moveGuard(guard, puzzle) {
    let positions = 0
    let next = puzzle[guard[1]][guard[0]]
    do {
        let [dx, dy] = dir[guarddir]
        let nx = guard[0] + dx
        let ny = guard[1] + dy
        if (puzzle[ny] === undefined) break

        next = puzzle[ny][nx]
        if (next != '#' && next != 'O') {
            guard[0] += dx
            guard[1] += dy
            puzzle[ny][nx] = 'X'
            if (next != 'X' && next != 'O') {
                prevs.push([[nx, ny], [dx, dy]])
                positions++
            }
        } else {
            guarddir = (guarddir + 1) % dir.length
            dx = dir[guarddir][0]
            dy = dir[guarddir][1]
        }

        // Loop detection
        if (next == 'O' || next == 'X') {
            let f = prevs.find(([pos, dir]) => {
                return pos[0] == nx && pos[1] == ny && dir[0] == dx && dir[1] == dy
            })
            if (f != undefined) {
                console.log('loop found at', nx, ny)
                return [positions, true]
            }
        }
    } while (next != undefined);
    return [positions, false]
}

function printPuzzle(puzzle) {
    puzzle.forEach(line => {
        console.log(line.join(''))
    })
    console.log()
}