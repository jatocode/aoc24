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
for (const update of updates) {
    let valid = true
    for (const page of update) {
        const pagerules = rules.filter(r => r[0] == page || r[1] == page)
        valid &&= checkRules(page, update.filter(u => u != page), update, pagerules)
        if (!valid) break
    }
    const middle = update[Math.floor(update.length / 2)]
    if (valid) middleTot += middle
}

console.log('Del 1:', middleTot)


function checkRules(page, otherpages, update, rules) {
    for (const other of otherpages) {
        for (const rule of rules) {
            if (rule[0] == page && rule[1] == other) {
                if(update.indexOf(page) > update.indexOf(other)) {
                    return false
                }
            } else if (rule[0] == other && rule[0] == page) {
                if(update.indexOf(other) > update.indexOf(page)) {
                    return false
                }
            } else {
                continue
            }
        }
    }
    return true
}

