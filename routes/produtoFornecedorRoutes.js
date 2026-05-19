/**
 * PERCHÉ: Definisce le rotte REST per la gestione dell'associazione N:N tra Produto e Fornecedor.
 * UTILIZZO: Registrato in app.js come middleware sotto il prefisso /api/produto-fornecedor.
 * DIPENDENZE: express.Router, controllers/ProdutoFornecedorController.js.
 */

const express = require('express');
const router = express.Router();
const ProdutoFornecedorController = require('../controllers/ProdutoFornecedorController');

// POST /api/produto-fornecedor - Associar fornecedor a produto
router.post('/', ProdutoFornecedorController.associar);

// DELETE /api/produto-fornecedor - Desassociar fornecedor de produto
router.delete('/', ProdutoFornecedorController.desassociar);

// GET /api/produto-fornecedor/produto/:produtoId - Listar fornecedores de um produto
router.get('/produto/:produtoId', ProdutoFornecedorController.listarFornecedoresDoProduto);

// GET /api/produto-fornecedor/fornecedor/:fornecedorId - Listar produtos de um fornecedor
router.get('/fornecedor/:fornecedorId', ProdutoFornecedorController.listarProdutosDoFornecedor);

module.exports = router;
