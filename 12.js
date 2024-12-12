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
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[0].length; x++) {
            let found = false
            regions.forEach(region => {
                if (region.has(`${x},${y}`)) {
                    found = true
                    return
                }
            })
            if (!found) regions.push(findRegion([x, y]))
        }
    }
    console.log('Regions:', regions.length)
    return regions
}

function regionFacts(region) {
    const area = region.size
    const positions = [...region].map(p => p.split(',').map(x => parseInt(x)))
    const type = map[positions[0][1]][positions[0][0]]
    const perimeter = positions.reduce((acc, pos) => {
        const nb = neighbours(pos, type)

        const border = nb.filter(n => !region.has(n.join(',')))

        let sumOutside = 0
        const d = [[0, 1], [0, -1], [1, 0], [-1, 0]]
        d.forEach(dir => {
            const x = pos[0] + dir[0]
            const y = pos[1] + dir[1]
            if (map[y] == undefined || map[y][x] == undefined) sumOutside++
        })

        return acc + border.length + sumOutside
    }, 0)

    let sides = new Set()
    for (const pos of positions) {
        const type = getType(pos[0], pos[1])

        // Uppåt
        let other = getType(pos[0], pos[1] - 1, 1)
        let p = ['UP', pos[1] - 1]
        if (other != type) {
            console.log('UP', pos, other)
            sides.add(p.join(','))
        }
    }
    for (const pos of positions) {
        const type = getType(pos[0], pos[1])

        // Nedåt
        other = getType(pos[0], pos[1] + 1, 2)
        p = ['DOWN', pos[1] + 1]
        if (other != type) {
            console.log('DOWN', pos, other)
            sides.add(p.join(','))
        }
    }
    for (const pos of positions) {
        const type = getType(pos[0], pos[1])

        // Vänster
        other = getType(pos[0] - 1, pos[1], 3)
        p = [pos[0] - 1, 'LEFT']
        if (other != type) {
            console.log('LEFT', pos, other)
            sides.add(p.join(','))
        }

    }
    for (const pos of positions) {
        const type = getType(pos[0], pos[1])

        // Höger
        other = getType(pos[0] + 1, pos[1], 4)
        p = [pos[0] + 1, 'RIGHT']
        if (other != type) {
            console.log('RIGHT', pos, other)
            sides.add(p.join(','))
        }
    }
    console.log(type, 'Price:', area * perimeter, 'Area:', area, 'Perimeter:', perimeter, 'Sides:', sides, sides.size)
    return area * perimeter
}



function getType(x, y, dir = 0) {
    return map[y] == undefined ? dir : map[y][x] == undefined ? dir : map[y][x]
}

function findRegion(start) {
    const queue = [start]
    const found = new Set()
    const type = map[start[1]][start[0]]
    const visited = new Set()
    found.add(start.join(','))
    while (queue.length > 0) {
        const current = queue.shift()
        for (const nextpos of neighbours(current, type)) {
            const next = nextpos.join(',')
            found.add(current.join(','))
            if (!visited.has(next)) queue.push(nextpos)
            visited.add(next)
            if (found.has(next)) continue
        }
    }
    //console.log('Found region:', type, found.size)
    return found
}


function neighbours(pos, type) {
    const nb = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    const all = nb.map(n => [pos[0] + n[0], pos[1] + n[1]])
    const active = all.filter(n => map[n[1]] != undefined && map[n[1]][n[0]] != undefined)
    const sametype = active.filter(n => map[pos[1]][pos[0]] == type)
    return sametype
}

