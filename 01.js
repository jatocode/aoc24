const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let left = []
let right = []
lines.forEach(x => {
    let match = x.match(/(\d+)\s+(\d+)/)
    left.push(parseInt(match[1]))
    right.push(parseInt(match[2]))
})
let lsorted = left.sort((a, b) => a - b)
let rsorted = right.sort((a, b) => a - b)

let tot = 0 
let simscore = 0
for (let i = 0; i < lsorted.length; i++) {
    let l = lsorted[i]
    let r = rsorted[i]
    tot += Math.abs(l - r)

    let lcount = right.filter(r => r === l).length
    simscore += l * lcount
}

console.log('Del 1: ' + tot)
console.log('Del 2: ' + simscore)

