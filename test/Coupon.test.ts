import Coupon from "../src/Coupon";

test("Deve criar um cupom de desconto válido", function () {
  const coupon = new Coupon("VALE20", 20, new Date("2023-10-01T10:00:00"));
  expect(coupon.isExpired(new Date("2023-02-01T10:00:00"))).toBeFalsy();
})

test("Deve criar um cupom de desconto inválido", function () {
  const coupon = new Coupon("VALE20", 20, new Date("2023-10-01T10:00:00"));
  expect(coupon.isExpired(new Date("2023-11-01T10:00:00"))).toBeTruthy();
})