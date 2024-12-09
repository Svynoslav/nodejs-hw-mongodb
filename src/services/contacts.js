import { ContactsCollection } from '../db/models/contact.js';

export const getContacts = async () => {
  return await ContactsCollection.find();
};

export const getContactById = async (id) => {
  return await ContactsCollection.findById(id);
};

export const createContact = async (payload) => {
  return await ContactsCollection.create(payload);
};

export const deleteContact = async (id) => {
  return await ContactsCollection.findByIdAndDelete(id);
};

export const replaceContact = async (id, payload) => {
  const rawResult = await ContactsCollection.findByIdAndUpdate(id, payload, {
    new: true,
    upsert: true,
    includeResultMetadata: true,
  });
  if (!rawResult || !rawResult.value) return null;

  return {
    contact: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const updateContact = async (id, contact) => {
  return ContactsCollection.findByIdAndUpdate(id, contact, { new: true });
};
