import express from 'express';
import permissionController from './permission.controller';
import authentication from '../../middleware/authentication';
const router = express.Router();

router.post('/create', authentication.authenticateToken, authentication.authorizeRole('admin'), permissionController.createPermission);
router.get('/get/:id?', authentication.authenticateToken, authentication.authorizeRole('admin'), permissionController.getPermissions);
router.delete('/delete/:id?', authentication.authenticateToken, authentication.authorizeRole('admin'), permissionController.deletePermission);
export default router;