async function run(params) {
    const fs = require('fs').promises

    csv = await fs.readFile('./web/news.csv', 'utf8')
    csv = csv.split('\n').sort(() => Math.random() - 0.5).join('\n')
    await fs.writeFile('./web/news.csv', csv)

}


run()