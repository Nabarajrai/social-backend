import { db } from "../db/connect.js";

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
