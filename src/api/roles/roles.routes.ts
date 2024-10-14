import express from 'express';
import rolesController from './roles.controller';
import authentication from '../../middleware/authentication';
const router = express.Router();

router.post('/create', authentication.authenticateToken, authentication.authorizeRole('admin'), rolesController.createRole);
router.get('/get/:id', authentication.authenticateToken, authentication.authorizeRole('admin'), rolesController.getRoles);
router.post('/assign', authentication.authenticateToken, authentication.authorizeRole('admin'), rolesController.assignPermission);
router.delete('/delete/:id', authentication.authenticateToken, authentication.authorizeRole('admin'), rolesController.deleteRole);
export default router;