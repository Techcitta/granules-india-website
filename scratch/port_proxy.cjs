const http = require('http');

const server = http.createServer((req, res) => {
  const targetPort = 5174;
  res.writeHead(307, {
    'Location': `http://${req.headers.host ? req.headers.host.split(':')[0] : 'localhost'}:${targetPort}${req.url}`
  });
  res.end();
});

server.listen(5173, '0.0.0.0', () => {
  console.log('Redirecting all requests from port 5173 to port 5174');
});
