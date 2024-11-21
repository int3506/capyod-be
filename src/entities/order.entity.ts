import { AbstractEntity } from "src/database/abstract.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { OrderItem } from "./orderItem.entity";
import { Shipping } from "./shipping.entity";
import { User } from "./user.entity";

@Entity()
export class Order extends AbstractEntity<Order> {
    @Column('decimal')
    totalPrice: number;

    @CreateDateColumn()
    orderDate: Date;

    @ManyToOne(() => User, (user) => user.orders)
    user: User;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    items: OrderItem[];

    @OneToOne(() => Shipping, (shipping) => shipping.order)
    @JoinColumn()
    shipping: Shipping;
}