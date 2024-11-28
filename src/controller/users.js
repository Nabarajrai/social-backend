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
      return res.status(200).json(result);
    });
  });
};
