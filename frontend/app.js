let resp = await fetch('/info')
resp = await resp.json();

console.log(resp);

document.querySelector('#swagger').href = resp.chroma + '/docs/';