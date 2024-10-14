import { customError, customeSuccessfulResponse } from "../../interface/io.interface";
import { AddTagInput, Book, BookInput } from "./book.interface";
import db from '../../config/db.config'
import { StatusCodes } from "http-status-codes";
import { Category } from "../category/category.interface";
class bookService {
    async addBook(input: BookInput) : Promise<customeSuccessfulResponse> {
        try{
            const { name } = input;
            const [isExistedBook] : [Book[], any] = await db.pool.query('SELECT * FROM books WHERE name = ?', [name]);
            if(isExistedBook.length > 0)
                throw new customError(StatusCodes.BAD_REQUEST, 'Book already existed');
            await db.pool.query('INSERT INTO books (name) VALUES (?)', [name]);
            return new customeSuccessfulResponse(StatusCodes.CREATED, 'Book created successfully');
        }
        catch(err){
            throw err;
        }
    }
    async addTag(input: AddTagInput) : Promise<customeSuccessfulResponse> {
        try{
            const { bookName, tagName } = input;
            const [book] : [Book[], any] = await db.pool.query('SELECT * FROM books WHERE name = ?', [bookName]);
            if(!book.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Book not found');
            const [tag] : [Category[], any] = await db.pool.query('SELECT * FROM categories WHERE name = ?', [tagName]);
            if(!tag.length)
                throw new customError(StatusCodes.NOT_FOUND, 'Tag not found');
            const bookId = book[0].id, tagId = tag[0].id;
            const [isExistedTag] : [Category[], any] = await db.pool.query('SELECT * FROM bookCategories WHERE bookId = ? AND categoryId = ?', [bookId, tagId]);
            if(isExistedTag.length > 0)
                throw new customError(StatusCodes.BAD_REQUEST, 'Tag already existed');
            await db.pool.query('INSERT INTO bookCategories (bookId, categoryId) VALUES (?, ?)', [bookId, tagId]);
            return new customeSuccessfulResponse(StatusCodes.CREATED, 'Tag added to book successfully');
        }
        catch(err){
            throw err;
        }
    }
    async getCategoryByBook(id: number) : Promise<string[]> {
        try{
            const [bookCategories] : [Category[], any] = await db.pool.query('SELECT categoryId FROM bookCategories WHERE bookId = ?', [id]);
            const categoryIds : number[] = bookCategories.map((category: Category) => category.categoryId);
            const categories : any[] = await Promise.all(categoryIds.map(async (categoryId: number) => {
                const [category] : [Category[], any] = await db.pool.query('SELECT name FROM categories WHERE id = ?', [categoryId]);
                return category;
            }));
            return categories.flat().map((category: Category) => category.name);
        }
        catch(err){
            throw err;
        }
    }
    async getBookById(id: string) : Promise<customeSuccessfulResponse> {
        try{
            if(id == 'all'){
                const [books] : [Book[], any] = await db.pool.query('SELECT * FROM books');
                if(books.length == 0)
                    throw new customError(StatusCodes.NOT_FOUND, 'No book found');
                const response = await Promise.all(books.map(async (book: Book) => {
                    return {
                        id: book.id,
                        name: book.name,
                        tags: await this.getCategoryByBook(book.id)
                    }
                }))
                return new customeSuccessfulResponse(StatusCodes.OK, 'Get successful', response);
            }
            else{
                const [book] : [Book[], any] = await db.pool.query('SELECT * FROM books WHERE id = ?', [id]);
                if(book.length == 0)
                    throw new customError(StatusCodes.NOT_FOUND, 'Book not found');
                const response = {
                    id: book[0].id,
                    name: book[0].name,
                    tags: await this.getCategoryByBook(book[0].id)
                }
                return new customeSuccessfulResponse(StatusCodes.OK, 'Get successful', response);
            }
        }
        catch(err){
            throw err;
        }
    }
    async getBookByName(input: BookInput) : Promise<customeSuccessfulResponse> {
        try{
            const { name } = input;
            const bookName = '%' + name + '%';
            const [book] : [Book[], any] = await db.pool.query('SELECT * FROM books WHERE name LIKE ?', [bookName]);
            console.log('book', book);
            
            if(book.length == 0)
                throw new customError(StatusCodes.NOT_FOUND, 'Book not found');
            const response = await Promise.all(book.map(async (book: Book) => {
                return {
                    id: book.id,
                    name: book.name,
                    tags: await this.getCategoryByBook(book.id)
                }
            }))
            return new customeSuccessfulResponse(StatusCodes.OK, 'Get successful', response);
        }
        catch(err){
            throw err;
        }
    }
    async deleteBook(id: string) : Promise<customeSuccessfulResponse> {
        try{
            const [book] : [Book[], any] = await db.pool.query('SELECT * FROM books WHERE id = ?', [id]);
            if(book.length == 0)
                throw new customError(StatusCodes.NOT_FOUND, 'Book not found');
            await db.pool.query('DELETE FROM bookCategories WHERE bookId = ?', [id]);
            await db.pool.query('DELETE FROM books WHERE id = ?', [id]);
            return new customeSuccessfulResponse(StatusCodes.OK, 'Book deleted successfully');
        }
        catch(err){
            throw err;
        }
    }
    async updateBook(id: string, input: BookInput) : Promise<customeSuccessfulResponse> {
        try{
            const { name } = input;
            const [book] : [Book[], any] = await db.pool.query('SELECT * FROM books WHERE id = ?', [id]);
            if(book.length == 0)
                throw new customError(StatusCodes.NOT_FOUND, 'Book not found');
            if (name == book[0].name)
                throw new customError(StatusCodes.BAD_REQUEST, 'Book name is the same');
            await db.pool.query('UPDATE books SET name = ? WHERE id = ?', [name, id]);
            return new customeSuccessfulResponse(StatusCodes.OK, 'Book updated successfully');
        }
        catch(err){
            throw err;
        }
    }
}
export default new bookService();