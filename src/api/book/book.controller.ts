import { Request, Response } from "express";
import { errorHandlingMiddleware } from "../../middleware/errorHandling.middleware";
import bookService from "./book.service";
import { customeSuccessfulResponse } from "../../interface/io.interface";
class category {
    async addBook(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await bookService.addBook(req.body);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async addTag(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await bookService.addTag(req.body);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async getBookById(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await bookService.getBookById(req.params.id);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async getBookByName(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await bookService.getBookByName(req.body);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async deleteBook(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await bookService.deleteBook(req.params.id);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
    async updateBook(req: Request, res: Response) {
        try {
            const response: customeSuccessfulResponse = await bookService.updateBook(req.params.id, req.body);
            res.status(response.status).json(response);
        } catch (err) {
            errorHandlingMiddleware(err, res);
        }
    }
}
export default new category()