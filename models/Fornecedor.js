/**
 * PERCHÉ: Gestisce le operazioni CRUD per l'entità Fornecedor nel database.
 *         Fornisce un'interfaccia pulita per interagire con la tabella fornecedores.
 * UTILIZZO: Importato dal FornecedorController per eseguire query sul database.
 * DIPENDENZE: database/database.js (connessione SQLite).
 * INFO: Il CNPJ ha un vincolo UNIQUE per evitare duplicati.
 *       Tutti i campi sono obbligatori come da specifica della apostila.
 */

const db = require('../database/database');

const Fornecedor = {
  /**
   * Restituisce tutti i fornitori presenti nel database.
   */
  findAll() {
    const stmt = db.prepare('SELECT * FROM fornecedores ORDER BY id DESC');
    return stmt.all();
  },

  /**
   * Cerca un fornitore specifico tramite il suo ID.
   */
  findById(id) {
    const stmt = db.prepare('SELECT * FROM fornecedores WHERE id = ?');
    return stmt.get(id);
  },

  /**
   * Cerca un fornitore tramite il CNPJ.
   * Utilizzato per verificare duplicati prima dell'inserimento.
   */
  findByCnpj(cnpj) {
    const stmt = db.prepare('SELECT * FROM fornecedores WHERE cnpj = ?');
    return stmt.get(cnpj);
  },

  /**
   * Crea un nuovo fornitore nel database.
   * Ritorna l'oggetto fornitore appena creato.
   */
  create(data) {
    const stmt = db.prepare(`
      INSERT INTO fornecedores (nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      data.nomeEmpresa,
      data.cnpj,
      data.endereco,
      data.telefone,
      data.email,
      data.contatoPrincipal
    );
    return this.findById(result.lastInsertRowid);
  },

  /**
   * Aggiorna un fornitore esistente tramite il suo ID.
   * Ritorna l'oggetto fornitore aggiornato.
   */
  update(id, data) {
    const stmt = db.prepare(`
      UPDATE fornecedores 
      SET nomeEmpresa = ?, cnpj = ?, endereco = ?, telefone = ?, 
          email = ?, contatoPrincipal = ?, updatedAt = datetime('now')
      WHERE id = ?
    `);
    stmt.run(
      data.nomeEmpresa,
      data.cnpj,
      data.endereco,
      data.telefone,
      data.email,
      data.contatoPrincipal,
      id
    );
    return this.findById(id);
  },

  /**
   * Elimina un fornitore dal database tramite il suo ID.
   * Ritorna il numero di righe eliminate.
   */
  delete(id) {
    const stmt = db.prepare('DELETE FROM fornecedores WHERE id = ?');
    const result = stmt.run(id);
    return result.changes;
  }
};

module.exports = Fornecedor;
