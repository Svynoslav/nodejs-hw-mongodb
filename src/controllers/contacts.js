import {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  replaceContact,
  updateContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';
import mongoose from 'mongoose';

export const getContactsCtrl = async (req, res) => {
  const contacts = await getContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdCtrl = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new createHttpError.BadRequest('Invalid ID format');
  }

  const contact = await getContactById(id);
  if (!contact) {
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
  if (!name || !phoneNumber || !contactType) {
    throw new createHttpError.BadRequest('Missing required fields');
  }

  const contact = await createContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });

  res.status(201).send({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactCtrl = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new createHttpError.BadRequest('Invalid ID format');
  }

  const contact = await deleteContact(id);
  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(204).send();
};

export const replaceContactCtrl = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new createHttpError.BadRequest('Invalid ID format');
  }

  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  if (!name || !phoneNumber || !contactType) {
    throw new createHttpError.BadRequest('Missing required fields');
  }

  const contact = {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
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
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new createHttpError.BadRequest('Invalid ID format');
  }

  const updatedFields = Object.fromEntries(
    Object.entries(req.body).filter(([_, value]) => value !== undefined),
  );

  const result = await updateContact(id, updatedFields);
  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.send({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result,
  });
};
