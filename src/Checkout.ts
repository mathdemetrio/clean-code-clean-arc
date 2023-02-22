import CouponRepository from "./CouponRepository";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import CurrencyGateway from "./CurrencyGateway";
import CurrencyGatewayHttp from "./CurrencyGatewayHttp";
import CurrencyTable from "./CurrencyTable";
import FreightCalculator from "./FreightCalculator";
import Order from "./Order";
import OrderRepositry from "./OrderRepository";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import { validate } from "./validator";

export default class Checkout {

	constructor (
		readonly currencyGateway: CurrencyGateway = new CurrencyGatewayHttp(),
		readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
		readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
		readonly orderRepository: OrderRepositry = new OrderRepositoryDatabase()
	) {
	}

	async execute (input: Input): Promise<Output> {
		const currencies = await this.currencyGateway.getCurrencies();
		const currencyTable = new CurrencyTable();
		currencyTable.addCurrency("USD", currencies.usd);
		const sequence = await this.orderRepository.count();
		const order = new Order(input.uuid, input.cpf, currencyTable, sequence, new Date())
		let freight = 0;
		if (input.items) {
			for (const item of input.items) {
				const product = await this.productRepository.getProduct(item.idProduct);
				order.addItem(product, item.quantity);
				const itemFreight = FreightCalculator.calculate(product);
				freight += Math.max(itemFreight, 10) * item.quantity;
			}
		}
		let total = order.getTotal();
		if (input.coupon) {
			const coupon = await this.couponRepository.getCoupon(input.coupon);
			if (!coupon.isExpired(order.date)) {
				total -= (total * coupon.percentage)/100;
			}
		}
		if (input.from && input.to) {
			order.freight = freight;
		}
		await this.orderRepository.save(order);
		return {
			total,
			freight
		};
	}
}

type Input = {
	uuid?: string,
	cpf: string,
	items: { idProduct: number, quantity: number, price?: number }[],
	coupon?: string,
	from?: string,
	to?: string
}

type Output = {
	total: number,
	freight: number
}