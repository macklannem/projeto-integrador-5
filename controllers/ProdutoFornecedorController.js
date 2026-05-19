/**
 * PERCHÉ: Gestisce la logica di business per l'associazione N:N tra Produto e Fornecedor.
 *         Permette di associare, desassociare e consultare le relazioni.
 * UTILIZZO: Collegato alle rotte in routes/produtoFornecedorRoutes.js.
 * DIPENDENZE: models/ProdutoFornecedor.js, models/Produto.js, models/Fornecedor.js.
 * INFO: Le messaggi di feedback seguono le specifiche della apostila
 *       (es. "Fornecedor associado com sucesso ao produto!",
 *            "Fornecedor já está associado a este produto!").
 */

const ProdutoFornecedor = require('../models/ProdutoFornecedor');
const Produto = require('../models/Produto');
const Fornecedor = require('../models/Fornecedor');

const ProdutoFornecedorController = {
  /**
   * POST /api/produto-fornecedor
   * Associa un fornitore a un prodotto.
   * Verifica l'esistenza di entrambe le entità e l'unicità dell'associazione.
   */
  associar(req, res) {
    try {
      const { produtoId, fornecedorId } = req.body;

      // Validazione dei campi obbligatori
      if (!produtoId || !fornecedorId) {
        return res.status(400).json({ 
          error: 'produtoId e fornecedorId são obrigatórios.' 
        });
      }

      // Verifica se il prodotto esiste
      const produto = Produto.findById(produtoId);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      // Verifica se il fornitore esiste
      const fornecedor = Fornecedor.findById(fornecedorId);
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado.' });
      }

      // Verifica se l'associazione esiste già
      const associacaoExistente = ProdutoFornecedor.findAssociation(produtoId, fornecedorId);
      if (associacaoExistente) {
        return res.status(409).json({ 
          error: 'Fornecedor já está associado a este produto!' 
        });
      }

      const associacao = ProdutoFornecedor.associate(produtoId, fornecedorId);
      return res.status(201).json({ 
        message: 'Fornecedor associado com sucesso ao produto!', 
        associacao 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao associar fornecedor ao produto.' });
    }
  },

  /**
   * DELETE /api/produto-fornecedor
   * Rimuove l'associazione tra un prodotto e un fornitore.
   */
  desassociar(req, res) {
    try {
      const { produtoId, fornecedorId } = req.body;

      // Validazione dei campi obbligatori
      if (!produtoId || !fornecedorId) {
        return res.status(400).json({ 
          error: 'produtoId e fornecedorId são obrigatórios.' 
        });
      }

      // Verifica se l'associazione esiste
      const associacao = ProdutoFornecedor.findAssociation(produtoId, fornecedorId);
      if (!associacao) {
        return res.status(404).json({ 
          error: 'Associação não encontrada entre este produto e fornecedor.' 
        });
      }

      ProdutoFornecedor.dissociate(produtoId, fornecedorId);
      return res.json({ 
        message: 'Fornecedor desassociado com sucesso!' 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao desassociar fornecedor do produto.' });
    }
  },

  /**
   * GET /api/produto-fornecedor/produto/:produtoId
   * Restituisce tutti i fornitori associati a un determinato prodotto.
   */
  listarFornecedoresDoProduto(req, res) {
    try {
      const { produtoId } = req.params;

      // Verifica se il prodotto esiste
      const produto = Produto.findById(produtoId);
      if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
      }

      const fornecedores = ProdutoFornecedor.findByProduto(produtoId);
      return res.json({ produto, fornecedores });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar fornecedores do produto.' });
    }
  },

  /**
   * GET /api/produto-fornecedor/fornecedor/:fornecedorId
   * Restituisce tutti i prodotti forniti da un determinato fornitore.
   */
  listarProdutosDoFornecedor(req, res) {
    try {
      const { fornecedorId } = req.params;

      // Verifica se il fornitore esiste
      const fornecedor = Fornecedor.findById(fornecedorId);
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado.' });
      }

      const produtos = ProdutoFornecedor.findByFornecedor(fornecedorId);
      return res.json({ fornecedor, produtos });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar produtos do fornecedor.' });
    }
  }
};

module.exports = ProdutoFornecedorController;
