const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");
const userDetails = require("../controller/userDetails");

const getUserDetailsFromToken = async (token) => {
  if (!token) {
    return {
      userDetails: 1,
      message: "session out",
      logout: true,
    };
  }

  const decode = jwt.verify(token, process.env.JWT_SECREAT_KEY);

  const user = await UserModel.findById(decode.id).select("-password");

  return user;
};

module.exports = getUserDetailsFromToken;
