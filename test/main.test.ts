import { calculateTotal } from "../src/main"

describe('Main', () => {
  it('should calculate order total value', () => {
    const products = [
      { description: "Pen", price: 10, quantity: 1 },
      { description: "Pencil", price: 12, quantity: 2 },
      { description: "Erase", price: 5, quantity: 1 },
    ];
    expect(calculateTotal(products, null, { cpf: "71111227047" })).toBe(39)
  })

  it('should calculate order total value with discount by coupon', () => {
    const products = [
      { description: "Pen", price: 10, quantity: 1 },
      { description: "Pencil", price: 12, quantity: 2 },
      { description: "Erase", price: 5, quantity: 1 },
    ];
    expect(calculateTotal(products, "coupon10off", { cpf: "71111227047" })).toBe(35.1)
  })

  it('should throw error when customer cpf is invalid', () => {
    const products = [
      { description: "Pen", price: 10, quantity: 1 },
      { description: "Pencil", price: 12, quantity: 2 },
      { description: "Erase", price: 5, quantity: 1 },
    ];
    expect(() => calculateTotal(products, "coupon10off", { cpf: "99999999999" })).toThrow('invalid customer CPF');
  })
})