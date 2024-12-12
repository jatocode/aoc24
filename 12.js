const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let map = []
lines.forEach(line => {
    map.push(line.trim().split(''))
})

const regions = findAllRegions()
console.log('Del 1:', regions.map(region => regionFacts(region)).reduce((a, b) => a + b, 0))

function findAllRegions() {
    let regions = []
    for (let y = 0; y < map.length - 1; y++) {
        for (let x = 0; x < map[0].length; x++) {
            let found = false
            regions.forEach(region => {
                if(region.has([x, y].join(','))) {
                    found = true
                    return
                }
            })
            if(!found) regions.push(findRegion([x, y]))
        }
    }
    return regions
}

function regionFacts(region) {
    const area = region.size
    const positions = [...region].map(p => p.split(',').map(x => parseInt(x)))
    const type = map[positions[0][1]][positions[0][0]]
    const perimeter = positions.reduce((acc, pos) => {
        const nb = neighbours(pos, type)

        // Här kommer jag inte åt de som är utanför kartan
        const border = nb.filter(n => !region.has(n.join(',')))

        const d = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        let sumOutside = 0
        const outside = d.forEach(dir => {
            const x = pos[0] + dir[0]
            const y = pos[1] + dir[1]
            if (map[y] == undefined || map[y][x] == undefined) sumOutside++
        })

        return acc + border.length + sumOutside
    }, 0)

    console.log(type, 'Price:', area * perimeter, 'Area:', area, 'Perimeter:', perimeter,  )
    return area * perimeter
}

function findRegion(start) {
    const queue = [start]
    const found = new Set()
    const type = map[start[1]][start[0]]
    found.add(start.join(','))
    while (queue.length > 0) {
        const current = queue.shift()
        const nexts = neighbours(current, type)
        for (const next of nexts) {
            if (found.has(next.join(','))) continue
            queue.push(next)
            found.add(current.join(','))
        }
    }
    return found
}

function neighbours(pos, type) {
    const nb = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    const all = nb.map(n => [pos[0] + n[0], pos[1] + n[1]])
    const active = all.filter(n => map[n[1]] != undefined && map[n[1]][n[0]] != undefined)
    const sametype = active.filter(n => map[pos[1]][pos[0]] == type)
    return sametype
}

