import { IsNotEmpty, IsOptional } from "class-validator";

export class SendOptions {
    @IsNotEmpty({ message: "To field should no be empty" })
    to: string | string[];
    @IsNotEmpty({ message: "CC field should no be empty" })
    cc: string | string[];
    @IsNotEmpty({ message: "Text field should no be empty" })
    text: string
    @IsOptional()
    subject?: string;
    @IsOptional()
    from?: string;
    @IsOptional()
    bcc?: string | string[]
    @IsOptional()
    html?: string;
    @IsOptional()
    attachments?: { filename: string, content: Buffer }[]

}   