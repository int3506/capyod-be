import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntity } from "src/database/abstract.entity";
import { Order } from "./order.entity";

@Entity()
export class Customer extends AbstractEntity<Customer> {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ type: 'varchar', length: 20 })
    phoneNumber: string;

    @OneToMany(() => Order, (order) => order.customer)
    orders: Order[];
}