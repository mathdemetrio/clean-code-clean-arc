export default interface OrderRepositry {
  save(order: any): Promise<void>;
  getById(id: string): Promise<any>;
  count(): Promise<number>;
}