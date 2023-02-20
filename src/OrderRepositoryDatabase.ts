import pgp from "pg-promise";
import OrderRepositry from "./OrderRepository";

export default class OrderRepositoryDatabase implements OrderRepositry {

  async save(order: any): Promise<void> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/postgres");
    await connection.query("insert into cccat10.order (id_order, cpf, code, total, freight) values ($1, $2, $3, $4, $5)", [order.idOrder, order.cpf, order.code, order.total, order.freight]);
		for (const item of order.items) {
      await connection.query("insert into cccat10.item (id_order, id_product, price, quantity) values ($1, $2, $3, $4)", [order.idOrder, item.idProduct, item.price, item.quantity]);
    }
    await connection.$pool.end();
  }

  async getById(id: string): Promise<any> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/postgres");
    const [orderData] = await connection.query("select * from cccat10.order where id_order = $1", [id]);
    await connection.$pool.end();
    return orderData;
  }

  async count(): Promise<number> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/postgres");
    const [options] = await connection.query("select count(*) from cccat10.order", []);
    await connection.$pool.end();
    return parseInt(options.count);
  }
  
}