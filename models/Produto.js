/**
 * PERCHÉ: Gestisce le operazioni CRUD per l'entità Produto nel database.
 *         Fornisce un'interfaccia pulita per interagire con la tabella produtos.
 * UTILIZZO: Importato dal ProdutoController per eseguire query sul database.
 * DIPENDENZE: database/database.js (connessione SQLite).
 * INFO: Ogni metodo utilizza prepared statements per prevenire SQL injection.
 *       Il codice a barre ha un vincolo UNIQUE per evitare duplicati.
 */

const db = require('../database/database');

const Produto = {
  /**
   * Restituisce tutti i prodotti presenti nel database.
   */
  findAll() {
    const stmt = db.prepare('SELECT * FROM produtos ORDER BY id DESC');
    return stmt.all();
  },

  /**
   * Cerca un prodotto specifico tramite il suo ID.
   */
  findById(id) {
    const stmt = db.prepare('SELECT * FROM produtos WHERE id = ?');
    return stmt.get(id);
  },

  /**
   * Cerca un prodotto tramite il codice a barre.
   * Utilizzato per verificare duplicati prima dell'inserimento.
   */
  findByCodigoBarras(codigoBarras) {
    const stmt = db.prepare('SELECT * FROM produtos WHERE codigoBarras = ?');
    return stmt.get(codigoBarras);
  },

  /**
   * Crea un nuovo prodotto nel database.
   * Ritorna l'oggetto prodotto appena creato.
   */
  create(data) {
    const stmt = db.prepare(`
      INSERT INTO produtos (nome, codigoBarras, descricao, quantidade, categoria, dataValidade, preco)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.nome,
      data.codigoBarras || null,
      data.descricao,
      data.quantidade || 0,
      data.categoria,
      data.dataValidade || null,
      data.preco || null
    );
    return this.findById(result.lastInsertRowid);
  },

  /**
   * Aggiorna un prodotto esistente tramite il suo ID.
   * Ritorna l'oggetto prodotto aggiornato.
   */
  update(id, data) {
    const stmt = db.prepare(`
      UPDATE produtos 
      SET nome = ?, codigoBarras = ?, descricao = ?, quantidade = ?, 
          categoria = ?, dataValidade = ?, preco = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);
    stmt.run(
      data.nome,
      data.codigoBarras || null,
      data.descricao,
      data.quantidade || 0,
      data.categoria,
      data.dataValidade || null,
      data.preco || null,
      id
    );
    return this.findById(id);
  },

  /**
   * Elimina un prodotto dal database tramite il suo ID.
   * Ritorna il numero di righe eliminate.
   */
  delete(id) {
    const stmt = db.prepare('DELETE FROM produtos WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
  }
};

module.exports = Produto;
