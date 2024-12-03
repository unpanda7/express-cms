import { Router } from 'express';
import { UserService } from '../services/user.service';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

const router = Router();
const userService = new UserService();

router.post('/register', validate(registerSchema), async (req, res) => {
  try {
    await userService.register(req.body);
    res.json({
      status: 'success',
      data: '创建成功'
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/admin/register', validate(registerSchema), async (req, res) => {
  try {
    await userService.registerAdmin(req.body);
    res.json({
      status: 'success',
      message: '创建成功'
    });
  } catch (error: any) {
    res.status(400).json({
      status: 'error',
      message: error.message
    });
  }
});

router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const result = await userService.login(req.body.username, req.body.password);
    res.json({
      status: 'success',
      data: result
    });
  } catch (error: any) {
    res.status(401).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;