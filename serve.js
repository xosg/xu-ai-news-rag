// 静态http文件服务



const mimes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.csv': 'text/plain; charset=utf-8',
}

const http = require('http')
const fs = require('fs').promises
const server = http.createServer(async (req, res) => {

  const filePath = __dirname + '/web' + req.url;
  const data = await fs.readFile(filePath).catch(err => err.message);
  const ext = req.url.slice(req.url.lastIndexOf('.')).toLowerCase();
  const mime = mimes[ext] || 'application/octet-stream';
  res.writeHead(200, { 'Content-Type': mime });
  res.end(data);

});


const PORT = 3001
const os = require('os')
const ip = os.networkInterfaces()['WLAN'].find(a => a.family === 'IPv4').address
server.listen(PORT, () => console.table({
  'server': `http://${ip}:${PORT}/index.html`,
}));
