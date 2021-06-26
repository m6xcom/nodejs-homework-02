const User = require("../model/user");

const findById = async (id) => {
  const result = await User.findById(id);
  return result;
};

const findByEmail = async (email) => {
  const result = await User.findOne({ email });
  return result;
};

const findByVerifyToken = async (verifyToken) => {
  const result = await User.findOne({ verifyToken });
  return result;
};

const create = async (body) => {
  const user = new User(body);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateTokenVerify = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};
module.exports = {
  findById,
  findByEmail,
  findByVerifyToken,
  create,
  updateToken,
  updateTokenVerify,
  updateAvatar,
};
