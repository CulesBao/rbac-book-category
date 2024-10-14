import { RowDataPacket } from "mysql2";

export interface PermissionInput {
    name: string;
}
export interface Permission extends RowDataPacket{
    id: number;
    name: string;
}