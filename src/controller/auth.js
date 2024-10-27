import bcrypt from "bcryptjs";
import { db } from "../db/connect.js";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const q = "SELECT * FROM users WHERE email=?";
  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res.status(409).json({ message: "Already registered user!" });

    // Check if password is provided

    if (!req.body.password) {
      return res.status(400).json({ message: "Password is required!" });
    }
    if (!regex.test(req.body.password))
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.",
      });

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(req.body.password, salt);

    const q = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hashPassword];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ message: "User created successfully!" });
    });
  });
};

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE  email = ?";

  db.query(q, [req.body.email, req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0)
      return res.status(400).json({ message: "User not found!" });
    const comparePass = bcrypt.compareSync(req.body.password, data[0].password);
    if (!comparePass)
      return res.status(400).json({ message: "Wrong password or username" });
    const { password, ...other } = data[0];
    const token = jwt.sign({ id: data[0].id }, "secret");
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Successfully logged in !",
        data: other,
      });
  });
};

export const logOut = (req, res) => {
  res
    .clearCookie("access_token", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({ message: "User has been logged out successfully" });
};
