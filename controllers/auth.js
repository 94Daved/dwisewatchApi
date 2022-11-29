import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

//create new user
export const signup = async (req, res, next) => {
  try {
    const isRegistered = await User.findOne({ email: req.body.email });

    if (isRegistered) return next(createError(404, "User already exists"));

    const hashedPassword = bcrypt.hashSync(
      req.body.password,
      bcrypt.genSaltSync(10)
    );

    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(200).json("successfully registered");
  } catch (error) {
    next(error);
  }
};

//signin a user
export const signin = async (req, res, next) => {
  try {
    const isRegistered = await User.findOne({ name: req.body.name });

    if (!isRegistered) return next(createError(404, "User not found!"));

    const isCorrect = await bcrypt.compare(
      req.body.password,
      isRegistered.password
    );

    if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

    const token = jwt.sign(
      {
        id: isRegistered._id,
      },
      process.env.SECRET,
      { expiresIn: "30d" }
    );

    const { password, ...others } = isRegistered._doc;
    res.status(200).json({ ...others, token });

    // res
    //   .cookie("access_token", token, { httpOnly: true })
    //   .status(200)
    //   .json({ ...others });
  } catch (error) {
    next(error);
    res.clearCookie("access_token");
  }
};

//sign in with google account

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.SECRET,
        { expiresIn: "30d" }
      );

      res.status(200).json({ ...user._doc, token });
      // res
      //   .cookie("access_token", token, { httpOnly: true })
      //   .status(200)
      //   .json(user._doc);
    } else {
      const newUser = new User({ ...req.body, fromGoogle: true });
      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
        },
        process.env.SECRET,
        { expiresIn: "30d" }
      );

      res.status(200).json({ ...newUser._doc, token });

      // res
      //   .cookie("access_token", token, { httpOnly: true })
      //   .status(200)
      //   .json({ ...newUser._doc });
    }
  } catch (error) {
    next(error);
  }
};
