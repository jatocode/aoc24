const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const puzzle = data.split('\n')
const xmas = 'XMAS'.split('')

let found = 0 
for(let y=0;y<puzzle.length;y++) {
    for(let x=0;x<puzzle[0].length;x++) {
        found += find(x,y)
    }
}
console.log('Del 1:', found)

function find(sx,sy) {
    let numfound = 0
    if(puzzle[sy][sx] != xmas[0]) return 0
    for(let dx=-1;dx<=1;dx++) {
        for(let dy=-1;dy<=1;dy++) {
            let found = true
            for(let i=0;i<xmas.length && found;i++) {
                let x = sx + dx * i
                let y = sy + dy * i
                found = puzzle[y] && puzzle[y][x] == xmas[i];
            }
            if (found) numfound++
        }
    }
    return numfound
}