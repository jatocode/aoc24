const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const line = data.split('\n')

const puzzle = []
let guard = []
let guarddir = 0
const dir = [[0, -1], [1, 0], [0, 1], [-1, 0]]

line.forEach((line, y) => {
    const x = line.indexOf('^')
    if (x !== -1) {
        guard = [x, y]
    }
    puzzle.push(line.split(''))
})
printPuzzle(puzzle)
moveGuard()
printPuzzle(puzzle)

function moveGuard() {
    let [dx, dy] = dir[guarddir]

    let nx = guard[0] + dx
    let ny = guard[1] + dy
    let next = puzzle[ny][nx]
    while (next != undefined) {
        nx = guard[0] + dx
        ny = guard[1] + dy
        if(puzzle[ny] === undefined) {
            break
        }
        next = puzzle[ny][nx]
        if (next != '#') {
            guard[0] += dx
            guard[1] += dy
            puzzle[ny][nx] = 'X'
        } else {
            guarddir = (guarddir + 1) % dir.length
            dx = dir[guarddir][0]
            dy = dir[guarddir][1]
        }
    }
}

function printPuzzle(puzzle) {
    puzzle.forEach(line => {
        console.log(line.join(''))
    })
}