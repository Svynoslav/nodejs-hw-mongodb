import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/upload.js';

import {
  contactPostSchema,
  contactPatchSchema,
  contactPutSchema,
} from '../validation/contacts.js';

import {
  getContactsCtrl,
  getContactByIdCtrl,
  createContactCtrl,
  deleteContactCtrl,
  replaceContactCtrl,
  updateContactCtrl,
} from '../controllers/contacts.js';

const router = express.Router();
const jsonParser = express.json();

router.get('/', ctrlWrapper(getContactsCtrl));
router.get('/:id', isValidId, ctrlWrapper(getContactByIdCtrl));

router.post(
  '/',
  upload.single('photo'),
  jsonParser,
  validateBody(contactPostSchema),
  ctrlWrapper(createContactCtrl),
);

router.delete('/:id', isValidId, ctrlWrapper(deleteContactCtrl));

router.put(
  '/:id',
  isValidId,
  upload.single('photo'),
  jsonParser,
  validateBody(contactPutSchema),
  ctrlWrapper(replaceContactCtrl),
);

router.patch(
  '/:id',
  isValidId,
  upload.single('photo'),
  jsonParser,
  validateBody(contactPatchSchema),
  ctrlWrapper(updateContactCtrl),
);

export default router;
