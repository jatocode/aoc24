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
const match = line.matchAll(/(mul\((\d+),(\d+)\))/g)
const conds = line.matchAll(/(don\'t\(\).*?do\(\))/g)
const disabledParts = []
for (const c of conds) {
    disabledParts.push([c.index, c.index + c[1].length])
}
for (const m of match) {
    const disabled = disabledParts.filter(d => {
    //    console.log(m[0], m.index, d[0], d[1], m.index > d[0] && m.index < d[1])
        return d[1], m.index > d[0] && m.index < d[1]
    }).length > 0
    sum += parseInt(m[2]) * parseInt(m[3])
    if (!disabled) sum2 += parseInt(m[2]) * parseInt(m[3])
}

console.log('Del 1:', sum)
console.log('Del 2:', sum2)
