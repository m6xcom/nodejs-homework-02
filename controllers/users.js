const operations = require("../repositories/users");
const jwt = require("jsonwebtoken");
const { HttpCodes } = require("../helpers/constants");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const signup = async (req, res, next) => {
  try {
    const user = await operations.findByEmail(req.body.email);
    if (user) {
      return res.status(HttpCodes.CONFLICT).json({
        status: "error",
        code: HttpCodes.CONFLICT,
        message: "Email in use",
      });
    }
    const { email, subscription } = await operations.create(req.body);
    return res.status(HttpCodes.CREATED).json({
      status: "success",
      code: HttpCodes.CREATED,
      user: { email, subscription },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await operations.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword) {
      return res.status(HttpCodes.UNAUTHORIZED).json({
        status: "error",
        code: HttpCodes.UNAUTHORIZED,
        message: "Email or password is wrong",
      });
    }
    const { _id: id } = user;
    const payload = { id };
    const token = jwt.sign(payload, secretKey);
    await operations.updateToken(id, token);
    return res.json({
      status: "success",
      code: HttpCodes.OK,
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;
    await operations.updateToken(id, null);
    return res.status(HttpCodes.NO_CONTENT).json({});
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    return res.status(HttpCodes.OK).json({
      status: "success",
      code: HttpCodes.OK,
      email: req.user.email,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
};
