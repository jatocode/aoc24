const fs = require('fs')
const args = process.argv.slice(2)

const data = fs.readFileSync(args[0], 'utf8')
const diskmap = data.split('\n')[0]

let system = []

let id = 0
diskmap.split('').forEach((cell, x) => {
    let c = parseInt(cell)
    if (!isNaN(c)) x % 2 == 1 ? system.push([-1, c, x]) : system.push([id++, c, x])
})
system.push([-1, 0])

let system1 = defragBlock(JSON.parse(JSON.stringify(system)))
console.log('Del 1: ', checkSum(system1))

let system2 = defragFile(JSON.parse(JSON.stringify(system)))
console.log('Del 2: ', checkSum(system2))

function defragFile(system) {
    const filesBySize = [...system].filter(block => block[0] != -1).sort((a, b) => b[0] - a[0])
    system.sort((a, b) => a[2] - b[2])
    filesBySize.forEach(file => {
        const fileIndex = file[2]
        const firstFree = system.find(block => block[0] == -1 && block[1] >= file[1] && block[2] < fileIndex)
        if (firstFree) {
            firstFree[1] = firstFree[1] - file[1]
            const firstFreeIndex = firstFree[2]
            if (firstFree[1] > 0) {
                // Reorder system
                for (let i = firstFreeIndex; i < system.length; i++) {
                    system[i][2] = i + 1
                }
            }
            file[2] = firstFreeIndex
            system.push([-1, file[1], fileIndex])
            system = system.filter(block => block[1] > 0)
            system.sort((a, b) => a[2] - b[2])
        }
    })
    return system
}

function defragBlock(system) {
    const lastFree = system.findLast(block => block[0] == -1)
    for (i = 0; i < system.length; i++) {
        const firstFree = system.find(block => block[0] == -1 && block[1] > 0)
        const lastFile = system.findLast(block => block[0] != -1)
        const firstFreeIndex = system.indexOf(firstFree)
        const lastFileIndex = system.indexOf(lastFile)
        if (lastFileIndex + 1 == firstFreeIndex) {
            break;
        }

        lastFile[1] = lastFile[1] - 1
        firstFree[1] = firstFree[1] - 1
        lastFree[1] = lastFree[1] + 1

        if (system[firstFreeIndex - 1] && system[firstFreeIndex - 1][0] == lastFile[0]) {
            system[firstFreeIndex - 1][1] = system[firstFreeIndex - 1][1] + 1
        } else {
            system = [
                ...system.slice(0, firstFreeIndex),
                [lastFile[0], 1],
                ...system.slice(firstFreeIndex)
            ]
        }
        // Rensa bort tomma block
        if (lastFile[1] == 0 || firstFree[1] == 0) {
            system = system.filter(block => block[1] > 0)
        }
    }
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
    system.sort((a, b) => a[2] - b[2]).forEach((block, x) => {
        const t = block[0] == -1 ? '.' : block[0]
        for (let i = 0; i < block[1]; i++) disk += t
    })

    console.log(disk)
}