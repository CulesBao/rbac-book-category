import express from 'express';
import authRoutes from '../api/auth/auth.routes';
import rolesRoutes from '../api/roles/roles.routes';
import permissionRoutes from '../api/permission/permission.routes';
import categoryRoutes from '../api/category/category.routes';
import bookRoutes from '../api/book/book.routes';
const router: express.Router = express.Router();

router.use('/auth', authRoutes);
router.use('/roles', rolesRoutes);
router.use('/permission', permissionRoutes);
router.use('/category', categoryRoutes);
router.use('/book', bookRoutes);

export default router;