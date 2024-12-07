const fs = require('fs')
const { TestContext } = require('node:test')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let sum = 0
let c = []
lines.forEach((line, y) => {
    if (line.length == 0) return
    const match = line.match(/(\d+):(.*)/)
    const test = parseInt(match[1])
    const values = match[2].trim().split(' ').map(x => parseInt(x))
    sum += check(test, values) ? test : 0
})
console.log('Del 1', sum)

function check(test, values) {
    if (values.length === 1) return values[0] === test 
    const rem = values.slice(2)
    const valp = [values[0] + values[1], ...rem]
    const valm = [values[0] * values[1], ...rem]
    return check(test, valp) || check(test, valm)
}
