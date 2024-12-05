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
    valid = checkRules(update)

    const middle = update[Math.floor(update.length / 2)]
    if (valid) middleTot += middle
}

console.log('Del 1:', middleTot)

function checkRules(update) {
    let valid = true
    for (const page of update) {
        const otherpages = update.filter(o => o != page)
        const pagerules = rules.filter(r => r[0] == page || r[1] == page)
        for (const other of otherpages) {
            for (const rule of pagerules) {
                if (rule[0] == page && rule[1] == other &&
                    update.indexOf(page) > update.indexOf(other)) {
                    valid = false
                    break
                } else if (rule[0] == other && rule[0] == page &&
                    update.indexOf(other) > update.indexOf(page)) {
                    valid = false
                    break
                } else {
                    continue
                }
            }
        }
    }
    return valid
}

