import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetPasswordSchema,
  resetPasswordSchema,
  confirmOAuthSchema,
} from '../validation/auth.js';
import {
  registerUserCtrl,
  loginUserCtrl,
  logoutUserCtrl,
  refreshUserSessionCtrl,
  requestResetPasswordCtrl,
  resetPasswordCtrl,
  getOAuthURLCtrl,
  confirmOAuthCtrl,
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

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetPasswordSchema),
  ctrlWrapper(requestResetPasswordCtrl),
);

router.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordCtrl),
);

router.get('/get-oauth-url', ctrlWrapper(getOAuthURLCtrl));

router.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOAuthSchema),
  ctrlWrapper(confirmOAuthCtrl),
);

export default router;
