import { Permission, PermissionInput } from "./permission.interface";
import db from '../../config/db.config'
import { customError, customeSuccessfulResponse } from "../../interface/io.interface";
import { StatusCodes } from "http-status-codes";
class permission{
    async createPermission(permissionInput: PermissionInput) : Promise<customeSuccessfulResponse> {
        try{
            const { name } = permissionInput;
            const [isExistedName] : [Permission[], any] = await db.pool.query(`SELECT * FROM permissions WHERE name = ?`, [name]);
            if(isExistedName.length > 0)
                throw new customError(StatusCodes.BAD_REQUEST, 'Permission name is already existed');
            await db.pool.query(`INSERT INTO permissions SET ?`, permissionInput);
            return new customeSuccessfulResponse(StatusCodes.CREATED, 'Permission created successfully');
        }
        catch(err){
            throw err;
        }
    }
    async getPermissions(id: string) : Promise<customeSuccessfulResponse> {
        try{
            if (!id)
                throw new customError(StatusCodes.BAD_REQUEST, 'Category id is required');
            if (id == 'all'){
                const [permissions] : [Permission[], any] = await db.pool.query(`SELECT * FROM permissions`);
                return new customeSuccessfulResponse(StatusCodes.OK, 'Permissions fetched successfully', permissions);
            }
            else{
                const [permission] : [Permission[], any] = await db.pool.query(`SELECT * FROM permissions WHERE id = ?`, [id]);
                if(permission.length == 0)
                    throw new customError(StatusCodes.NOT_FOUND, 'Permission not found');
                return new customeSuccessfulResponse(StatusCodes.OK, 'Permission fetched successfully', permission);
            }
        }
        catch(err){
            throw err;
        }
    }
    async deletePermission(id: string) : Promise<customeSuccessfulResponse> {
        try{
            if (!id)
                throw new customError(StatusCodes.BAD_REQUEST, 'Category id is required');
            const [permission] : [Permission[], any] = await db.pool.query(`SELECT * FROM permissions WHERE id = ?`, [id]);
            if(permission.length == 0)
                throw new customError(StatusCodes.NOT_FOUND, 'Permission not found');
            await db.pool.query(`DELETE FROM rolePermissions WHERE permissionId = ?`, [id]);
            await db.pool.query(`DELETE FROM permissions WHERE id = ?`, [id]);
            return new customeSuccessfulResponse(StatusCodes.OK, 'Permission deleted successfully');
        }
        catch(err){
            throw err;
        }
    }
}
export default new permission();