import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../error.js";

export const updateUser = async (req, res, next) => {
  const userId = req.user;

  if (userId.id !== req.params.id)
    return next(createError(403, "You can updated only your account"));

  try {
    const updateUser = await User.findOneAndUpdate(
      { _id: userId.id },
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updateUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.user;

  if (userId.id !== req.params.id)
    return next(createError(403, "You can delete only your account"));

  try {
    await User.findOneAndDelete({ _id: userId.id });
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others });
  } catch (error) {
    next(error);
  }
};

export const subUser = async (req, res, next) => {
  try {
    //This is the logged in user whos is subcribing
    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscribedUsers: req.params.id },
    });
    //This is the random channel
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfull.");
  } catch (error) {
    next(error);
  }
};

export const unSubUser = async (req, res, next) => {
  try {
    //This is the logged in user whos is unsubcribing
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    //This is the random channel
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: -1 },
    });
    res.status(200).json("Subscription successfull.");
  } catch (error) {
    next(error);
  }
};

export const likeVideo = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;

  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id },
    });
    res.status(200).json("The video has been liked.");
  } catch (err) {
    next(err);
  }
};

export const dislikeVideo = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id },
    });
    res.status(200).json("The video has been disliked.");
  } catch (err) {
    next(err);
  }
};
