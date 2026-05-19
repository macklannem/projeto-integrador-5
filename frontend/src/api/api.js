/**
 * PERCHÉ: Centralizza tutte le chiamate HTTP verso l'API REST del backend.
 *         Fornisce funzioni riutilizzabili per ogni operazione CRUD.
 * UTILIZZO: Importato da tutte le pagine (Produtos, Fornecedores, Associação).
 * DIPENDENZE: fetch API nativa del browser.
 * INFO: Le richieste passano attraverso il proxy Vite configurato in vite.config.js
 *       che reindirizza /api → http://localhost:3000/api.
 */

const API_BASE = '/api';

// =============================================
// Funzioni helper per le richieste HTTP
// =============================================

async function request(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw data;
  }

  return data;
}

// =============================================
// API de Produtos
// =============================================

export const produtoAPI = {
  listarTodos: () => request('/produtos'),
  buscarPorId: (id) => request(`/produtos/${id}`),
  criar: (dados) => request('/produtos', { method: 'POST', body: dados }),
  atualizar: (id, dados) => request(`/produtos/${id}`, { method: 'PUT', body: dados }),
  deletar: (id) => request(`/produtos/${id}`, { method: 'DELETE' }),
};

// =============================================
// API de Fornecedores
// =============================================

export const fornecedorAPI = {
  listarTodos: () => request('/fornecedores'),
  buscarPorId: (id) => request(`/fornecedores/${id}`),
  criar: (dados) => request('/fornecedores', { method: 'POST', body: dados }),
  atualizar: (id, dados) => request(`/fornecedores/${id}`, { method: 'PUT', body: dados }),
  deletar: (id) => request(`/fornecedores/${id}`, { method: 'DELETE' }),
};

// =============================================
// API de Associação Produto/Fornecedor
// =============================================

export const associacaoAPI = {
  associar: (produtoId, fornecedorId) =>
    request('/produto-fornecedor', { method: 'POST', body: { produtoId, fornecedorId } }),
  desassociar: (produtoId, fornecedorId) =>
    request('/produto-fornecedor', { method: 'DELETE', body: { produtoId, fornecedorId } }),
  fornecedoresDoProduto: (produtoId) =>
    request(`/produto-fornecedor/produto/${produtoId}`),
  produtosDoFornecedor: (fornecedorId) =>
    request(`/produto-fornecedor/fornecedor/${fornecedorId}`),
};
