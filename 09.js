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
let system1 = defragBlock(JSON.parse(JSON.stringify(system)))
//printDisk(system1)
console.log('Del 1: ', checkSum(system1))

let system2 = defragFile(JSON.parse(JSON.stringify(system)))
//printDisk(system2)
console.log('Del 2: ', checkSum(system2))

function defragFile(system) {
    const filesBySize = [...system].filter(block => block[0] != -1).sort((a, b) => b[0] - a[0])
    filesBySize.forEach(file => {
        const fileIndex = system.indexOf(file)
        const firstFree = system.filter(block => block[0] == -1 && block[1] >= file[1] && system.indexOf(block) < fileIndex).shift()
        if (firstFree) {
            firstFree[1] = firstFree[1] - file[1]
            const newSystem = [
                ...system.slice(0, system.indexOf(firstFree)),
                file,
                ...system.slice(system.indexOf(firstFree), fileIndex),
                [-1, file[1]],
                ...system.slice(fileIndex + 1)
            ]
            system = newSystem
            system = system.filter(block => block[1] > 0)
        }
    })
    return system
}

function defragBlock(system) {
    for (i = 0; i < system.length; i++) {
        const firstFree = system.filter(block => block[0] == -1 && block[1] > 0).shift()
        const lastFile = system.filter(block => block[0] != -1).pop()
        const lastFree = system.filter(block => block[0] == -1).pop()
        const firstFreeIndex = system.indexOf(firstFree)
        const lastFileIndex = system.indexOf(lastFile)
        if (lastFileIndex + 1 == firstFreeIndex) {
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
    }
    system = system.filter(block => block[1] > 0)
    return system
}

function checkSum(system) {
    let sum = 0
    let pos = 0
    system.forEach(block => {
        for (let i = 0; i < block[1]; i++) {
            if (block[0] != -1)
                sum += block[0] * pos
            pos++
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