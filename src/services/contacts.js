import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  try {
    const contacts = await ContactsCollection.find();
    return contacts;
  } catch (err) {
    console.log('Error getting contacts from MongoDB', err);
  }
};

export const getContactById = async (id) => {
  try {
    const contact = await ContactsCollection.findById(id);
    return contact;
  } catch (err) {
    console.log('Error getting contact by id from MongoDB', err);
  }
};
