import { THIRTY_DAYS } from '../constants/index.js';

import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  requestResetPassword,
  resetPassword,
  loginOrRegister,
} from '../services/auth.js';

import { generateOAuthURL, validateCode } from '../utils/googleOAuth2.js';

export const registerUserCtrl = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserCtrl = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserCtrl = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const refreshUserSessionCtrl = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const requestResetPasswordCtrl = async (req, res) => {
  const { email } = req.body;

  await requestResetPassword(email);

  res.send({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordCtrl = async (req, res) => {
  const { password, token } = req.body;

  await resetPassword(password, token);

  res.send({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};

export const getOAuthURLCtrl = async (req, res) => {
  const url = generateOAuthURL();

  res.send({
    status: 200,
    message: 'ok',
    data: url,
  });
};

export const confirmOAuthCtrl = async (req, res) => {
  const { code } = req.body;

  const ticket = await validateCode(code);
  const session = await loginOrRegister(ticket.payload);

  setupSession(res, session);

  res.send({
    status: 200,
    message: 'ok',
    data: {
      accessToken: session.accessToken,
    },
  });
};
