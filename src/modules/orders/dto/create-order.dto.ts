export class CreateOrderDto {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  shipping: {
    address: string;
  };
  totalPrice: number;
}
