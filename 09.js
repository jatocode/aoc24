const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const diskmap = data.split('\n')[0]

let system = []

let id = 0
diskmap.split('').forEach((cell, x) => {
    let c = parseInt(cell)
    if (!isNaN(c)) x % 2 == 1 ? system.push([-1, c]) : system.push([id++, c])
})
system.push([-1, 0])

// console.log(diskmap)
// printDisk(system)
system = defrag(system)
console.log(system)
console.log('Del 1: ', checkSum(system))

function defrag(system) {
    for (i = 0; i < system.length; i++) {
        const firstFree = system.filter(block => block[0] == -1 && block[1] > 0).shift()
        const lastFile = system.filter(block => block[0] != -1 /* && cell[1] >= firstFree[1] */).pop()
        const lastFree = system.filter(block => block[0] == -1).pop()
        const firstFreeIndex = system.indexOf(firstFree)
        const lastFileIndex = system.indexOf(lastFile)
        if(lastFileIndex + 1 == firstFreeIndex) {
            break;
        }

        lastFile[1] = lastFile[1] - 1
        firstFree[1] = firstFree[1] - 1
        lastFree[1] = lastFree[1] + 1

        const newSystem = [
            ...system.slice(0, firstFreeIndex),
            [lastFile[0], 1], // Todo - trycker in massa [x,1] block på rad istället för att slå ihop. Funkar - men....
            ...system.slice(firstFreeIndex)
        ]
        system = newSystem
        system = system.filter(block => block[1] > 0)
        //printDisk(system)
    }
    system = system.filter(block => block[1] > 0)
    return system
}

function checkSum(system) {
    let sum = 0
    let pos = 0
    system.forEach(block => {
        if(block[0] != -1) 
            for (let i = 0; i < block[1]; i++) {
                sum += block[0] * pos++
            }
    })
    return sum
}

function printDisk(system) {
    let disk = ''
    system.forEach((block, x) => {
        const t = block[0] == -1 ? '.' : block[0]
        for (let i = 0; i < block[1]; i++) disk += t
    })

    console.log(disk)
}