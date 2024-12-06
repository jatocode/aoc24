const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

const puzzle = []
let guard = []
lines.forEach((line, y) => {
    const x = line.indexOf('^')
    if (x !== -1) {
        guard = [x, y]
    }
    puzzle.push(line.split(''))
})
let firstpass = JSON.parse(JSON.stringify(puzzle))
let [positions, _] = moveGuard(guard, firstpass)
console.log('Del 1:', positions)
// Del 2
let loops = 0
let cache = {}
for (let y = 0; y < puzzle.length; y++) {
    let now = Date.now()
    for (let x = 0; x < puzzle[y].length; x++) {
        if (firstpass[y][x] != 'X') continue
        let puzzlecopy = JSON.parse(JSON.stringify(puzzle))
        if (puzzlecopy[y][x] == '.') puzzlecopy[y][x] = 'O'
        else continue
        // const hash = puzzlecopy[y].join('')
        // if(hash in cache) {
        //     console.log('Memo hit')
        //     check = cache[hash]
        // } else {
        //     check = moveGuard(guard, puzzlecopy)
        //     cache[hash] = check
        // }
        const check = moveGuard(guard, puzzlecopy)
        const [_, loop] = check
        if (loop) {
            loops++
        }
        puzzlecopy[y][x] = '.'
    }
    console.log({ y, time: Date.now() - now })
}
console.log('Del 2:', loops)

function moveGuard(start, p) {
    let cache = new Set()
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
                cache.add(nx+','+ny+','+dx+','+dy)
                positions++
            }
        } else {
            guarddir = (guarddir + 1) % dir.length
            dx = dir[guarddir][0]
            dy = dir[guarddir][1]
        }
        // Loop detection
        if (next == 'O' || next == 'X') {
            if (cache.has(nx+','+ny+','+dx+','+dy)) {
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