const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const puzzle = data.split('\n')

let xmas = 0
let x_mas = 0
for (let y = 0; y < puzzle.length; y++) {
    for (let x = 0; x < puzzle[0].length; x++) {
        xmas += find(x, y)
        x_mas += findx_mas(x, y)
    }
}
console.log('Del 1:', xmas)
console.log('Del 2:', x_mas)

function find(sx, sy) {
    const xmas = 'XMAS'.split('')
    let numfound = 0
    if (puzzle[sy][sx] != xmas[0]) return 0
    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            let found = true
            for (let i = 0; i < xmas.length && found; i++) {
                let x = sx + dx * i
                let y = sy + dy * i
                found = puzzle[y] && puzzle[y][x] == xmas[i];
            }
            if (found) numfound++
        }
    }
    return numfound
}

function findx_mas(sx,sy) {
    if(puzzle[sy] && puzzle[sy][sx] != 'A') return 0
    let found = 0
    // Framåt
    if(puzzle[sy - 1] && puzzle[sy - 1][sx - 1] == 'M' && 
       puzzle[sy + 1] && puzzle[sy + 1][sx + 1] == 'S') found += 1  
    if(puzzle[sy + 1] && puzzle[sy + 1][sx - 1] == 'M' && 
       puzzle[sy - 1] && puzzle[sy - 1][sx + 1] == 'S') found += 1

    // Bakåt
    if(puzzle[sy - 1] && puzzle[sy - 1][sx - 1] == 'S' && 
        puzzle[sy + 1] && puzzle[sy + 1][sx + 1] == 'M') found += 1  
     if(puzzle[sy + 1] && puzzle[sy + 1][sx - 1] == 'S' && 
        puzzle[sy - 1] && puzzle[sy - 1][sx + 1] == 'M') found += 1

    return found > 1 ? 1 : 0
}
