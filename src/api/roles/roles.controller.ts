import { Request, Response } from 'express';
import { customeSuccessfulResponse } from '../../interface/io.interface';
import { errorHandlingMiddleware } from '../../middleware/errorHandling.middleware';
import rolesService from './roles.service';
class roles{
    async createRole(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await rolesService.createRole(req.body);
            res.status(response.status).json({
                message: response.message
            });
        }
        catch(err){
            errorHandlingMiddleware(err, res);
        }
    }
    async assignPermission(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await rolesService.assignPermission(req.body);
            res.status(response.status).json({
                message: response.message
            });
        }
        catch(err){
            errorHandlingMiddleware(err, res);
        }
    }
    async getRoles(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await rolesService.getRoles(req.params.id);
            res.status(response.status).json({
                message: response.message,
                data: response.data
            });
        }
        catch(err){
            errorHandlingMiddleware(err, res);
        }
    }
    async deleteRole(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await rolesService.deleteRole(req.params.id);
            res.status(response.status).json({
                message: response.message
            });
        }
        catch(err){
            errorHandlingMiddleware(err, res);
        }
    }
}

export default new roles();