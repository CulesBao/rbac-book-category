import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket{
    id: number;
    username: string;
    email: string;
    password: string;
}
interface Role extends RowDataPacket{
    id: number;
    roleName: string;
}
interface UserRoles extends RowDataPacket{
    userId: number;
    roleId: number;
}
interface UserRolesInput{
    username: string;
    roleName: string;
}
interface UserInput {
    username: string;
    password: string;
    email?: string;
}
export { User, Role, UserInput, UserRoles, UserRolesInput }