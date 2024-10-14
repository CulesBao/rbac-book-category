import { Request, Response } from "express";
import { errorHandlingMiddleware } from "../../middleware/errorHandling.middleware";
import categoryService from "./category.service";
import { customeSuccessfulResponse } from "../../interface/io.interface";
class category {
    async createCategory(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await categoryService.createCategory(req.body);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async getCategories(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await categoryService.getCategories(req.params.id);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async deleteCategory(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await categoryService.deleteCategory(req.params.id);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async updateCategory(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await categoryService.updateCategory(req.params.id, req.body);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
}
export default new category()