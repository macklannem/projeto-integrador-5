/**
 * PERCHÉ: Punto di ingresso principale dell'applicazione backend.
 *         Configura Express, middleware, rotte API e serve il frontend in produzione.
 * UTILIZZO: Eseguito direttamente tramite `node app.js` o `npm start`.
 * DIPENDENZE: express, cors, path, database/database.js, routes/*.
 * INFO: Il server ascolta sulla porta definita dalla variabile d'ambiente PORT (default: 3000).
 *       In produzione serve i file statici del frontend React compilato.
 *       Il database SQLite viene inizializzato automaticamente all'avvio.
 */

const fs = require('fs');
const path = require('path');

// 1. CAPTURADOR DE ERROS GLOBAIS (Cria error.log se o servidor crashar)
process.on('uncaughtException', (err) => {
  const logMsg = `[${new Date().toISOString()}] UNCAUGHT EXCEPTION: ${err.message}\n${err.stack}\n\n`;
  fs.appendFileSync(path.join(__dirname, 'error.log'), logMsg);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  const logMsg = `[${new Date().toISOString()}] UNHANDLED REJECTION: ${reason}\n\n`;
  fs.appendFileSync(path.join(__dirname, 'error.log'), logMsg);
});

// Envolver a inicialização em um try-catch
try {
  const express = require('express');
  const cors = require('cors');

  // Importazione delle rotte
  const produtoRoutes = require('./routes/produtoRoutes');
  const fornecedorRoutes = require('./routes/fornecedorRoutes');
  const produtoFornecedorRoutes = require('./routes/produtoFornecedorRoutes');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware globali
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Registrazione delle rotte dell'API
  app.use('/api/produtos', produtoRoutes);
  app.use('/api/fornecedores', fornecedorRoutes);
  app.use('/api/produto-fornecedor', produtoFornecedorRoutes);

  // In produzione: serve i file statici del frontend React compilato (build)
  const distPath = path.join(__dirname, 'frontend', 'dist');
  
  // Só tenta servir o frontend se a pasta dist existir (evita crash se o build falhar)
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('/(.*)', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    app.get('/(.*)', (req, res) => {
      res.send('A API está rodando, mas a pasta frontend/dist não foi encontrada. O comando npm run build foi executado?');
    });
  }

  // Avvio del server
  app.listen(PORT, () => {
    fs.appendFileSync(path.join(__dirname, 'error.log'), `[${new Date().toISOString()}] Servidor iniciado na porta ${PORT} com sucesso.\n`);
  });

  module.exports = app;
} catch (error) {
  fs.appendFileSync(path.join(__dirname, 'error.log'), `[${new Date().toISOString()}] STARTUP ERROR: ${error.message}\n${error.stack}\n\n`);
  process.exit(1);
}
