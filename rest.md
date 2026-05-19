# Testes de API REST - Projeto Integrador

Aqui estão 3 chamadas funcionais para testar os serviços REST construídos neste projeto. Você pode executá-las no seu terminal usando `curl` ou importá-las para ferramentas como **Insomnia** ou **Postman**.

*(Nota: Os exemplos abaixo apontam para o ambiente local `http://localhost:3000`. Se for testar em produção, substitua pela URL do seu deploy).*

---

### 1. Criar um novo Produto (POST)
Cria um novo registro na tabela de produtos.

```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Notebook Dell Inspiron",
    "codigoBarras": "7891234567890",
    "descricao": "Notebook i7 com 16GB RAM e 512GB SSD",
    "quantidade": 15,
    "categoria": "Eletrônicos",
    "preco": 4500.00
  }'
```

**Resposta esperada (201 Created):**
```json
{
  "message": "Produto cadastrado com sucesso!",
  "id": 1
}
```

---

### 2. Criar um novo Fornecedor (POST)
Cria um novo registro na tabela de fornecedores.

```bash
curl -X POST http://localhost:3000/api/fornecedores \
  -H "Content-Type: application/json" \
  -d '{
    "nomeEmpresa": "Dell Computadores do Brasil",
    "cnpj": "72.381.189/0001-10",
    "endereco": "Av. Industrial, 123 - São Paulo/SP",
    "telefone": "(11) 4004-0000",
    "email": "vendas@dell.com.br",
    "contatoPrincipal": "Carlos Souza"
  }'
```

**Resposta esperada (201 Created):**
```json
{
  "message": "Fornecedor cadastrado com sucesso!",
  "id": 1
}
```

---

### 3. Associar Produto a Fornecedor (POST)
Cria uma associação (relação N:N) entre o produto (ID 1) e o fornecedor (ID 1).

```bash
curl -X POST http://localhost:3000/api/produto-fornecedor \
  -H "Content-Type: application/json" \
  -d '{
    "produtoId": 1,
    "fornecedorId": 1
  }'
```

**Resposta esperada (201 Created):**
```json
{
  "message": "Fornecedor associado com sucesso ao produto!",
  "id": 1
}
```
