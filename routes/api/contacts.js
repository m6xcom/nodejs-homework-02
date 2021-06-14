const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts");
const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateFavorite,
  validationId,
} = require("./validation");

router.get("/", getAllContacts).post("/", validationCreateContact, addContact);

router
  .get("/:contactId", validationId, getContactById)
  .delete("/:contactId", validationId, removeContact)
  .patch("/:contactId", validationId, validationUpdateContact, updateContact);

router.patch(
  "/:contactId/favorite",
  validationId,
  validationUpdateFavorite,
  updateStatusContact
);

module.exports = router;
