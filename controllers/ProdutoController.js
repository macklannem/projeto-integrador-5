/**
 * PERCHÉ: Gestisce la logica di business per le operazioni CRUD sui Prodotti.
 *         Valida i dati di input e restituisce risposte HTTP appropriate.
 * UTILIZZO: Collegato alle rotte in routes/produtoRoutes.js.
 * DIPENDENZE: models/Produto.js.
 * INFO: Le messaggi di feedback seguono le specifiche della apostila
 *       (es. "Produto cadastrado com sucesso!", "Produto com este código de barras já está cadastrado!").
 */

const Produto = require('../models/Produto');

const ProdutoController = {
  /**
   * GET /api/produtos
   * Restituisce l'elenco completo dei prodotti.
   */
  listarTodos(req, res) {
    try {
      const produtos = Produto.findAll();
      return res.json(produtos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produtos.' });
    }
  },

  /**
   * GET /api/produtos/:id
   * Restituisce un singolo prodotto identificato dall'ID.
   */
  buscarPorId(req, res) {
    try {
      const produto = Produto.findById(req.params.id);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }
      return res.json(produto);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
  },

  /**
   * POST /api/produtos
   * Crea un nuovo prodotto dopo aver validato i campi obbligatori
   * e verificato l'unicità del codice a barre.
   */
  criar(req, res) {
    try {
      const { nome, codigoBarras, descricao, quantidade, categoria, dataValidade, preco } = req.body;

      // Validazione dei campi obbligatori come da specifica della apostila
      if (!nome || !descricao || !categoria) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios não preenchidos.',
          campos: {
            nome: !nome ? 'Nome do produto é obrigatório.' : null,
            descricao: !descricao ? 'Descrição é obrigatória.' : null,
            categoria: !categoria ? 'Categoria é obrigatória.' : null
          }
        });
      }

      // Verifica duplicato del codice a barre (se fornito)
      if (codigoBarras) {
        const existente = Produto.findByCodigoBarras(codigoBarras);
        if (existente) {
          return res.status(409).json({ 
            error: 'Produto com este código de barras já está cadastrado!' 
          });
        }
      }

      const produto = Produto.create({ nome, codigoBarras, descricao, quantidade, categoria, dataValidade, preco });
      return res.status(201).json({ 
        message: 'Produto cadastrado com sucesso!', 
        produto 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }
  },

  /**
   * PUT /api/produtos/:id
   * Aggiorna un prodotto esistente dopo aver validato i dati.
   */
  atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, codigoBarras, descricao, quantidade, categoria, dataValidade, preco } = req.body;

      // Verifica se il prodotto esiste
      const produtoExistente = Produto.findById(id);
      if (!produtoExistente) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      // Validazione dei campi obbligatori
      if (!nome || !descricao || !categoria) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios não preenchidos.',
          campos: {
            nome: !nome ? 'Nome do produto é obrigatório.' : null,
            descricao: !descricao ? 'Descrição é obrigatória.' : null,
            categoria: !categoria ? 'Categoria é obrigatória.' : null
          }
        });
      }

      // Verifica duplicato del codice a barre (escluso il prodotto corrente)
      if (codigoBarras) {
        const duplicado = Produto.findByCodigoBarras(codigoBarras);
        if (duplicado && duplicado.id !== Number(id)) {
          return res.status(409).json({ 
            error: 'Produto com este código de barras já está cadastrado!' 
          });
        }
      }

      const produto = Produto.update(id, { nome, codigoBarras, descricao, quantidade, categoria, dataValidade, preco });
      return res.json({ 
        message: 'Produto atualizado com sucesso!', 
        produto 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar produto.' });
    }
  },

  /**
   * DELETE /api/produtos/:id
   * Elimina un prodotto dal database.
   */
  deletar(req, res) {
    try {
      const { id } = req.params;

      const produto = Produto.findById(id);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      Produto.delete(id);
      return res.json({ message: 'Produto deletado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar produto.' });
    }
  }
};

module.exports = ProdutoController;
