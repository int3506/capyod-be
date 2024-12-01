import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Role } from "src/modules/auth/models/role.enum";
import { Blueprint } from "src/modules/blueprint/entity/blueprint.entity";
import { Order } from "src/modules/order/entity/order.entity";

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

    @Column({ type: 'enum', enum: Role, default: Role.USER })
    role: Role;

    @OneToMany(() => Blueprint, (blueprint) => blueprint.user, { cascade: true, onDelete: 'CASCADE' })
    blueprints: Blueprint[];

    @OneToMany(() => Order, (order) => order.user, { cascade: true, onDelete: 'CASCADE' })
    orders: Order[];
}