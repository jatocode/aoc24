const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let map = []
let antennas = new Map()
lines.forEach(line => {
    const row = line.split('')
    map.push(row)
    row.forEach((cell, x) => {
        if (cell != '.') {
            const prev = antennas.get(cell)
            if (prev) {
                prev.push([x, map.length - 1])
                antennas.set(cell, prev)
            } else {
                antennas.set(cell, [[x, map.length - 1]])
            }
        }
    })
})
let antidotes = new Set()
antennas.forEach((positions, name) => {
    for (let p of positions) {
        const other = positions.filter(x => x != p)
        for (let o of other) {
            const xd = (o[0] - p[0]) * -1
            const yd = (o[1] - p[1]) * -1
            const nx = p[0] + xd
            const ny = p[1] + yd

            if (map[ny] && map[ny][nx] != undefined ) {
                if (map[ny][nx] == '.') map[ny][nx] = '#'

                // Är det redan samma frekvens så skapa ingen antidot
                if (map[ny][nx] != name) {
                    antidotes.add(nx+','+ny)
                }
            }
        }
    }
})
printMap(map)
console.log('Del 1', antidotes.size)

function printMap(p) {
    p.forEach(line => {
        console.log(line.join(''))
    })
    console.log()
}