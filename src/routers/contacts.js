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

router.get('/contacts', ctrlWrapper(getContactsCtrl));
router.get('/contacts/:id', ctrlWrapper(getContactByIdCtrl));

router.post('/contacts', jsonParser, ctrlWrapper(createContactCtrl));

router.delete('/:id', ctrlWrapper(deleteContactCtrl));

router.put('/:id', jsonParser, ctrlWrapper(replaceContactCtrl));

router.patch('/:id', jsonParser, ctrlWrapper(updateContactCtrl));

export default router;
