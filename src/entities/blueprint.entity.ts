import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Partner } from "./partner.entity";

@Entity()
export class Blueprint extends AbstractEntity<Blueprint> {
    @Column()
    name: string

    @Column('text')
    description: string;

    @Column()
    imageUrl: string;

    @ManyToOne(() => Partner, (partner) => partner.blueprints)
    partner: Partner;
}