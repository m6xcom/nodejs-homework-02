const User = require("../model/user");

const findById = async (id) => {
  const result = await User.findById(id);
  return result;
};

const findByEmail = async (email) => {
  const result = await User.findOne({ email });
  return result;
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

module.exports = {
  findById,
  findByEmail,
  create,
  updateToken,
};
