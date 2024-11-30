import { AbstractEntity } from "src/database/abstract.entity";
import { User } from "src/modules/user/entity/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Blueprint extends AbstractEntity<Blueprint> {
    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column()
    imageUrl: string;

    @ManyToOne(() => User, (user) => user.blueprints, { onDelete: 'CASCADE' })
    user: User;
}