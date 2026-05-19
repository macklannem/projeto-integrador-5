/**
 * PERCHÉ: Configura e inizializza la connessione al database SQLite.
 *         Crea automaticamente le tabelle necessarie se non esistono.
 * UTILIZZO: Importato da tutti i Model per accedere al database.
 * DIPENDENZE: better-sqlite3.
 * INFO: Utilizza better-sqlite3 (sincrono) per semplicità e performance.
 *       Le tabelle vengono create con vincoli di unicità e chiavi esterne.
 */

const Database = require('better-sqlite3');
const path = require('path');

// Percorso del file del database SQLite
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// Inizializzazione della connessione
const db = new Database(dbPath);

// Abilita il supporto per le chiavi esterne (foreign keys)
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Creazione della tabella Produtos
db.exec(`
  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    codigoBarras TEXT UNIQUE,
    descricao TEXT NOT NULL,
    quantidade INTEGER DEFAULT 0,
    categoria TEXT NOT NULL,
    dataValidade TEXT,
    preco REAL,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  )
`);

// Creazione della tabella Fornecedores
db.exec(`
  CREATE TABLE IF NOT EXISTS fornecedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeEmpresa TEXT NOT NULL,
    cnpj TEXT NOT NULL UNIQUE,
    endereco TEXT NOT NULL,
    telefone TEXT NOT NULL,
    email TEXT NOT NULL,
    contatoPrincipal TEXT NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT DEFAULT (datetime('now'))
  )
`);

// Creazione della tabella di associazione Produto-Fornecedor (relazione N:N)
db.exec(`
  CREATE TABLE IF NOT EXISTS produto_fornecedor (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produtoId INTEGER NOT NULL,
    fornecedorId INTEGER NOT NULL,
    createdAt TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (produtoId) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (fornecedorId) REFERENCES fornecedores(id) ON DELETE CASCADE,
    UNIQUE(produtoId, fornecedorId)
  )
`);

module.exports = db;
