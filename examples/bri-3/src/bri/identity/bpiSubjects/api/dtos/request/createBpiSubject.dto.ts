import { IsNotEmpty } from "class-validator";

export class CreateBpiSubjectDto {
    name: string;

    @IsNotEmpty()
    desc: string;

    publicKey: string;
}
