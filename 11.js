const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const stones = data.split('\n')[0].split(' ').map(x => parseInt(x))

console.log('Del 1:', blink([...stones], 25).length)
console.log('Del 2:', blink2([...stones], 75))

function blink(stones, maxBlinks) {
    for (let blink = 0; blink < maxBlinks; blink++) {
        let newstones = []
        for (const stone of stones) {
            const digits = stone.toString()
            if (stone == 0) {
                newstones.push(stone + 1)
            }
            else if (digits.length % 2 == 0) {
                newstones.push(parseInt(digits.slice(0, Math.floor(digits.length / 2))))
                newstones.push(parseInt(digits.slice(digits.length / 2)))
            }
            else {
                newstones.push(stone * 2024)
            }
        }
        stones = newstones
    }
    return stones
}

function blink2(stones, maxBlinks) {
    const map = new Map()
    stones.map(s => map.set(s, 1))
    for (let blink = 0; blink < maxBlinks; blink++) {
       const keys = [...map.keys()]
       const todo = []
       for (const stone of keys) {
            const digits = stone.toString()
            let count = 1
            if(map.has(stone)) {
                count = map.get(stone)
            }
            if (stone == 0) {
                todo.push([stone, -1 * count])
                todo.push([stone + 1, 1 * count])
            }
            else if (digits.length % 2 == 0) {
                const left = parseInt(digits.slice(0, Math.floor(digits.length / 2)))
                const right = parseInt(digits.slice(digits.length / 2))
                todo.push([stone, -1 * count])
                todo.push([left, 1 * count])
                todo.push([right, 1 * count])
            }
            else {
                todo.push([stone, -1 * count])
                todo.push([stone * 2024, 1 * count])
            }
        }
        todo.forEach(t => bump(map, t[0], t[1]))
    }
    return map.values().reduce((a, b) => a + b, 0)
}

function bump(map, key, num) {
    //console.log('bump', key, num)
    if(map.has(key)) map.set(key, map.get(key) + num)
    else map.set(key, num)
    if(map.get(key) == 0) map.delete(key)
}
