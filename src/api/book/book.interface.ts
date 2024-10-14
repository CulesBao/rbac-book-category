import { RowDataPacket } from "mysql2";

export interface BookInput {
    name: string;
}
export interface Book extends RowDataPacket{
    id: number;
    name: string;
}
export interface AddTagInput {
    bookName: string;
    tagName: string;
}