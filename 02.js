const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

const levels = []
let safe = 0
lines.forEach(line => {
    const level = line.split(' ').map(x => parseInt(x))
    let safe = false
    for(let i=1;i<level.l;i++) {
        if(level[i] )
    }
})
