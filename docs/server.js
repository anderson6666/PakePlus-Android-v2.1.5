const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

// MIME 类型
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// 创建服务器
const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // 处理路由 - 所有请求都返回 index.html (SPA 路由)
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // 如果文件不存在，返回 index.html
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err || filePath.endsWith('/')) {
      filePath = './index.html';
    }
    
    // 获取文件扩展名
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    // 读取文件
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if(error.code == 'ENOENT') {
          // 如果文件不存在，返回 index.html
          fs.readFile('./index.html', (error, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          });
        }
        else {
          res.writeHead(500);
          res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
          res.end(); 
        }
      }
      else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop the server');
});
