const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  let filePath = path.join(__dirname, reqPath === '/' ? 'index.html' : reqPath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(__dirname, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'text/html; charset=utf-8';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Server xatoligi: ' + err.code);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    const url = `http://localhost:${portToTry}`;
    console.log(`\n=========================================`);
    console.log(`🚀 QueueFlow SaaS serveri ishga tushdi:`);
    console.log(`🔗 Havola: ${url}`);
    console.log(`To'xtatish uchun: Ctrl + C bosing`);
    console.log(`=========================================\n`);

    exec(`start ${url}`, () => {});
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${portToTry} band. ${portToTry + 1} porti sinab ko'rilmoqda...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server xatosi:', err);
    }
  });
}

startServer(PORT);
