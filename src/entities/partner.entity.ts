import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Blueprint } from "./blueprint.entity";

@Entity()
export class Partner extends AbstractEntity<Partner> {
    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'varchar', length: 20 })
    phoneNumber: string;

    @OneToMany(() => Blueprint, (blueprint) => blueprint.partner)
    blueprints: Blueprint[];
}