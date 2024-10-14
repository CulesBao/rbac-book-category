import { RoleInput, Role, assignPermissionToRole, Permission, RolePermission } from "./roles.interface";
import db from '../../config/db.config'
import { customError, customeSuccessfulResponse } from "../../interface/io.interface";
import { StatusCodes } from "http-status-codes";
class roles {
    async createRole(roleInput: RoleInput) {
        try {
            const { name } = roleInput;
            const roles: [Role[], any] = await db.pool.query(`SELECT * FROM roles WHERE name = ?`, [name]);
            if (roles[0].length)
                throw new customError(StatusCodes.CONFLICT, 'Role already exists');
            await db.pool.query(`INSERT INTO roles (name) VALUES (?)`, [name]);
            return new customeSuccessfulResponse(StatusCodes.CREATED, 'Role created successfully');
        }
        catch (err) {
            throw err
        }
    }
    async assignPermission(assignPermissionToRole: assignPermissionToRole) {
        try {
            const { roleName, permissionName } = assignPermissionToRole;
            const [role]: [Role[], any] = await db.pool.query(`SELECT * FROM roles WHERE name = ?`, [roleName]);
            if (!role.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Role not found');
            const [permission]: [Permission[], any] = await db.pool.query(`SELECT * FROM permissions WHERE name = ?`, [permissionName]);
            if (!permission.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Permission not found');

            const roleId = role[0].id, permissionId = permission[0].id;
            const [isExisted]: [RolePermission[], any] = await db.pool.query(`SELECT * FROM rolePermissions WHERE roleId = ? AND permissionId = ?`, [roleId, permissionId]);
            if (isExisted?.length)
                throw new customError(StatusCodes.CONFLICT, 'Permission already assigned to role');
            await db.pool.query(`INSERT INTO rolePermissions (roleId, permissionId) VALUES (?, ?)`, [roleId, permissionId]);
            return new customeSuccessfulResponse(StatusCodes.CREATED, 'Assign permission to role successfully');
        }
        catch (err) {
            throw err
        }
    }
    async getRoles(id: string) {
        try {
            if (id == 'all') {
                const [roles]: [Role[], any] = await db.pool.query(`SELECT * FROM roles`);
                return new customeSuccessfulResponse(StatusCodes.OK, "Roles fetched successfully", { roles });
            }
            else {
                const [role]: [Role[], any] = await db.pool.query(`SELECT * FROM roles WHERE id = ?`, [id]);
                if (!role.length)
                    throw new customError(StatusCodes.NOT_FOUND, 'Role not found');
                return new customeSuccessfulResponse(StatusCodes.OK, "Role fetched successfully", { role });
            }
        }
        catch (err) {
            throw err
        }
    }
    async deleteRole(id: string) {
        try {
            if (id == '1')
                throw new customError(StatusCodes.FORBIDDEN, 'Cannot delete admin role');
            const [role]: [Role[], any] = await db.pool.query(`SELECT * FROM roles WHERE id = ?`, [id]);
            if (!role.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Role not found');
            await db.pool.query(`DELETE FROM rolePermissions WHERE roleId = ?`, [id]);
            await db.pool.query(`DELETE FROM userRoles WHERE roleId = ?`, [id]);
            await db.pool.query(`DELETE FROM roles WHERE id = ?`, [id]);
            return new customeSuccessfulResponse(StatusCodes.OK, 'Role deleted successfully');
        }
        catch (err) {
            throw err
        }
    }
}

export default new roles();