const fs = require('fs')
const { TestContext } = require('node:test')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let sum = 0
let sum2 = 0
let calibs = []
lines.forEach((line, y) => {
    if (line.length == 0) return
    const match = line.match(/(\d+):(.*)/)
    const test = parseInt(match[1])
    const values = match[2].trim().split(' ').map(x => parseInt(x))
    calibs.push({test, values})
    sum += check(test, values) ? test : 0
    sum2 += check(test, values, true) ? test : 0
})

console.log('Del 1', sum)
console.log('Del 2', sum2)

function check(test, values, concat = false) {
    if (values[0] > test) return false
    if (values.length === 1) return values[0] === test 
    const rem = values.slice(2)
    const valp = [values[0] + values[1], ...rem]
    const valm = [values[0] * values[1], ...rem]
    if(concat) {
        // älskar javascript
        const valc = [+`${values[0]}${values[1]}`, ...rem]
        return check(test, valp, true) || check(test, valm, true) || check(test, valc, true)
    }
    
    return check(test, valp) || check(test, valm)
    
}
