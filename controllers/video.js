import { createError } from "../error.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

export const deleteVideo = async (req, res, next) => {
  try {
    const foundVideo = await Video.findById(req.params.id);

    if (!foundVideo) return next(createError(404, "Video not found"));

    if (req.user.id === foundVideo.userId) {
      await Video.findOneAndDelete({
        _id: foundVideo._id,
      });
      res.status(200).json("Video has been deleted");
    } else {
      return next(createError(403, "You can only delete your video"));
    }
  } catch (error) {
    next(error);
  }
};

export const addVideo = async (req, res, next) => {
  const newVideo = new Video({ userId: req.user.id, ...req.body });
  try {
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const foundVideo = await Video.findById(req.params.id);

    if (!foundVideo) return next(createError(404, "Video not found"));

    if (req.user.id === foundVideo.userId) {
      const updatedVideo = await Video.findOneAndUpdate(
        { _id: foundVideo._id },
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You can only update your video"));
    }
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
};

export const getUserVideos = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    let list = [];

    list = await Video.aggregate([
      {
        $match: { userId: userId },
      },
    ]);

    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json("Increased views");
  } catch (error) {
    next(error);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ vews: -1 });
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedUsers = user.subscribedUsers;

    let list = [];
    list = await Promise.all(
      subscribedUsers.map((ChannelId) => Video.find({ userId: ChannelId }))
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (error) {
    next(error);
  }
};

export const getByTags = async (req, res, next) => {
  const tags = req.query.tags.split(",");

  // console.log(tags);

  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};

export const search = async (req, res, next) => {
  const query = req.query.q;

  try {
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    }).limit(40);
    res.status(200).json(videos);
  } catch (error) {
    next(error);
  }
};
