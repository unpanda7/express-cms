import { Router } from 'express';
import { UserManagementService } from '../services/user-management.service';
import { RoleManagementService } from '../services/role-management.service';
import { MenuManagementService } from '../services/menu-management.service';
import { validate } from '../middlewares/validate.middleware';
import { authMiddleware, hasPermission } from '../middlewares/auth.middleware';
import {
  createMenuSchema,
  updateMenuSchema,
  createRoleSchema,
  updateRoleSchema,
  updateUserSchema,
  assignRoleSchema
} from '../schemas/management.schema';

const router = Router();
const userService = new UserManagementService();
const roleService = new RoleManagementService();
const menuService = new MenuManagementService();


router.get('/users', authMiddleware, hasPermission(['read:users']), async (req, res) => {
  const users = await userService.findUsers(req.query);
  res.json(users);
});


router.put('/users/:id',
  authMiddleware,
  hasPermission(['update:users']),
  validate(updateUserSchema),
  async (req, res) => {
    const user = await userService.updateUser(parseInt(req.params.id), req.body);
    res.json(user);
});


router.delete('/users/:id',
  authMiddleware,
  hasPermission(['delete:users']),
  async (req, res) => {
    await userService.deleteUser(parseInt(req.params.id));
    res.json({ message: 'User deleted successfully' });
});


router.post('/users/:id/roles',
  authMiddleware,
  hasPermission(['assign:roles']),
  validate(assignRoleSchema),
  async (req, res) => {
    await userService.updateUserRoles(parseInt(req.params.id), req.body.roleIds);
    res.json({ message: 'Roles assigned successfully' });
});


router.get('/roles', authMiddleware, hasPermission(['read:roles']), async (req, res) => {
  const roles = await roleService.findRoles(req.query);
  res.json(roles);
});


router.post('/roles',
  authMiddleware,
  hasPermission(['create:roles']),
  validate(createRoleSchema),
  async (req, res) => {
    const role = await roleService.createRole(req.body);
    res.json(role);
});

router.put('/roles/:id',
  authMiddleware,
  hasPermission(['update:roles']),
  validate(updateRoleSchema),
  async (req, res) => {
    const role = await roleService.updateRole(parseInt(req.params.id), req.body);
    res.json(role);
});


router.get('/roles/:id',
  authMiddleware,
  hasPermission(['read:roles']),
  async (req, res) => {
    const role = await roleService.findRoleById(parseInt(req.params.id));
    res.json(role);
});


router.delete('/roles/:id',
  authMiddleware,
  hasPermission(['delete:roles']),
  async (req, res) => {
    await roleService.deleteRole(parseInt(req.params.id));
    res.json({ message: 'Role deleted successfully' });
});


router.get('/menus', authMiddleware, hasPermission(['read:menus']), async (req, res) => {
  const menus = await menuService.findMenus(req.query);
  res.json(menus);
});


router.get('/menus/tree', authMiddleware, hasPermission(['read:menus']), async (req, res) => {
  const menuTree = await menuService.getMenuTree();
  res.json(menuTree);
});


router.post('/menus',
  authMiddleware,
  hasPermission(['create:menus']),
  validate(createMenuSchema),
  async (req, res) => {
    const menu = await menuService.createMenu(req.body);
    res.json(menu);
});


router.put('/menus/:id',
  authMiddleware,
  hasPermission(['update:menus']),
  validate(updateMenuSchema),
  async (req, res) => {
    const menu = await menuService.updateMenu(parseInt(req.params.id), req.body);
    res.json(menu);
});


router.get('/menus/:id',
  authMiddleware,
  hasPermission(['read:menus']),
  async (req, res) => {
    const menu = await menuService.findMenuById(parseInt(req.params.id));
    res.json(menu);
});


router.delete('/menus/:id',
  authMiddleware,
  hasPermission(['delete:menus']),
  async (req, res) => {
    await menuService.deleteMenu(parseInt(req.params.id));
    res.json({ message: 'Menu deleted successfully' });
});

export default router;