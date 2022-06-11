const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

// check for empty values
  if (!email || !password)
    throw new BadRequestError("Please provide email and password");
    
// check if email is present in the DB
  const user = await User.findOne({ email });
  if (!user) 
    throw new UnauthenticatedError("Invalid Credentials");

// check if the password entered is correct
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) 
    throw new UnauthenticatedError("Invalid Password");

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { register, login }
