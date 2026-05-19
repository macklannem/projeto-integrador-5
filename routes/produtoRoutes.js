/**
 * PERCHÉ: Definisce le rotte REST per le operazioni CRUD sui Prodotti.
 * UTILIZZO: Registrato in app.js come middleware sotto il prefisso /api/produtos.
 * DIPENDENZE: express.Router, controllers/ProdutoController.js.
 */

const express = require('express');
const router = express.Router();
const ProdutoController = require('../controllers/ProdutoController');

// GET /api/produtos - Listar todos os produtos
router.get('/', ProdutoController.listarTodos);

// GET /api/produtos/:id - Buscar produto por ID
router.get('/:id', ProdutoController.buscarPorId);

// POST /api/produtos - Cadastrar novo produto
router.post('/', ProdutoController.criar);

// PUT /api/produtos/:id - Atualizar produto
router.put('/:id', ProdutoController.atualizar);

// DELETE /api/produtos/:id - Deletar produto
router.delete('/:id', ProdutoController.deletar);

module.exports = router;
