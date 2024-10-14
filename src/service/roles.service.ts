import { RowDataPacket } from 'mysql2'
import db from '../config/db.config'
import { customError } from '../interface/io.interface'
import { StatusCodes } from 'http-status-codes'
import { RolePermission } from '../api/roles/roles.interface'
class roles {
    async userRoles(id: number): Promise<Array<string>> {
        try {
            const [userRoles]: [RowDataPacket[], any] = await db.pool.query(`SELECT roleId FROM userRoles WHERE userId = ?`, [id])
            const roleIds: Array<number> = userRoles.map((row: RowDataPacket): number => row.roleId)
            if (!roleIds.length)
                throw new customError(StatusCodes.NOT_FOUND, 'User does not have any role')
            return await Promise.all(roleIds.map(async (row: number): Promise<string> => {
                const [role]: [RowDataPacket[], any] = await db.pool.query(`SELECT name FROM roles WHERE id = ?`, [row])
                if (!role.length)
                    throw new customError(StatusCodes.NOT_FOUND, 'Role does not exist')
                return role[0].name
            }))
        } catch (err) {
            throw err
        }
    }
    async rolePermissions(id: number): Promise<Array<string>> {
        try {
            const [userRoles]: [RowDataPacket[], any] = await db.pool.query(`SELECT roleId FROM userRoles WHERE userId = ?`, [id])
            const roleIds: number[] = userRoles.map((row: RowDataPacket): number => row.roleId)
            if (!roleIds.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Role does not exist')
            
            const rolePermissions: RolePermission[] = await Promise.all(roleIds.map(async (roleId: number): Promise<RolePermission> => {
                const [rolePermission]: [any, any] = await db.pool.query(`SELECT permissionId FROM rolePermissions WHERE roleId = ?`, [roleId])
                if (!rolePermission.length)
                    throw new customError(StatusCodes.NOT_FOUND, 'Role does not have any permission')
                return rolePermission
            }))
            const permissionIds: number[] = rolePermissions.flatMap((rolePermission: any) => 
                rolePermission.map((row: RowDataPacket) => row.permissionId)
            );
            if (!permissionIds.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Role does not have any permission')
            return await Promise.all(permissionIds.map(async (id: number): Promise<string> => {
                const [permission]: [RowDataPacket[], any] = await db.pool.query(`SELECT name FROM permissions WHERE id = ?`, [id])
                
                if (!permission.length)
                    throw new customError(StatusCodes.NOT_FOUND, 'Permission does not exist')
                return permission[0].name
            }))
        } catch (err) {
            throw err
        }
    }
}

export default new roles()