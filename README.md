# Atividade 2 - Laboratório de Programação

## Descrição

Este projeto consiste na implementação de um CRUD simples utilizando SQLite e TypeScript, substituindo o armazenamento em arquivo JSON por persistência em banco de dados.

O sistema permite:

- Criar itens
- Carregar um item pelo ID
- Carregar todos os itens
- Atualizar o título de um item
- Remover itens
- Utilizar cache em memória para evitar carregamentos repetidos do banco

---

# Estrutura do Projeto

O projeto possui duas classes principais:

## Classe `Item`

Representa um único item da lista.

Responsabilidades:

- Criar novos registros no banco de dados
- Carregar registros pelo ID
- Atualizar registros existentes
- Gerenciar o cache de objetos carregados

### Métodos

#### `create(title: string)`

Cria um novo item no banco de dados.

Exemplo:

```ts
Item.create("Estudar TypeScript");
```

---

#### `load(id: number)`

Carrega um item pelo ID.

Caso o item já esteja no cache, a instância armazenada será retornada sem consultar novamente o banco.

Exemplo:

```ts
const item = Item.load(1);
```

---

#### `removeFromCache(id: number)`

Remove um item específico do cache.

---

#### `clearCache()`

Remove todos os itens armazenados no cache.

Utilizado principalmente durante os testes.

---

### Getters e Setters

#### `title`

Permite consultar e atualizar o título do item.

Exemplo:

```ts
item.title = "Novo título";
```

---

#### `id`

Retorna o identificador do item.

Exemplo:

```ts
console.log(item.id);
```

---

## Classe `ToDoList`

Representa uma coleção de itens.

Responsabilidades:

- Carregar todos os registros do banco
- Adicionar itens à lista em memória
- Remover itens da lista e do banco de dados

### Métodos

#### `loadAll()`

Carrega todos os registros existentes no banco.

Exemplo:

```ts
const lista = ToDoList.loadAll();
```

---

#### `add(item: Item)`

Adiciona um item à lista em memória.

Exemplo:

```ts
lista.add(item);
```

---

#### `remove(id: number)`

Remove um item do banco de dados, do cache e da lista carregada.

Exemplo:

```ts
lista.remove(1);
```

---

# Banco de Dados

O projeto utiliza SQLite através do pacote `bun:sqlite`.

Tabela criada automaticamente:

```sql
CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
);
```

Campos:

| Campo | Tipo    | Descrição           |
| ----- | ------- | ------------------- |
| id    | INTEGER | Identificador único |
| title | TEXT    | Título do item      |

# Consultas SQL (Queries)

O projeto utiliza consultas SQL preparadas para realizar as operações de CRUD no banco de dados SQLite.

### Inserção de itens

```ts
const insertItem = db.query(
  "INSERT INTO items (title) VALUES(?)"
);
```

Insere um novo registro na tabela `items`.

---

### Busca de um item pelo ID

```ts
const selectItem = db.query(
  "SELECT * FROM items WHERE id = ? LIMIT 1"
);
```

Retorna um único item com base no ID informado.

A cláusula `LIMIT 1` garante que apenas um registro seja retornado.

---

### Busca de todos os itens

```ts
const selectAllItems = db.query(
  "SELECT * FROM items"
);
```

Retorna todos os registros da tabela `items`.

Utilizada pelo método:

```ts
ToDoList.loadAll()
```

---

### Atualização do título de um item

```ts
const updateTitleItem = db.query(
  "UPDATE items SET title = ? WHERE id = ?"
);
```

Atualiza o campo `title` de um registro específico.

Utilizada pelo setter:

```ts
item.title = "Novo título";
```

---

### Remoção de um item

```ts
const removeItem = db.query(
  "DELETE FROM items WHERE id = ?"
);
```

Remove um registro da tabela utilizando seu ID.

Utilizada pelo método:

```ts
ToDoList.remove(id)
```

---

### Limpeza da tabela para testes

```ts
db.run("DELETE FROM items");
```

Remove todos os registros da tabela.

É utilizada apenas durante os testes para garantir um ambiente limpo a cada execução.

---

### Reinicialização do contador de IDs

```ts
db.run("DELETE FROM sqlite_sequence WHERE name='items'");
```

Reinicia o contador do `AUTOINCREMENT`.

Dessa forma, os IDs dos testes sempre começam em `1`, facilitando a visualização e validação dos resultados.

---

# Sistema de Cache

A classe `Item` possui um cache baseado em `Map`.

```ts
private static cache: Map<number, Item>;
```

Objetivo:

- Evitar consultas repetidas ao banco
- Garantir que o mesmo ID retorne sempre a mesma instância durante a execução

Exemplo:

```ts
const a = Item.load(1);
const b = Item.load(1);

console.log(a === b);
```

Resultado:

```txt
true
```

---

# Como Executar

## Pré-requisitos

- Bun instalado na máquina
- Caso não esteja, rodar um dos seguintes comandos no terminal:
### Windows

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Linux / macOS

```bash
curl -fsSL https://bun.sh/install | bash
```

Verifique a instalação:

```bash
bun --version
```

---

## Instalação

Caso necessário:

```bash
bun install
```

---

## Executar o Projeto

```bash
bun run src/core
```

ou

```bash
bun src/core
```

---

# Testes

O projeto possui testes simples diretamente no arquivo principal.

Os testes executam as seguintes operações:

1. Limpeza da tabela
2. Criação de registros
3. Carregamento de registros
4. Atualização de um item
5. Remoção de um item
6. Verificação do resultado final

Ao executar o projeto, tabelas serão exibidas no terminal utilizando:

```ts
console.table(...)
```

permitindo visualizar o estado do banco após cada operação.

---

# Visualizando o Banco de Dados

Uma forma simples de visualizar os dados armazenados é utilizando a extensão **SQLite Viewer** para Visual Studio Code.

## Instalação

1. Abra o VS Code
2. Acesse a aba Extensions
3. Pesquise por:

```txt
SQLite Viewer
```

4. Instale a extensão

---

## Utilização

Após a instalação:

1. Localize o arquivo:

```txt
database.sqlite
```

2. Clique com o botão direito sobre o arquivo

3. Selecione:

```txt
Open Database
```

ou

```txt
Open with SQLite Viewer
```

(dependendo da versão instalada)

Será possível:

- Visualizar tabelas
- Consultar registros
- Executar consultas SQL
- Verificar alterações realizadas pelos testes

---

# Tecnologias Utilizadas

- TypeScript
- Bun
- SQLite

---
