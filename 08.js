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

console.log('Del 1', createAntidotes())
console.log('Del 2', createAntidotes(true))

function createAntidotes(multi = false) {
    let antidotes = new Set()
    antennas.forEach((positions, name) => {
        for (let p of positions) {
            const other = positions.filter(x => x != p)
            for (let o of other) {
                const xd = (o[0] - p[0]) * -1
                const yd = (o[1] - p[1]) * -1

                // Lägg till dig själv som antidot
                if(multi) antidotes.add(p[0] + ',' + p[1])

                let nx, ny;
                let i = 1;
                do {
                    nx = p[0] + xd * i
                    ny = p[1] + yd * i

                    if (map[ny] && map[ny][nx] != undefined) {
                        if (map[ny][nx] == '.') map[ny][nx] = '#'
                        // Är det redan samma frekvens så skapa ingen antidot
                        if(multi) 
                            antidotes.add(nx + ',' + ny)
                        else if (map[ny][nx] != name) {
                            antidotes.add(nx + ',' + ny)
                        }
                    }
                    i++
                } while (multi && map[ny] && map[ny][nx] != undefined)
            }
        }
    })
    return antidotes.size
}

function printMap(p) {
    p.forEach(line => {
        console.log(line.join(''))
    })
    console.log()
}