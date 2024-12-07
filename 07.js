const fs = require('fs')
const { TestContext } = require('node:test')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let calibs = []
let sum = 0
lines.forEach((line, y) => {
    const match = line.match(/(\d+):(.*)/)
    const test = parseInt(match[1])
    const values = match[2].trim().split(' ').map(x => parseInt(x))
    calibs[test] = values
    sum += check(test, values)
})
console.table(calibs)

console.log('Del 1', sum)

function check(test, values) {
    const f1 = values.reduce((acc, x) => acc + x, 0)
    if (f1 == test) return f1
    const f2 = values.reduce((acc, x) => acc * x, 1)
    if (f2 == test) return f2
    const f3 = values.reduce((acc, x, i) => i % 2 == 0 ? acc + x : acc * x, 0)
    if (f3 == test) return f3
    const f4 = values.reduce((acc, x, i) => i % 2 == 0 ? acc * x : acc + x, 1)
    if (f4 == test) return f4

    return 0
}