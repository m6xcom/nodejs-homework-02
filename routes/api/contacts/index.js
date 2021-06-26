const express = require("express");
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../../controllers/contacts");
const {
  validationCreateContact,
  validationUpdateContact,
  validationUpdateFavorite,
  validationId,
} = require("./validation");
const guard = require("../../../helpers/guard");

router
  .get("/", guard, getAllContacts)
  .post("/", guard, validationCreateContact, addContact);

router
  .get("/:contactId", guard, validationId, getContactById)
  .delete("/:contactId", guard, validationId, removeContact)
  .patch(
    "/:contactId",
    guard,
    validationId,
    validationUpdateContact,
    updateContact
  );

router.patch(
  "/:contactId/favorite",
  guard,
  validationId,
  validationUpdateFavorite,
  updateStatusContact
);

module.exports = router;
