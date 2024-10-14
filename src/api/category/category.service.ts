import { customError, customeSuccessfulResponse } from "../../interface/io.interface";
import { Category, CategoryInput } from "./category.interface";
import db from '../../config/db.config'
import { StatusCodes } from "http-status-codes";
import { Book } from "../book/book.interface";
class categoryService {
    async createCategory(input: CategoryInput): Promise<customeSuccessfulResponse> {
        try {
            const { name } = input;
            const [isExistedCategory]: [Category[], any] = await db.pool.query('SELECT * FROM categories WHERE name = ?', [name]);
            if (isExistedCategory.length > 0)
                throw new customError(StatusCodes.BAD_REQUEST, 'Category already existed');
            await db.pool.query('INSERT INTO categories (name) VALUES (?)', [name]);
            return new customeSuccessfulResponse(StatusCodes.CREATED, 'Category created successfully');
        }
        catch (err) {
            throw err;
        }
    }
    async getBooksByCategory(id: number): Promise<string[]> {
        try {
            const [bookCategories]: [Book[], any] = await db.pool.query('SELECT bookId FROM bookCategories WHERE categoryId = ?', [id]);
            const bookIds: number[] = bookCategories.map((book: Book) => book.bookId);
            const books: any[] = await Promise.all(bookIds.map(async (bookId: number) => {
                const [book]: [Book[], any] = await db.pool.query('SELECT name FROM books WHERE id = ?', [bookId]);
                return book;
            }));
            return books.flat().map((book: Book) => book.name);
        }
        catch (err) {
            throw err;
        }
    }
    async getCategories(id: string): Promise<customeSuccessfulResponse> {
        try {
            if (!id) 
                throw new customError(StatusCodes.BAD_REQUEST, 'Category id is required');
            if (id == 'all') {
                const [categories]: [Category[], any] = await db.pool.query('SELECT * FROM categories');
                if (categories.length == 0)
                    throw new customError(StatusCodes.NOT_FOUND, 'No category found');
                const response = await Promise.all(categories.map(async (category: Category) => {
                    return {
                        id: category.id,
                        name: category.name,
                        books: await this.getBooksByCategory(category.id)
                    }
                }))
                return new customeSuccessfulResponse(StatusCodes.OK, "Get successful", response);
            }
            else {
                const [category]: [Category[], any] = await db.pool.query('SELECT * FROM categories WHERE id = ?', [id]);
                if (category.length == 0)
                    throw new customError(StatusCodes.NOT_FOUND, 'Category not found');
                const response = {
                    id: category[0].id,
                    name: category[0].name,
                    books: await this.getBooksByCategory(category[0].id)
                }
                return new customeSuccessfulResponse(StatusCodes.OK, "Get successful", response);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async deleteCategory(id: string): Promise<customeSuccessfulResponse> {
        try {
            if (!id)
                throw new customError(StatusCodes.BAD_REQUEST, 'Category id is required');
            const [category]: [Category[], any] = await db.pool.query('SELECT * FROM categories WHERE id = ?', [id]);
            if (category.length == 0)
                throw new customError(StatusCodes.NOT_FOUND, 'Category not found');
            await db.pool.query('DELETE FROM bookCategories WHERE categoryId = ?', [id]);
            await db.pool.query('DELETE FROM categories WHERE id = ?', [id]);
            return new customeSuccessfulResponse(StatusCodes.OK, 'Category deleted successfully');
        }
        catch (err) {
            throw err;
        }
    }
    async updateCategory(id: string, input: CategoryInput): Promise<customeSuccessfulResponse> {
        try {
            if (!id)
                throw new customError(StatusCodes.BAD_REQUEST, 'Category id is required');
            const { name } = input;
            const [category]: [Category[], any] = await db.pool.query('SELECT * FROM categories WHERE id = ?', [id]);
            if (category.length == 0)
                throw new customError(StatusCodes.NOT_FOUND, 'Category not found');
            if (category[0].name == name)
                throw new customError(StatusCodes.BAD_REQUEST, 'Category already existed');
            await db.pool.query('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
            return new customeSuccessfulResponse(StatusCodes.OK, 'Category updated successfully');
        }
        catch (err) {
            throw err;
        }
    }
}
export default new categoryService();