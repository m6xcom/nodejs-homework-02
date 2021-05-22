const fs = require("fs/promises");
const path = require("path");
const { v4: uuid } = require("uuid");

const readContacts = async () => {
  const contacts = await fs.readFile(
    path.join(__dirname, "contacts.json"),
    "utf-8"
  );
  return JSON.parse(contacts);
};

const listContacts = async () => {
  return await readContacts();
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  return contacts.find((contact) => contact.id === contactId);
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const contactIndex = contacts.findIndex(
    (contact) => contact.id === contactId
  );
  if (contactIndex !== -1) {
    const result = contacts.splice(contactIndex, 1);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
    return result;
  }
  return null;
};

const addContact = async (body) => {
  if (body.name && body.email && body.phone) {
    const contacts = await readContacts();
    const contact = { id: uuid(), ...body };
    contacts.push(contact);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
    return contact;
  }
  return null;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  if (contact) {
    Object.assign(contact, body);
    await fs.writeFile(
      path.join(__dirname, "contacts.json"),
      JSON.stringify(contacts, null, 2)
    );
  }
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
