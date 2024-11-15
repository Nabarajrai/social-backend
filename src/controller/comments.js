import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = async (req, res) => {
  const q = `SELECT c.*, u.id AS userId, username, coverpic 
    FROM comments AS c JOIN users AS u ON (u.id = c.userId) WHERE c.postId=? ORDER BY c.created_date DESC
    
 `;
  db.query(q, [req.query.postId], (err, data) => {
    console.log("data", data);
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const q =
      "INSERT INTO comments(`desc`,`commentUserId`,`postId`,`userId`,`created_date`) VALUES (?)";
    const VALUES = [
      req.body.desc,
      req.body.commentUserId,
      req.body.postId,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    console.log("values", req.body);
    db.query(q, [VALUES], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Successfully created comment!" });
    });
  });
};
