/**
 * PERCHÉ: Punto di ingresso principale dell'applicazione backend.
 *         Configura Express, middleware e registra tutte le rotte dell'API REST.
 * UTILIZZO: Eseguito direttamente tramite `node app.js` o `npm start`.
 * DIPENDENZE: express, cors, database/database.js, routes/*.
 * INFO: Il server ascolta sulla porta 3000 (configurabile via variabile d'ambiente PORT).
 *       Il database SQLite viene inizializzato automaticamente all'avvio.
 */

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

// Rotta principale - verifica che il server è attivo
app.get('/', (req, res) => {
  res.json({ 
    message: 'Projeto Integrador - Faculdade Gran',
    version: '1.0.0',
    endpoints: {
      produtos: '/api/produtos',
      fornecedores: '/api/fornecedores',
      produtoFornecedor: '/api/produto-fornecedor'
    }
  });
});

// Registrazione delle rotte dell'API
app.use('/api/produtos', produtoRoutes);
app.use('/api/fornecedores', fornecedorRoutes);
app.use('/api/produto-fornecedor', produtoFornecedorRoutes);

// Avvio del server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  - GET    http://localhost:${PORT}/api/produtos`);
  console.log(`  - GET    http://localhost:${PORT}/api/fornecedores`);
  console.log(`  - GET    http://localhost:${PORT}/api/produto-fornecedor`);
});

module.exports = app;
