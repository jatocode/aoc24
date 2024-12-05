const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let rules = []
let updates = []
lines.forEach(line => {
    const matchr = line.match(/(\d+)\|(\d+)/)
    if (matchr) rules.push([parseInt(matchr[1]), parseInt(matchr[2])])
    else if (line.length > 1) updates.push(line.split(',').map(x => parseInt(x)))
})

let middleTot = 0
let failedMiddle = 0
for (const update of updates) {
    let valid = true
    valid = checkRules(update)


    const middle = update[Math.floor(update.length / 2)]
    if (valid) middleTot += middle
    else {
        // Memory goes brrrrr
        const fixed = findValidPermutations(update)
        console.log(fixed)
        failedMiddle += fixed[Math.floor(fixed.length / 2)]
    }
}

console.log('Del 1:', middleTot)
console.log('Del 2:', failedMiddle)

function checkRules(update) {
    let valid = true
    for (const page of update) {
        const otherpages = update.filter(o => o != page)
        const pagerules = rules.filter(r => r[0] == page || r[1] == page)
        for (const other of otherpages) {
            for (const rule of pagerules) {
                if (rule[0] == page && rule[1] == other && update.indexOf(page) > update.indexOf(other)) {
                    valid = false
                } else if (rule[0] == other && rule[0] == page && update.indexOf(other) > update.indexOf(page)) {
                    valid = false
                }
            }
        }
    }
    return valid
}

function findValidPermutations(arr) {
    let fixed = []
    function permute(subArr, m = []) {
        if (subArr.length === 0) {
            if (checkRules(m)) {
                fixed = m
            }
        } else {
            for (let i = 0; i < subArr.length; i++) {
                let curr = subArr.slice()
                let next = curr.splice(i, 1)
                permute(curr.slice(), m.concat(next))
            }
        }
    }
    permute(arr)
    return fixed
}