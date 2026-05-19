/**
 * PERCHÉ: Pagina di gestione CRUD dei Prodotti.
 *         Permette creare, leggere, aggiornare e cancellare prodotti.
 * UTILIZZO: Renderizzata dalla rotta /produtos in App.jsx.
 * DIPENDENZE: api/api.js (produtoAPI).
 * INFO: I messaggi di feedback seguono le specifiche della apostila.
 *       La validazione evidenzia i campi obbligatori mancanti.
 */

import { useState, useEffect } from 'react';
import { produtoAPI } from '../api/api';
import './Produtos.css';

// Categorie predefinite come da specifica della apostila
const CATEGORIAS = [
  'Eletrônicos',
  'Alimentos',
  'Vestuário',
  'Higiene',
  'Limpeza',
  'Papelaria',
  'Ferramentas',
  'Outro'
];

// Stato iniziale del formulario
const FORM_INICIAL = {
  nome: '',
  codigoBarras: '',
  descricao: '',
  quantidade: '',
  categoria: '',
  dataValidade: '',
  preco: ''
};

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [erros, setErros] = useState({});

  // Carica i prodotti all'avvio del componente
  useEffect(() => {
    carregarProdutos();
  }, []);

  // Rimuove il messaggio dopo 4 secondi
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  async function carregarProdutos() {
    try {
      const data = await produtoAPI.listarTodos();
      setProdutos(data);
    } catch (err) {
      setMensagem({ tipo: 'error', texto: 'Erro ao carregar produtos.' });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Rimuove l'errore del campo quando l'utente digita
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  }

  // Validazione lato client dei campi obbligatori
  function validarForm() {
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = 'Nome do produto é obrigatório.';
    if (!form.descricao.trim()) novosErros.descricao = 'Descrição é obrigatória.';
    if (!form.categoria) novosErros.categoria = 'Categoria é obrigatória.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validarForm()) return;

    // Preparazione dei dati (conversione dei tipi numerici)
    const dados = {
      ...form,
      quantidade: form.quantidade ? Number(form.quantidade) : 0,
      preco: form.preco ? Number(form.preco) : null
    };

    try {
      if (editandoId) {
        const res = await produtoAPI.atualizar(editandoId, dados);
        setMensagem({ tipo: 'success', texto: res.message });
      } else {
        const res = await produtoAPI.criar(dados);
        setMensagem({ tipo: 'success', texto: res.message });
      }
      setForm(FORM_INICIAL);
      setEditandoId(null);
      setErros({});
      carregarProdutos();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: err.error || 'Erro ao salvar produto.' });
    }
  }

  function handleEditar(produto) {
    setForm({
      nome: produto.nome || '',
      codigoBarras: produto.codigoBarras || '',
      descricao: produto.descricao || '',
      quantidade: produto.quantidade?.toString() || '',
      categoria: produto.categoria || '',
      dataValidade: produto.dataValidade || '',
      preco: produto.preco?.toString() || ''
    });
    setEditandoId(produto.id);
    setErros({});
    // Scroll fino al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeletar(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    try {
      const res = await produtoAPI.deletar(id);
      setMensagem({ tipo: 'success', texto: res.message });
      carregarProdutos();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: err.error || 'Erro ao deletar produto.' });
    }
  }

  function handleCancelar() {
    setForm(FORM_INICIAL);
    setEditandoId(null);
    setErros({});
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">🏷️ Cadastro de Produto</h2>
        <p className="page-subtitle">Gerencie os produtos do seu estoque</p>
      </div>

      {mensagem && (
        <div className={`alert alert-${mensagem.tipo}`}>
          {mensagem.tipo === 'success' ? '✅' : '❌'} {mensagem.texto}
        </div>
      )}

      {/* Formulario di cadastro/modifica */}
      <div className="card">
        <h3 className="card-title">
          {editandoId ? '✏️ Editar Produto' : '➕ Novo Produto'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Nome do Produto <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nome"
                className={`form-input ${erros.nome ? 'error' : ''}`}
                placeholder="Insira o nome do produto"
                value={form.nome}
                onChange={handleChange}
              />
              {erros.nome && <span className="form-error">{erros.nome}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Código de Barras</label>
              <input
                type="text"
                name="codigoBarras"
                className="form-input"
                placeholder="Insira o código de barras"
                value={form.codigoBarras}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Categoria <span className="required">*</span>
              </label>
              <select
                name="categoria"
                className={`form-select ${erros.categoria ? 'error' : ''}`}
                value={form.categoria}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {erros.categoria && <span className="form-error">{erros.categoria}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Quantidade em Estoque</label>
              <input
                type="number"
                name="quantidade"
                className="form-input"
                placeholder="Quantidade disponível"
                value={form.quantidade}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preço (R$)</label>
              <input
                type="number"
                name="preco"
                className="form-input"
                placeholder="0.00"
                value={form.preco}
                onChange={handleChange}
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data de Validade</label>
              <input
                type="date"
                name="dataValidade"
                className="form-input"
                value={form.dataValidade}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Descrição <span className="required">*</span>
              </label>
              <textarea
                name="descricao"
                className={`form-textarea ${erros.descricao ? 'error' : ''}`}
                placeholder="Descreva brevemente o produto"
                value={form.descricao}
                onChange={handleChange}
              />
              {erros.descricao && <span className="form-error">{erros.descricao}</span>}
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editandoId ? '💾 Atualizar' : '📦 Cadastrar'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-outline" onClick={handleCancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabella dei prodotti */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title">📋 Produtos Cadastrados ({produtos.length})</h3>
        {produtos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p className="empty-state-text">Nenhum produto cadastrado ainda.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Código de Barras</th>
                  <th>Categoria</th>
                  <th>Qtd.</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {produtos.map(produto => (
                  <tr key={produto.id}>
                    <td><strong>{produto.nome}</strong></td>
                    <td>{produto.codigoBarras || '—'}</td>
                    <td>
                      <span className="badge">{produto.categoria}</span>
                    </td>
                    <td>{produto.quantidade}</td>
                    <td>
                      {produto.preco
                        ? `R$ ${Number(produto.preco).toFixed(2)}`
                        : '—'}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEditar(produto)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletar(produto.id)}
                        >
                          🗑️ Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Produtos;
