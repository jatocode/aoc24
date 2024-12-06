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
let correct = []
let failed = []
for (const update of updates) {
    let valid = true
    valid = checkRules(update)
    if (valid) correct.push(update)
    else failed.push(update)
}

// Del 2
failed.forEach(x => {
    while (!(rules.every(y => !(x.includes(y[0])) || !(x.includes(y[1])) || x.indexOf(y[0]) < x.indexOf(y[1])))) {
        rules.forEach(y => {
            if (!(x.includes(y[0]) && x.includes(y[1]))) return;
            if (x.indexOf(y[0]) < x.indexOf(y[1])) return;
            temp = x[x.indexOf(y[0])];
            x[x.indexOf(y[0])] = x[x.indexOf(y[1])];
            x[x.indexOf(y[1])] = temp;
        });
    }
});
middleTot = correct.reduce((acc, x) => acc + x[Math.floor(x.length / 2)], 0)
failedMiddle = failed.reduce((acc, x) => acc + x[Math.floor(x.length / 2)], 0)

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


