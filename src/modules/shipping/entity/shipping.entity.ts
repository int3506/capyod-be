import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { Order } from "../../order/entity/order.entity";
import { ShippingStatus } from "../models/shipping-status.enum";

@Entity()
export class Shipping extends AbstractEntity<Shipping> {
    @OneToOne(() => Order, (order) => order.shipping, { onDelete: 'CASCADE' })
    @JoinColumn()
    order: Order;

    @Column('text')
    address: string;

    @Column({ type: 'enum', enum: ShippingStatus, default: ShippingStatus.PROCESSING })
    status: ShippingStatus;
}