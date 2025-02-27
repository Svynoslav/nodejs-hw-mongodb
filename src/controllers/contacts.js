import * as fs from 'node:fs/promises';
import path from 'node:path';

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
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';
import { env } from '../utils/env.js';

import createHttpError from 'http-errors';

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
  let photo = null;

  if (typeof req.file !== 'undefined') {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );

      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }

  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const contact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
    userId: req.user._id,
    photo,
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
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;

  const existingContact = await getContactById(id);
  if (!existingContact) {
    throw new createHttpError.NotFound('Contact not found');
  }
  if (existingContact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  let photo = null;

  if (typeof req.file !== 'undefined') {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);

      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );

      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }

  const updatedContact = {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  };

  if (photo) {
    updatedContact.photo = photo;
  } else {
    updatedContact.photo = existingContact.photo;
  }

  const result = await replaceContact(id, updatedContact);
  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.send({ status, message: 'Contact upserted', data: result.contact });
};

export const updateContactCtrl = async (req, res) => {
  const { id } = req.params;
  const contact = req.body;

  const existingContact = await getContactById(id);
  if (!existingContact) {
    throw new createHttpError.NotFound('Contact not found');
  }
  if (existingContact.userId.toString() !== req.user._id.toString()) {
    throw new createHttpError.NotFound('Contact not found');
  }

  let photo = null;

  if (typeof req.file !== 'undefined') {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public', 'photos', req.file.filename),
      );
      photo = `http://localhost:3000/photo/${req.file.filename}`;
    }
  }

  if (photo) {
    contact.photo = photo;
  }

  const result = await updateContact(id, contact);
  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
