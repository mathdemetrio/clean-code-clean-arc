// @ts-nocheck
import { isValidCPF } from "./helpers/validateCPF";

export function calculateTotal (products, coupon, customer) {
  if (!isValidCPF(customer?.cpf)) throw new Error("invalid customer CPF");

  let total = products.reduce((partial, product) => {
    const itemValue = product.price * product.quantity;
    return partial + itemValue;
  }, 0)

  if (coupon === 'coupon10off') {
    total = total - total * 0.1;
  }

  return total;
}