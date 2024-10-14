import { customeSuccessfulResponse } from '../../interface/io.interface';
import authService from './auth.service'
import { Request, Response } from "express";
import { errorHandlingMiddleware } from "../../middleware/errorHandling.middleware";

class authController{
    async register(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await authService.register(req.body)
            res.status(response.status).json({message: response.message})
        }
        catch(err){
            errorHandlingMiddleware(err, res)
        }
    }
    async login(req: Request , res: Response){
        try{
            const response: customeSuccessfulResponse = await authService.login(req.body)
            res.status(response.status).json({
                message: response.message,
                data: response.data
            })
        }
        catch(err){
            errorHandlingMiddleware(err, res)
        }
    }
    async get(req: any, res: Response){
        try{
            const info = (req.params.id) ? req.params.id : 'all'
            const id = req.id
            const response: customeSuccessfulResponse = await authService.get(info, id)
            res.status(response.status).json({
                message: response.message,
                data: response.data
            })
        }
        catch (err){
            errorHandlingMiddleware(err, res)
        }
    }
    async getMe(req: any, res: Response){
        try{
            const response: customeSuccessfulResponse = await authService.get('me', req.id)
            res.status(response.status).json({
                message: response.message,
                data: response.data
            })
        }
        catch(err){
            errorHandlingMiddleware(err, res)
        }
    }
    async getAll(req: any, res: Response){
        try{
            const response: customeSuccessfulResponse = await authService.get('all', req.id)
            res.status(response.status).json({
                message: response.message,
                data: response.data
            })
        }
        catch(err){
            errorHandlingMiddleware(err, res)
        }
    }
    async deleteUser (req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await authService.deleteUser(req.params.id)
            res.status(response.status).json({
                message: response.message
            })
        }
        catch(err){
            errorHandlingMiddleware(err, res)
        }
    }
    async updateUser(req: any, res: Response){
        try{
            const response: customeSuccessfulResponse = await authService.updateUser(req.body, req.id)
            res.status(response.status).json({
                message: response.message
            })
        }
        catch(err){
            errorHandlingMiddleware(err, res)
        }
    }
    async assignRole(req: Request, res: Response){
        try{
            const response: customeSuccessfulResponse = await authService.assignRole(req.body)
            res.status(response.status).json({
                message: response.message
            })
        }
        catch(err){
            errorHandlingMiddleware(err, res)
        }
    }
}

export default new authController()