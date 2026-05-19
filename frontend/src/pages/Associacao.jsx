/**
 * PERCHÉ: Pagina per gestire la relazione molti-a-molti (N:N) tra Produto e Fornecedor.
 *         Permette associare, desassociare e consultare le relazioni.
 * UTILIZZO: Renderizzata dalla rotta /associacao in App.jsx.
 * DIPENDENZE: api/api.js (produtoAPI, fornecedorAPI, associacaoAPI).
 * INFO: Segue il protótipo descritivo della apostila:
 *       - Selezione del prodotto con dettagli in sola lettura
 *       - Dropdown per selezionare il fornitore da associare
 *       - Tabella dei fornitori attualmente associati con pulsante "Desassociar"
 */

import { useState, useEffect } from 'react';
import { produtoAPI, fornecedorAPI, associacaoAPI } from '../api/api';
import './Associacao.css';

function Associacao() {
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('');
  const [detalheProduto, setDetalheProduto] = useState(null);
  const [fornecedoresAssociados, setFornecedoresAssociados] = useState([]);
  const [mensagem, setMensagem] = useState(null);

  // Carica tutti i prodotti e fornitori all'avvio
  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => setMensagem(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  // Quando un prodotto viene selezionato, carica i suoi dettagli e fornitori associati
  useEffect(() => {
    if (produtoSelecionado) {
      carregarDetalheProduto(produtoSelecionado);
    } else {
      setDetalheProduto(null);
      setFornecedoresAssociados([]);
    }
  }, [produtoSelecionado]);

  async function carregarDados() {
    try {
      const [prods, forns] = await Promise.all([
        produtoAPI.listarTodos(),
        fornecedorAPI.listarTodos()
      ]);
      setProdutos(prods);
      setFornecedores(forns);
    } catch (err) {
      setMensagem({ tipo: 'error', texto: 'Erro ao carregar dados.' });
    }
  }

  async function carregarDetalheProduto(produtoId) {
    try {
      const data = await associacaoAPI.fornecedoresDoProduto(produtoId);
      setDetalheProduto(data.produto);
      setFornecedoresAssociados(data.fornecedores);
    } catch (err) {
      setMensagem({ tipo: 'error', texto: 'Erro ao carregar detalhes do produto.' });
    }
  }

  async function handleAssociar() {
    if (!produtoSelecionado || !fornecedorSelecionado) {
      setMensagem({ tipo: 'error', texto: 'Selecione um produto e um fornecedor.' });
      return;
    }

    try {
      const res = await associacaoAPI.associar(
        Number(produtoSelecionado),
        Number(fornecedorSelecionado)
      );
      setMensagem({ tipo: 'success', texto: res.message });
      setFornecedorSelecionado('');
      carregarDetalheProduto(produtoSelecionado);
    } catch (err) {
      setMensagem({ tipo: 'error', texto: err.error || 'Erro ao associar.' });
    }
  }

  async function handleDesassociar(fornecedorId) {
    if (!confirm('Tem certeza que deseja desassociar este fornecedor?')) return;

    try {
      const res = await associacaoAPI.desassociar(
        Number(produtoSelecionado),
        fornecedorId
      );
      setMensagem({ tipo: 'success', texto: res.message });
      carregarDetalheProduto(produtoSelecionado);
    } catch (err) {
      setMensagem({ tipo: 'error', texto: err.error || 'Erro ao desassociar.' });
    }
  }

  // Filtra i fornitori che non sono ancora associati al prodotto selezionato
  const fornecedoresDisponiveis = fornecedores.filter(
    f => !fornecedoresAssociados.some(fa => fa.id === f.id)
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">🔗 Associação de Fornecedor a Produto</h2>
        <p className="page-subtitle">Gerencie as relações entre produtos e fornecedores</p>
      </div>

      {mensagem && (
        <div className={`alert alert-${mensagem.tipo}`}>
          {mensagem.tipo === 'success' ? '✅' : '❌'} {mensagem.texto}
        </div>
      )}

      {/* Seleção do produto */}
      <div className="card">
        <h3 className="card-title">📦 Selecione um Produto</h3>
        <div className="form-group">
          <label className="form-label">Produto</label>
          <select
            className="form-select"
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
          >
            <option value="">Selecione um produto</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} {p.codigoBarras ? `(${p.codigoBarras})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Dettagli del prodotto selezionato (sola lettura) */}
        {detalheProduto && (
          <div className="produto-detalhe">
            <div className="detalhe-grid">
              <div className="detalhe-item">
                <span className="detalhe-label">Nome do Produto</span>
                <span className="detalhe-valor">{detalheProduto.nome}</span>
              </div>
              <div className="detalhe-item">
                <span className="detalhe-label">Código de Barras</span>
                <span className="detalhe-valor">{detalheProduto.codigoBarras || '—'}</span>
              </div>
              <div className="detalhe-item">
                <span className="detalhe-label">Categoria</span>
                <span className="detalhe-valor">
                  <span className="badge">{detalheProduto.categoria}</span>
                </span>
              </div>
              <div className="detalhe-item full-width">
                <span className="detalhe-label">Descrição</span>
                <span className="detalhe-valor">{detalheProduto.descricao}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Associazione - visibile solo dopo aver selezionato un prodotto */}
      {detalheProduto && (
        <>
          {/* Formulario per associare un fornitore */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 className="card-title">➕ Associar Fornecedor</h3>
            <div className="associar-form">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Selecione um Fornecedor</label>
                <select
                  className="form-select"
                  value={fornecedorSelecionado}
                  onChange={(e) => setFornecedorSelecionado(e.target.value)}
                >
                  <option value="">Selecione um fornecedor</option>
                  {fornecedoresDisponiveis.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.nomeEmpresa} ({f.cnpj})
                    </option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-success"
                onClick={handleAssociar}
                disabled={!fornecedorSelecionado}
              >
                🔗 Associar Fornecedor
              </button>
            </div>
            {fornecedoresDisponiveis.length === 0 && fornecedores.length > 0 && (
              <p className="info-text">
                Todos os fornecedores já estão associados a este produto.
              </p>
            )}
            {fornecedores.length === 0 && (
              <p className="info-text">
                Nenhum fornecedor cadastrado. Cadastre fornecedores primeiro.
              </p>
            )}
          </div>

          {/* Tabella dei fornitori associati */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 className="card-title">
              📋 Fornecedores Associados ({fornecedoresAssociados.length})
            </h3>
            {fornecedoresAssociados.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔗</div>
                <p className="empty-state-text">
                  Nenhum fornecedor associado a este produto.
                </p>
              </div>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fornecedor</th>
                      <th>CNPJ</th>
                      <th>Telefone</th>
                      <th>E-mail</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fornecedoresAssociados.map(f => (
                      <tr key={f.id}>
                        <td><strong>{f.nomeEmpresa}</strong></td>
                        <td className="monospace">{f.cnpj}</td>
                        <td>{f.telefone}</td>
                        <td>{f.email}</td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDesassociar(f.id)}
                          >
                            ❌ Desassociar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Associacao;
