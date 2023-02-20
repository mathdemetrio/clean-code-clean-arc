import Cpf from "./Cpf";
import CurrencyTable from "./CurrencyTable";
import Item from "./Item";
import Product from "./Product";

export default class Order {
  items: Item[];
  cpf: Cpf;

  constructor (readonly idOrder: string, cpf: string, readonly currencyTable: CurrencyTable = new CurrencyTable()) {
    this.items = [];
    this.cpf = new Cpf(cpf);
  }

  addItem (product: Product, quantity: number) {
    if (quantity <= 0) throw new Error("Invalid quantity");
    if (this.items.some((item) => item.idProduct === product.idProduct)) throw new Error("Duplicated item");
    this.items.push(new Item(product.idProduct, product.price, quantity, product.currency))
  }

  getTotal () {
    return this.items.reduce((acc, item) => (acc += item.price * item.quantity * this.currencyTable.getCurrency(item.currency)), 0)
  }
}