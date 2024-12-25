import createHttpError from 'http-errors';

import {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  replaceContact,
  updateContact,
} from '../services/contacts.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getContactsCtrl = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const contacts = await getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId: req.user._id,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdCtrl = async (req, res) => {
  const { id } = req.params;

  const contact = await getContactById(id);
  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
};

export const createContactCtrl = async (req, res) => {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const photo = req.file;

  let photoUrl;
  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId: req.user._id,
    photo: photoUrl,
  });

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactCtrl = async (req, res) => {
  const { id } = req.params;

  const contact = await deleteContact(id);
  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  if (contact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(204).send();
};

export const replaceContactCtrl = async (req, res) => {
  const { id } = req.params;
  const { name, phoneNumber, email, isFavourite, contactType, userId } =
    req.body;
  const photo = req.file;
  let photoUrl;

  const existingContact = await getContactById(id);
  if (!existingContact) {
    throw new createHttpError.NotFound('Contact not found');
  }
  if (existingContact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const contact = {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId,
    photo: photoUrl,
  };

  const result = await replaceContact(id, contact);
  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.send({ status, message: 'Contact upserted', data: result.contact });
};

export const updateContactCtrl = async (req, res) => {
  const { id } = req.params;
  const photo = req.file;
  let photoUrl;

  const existingContact = await getContactById(id);
  if (!existingContact) {
    throw new createHttpError.NotFound('Contact not found');
  }
  if (existingContact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  const result = await updateContact(id, {
    ...req.body,
    photo: photoUrl,
  });
  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
