const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let sum = 0
let sum2 = 0
let line = ''
lines.forEach(l => {
    line += l
});

sum = sumMul(line)
sum2 = sumMulWithCond(line)

console.log('Del 1:', sum)
console.log('Del 2:', sum2)

function sumMul(line) {
    const match = line.matchAll(/(mul\((\d+),(\d+)\))/g)
    let sum = 0
    for (const m of match) {
        sum += parseInt(m[2]) * parseInt(m[3])
    }
    return sum
}

function sumMulWithCond(line) {
    const match = line.matchAll(/(mul\((\d+),(\d+)\)|do\(\)|don\'t\(\))/g)
    let sum = 0
    let enabled = true
    for (const m of match) {
        if (m[1] == undefined) continue
        if (m[1] == 'do()') enabled = true
        if (m[1] == 'don\'t()') enabled = false

        if (enabled && m[1].startsWith('mul')) sum += parseInt(m[2]) * parseInt(m[3])
    }
    return sum
}

// Fick den inte att funka :D :'( 
function sumMulWithCondNotworking(line) {
    const match = line.matchAll(/(mul\((\d+),(\d+)\))/g)
    let sum = 0
    for (const m of match) {
        const dos = 1 + line.slice(0, m.index).matchAll(/(do\(\))/g).toArray().length // vi börjar med ett do, så lägg på 1
        const donts = line.slice(0, m.index).matchAll(/(don\'t\(\))/g).toArray().length
        if (donts > dos) continue
        sum += parseInt(m[2]) * parseInt(m[3])
    }
    return sum
}
