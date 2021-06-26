const operations = require("../repositories/contacts");
const { HttpCodes } = require("../helpers/constants");
const getAllContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await operations.listContacts(userId);
    return res.json({ status: "success", code: HttpCodes.OK, data });
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await operations.getContactById(userId, req.params.contactId);
    if (data) {
      return res.json({ status: "success", code: HttpCodes.OK, data });
    }
    return res.json({
      status: "error",
      code: HttpCodes.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await operations.addContact(userId, req.body);
    return res
      .status(HttpCodes.CREATED)
      .json({ status: "success", code: HttpCodes.CREATED, data: { contact } });
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await operations.removeContact(userId, req.params.contactId);
    if (data) {
      return res.json({ status: "success", code: HttpCodes.OK, data });
    }
    return res.json({
      status: "error",
      code: HttpCodes.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await operations.updateContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (data) {
      return res.json({ status: "success", code: HttpCodes.OK, data });
    }
    return res.json({
      status: "error",
      code: HttpCodes.NOT_FOUND,
      message: "Not found",
    });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = await operations.updateStatusContact(
      userId,
      req.params.contactId,
      req.body
    );
    if (data) {
      return res.json({ status: "success", code: HttpCodes.OK, data });
    }
    return res.json({
      status: "error",
      code: HttpCodes.NOT_FOUND,
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
