const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let left = []
let right = []
lines.forEach(x => {
    const match = x.match(/(\d+)\s+(\d+)/)
    left.push(parseInt(match[1]))
    right.push(parseInt(match[2]))
})
const lsorted = left.sort((a, b) => a - b)
const rsorted = right.sort((a, b) => a - b)

// Skrev om det till reduce bara för att se om jag kunde. Blir två loopar men coolare
const tot = lsorted.reduce((prev, val, i) => prev + Math.abs(rsorted[i] - val), 0)
const simscore = lsorted.reduce((prev, val, i) => prev + val * right.filter(r => r === val).length, 0)

console.log('Del 1: ' + tot)
console.log('Del 2: ' + simscore)
