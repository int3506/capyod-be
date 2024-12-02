import { AbstractEntity } from "src/database/abstract.entity";
import { Order } from "src/modules/order/entity/order.entity";
import { Product } from "src/modules/product/entity/product.entity";
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";

@Entity()
export class OrderItem extends AbstractEntity<OrderItem> {
    @Column({ type: 'int' })
    price: number;

    @ManyToOne(() => User, (user) => user.orderItems, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Product, (product) => product.id)
    product: Product;

    @Column({ nullable: true })
    frontsideImageUrl: string;

    @Column({ nullable: true })
    backsideImageUrl: string;

    @OneToMany(() => Order, (order) => order.orderItem, { cascade: true, onDelete: 'CASCADE' })
    orders: Order[];
}
