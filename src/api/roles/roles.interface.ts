import { RowDataPacket } from "mysql2";

export interface RoleInput {
    name: string
}
export interface Role extends RowDataPacket {
    id: number,
    name: string
}
export interface assignPermissionToRole {
    roleName: string,
    permissionName: string
}
export interface RolePermission extends RowDataPacket {
    roleId: number,
    permissionId: number
}
export interface Permission extends RowDataPacket {
    id: number,
    name: string
}