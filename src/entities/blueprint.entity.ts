import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Blueprint extends AbstractEntity<Blueprint> {
    @Column()
    name: string

    @Column('text')
    description: string;

    @Column()
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.blueprints)
    user: User;
}