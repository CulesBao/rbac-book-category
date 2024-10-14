import express from 'express';
import authentication from '../../middleware/authentication';
import bookController from './book.controller';
const router = express.Router();

router.post('/add', authentication.authenticateToken, authentication.authorizePermission('add-book'), bookController.addBook);
router.post('/assign', authentication.authenticateToken, authentication.authorizePermission('add-tag'), bookController.addTag);
router.get('/get/:id', authentication.authenticateToken, authentication.authorizePermission('get-book'), bookController.getBookById);
router.get('/get', authentication.authenticateToken, authentication.authorizePermission('get-book'), bookController.getBookByName);
router.delete('/delete/:id', authentication.authenticateToken, authentication.authorizePermission('delete-book'), bookController.deleteBook);
router.put('/update/:id', authentication.authenticateToken, authentication.authorizePermission('update-book'), bookController.updateBook);
export default router;