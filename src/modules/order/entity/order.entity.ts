import { AbstractEntity } from "src/database/abstract.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { Shipping } from "../../shipping/entity/shipping.entity";
import { Blueprint } from "../../blueprint/entity/blueprint.entity";
import { Product } from "../../product/entity/product.entity";
import { User } from "src/modules/user/entity/user.entity";

@Entity()
export class Order extends AbstractEntity<Order> {
    @Column('decimal')
    totalPrice: number;

    @CreateDateColumn()
    orderDate: Date;

    @Column()
    quantity: number;

    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Product, (product) => product.id)
    product: Product;

    @ManyToOne(() => Blueprint, (blueprint) => blueprint.id)
    blueprint: Blueprint;

    @OneToOne(() => Shipping, (shipping) => shipping.order, { cascade: true, onDelete: 'CASCADE' })
    @JoinColumn()
    shipping: Shipping;
}