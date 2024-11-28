import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = async (req, res) => {
  const q = `SELECT followerId FROM relationships WHERE followedId=?`;
  db.query(q, [req.query.followedId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(data.map((relationships) => relationships.followerId));
  });
};

export const deleteRelationships = async (req, res) => {
  const token = req.cookies.access_token;
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const q = `DELETE FROM relationships WHERE followerId=? && followedId=?`;
    db.query(q, [userInfo.id, req.query.followedId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Successfully deleted !" });
    });
  });
};

export const addRelationships = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const q =
      "INSERT INTO relationships (`followerId`,`followedId`) VALUES (?)";
    const VALUES = [userInfo.id, req.query.followedId];
    db.query(q, [VALUES], (err, data) => {
      if (err) return res.status(500).json(err);
      return res
        .status(200)
        .json({ message: "Successfully created relationships!" });
    });
  });
};
