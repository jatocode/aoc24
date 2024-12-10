const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const lines = data.split('\n')

let map = []
let starts = []
lines.forEach((line, y) => {
    const row = line.split('')
    map.push(row)
    row.forEach((cell, x) => {
        if (cell == '0') starts.push([x, y])
    })
})

const score = findTrailheads(starts)
console.log('Del 1: ', score[0])
console.log('Del 2: ', score[1])

function findTrailheads(starts) {
    let sum = 0
    let sum2 = 0
    starts.forEach(start => {
        const [r1, r2] = findPath(start)
        sum += r1
        sum2 += r2
    })

    return [sum, sum2]
   
    function findPath(start) {
        const stack = [start]
        const found9 = []
        while (stack.length > 0) {
            const current = stack.pop()
            if (map[current[1]][current[0]] == '9') found9.push(current.join(','))  
            stack.push(...neighbours(current))
        }
        return [new Set(found9).size, found9.length]
    }
}

function neighbours(pos) {
    const nb = [[0, 1], [0, -1], [1, 0], [-1, 0]]
    const all = nb.map(n => [pos[0] + n[0], pos[1] + n[1]])
    const active = all.filter(n => map[n[1]] != undefined && map[n[1]][n[0]] != undefined)
    const steps = active.filter(n => map[n[1]][n[0]] - map[pos[1]][pos[0]] == 1)
    return steps
}
