import { Database } from "bun:sqlite"

// class Item_ {
//   public title: string
//   constructor(title: string) {
//     this.title = title
//   }
// }

const db = new Database("database.sqlite")

db.run(`
  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`)

const querySelectItems = db.query("SELECT * FROM items")

const queryInsertItem = db.query(`
  INSERT INTO items (title)
  VALUES (?)
`)

const queryRemoveItem = db.query(`
  DELETE FROM items
  WHERE id = ?
`)

const queryUpdateItem = db.query(`
  UPDATE items
  SET title = ?
  WHERE id = ?
`)

class Item {
  constructor(public title: string) { }
}

class TodoList {
  private items: Item[] = []

  addItem(item: Item) {
    this.items.push(item)
    queryInsertItem.run(item.title)
  }

  getItems() {
    const items = querySelectItems.all()
    return items
  }

  removeItem(id: number) {
    queryRemoveItem.run(id)
  }

  updateItem(id: number, newTitle: string) {
    queryUpdateItem.run(newTitle, id)
  }

}

//
// exemplo [ [ [ NÃO COPIEM ] ] ] 
//

const lista = new TodoList()
// lista.addItem(new Item("ficar quieto"))
// lista.addItem(new Item("prestar atenção"))
// lista.addItem(new Item("aprender typescript"))
lista.updateItem(20, "siuuuu")
lista.removeItem(23)
lista.removeItem(24)
console.table(lista)