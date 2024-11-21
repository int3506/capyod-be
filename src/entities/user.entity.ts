import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Blueprint } from "./blueprint.entity";
import { Order } from "./order.entity";

@Entity()
export class User extends AbstractEntity<User> {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column()
    phoneNumber: string;

    @Column({ default: false })
    isPartner: boolean;

    @OneToMany(() => Blueprint, (blueprint) => blueprint.user)
    blueprints: Blueprint[];

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
}