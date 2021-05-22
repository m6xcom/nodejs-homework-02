const express = require("express");
const router = express.Router();
const operations = require("../../model/index");
const {
  validationCreateContact,
  validationUpdateContact,
} = require("./validation");

router.get("/", async (req, res, next) => {
  try {
    const data = await operations.listContacts();
    return res.json({ status: "success", code: 200, data });
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const data = await operations.getContactById(req.params.contactId);
    if (data) {
      return res.json({ status: "success", code: 200, data });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.post("/", validationCreateContact, async (req, res, next) => {
  try {
    const contact = await operations.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const data = await operations.removeContact(req.params.contactId);
    if (data) {
      return res.json({ status: "success", code: 200, data });
    }
    return res.json({ status: "error", code: 404, message: "Not found" });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId", validationUpdateContact, async (req, res, next) => {
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
});

module.exports = router;
