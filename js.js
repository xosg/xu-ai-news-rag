// A script downloading all the 3-letter abbreviations

const firstLetter = 'G';
const secondLetter = "Z"
let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
// letters = letters.slice(0, 3)
let csv = '';
// window.return = false;
async function go() {
    // to continue from where we left off
    for (let i = letters.indexOf(secondLetter); i < letters.length; i++) {
        for (let j = 0; j < letters.length; j++) {
            // if (window.return) return
            try {
                const response = await fetch(`https://www.abbreviations.com/${firstLetter}${letters[i]}${letters[j]}`)
                const data = await response.text()
                const match = (data.match(/&#039;(.*?)&#039;/)[1]);
                const line = `${firstLetter}${letters[i]}${letters[j]}, ${match}\n`;
                csv += line;
                console.log(line);
                // lengthen the interval between requests to avoid being blocked
                await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
            } catch (err) {
                let line = `${firstLetter}${letters[i]}${letters[j]}, \n`;
                csv += line;
                console.error(line);
                // return;
            }
        }
    }
}

await go();
console.log(csv);