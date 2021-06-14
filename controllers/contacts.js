const operations = require("../repositories/contacts");
const getAllContacts = async (req, res, next) => {
  try {
    const data = await operations.listContacts();
    return res.json({ status: "success", code: 200, data });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const data = await operations.getContactById(req.params.contactId);
    if (data) {
      return res.json({ status: "success", code: 200, data });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await operations.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const data = await operations.removeContact(req.params.contactId);
    if (data) {
      return res.json({ status: "success", code: 200, data });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const data = await operations.updateContact(req.params.contactId, req.body);
    if (data) {
      return res.json({ status: "success", code: 200, data });
    }
    return res.json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const data = await operations.updateStatusContact(
      req.params.contactId,
      req.body
    );
    if (data) {
      return res.json({ status: "success", code: 200, data });
    }
    return res.json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
