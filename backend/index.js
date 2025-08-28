const http = require('http')
const path = require('path')
const fs = require('fs').promises


const chroma = 'http://localhost:8000'


async function getInfo() {
  let identity = await fetch(`${chroma}/api/v2/auth/identity`)
  identity = await identity.json();
  const { user_id, tenant, databases } = identity;

  let health = await fetch(`${chroma}/api/v2/healthcheck`)
  health = await health.json()


  let heart = await fetch(`${chroma}/api/v2/heartbeat`)
  heart = await heart.json()


  let preflight = await fetch(`${chroma}/api/v2/pre-flight-checks`)
  preflight = await preflight.json()

  let version = await fetch(`${chroma}/api/v2/version`)
  version = await version.json()



  let allColls = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${databases[0]}/collections`)
  allColls = await allColls.json()
  let firstColl = allColls[0]

  let rows = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${firstColl.database}/collections/${firstColl.id}/count`,)
  rows = await rows.json()


  const info = {
    ...identity,
    ...health,
    ...heart,
    ...preflight,
    version,
    ...firstColl,
    rows,
    chroma
  }
  return info


}






async function serveStatic(req, res) {


  const filePath = path.join(__dirname, '../frontend', req.url);
  const data = await fs.readFile(filePath).catch(err => err.message);
  const ext = path.extname(filePath).toLowerCase();
  const mime = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
  }[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  res.end(data);


}

const server = http.createServer(async (req, res) => {

  switch (req.url) {
    case '/':
      res.writeHead(302, { Location: '/index.html' });
      res.end();
      return;

    case '/info':
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(await getInfo(), null, 2));
      return;

    default:
      await serveStatic(req, res);
      break;
  }


});

server.listen(3001, () => console.table({
  'Native server': 'http://localhost:3001',
  'Swagger API': chroma + '/docs'
}));
