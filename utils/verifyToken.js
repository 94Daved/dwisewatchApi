import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = async (req, res, next) => {
  const authToken = req.headers.token.split(" ")[1];

  //console.log(authToken);
  //const token = req.cookies.access_token;

  if (!authToken) return next(createError(401, "You are not authenticated"));

  jwt.verify(authToken, process.env.SECRET, (err, user) => {
    if (err) return next(createError(403, "Token is not valid"));
    req.user = user;
    next();
  });
};
