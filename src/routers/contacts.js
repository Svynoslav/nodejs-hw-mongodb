import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
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
router.get('/:id', ctrlWrapper(getContactByIdCtrl));

router.post('/', jsonParser, ctrlWrapper(createContactCtrl));

router.delete('/:id', ctrlWrapper(deleteContactCtrl));

router.put('/:id', jsonParser, ctrlWrapper(replaceContactCtrl));

router.patch('/:id', jsonParser, ctrlWrapper(updateContactCtrl));

export default router;
