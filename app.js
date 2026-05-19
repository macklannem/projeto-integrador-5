/**
 * PERCHÉ: Server HTTP semplice che risponde con "Olá, Mundo!" a qualsiasi richiesta.
 *         Serve come punto di partenza per il Projeto Integrador.
 * UTILIZZO: Eseguito direttamente tramite `node app.js`.
 * DIPENDENZE: Modulo nativo `http` di Node.js (nessuna dipendenza esterna).
 */

const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Olá, Mundo!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
});
