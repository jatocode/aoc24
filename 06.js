const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const line = data.split('\n')

const puzzle = []
let guard = []
line.forEach((line, y) => {
    const x = line.indexOf('^')
    if (x !== -1) {
        guard = [x, y]
    }
    puzzle.push(line.split(''))
})
let puzzlecopy = JSON.parse(JSON.stringify(puzzle))
let [positions, loop] = moveGuard(guard,puzzlecopy)
console.log('Del 1:', positions)
// Del 2
let loops = 0
for (let y = 0; y < puzzle.length; y++) {
    for (let x = 0; x < puzzle[y].length; x++) {
        puzzlecopy = JSON.parse(JSON.stringify(puzzle))
        if (puzzlecopy[y][x] == '.') puzzlecopy[y][x] = 'O'
        else continue
        let [positions, loop] = moveGuard(guard, puzzlecopy)
        if (loop) {
            loops++
        }
        puzzlecopy[y][x] = '.'
    }
}
console.log('Del 2:', loops)

function moveGuard(start, p) {
    let prevs = []
    let positions = 0
    let guarddir = 0
    let guard = [start[0], start[1]]
    const dir = [[0, -1], [1, 0], [0, 1], [-1, 0]]
    let next = p[guard[1]][guard[0]]
    do {
        let [dx, dy] = dir[guarddir]
        let nx = guard[0] + dx
        let ny = guard[1] + dy
        if (p[ny] === undefined) break

        next = p[ny][nx]
        if (next != '#' && next != 'O') {
            guard[0] += dx
            guard[1] += dy
            p[ny][nx] = 'X'
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
                return [positions, true]
            }
        }
    } while (next != undefined);
    return [positions, false]
}

function printPuzzle(p) {
    p.forEach(line => {
        console.log(line.join(''))
    })
    console.log()
}