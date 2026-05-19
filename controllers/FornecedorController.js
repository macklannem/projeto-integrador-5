/**
 * PERCHÉ: Gestisce la logica di business per le operazioni CRUD sui Fornecedores.
 *         Valida i dati di input e restituisce risposte HTTP appropriate.
 * UTILIZZO: Collegato alle rotte in routes/fornecedorRoutes.js.
 * DIPENDENZE: models/Fornecedor.js.
 * INFO: Le messaggi di feedback seguono le specifiche della apostila
 *       (es. "Fornecedor cadastrado com sucesso!", "Fornecedor com esse CNPJ já está cadastrado!").
 */

const Fornecedor = require('../models/Fornecedor');

const FornecedorController = {
  /**
   * GET /api/fornecedores
   * Restituisce l'elenco completo dei fornitori.
   */
  listarTodos(req, res) {
    try {
      const fornecedores = Fornecedor.findAll();
      return res.json(fornecedores);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar fornecedores.' });
    }
  },

  /**
   * GET /api/fornecedores/:id
   * Restituisce un singolo fornitore identificato dall'ID.
   */
  buscarPorId(req, res) {
    try {
      const fornecedor = Fornecedor.findById(req.params.id);
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado.' });
      }
      return res.json(fornecedor);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar fornecedor.' });
    }
  },

  /**
   * POST /api/fornecedores
   * Crea un nuovo fornitore dopo aver validato i campi obbligatori
   * e verificato l'unicità del CNPJ.
   */
  criar(req, res) {
    try {
      const { nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

      // Validazione di tutti i campi obbligatori come da specifica della apostila
      if (!nomeEmpresa || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios não preenchidos.',
          campos: {
            nomeEmpresa: !nomeEmpresa ? 'Nome da empresa é obrigatório.' : null,
            cnpj: !cnpj ? 'CNPJ é obrigatório.' : null,
            endereco: !endereco ? 'Endereço é obrigatório.' : null,
            telefone: !telefone ? 'Telefone é obrigatório.' : null,
            email: !email ? 'E-mail é obrigatório.' : null,
            contatoPrincipal: !contatoPrincipal ? 'Contato principal é obrigatório.' : null
          }
        });
      }

      // Verifica duplicato del CNPJ
      const existente = Fornecedor.findByCnpj(cnpj);
      if (existente) {
        return res.status(409).json({ 
          error: 'Fornecedor com esse CNPJ já está cadastrado!' 
        });
      }

      const fornecedor = Fornecedor.create({ nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal });
      return res.status(201).json({ 
        message: 'Fornecedor cadastrado com sucesso!', 
        fornecedor 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao cadastrar fornecedor.' });
    }
  },

  /**
   * PUT /api/fornecedores/:id
   * Aggiorna un fornitore esistente dopo aver validato i dati.
   */
  atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

      // Verifica se il fornitore esiste
      const fornecedorExistente = Fornecedor.findById(id);
      if (!fornecedorExistente) {
        return res.status(404).json({ error: 'Fornecedor não encontrado.' });
      }

      // Validazione dei campi obbligatori
      if (!nomeEmpresa || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios não preenchidos.',
          campos: {
            nomeEmpresa: !nomeEmpresa ? 'Nome da empresa é obrigatório.' : null,
            cnpj: !cnpj ? 'CNPJ é obrigatório.' : null,
            endereco: !endereco ? 'Endereço é obrigatório.' : null,
            telefone: !telefone ? 'Telefone é obrigatório.' : null,
            email: !email ? 'E-mail é obrigatório.' : null,
            contatoPrincipal: !contatoPrincipal ? 'Contato principal é obrigatório.' : null
          }
        });
      }

      // Verifica duplicato del CNPJ (escluso il fornitore corrente)
      const duplicado = Fornecedor.findByCnpj(cnpj);
      if (duplicado && duplicado.id !== Number(id)) {
        return res.status(409).json({ 
          error: 'Fornecedor com esse CNPJ já está cadastrado!' 
        });
      }

      const fornecedor = Fornecedor.update(id, { nomeEmpresa, cnpj, endereco, telefone, email, contatoPrincipal });
      return res.json({ 
        message: 'Fornecedor atualizado com sucesso!', 
        fornecedor 
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar fornecedor.' });
    }
  },

  /**
   * DELETE /api/fornecedores/:id
   * Elimina un fornitore dal database.
   */
  deletar(req, res) {
    try {
      const { id } = req.params;

      const fornecedor = Fornecedor.findById(id);
      if (!fornecedor) {
        return res.status(404).json({ error: 'Fornecedor não encontrado.' });
      }

      Fornecedor.delete(id);
      return res.json({ message: 'Fornecedor deletado com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar fornecedor.' });
    }
  }
};

module.exports = FornecedorController;
