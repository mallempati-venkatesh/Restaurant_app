import { Payment } from "./payment";
import { Product } from "./product";

export class Order {
    customerId: number;
    lineItems: Product[];
    payment: Payment;
    totalAmount: number;
    tax: number;
}