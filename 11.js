const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const stones = data.split('\n')[0].split(' ').map(x => parseInt(x))

console.log('Del 1:', blink([...stones], 25).length)

function blink(stones, maxBlinks) {
    for (let blink = 0; blink < maxBlinks; blink++) {
        let newstones = []
        for (const stone of stones) {
            const digits = stone.toString()
            if (stone == 0) {
                newstones.push(stone + 1)
            }
            else if (digits.length % 2 == 0) {
                newstones.push(parseInt(digits.slice(0, Math.floor(digits.length/2))))
                newstones.push(parseInt(digits.slice(digits.length/2)))
            }
            else {
                newstones.push(stone * 2024)
            }
        }
        stones = newstones
    }
    return stones
}