import {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  replaceContact,
  updateContact,
} from '../services/contacts.js';

import createHttpError from 'http-errors';

export const getContactsCtrl = async (req, res) => {
  const contacts = await getContacts();

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdCtrl = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactCtrl = async (req, res) => {
  const contact = await createContact(req.body);

  res
    .status(201)
    .send({ status: 201, message: 'Contact created', data: contact });
};

export const deleteContactCtrl = async (req, res) => {
  const { id } = req.params;

  const contact = await deleteContact(id);

  if (!contact) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.status(204).send();
};

export const replaceContactCtrl = async (req, res) => {
  const { id } = req.params;

  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
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
  const contact = {
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    email: req.body.email,
    isFavourite: req.body.isFavourite,
    contactType: req.body.contactType,
  };

  const result = await updateContact(id, contact);

  if (!result) {
    throw new createHttpError.NotFound('Contact not found');
  }

  res.send({ status: 200, message: 'Contact updated', data: result });
};
