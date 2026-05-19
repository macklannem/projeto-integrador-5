/**
 * PERCHÉ: Definisce le rotte REST per le operazioni CRUD sui Fornecedores.
 * UTILIZZO: Registrato in app.js come middleware sotto il prefisso /api/fornecedores.
 * DIPENDENZE: express.Router, controllers/FornecedorController.js.
 */

const express = require('express');
const router = express.Router();
const FornecedorController = require('../controllers/FornecedorController');

// GET /api/fornecedores - Listar todos os fornecedores
router.get('/', FornecedorController.listarTodos);

// GET /api/fornecedores/:id - Buscar fornecedor por ID
router.get('/:id', FornecedorController.buscarPorId);

// POST /api/fornecedores - Cadastrar novo fornecedor
router.post('/', FornecedorController.criar);

// PUT /api/fornecedores/:id - Atualizar fornecedor
router.put('/:id', FornecedorController.atualizar);

// DELETE /api/fornecedores/:id - Deletar fornecedor
router.delete('/:id', FornecedorController.deletar);

module.exports = router;
