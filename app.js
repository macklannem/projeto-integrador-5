/**
 * PERCHÉ: Punto di ingresso principale dell'applicazione backend.
 *         Configura Express, middleware, rotte API e serve il frontend in produzione.
 * UTILIZZO: Eseguito direttamente tramite `node app.js` o `npm start`.
 * DIPENDENZE: express, cors, path, database/database.js, routes/*.
 * INFO: Il server ascolta sulla porta definita dalla variabile d'ambiente PORT (default: 3000).
 *       In produzione serve i file statici del frontend React compilato.
 *       Il database SQLite viene inizializzato automaticamente all'avvio.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');

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
// Il frontend viene compilato con `npm run build` nella directory frontend/dist
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Fallback: qualsiasi rotta non gestita dall'API viene reindirizzata all'app React
// Questo è necessario per il funzionamento del React Router (client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Avvio del server
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}/`);
  console.log(`Endpoints disponíveis:`);
  console.log(`  - GET    http://localhost:${PORT}/api/produtos`);
  console.log(`  - GET    http://localhost:${PORT}/api/fornecedores`);
  console.log(`  - GET    http://localhost:${PORT}/api/produto-fornecedor`);
});

module.exports = app;
