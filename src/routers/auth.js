import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  registerUserCtrl,
  loginUserCtrl,
  logoutUserCtrl,
  refreshUserSessionCtrl,
} from '../controllers/auth.js';

const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserCtrl),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserCtrl),
);

router.post('/logout', ctrlWrapper(logoutUserCtrl));

router.post('/refresh', ctrlWrapper(refreshUserSessionCtrl));

export default router;
