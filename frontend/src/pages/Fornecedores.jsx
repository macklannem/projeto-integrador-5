/**
 * PERCHÉ: Pagina di gestione CRUD dei Fornecedores.
 *         Permette creare, leggere, aggiornare e cancellare fornitori.
 * UTILIZZO: Renderizzata dalla rotta /fornecedores in App.jsx.
 * DIPENDENZE: api/api.js (fornecedorAPI).
 * INFO: Tutti i campi sono obbligatori come da specifica della apostila.
 *       Il CNPJ è validato come campo unico.
 */

import { useState, useEffect } from 'react';
import { fornecedorAPI } from '../api/api';
import './Fornecedores.css';

// Stato iniziale del formulario
const FORM_INICIAL = {
  nomeEmpresa: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  email: '',
  contatoPrincipal: ''
};

function Fornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [mensagem, setMensagem] = useState(null);
  const [erros, setErros] = useState({});

  useEffect(() => {
    carregarFornecedores();
  }, []);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  async function carregarFornecedores() {
    try {
      const data = await fornecedorAPI.listarTodos();
      setFornecedores(data);
    } catch (err) {
      setMensagem({ tipo: 'error', texto: 'Erro ao carregar fornecedores.' });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    let valorFormatado = value;

    // Formattazione automatica del CNPJ
    if (name === 'cnpj') {
      valorFormatado = formatarCNPJ(value);
    }
    // Formattazione automatica del telefono
    if (name === 'telefone') {
      valorFormatado = formatarTelefone(value);
    }

    setForm(prev => ({ ...prev, [name]: valorFormatado }));
    if (erros[name]) {
      setErros(prev => ({ ...prev, [name]: null }));
    }
  }

  // Formatta automaticamente il CNPJ mentre l'utente digita
  function formatarCNPJ(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 14);
    return numeros
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  // Formatta automaticamente il telefono mentre l'utente digita
  function formatarTelefone(valor) {
    const numeros = valor.replace(/\D/g, '').slice(0, 11);
    if (numeros.length <= 10) {
      return numeros
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return numeros
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  // Validazione lato client di tutti i campi (tutti obbligatori nella apostila)
  function validarForm() {
    const novosErros = {};
    if (!form.nomeEmpresa.trim()) novosErros.nomeEmpresa = 'Nome da empresa é obrigatório.';
    if (!form.cnpj.trim()) novosErros.cnpj = 'CNPJ é obrigatório.';
    if (!form.endereco.trim()) novosErros.endereco = 'Endereço é obrigatório.';
    if (!form.telefone.trim()) novosErros.telefone = 'Telefone é obrigatório.';
    if (!form.email.trim()) novosErros.email = 'E-mail é obrigatório.';
    if (!form.contatoPrincipal.trim()) novosErros.contatoPrincipal = 'Contato principal é obrigatório.';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validarForm()) return;

    try {
      if (editandoId) {
        const res = await fornecedorAPI.atualizar(editandoId, form);
        setMensagem({ tipo: 'success', texto: res.message });
      } else {
        const res = await fornecedorAPI.criar(form);
        setMensagem({ tipo: 'success', texto: res.message });
      }
      setForm(FORM_INICIAL);
      setEditandoId(null);
      setErros({});
      carregarFornecedores();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: err.error || 'Erro ao salvar fornecedor.' });
    }
  }

  function handleEditar(fornecedor) {
    setForm({
      nomeEmpresa: fornecedor.nomeEmpresa || '',
      cnpj: fornecedor.cnpj || '',
      endereco: fornecedor.endereco || '',
      telefone: fornecedor.telefone || '',
      email: fornecedor.email || '',
      contatoPrincipal: fornecedor.contatoPrincipal || ''
    });
    setEditandoId(fornecedor.id);
    setErros({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDeletar(id) {
    if (!confirm('Tem certeza que deseja deletar este fornecedor?')) return;
    try {
      const res = await fornecedorAPI.deletar(id);
      setMensagem({ tipo: 'success', texto: res.message });
      carregarFornecedores();
    } catch (err) {
      setMensagem({ tipo: 'error', texto: err.error || 'Erro ao deletar fornecedor.' });
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
        <h2 className="page-title">🏢 Cadastro de Fornecedor</h2>
        <p className="page-subtitle">Gerencie os fornecedores da sua empresa</p>
      </div>

      {mensagem && (
        <div className={`alert alert-${mensagem.tipo}`}>
          {mensagem.tipo === 'success' ? '✅' : '❌'} {mensagem.texto}
        </div>
      )}

      {/* Formulario di cadastro/modifica */}
      <div className="card">
        <h3 className="card-title">
          {editandoId ? '✏️ Editar Fornecedor' : '➕ Novo Fornecedor'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                Nome da Empresa <span className="required">*</span>
              </label>
              <input
                type="text"
                name="nomeEmpresa"
                className={`form-input ${erros.nomeEmpresa ? 'error' : ''}`}
                placeholder="Insira o nome da empresa"
                value={form.nomeEmpresa}
                onChange={handleChange}
              />
              {erros.nomeEmpresa && <span className="form-error">{erros.nomeEmpresa}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                CNPJ <span className="required">*</span>
              </label>
              <input
                type="text"
                name="cnpj"
                className={`form-input ${erros.cnpj ? 'error' : ''}`}
                placeholder="00.000.000/0000-00"
                value={form.cnpj}
                onChange={handleChange}
              />
              {erros.cnpj && <span className="form-error">{erros.cnpj}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Telefone <span className="required">*</span>
              </label>
              <input
                type="text"
                name="telefone"
                className={`form-input ${erros.telefone ? 'error' : ''}`}
                placeholder="(00) 0000-0000"
                value={form.telefone}
                onChange={handleChange}
              />
              {erros.telefone && <span className="form-error">{erros.telefone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                E-mail <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${erros.email ? 'error' : ''}`}
                placeholder="exemplo@fornecedor.com"
                value={form.email}
                onChange={handleChange}
              />
              {erros.email && <span className="form-error">{erros.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">
                Contato Principal <span className="required">*</span>
              </label>
              <input
                type="text"
                name="contatoPrincipal"
                className={`form-input ${erros.contatoPrincipal ? 'error' : ''}`}
                placeholder="Nome do contato principal"
                value={form.contatoPrincipal}
                onChange={handleChange}
              />
              {erros.contatoPrincipal && <span className="form-error">{erros.contatoPrincipal}</span>}
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                Endereço <span className="required">*</span>
              </label>
              <input
                type="text"
                name="endereco"
                className={`form-input ${erros.endereco ? 'error' : ''}`}
                placeholder="Insira o endereço completo da empresa"
                value={form.endereco}
                onChange={handleChange}
              />
              {erros.endereco && <span className="form-error">{erros.endereco}</span>}
            </div>
          </div>

          <div className="btn-group">
            <button type="submit" className="btn btn-primary">
              {editandoId ? '💾 Atualizar' : '🏢 Cadastrar'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-outline" onClick={handleCancelar}>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tabella dei fornitori */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3 className="card-title">📋 Fornecedores Cadastrados ({fornecedores.length})</h3>
        {fornecedores.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏢</div>
            <p className="empty-state-text">Nenhum fornecedor cadastrado ainda.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>CNPJ</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Contato</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {fornecedores.map(f => (
                  <tr key={f.id}>
                    <td><strong>{f.nomeEmpresa}</strong></td>
                    <td className="monospace">{f.cnpj}</td>
                    <td>{f.telefone}</td>
                    <td>{f.email}</td>
                    <td>{f.contatoPrincipal}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleEditar(f)}
                        >
                          ✏️ Editar
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeletar(f.id)}
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

export default Fornecedores;
