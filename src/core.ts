import { Database } from "bun:sqlite";

const db = new Database("./database.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  );
`);

const insertItem = db.query("INSERT INTO items (title) VALUES(?)");
const selectItem = db.query("SELECT * FROM items WHERE id = ? LIMIT 1");
const selectAllItems = db.query("SELECT * FROM items");
const updateTitleItem = db.query("UPDATE items SET title = ? WHERE id = ?");
const removeItem = db.query("DELETE FROM items WHERE id = ?");

type ModelTitle = {
  id: number;
  title: string;
};

class Item {
  private static cache: Map<number, Item> = new Map();

  private _title!: string;
  private _id!: number;

  private constructor() {}

  static create(title: string) {
    const instance = new Item();
    instance._title = title;
    const resp = insertItem.run(title);
    instance._id = resp.lastInsertRowid as number;
    Item.cache.set(instance._id, instance);
    return instance;
  }

  static load(id: number) {
    if (Item.cache.has(id)) {
      return Item.cache.get(id)!;
    }

    const response = selectItem.get(id) as ModelTitle;

    if (!response) {
      throw new Error(
        `Impossível carregar o Item de id ${id} do banco de dados`,
      );
    }

    const instance = new Item();
    instance._title = response.title;
    instance._id = response.id;
    Item.cache.set(id, instance);
    return instance;
  }

  static removeFromCache(id: number) {
    Item.cache.delete(id);
  }

  static clearCache() {
    Item.cache.clear();
  }

  set title(newTitle: string) {
    updateTitleItem.run(newTitle, this._id);
    this._title = newTitle;
  }

  get title() {
    return this._title;
  }

  get id() {
    return this._id;
  }
}

class ToDoList {
  private _items: Item[];

  constructor(items: Item[] = []) {
    this._items = items;
  }

  static loadAll() {
    const rows = selectAllItems.all() as ModelTitle[];
    const items: Item[] = [];

    for (const row of rows) {
      items.push(Item.load(row.id));
    }

    return new ToDoList(items);
  }

  add(item: Item) {
    this._items.push(item);
  }

  remove(id: number) {
    removeItem.run(id);

    Item.removeFromCache(id);

    this._items = this._items.filter((item) => item.id !== id);
  }

  get items() {
    return this._items;
  }
}

// Testes

// Limpeza do banco e da estrutura Map para testes
db.run("DELETE FROM items");
db.run("DELETE FROM sqlite_sequence WHERE name='items'");
Item.clearCache();

console.log("\n=== CRIANDO ITENS ===");

Item.create("Estudar TypeScript");
Item.create("Fazer exercícios");
Item.create("Ler documentação");

let lista = ToDoList.loadAll();

console.table(
  lista.items.map((item) => ({
    id: item.id,
    title: item.title,
  })),
);

console.log("\n=== ATUALIZANDO PRIMEIRO ITEM ===");

lista.items[0].title = "Estudar TypeScript Avançado";

lista = ToDoList.loadAll();

console.table(
  lista.items.map((item) => ({
    id: item.id,
    title: item.title,
  })),
);

console.log("\n=== REMOVENDO SEGUNDO ITEM ===");

lista.remove(lista.items[1].id);

lista = ToDoList.loadAll();

console.table(
  lista.items.map((item) => ({
    id: item.id,
    title: item.title,
  })),
);

console.log("\n=== RESULTADO FINAL (considerando cache) ===");

console.log("Quantidade esperada: 2 | Quantidade atual:", lista.items.length);
