import { RowDataPacket } from "mysql2";

export interface CategoryInput {
    name: string;
}
export interface Category extends RowDataPacket{
    id: number;
    name: string;
}