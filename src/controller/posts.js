import moment from "moment";
import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";

export const posts = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err)
      return res.status(403).json({ message: "token verification failed  " });
    const q = `SELECT p.*, u.id AS userId, username, coverpic,profilePic
   FROM posts AS p 
   JOIN users AS u ON (u.id = p.userId) 
   LEFT JOIN relationships AS r ON (p.userId = r.followedId) 
   WHERE r.followerId = ? OR p.userId = ? ORDER BY p.created_date DESC
`;
    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err) return res.status(403).json({ message: "token not valid" });
    const q =
      "INSERT INTO posts(`desc`,`img`,`userId`,`created_date`) VALUES (?)";
    const VALUES = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    console.log("values", req.body);
    db.query(q, [VALUES], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "Successfully created post!" });
    });
  });
};

export const userPosts = (req, res) => {
  console.log("token", req.params);
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ message: "Not logged in!" });
  jwt.verify(token, "secret", (err, userInfo) => {
    if (err)
      return res.status(403).json({ message: "token verification failed  " });
    const q = `SELECT p.*, u.id AS userId, username, coverpic,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)  WHERE  p.userId = ? ORDER BY p.created_date DESC
`;
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
