import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { Order } from "./order.entity";
import { Blueprint } from "./blueprint.entity";

@Entity()
export class OrderItem extends AbstractEntity<OrderItem> {
    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => Product, (product) => product.id)
    product: Product;

    @ManyToOne(() => Blueprint, (blueprint) => blueprint.id)
    blueprint: Blueprint;

    @Column()
    quantity: number;
}