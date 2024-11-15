import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";

export const getLikes = async (req, res) => {
  const q = `SELECT likeUserId FROM likes WHERE likePostId=?`;
  db.query(q, [req.query.likePostId], (err, data) => {
    console.log("data", data);
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteLikes = async (req, res) => {
  const q = `DELETE FROM likes WHERE likeUserId=?`;
  db.query(q, [req.query.likeUserId], (err, data) => {
    console.log("err", err);
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "Successfully deleted !" });
  });
};

export const addLikes = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const q = "INSERT INTO likes (`likeUserId`,`likePostId`) VALUES (?)";
    const VALUES = [req.body.likeUserId, req.query.likePostId];
    console.log("values", req.body);
    db.query(q, [VALUES], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Successfully created likes!" });
    });
  });
};
