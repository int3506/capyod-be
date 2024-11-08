import { AbstractEntity } from "src/database/abstract.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Product extends AbstractEntity<Product> {
    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal')
    price: number;

    @Column('simple-array')
    color: string[];

    @Column('simple-array')
    size: string[];

    @Column()
    imageUrl: string;
}