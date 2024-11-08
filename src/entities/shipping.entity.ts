import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Shipping extends AbstractEntity<Shipping> {
    @OneToOne(() => Order, (order) => order.shipping)
    @JoinColumn()
    order: Order;

    @Column('text')
    address: string;

    @Column({ default: 'in transit' })
    status: string;
}