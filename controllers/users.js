const jwt = require("jsonwebtoken");
const { HttpCodes } = require("../helpers/constants");
const operations = require("../repositories/users");
const UploadAvatarService = require("../services/local-upload");
const EmailService = require("../services/email");
const CreateSender = require("../services/email-sender");
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
    const { email, avatarURL, subscription, verifyToken } =
      await operations.create(req.body);
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSender()
      );
      await emailService.sendVerifyEmail(verifyToken, email);
    } catch (error) {
      console.log(error.message);
    }
    return res.status(HttpCodes.CREATED).json({
      status: "success",
      code: HttpCodes.CREATED,
      user: { email, avatarURL, subscription, verifyToken },
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await operations.findByVerifyToken(
      req.params.verificationToken
    );
    if (user) {
      await operations.updateTokenVerify(user._id, true, null);
      return res.json({
        status: "success",
        code: HttpCodes.OK,
        message: "Verification successful",
      });
    }
    return res.status(HttpCodes.NOT_FOUND).json({
      status: "fail",
      code: HttpCodes.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

const repeatVerify = async (req, res, next) => {
  try {
    const user = await operations.findByEmail(req.body.email);
    if (user) {
      const { email, verify, verifyToken } = user;
      if (!verify) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSender()
        );
        await emailService.sendVerifyEmail(verifyToken, email);
        res.json({
          status: "success",
          code: HttpCodes.OK,
          message: "Verification email sent",
        });
      }
      res.status(HttpCodes.BAD_REQUEST).json({
        status: "error",
        code: HttpCodes.BAD_REQUEST,
        message: "Verification has already been passed",
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await operations.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);
    if (!user || !isValidPassword || !user.verify) {
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
      avatarURL: req.user.avatarURL,
      subscription: req.user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({
      idUser: userId,
      file: req.file,
    });
    await operations.updateAvatar(userId, avatarUrl);
    return res.json({
      status: "success",
      code: HttpCodes.OK,
      data: { avatarUrl },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  verify,
  repeatVerify,
  login,
  logout,
  current,
  updateAvatar,
};
