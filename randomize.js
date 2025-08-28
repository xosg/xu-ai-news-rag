async function run(params) {
    const fs = require('fs').promises

    csv = await fs.readFile('./news.csv', 'utf8')
    // csv = csv.split('\n').sort(() => Math.random() - 0.5).join('\n')
    // await fs.writeFile('./news.csv', csv)

    csv = csv.split('\n').map(line => line.split(',')[1])
    console.log(new Set(csv).size, csv.length)
}


run()