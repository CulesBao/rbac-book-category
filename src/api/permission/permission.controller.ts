import { Request, Response } from 'express';
import { errorHandlingMiddleware } from '../../middleware/errorHandling.middleware';
import permissionService from './permission.service';
import { customeSuccessfulResponse } from '../../interface/io.interface';
class permission{
    async createPermission(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await permissionService.createPermission(req.body);
            res.status(response.status).json({
                message: response.message
            });
        }
        catch(err){
            errorHandlingMiddleware(err, res);
        }
    }
    async getPermissions(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await permissionService.getPermissions(req.params.id);
            res.status(response.status).json({
                message: response.message,
                data: response.data
            });
        }
        catch(err){
            errorHandlingMiddleware(err, res);
        }
    }
    async deletePermission(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await permissionService.deletePermission(req.params.id);
            res.status(response.status).json({
                message: response.message
            });
        }
        catch(err){
            errorHandlingMiddleware(err, res);
        }
    }
}
export default new permission();