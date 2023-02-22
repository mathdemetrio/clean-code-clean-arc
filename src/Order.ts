import Cpf from "./Cpf";
import CurrencyTable from "./CurrencyTable";
import Item from "./Item";
import Product from "./Product";
import crypto from "crypto";

export default class Order {
  items: Item[];
  cpf: Cpf;
  code: string;
  freight = 0;

  constructor (readonly idOrder: string | undefined, cpf: string, readonly currencyTable: CurrencyTable = new CurrencyTable(), readonly sequence: number = 1, readonly date: Date = new Date()) {
    if (!idOrder) this.idOrder = crypto.randomUUID();
    this.items = [];
    this.cpf = new Cpf(cpf);
		this.code = `${date.getFullYear()}${new String(sequence).padStart(8, "0")}`;
  }

  addItem (product: Product, quantity: number) {
    if (quantity <= 0) throw new Error("Invalid quantity");
    if (this.items.some((item) => item.idProduct === product.idProduct)) throw new Error("Duplicated item");
    this.items.push(new Item(product.idProduct, product.price, quantity, product.currency))
  }

  getCode () {
    return this.code;
  }

  getTotal () {
    let total = this.items.reduce((acc, item) => (acc += item.price * item.quantity * this.currencyTable.getCurrency(item.currency)), 0)
    total += this.freight;
    return total;
  }
}