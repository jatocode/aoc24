const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let tot = 0
let tot2 = 0
lines.forEach(line => {
    const level = line.split(' ').map(x => parseInt(x))
    const safe = checkLevel(level)
    if (safe) tot++
    else {
        for (let i = 0; i < level.length; i++) {
            const newlevel = [...level]
            newlevel.splice(i, 1)
            if (checkLevel(newlevel)) {
                tot2++
                break
            }
        }
    }
})

console.log('Del 1:', tot)
console.log('Del 2:', tot + tot2)

function checkLevel(level) {
    let inc = 0
    let dec = 0
    let safe = true
    level.forEach((x, i) => {
        const next = level[i + 1]
        if (next != undefined && x - next > 0) inc++
        if (next != undefined && x - next < 0) dec++
        if (!checkSafe(x, next)) safe = false
    })

    return safe && (inc == level.length - 1 || dec == level.length - 1);
}

function checkSafe(a, b) {
    if (b != undefined) {
        return Math.abs(a - b) > 0 && Math.abs(a - b) < 4
    }
    return true
}
