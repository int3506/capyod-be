import { AbstractEntity } from "src/database/abstract.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { User } from "src/modules/user/entity/user.entity";
import { OrderStatus } from "src/modules/order/models/order-status.enum";
import { OrderItem } from "src/modules/order-item/entity/order-item.entity";

@Entity()
export class Order extends AbstractEntity<Order> {
    @Column('decimal')
    totalPrice: number;

    @CreateDateColumn()
    orderDate: Date;

    @Column()
    quantity: number;

    @Column('text')
    address: string;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
    status: OrderStatus;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => OrderItem, (orderItem) => orderItem.orders, { onDelete: 'CASCADE' })
    orderItem: OrderItem;
}