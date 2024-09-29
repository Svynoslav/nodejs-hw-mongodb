import { getAllContacts, getContactById } from '../services/contacts.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await getAllContacts();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: 'Fetching contacts internal server error',
      error: err.message,
    });
  }
};

export const findContactById = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    res.status(404).json({
      status: 404,
      message: 'Contact not found',
    });
    return;
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
