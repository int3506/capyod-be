import { IsNotEmpty } from "class-validator";

export class CreateBlueprintDto {
    @IsNotEmpty()
    name: string;

    description: string;
}
