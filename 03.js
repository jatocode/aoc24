const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let sum = 0
lines.forEach(line => {
    const match = line.matchAll(/.*?(mul\((\d+),(\d+)\)).*?/g)
    for(const m of match) {
        sum += parseInt(m[2]) * parseInt(m[3])
    }
})
console.log('Del 1:', sum)
