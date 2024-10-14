import { errorHandlingMiddleware } from './errorHandling.middleware';
import { StatusCodes } from 'http-status-codes';
import tokenUtils from '../utils/token.utils';
import { customError } from '../interface/io.interface';
import rolesService from '../service/roles.service';
import { NextFunction } from 'express';

class authentication {
    authenticateToken(req: any, res: any, next: any) {
        try {
            const authHeader: string = req.headers['authorization']
            const token: string = authHeader && authHeader.split(' ')[1]
            if (token == null)
                throw new customError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
            const id: number = tokenUtils.verifyToken(token)
            if (!id)
                throw new customError(StatusCodes.UNAUTHORIZED, 'Unauthorized')
            req.id = id
            next()
        }
        catch (err) {
            errorHandlingMiddleware(err, res)
        }
    }
    authorizeRole = (requiredRole: string) => {
        return async (req: any, res: any, next: NextFunction) => {
            try {
                const id: number = req.id;
                if (!id) {
                    throw new customError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
                }
                const rolesName: string[] = await rolesService.userRoles(id);
                if (!rolesName.includes(requiredRole)) {
                    throw new customError(StatusCodes.FORBIDDEN, 'Forbidden');
                }
                next();
            } catch (err) {
                errorHandlingMiddleware(err, res);
            }
        };
    }
    authorizePermission = (requiredPermission: string)  =>{
        return async (req: any, res: any, next: NextFunction) => {
            try {
                const id: number = req.id;
                if (!id) {
                    throw new customError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
                }
                const permissions: string[] = await rolesService.rolePermissions(id);
                
                if (!permissions.includes(requiredPermission)) {
                    throw new customError(StatusCodes.FORBIDDEN, 'Cannot access this resource');
                }
                next();
            } catch (err) {
                errorHandlingMiddleware(err, res);
            }
        };
    }
}
export default new authentication()