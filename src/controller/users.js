import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const q = "SELECT * FROM users WHERE id=? ";
    const VALUES = [req.params.userId];
    db.query(q, [VALUES], (err, result) => {
      if (err) return res.status(500).json(err);
      const { password, ...others } = result[0];
      return res.status(200).json(others);
    });
  });
};

export const getSuggestions = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const q = `select * from users where id!=?`;
    const VALUES = [userInfo.id];
    db.query(q, [VALUES], (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(result);
    });
  });
};

export const updateUserDetails = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const { username, coverpic, profilePic } = req.body;
    const q =
      "UPDATE users SET username=?,coverPic=? ,profilePic=?  WHERE id=? ";
    const VALUES = [username, coverpic, profilePic, userInfo.id];
    db.query(q, VALUES, (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Successfully updated user!" });
    });
  });
};

export const updateUserDetailAvatorCover = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });

  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "Token not valid" });

    const { coverpic, profilePic } = req.body;
    const updates = [];
    const values = [];

    if (profilePic) {
      updates.push("profilePic = ?");
      values.push(profilePic);
    }

    if (coverpic) {
      updates.push("coverPic = ?");
      values.push(coverpic);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(req.params.userId);

    const q = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;

    db.query(q, values, (err, result) => {
      if (err) return res.status(500).json(err);

      return res.status(200).json({ message: "Successfully updated user!" });
    });
  });
};
