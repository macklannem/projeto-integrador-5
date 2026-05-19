/**
 * PERCHÉ: Gestisce la relazione molti-a-molti (N:N) tra Produto e Fornecedor.
 *         Permette di associare, desassociare e consultare le relazioni.
 * UTILIZZO: Importato dal ProdutoFornecedorController per gestire le associazioni.
 * DIPENDENZE: database/database.js (connessione SQLite).
 * INFO: Utilizza un vincolo UNIQUE(produtoId, fornecedorId) per impedire
 *       duplicati nella tabella di associazione.
 */

const db = require('../database/database');

const ProdutoFornecedor = {
  /**
   * Associa un fornitore a un prodotto.
   * Lancia un errore se l'associazione esiste già (vincolo UNIQUE).
   */
  associate(produtoId, fornecedorId) {
    const stmt = db.prepare(`
      INSERT INTO produto_fornecedor (produtoId, fornecedorId)
      VALUES (?, ?)
    `);
    const result = stmt.run(produtoId, fornecedorId);
    return { id: result.lastInsertRowid, produtoId, fornecedorId };
  },

  /**
   * Rimuove l'associazione tra un prodotto e un fornitore.
   * Ritorna il numero di righe eliminate.
   */
  dissociate(produtoId, fornecedorId) {
    const stmt = db.prepare(`
      DELETE FROM produto_fornecedor 
      WHERE produtoId = ? AND fornecedorId = ?
    `);
    const result = stmt.run(produtoId, fornecedorId);
    return result.changes;
  },

  /**
   * Restituisce tutti i fornitori associati a un determinato prodotto.
   * Esegue un JOIN per ottenere i dettagli completi del fornitore.
   */
  findByProduto(produtoId) {
    const stmt = db.prepare(`
      SELECT f.*, pf.createdAt as associadoEm
      FROM fornecedores f
      INNER JOIN produto_fornecedor pf ON f.id = pf.fornecedorId
      WHERE pf.produtoId = ?
      ORDER BY f.nomeEmpresa
    `);
    return stmt.all(produtoId);
  },

  /**
   * Restituisce tutti i prodotti forniti da un determinato fornitore.
   * Esegue un JOIN per ottenere i dettagli completi del prodotto.
   */
  findByFornecedor(fornecedorId) {
    const stmt = db.prepare(`
      SELECT p.*, pf.createdAt as associadoEm
      FROM produtos p
      INNER JOIN produto_fornecedor pf ON p.id = pf.produtoId
      WHERE pf.fornecedorId = ?
      ORDER BY p.nome
    `);
    return stmt.all(fornecedorId);
  },

  /**
   * Verifica se un'associazione specifica esiste già.
   */
  findAssociation(produtoId, fornecedorId) {
    const stmt = db.prepare(`
      SELECT * FROM produto_fornecedor 
      WHERE produtoId = ? AND fornecedorId = ?
    `);
    return stmt.get(produtoId, fornecedorId);
  }
};

module.exports = ProdutoFornecedor;
