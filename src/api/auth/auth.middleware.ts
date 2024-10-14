// import { customError } from "../../interface/io.interface";
// import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { usersSchema } from "../../schema/users.schema";
import { errorHandlingMiddleware } from "../../middleware/errorHandling.middleware";
import { UserInput } from "./auth.interface";

class authMiddleware {
    async loginValidation(req: Request, res: Response, next: NextFunction) {
        try {
            const loginData: UserInput = req.body
            const {err} = await usersSchema.validateAsync(loginData)
            // if (err)
            //     throw new customError(StatusCodes.NOT_ACCEPTABLE, err.details[0].message)
            next()
        }
        catch (err) {
            errorHandlingMiddleware(err, res)
        }
    }
    async registerValidation(req: Request, res: Response, next: NextFunction) {
        try {
            const registerData: UserInput = req.body;
            const { err } = await usersSchema.validateAsync(registerData)
            next()
        }
        catch (err) {
            errorHandlingMiddleware(err, res)
        }
    }
    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userInput: UserInput = req.body
            const { err } = await usersSchema.validateAsync(userInput)
            next()
        }
        catch (err) {
            errorHandlingMiddleware(err, res)
        }
    }
}

export default new authMiddleware()