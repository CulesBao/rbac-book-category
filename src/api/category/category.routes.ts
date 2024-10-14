import express from 'express';
import authentication from '../../middleware/authentication';
import categoryController from './category.controller';
const router = express.Router();

router.post('/create', authentication.authenticateToken, authentication.authorizePermission('create-category'), categoryController.createCategory);
router.get('/get/:id?', authentication.authenticateToken, authentication.authorizePermission('get-category'), categoryController.getCategories);
router.delete('/delete/:id?', authentication.authenticateToken, authentication.authorizePermission('delete-category'), categoryController.deleteCategory);
router.put('/update/:id?', authentication.authenticateToken, authentication.authorizePermission('update-category'), categoryController.updateCategory);
export default router;