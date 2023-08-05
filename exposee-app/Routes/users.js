import express from "express";
import bcrypt from "bcrypt";
import { User } from "../models/users.js";
import { Gift } from "../models/gifts.js";
import { Wallet } from "../models/wallet.js";
import { Op } from "sequelize";
// import { sequelize } from "../database.js";
// import { Gift, Wallet } from "../models/index.js";
import pkg from "jsonwebtoken";
const { sign } = pkg;
import validate_Token from "../authentoken.js";
import dotenv from "dotenv";
import { sequelize } from "../database.js";

const router = express.Router();
dotenv.config();
function verifytoken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error: "Acess denied. No token provided" });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "invalid token" });
    }
    req.userId = decoded.userId;
    next();
  });
}
router.get("/user", validate_Token, async (req, res) => {
  const users = await User.findAll();
  console.log(users);
  res.status(200).json(users);
});
router.get('/:user_id/wallet', validate_Token, async (req, res) => {
  try {
    const user_id = req.userId;
    // const user_id = req.params.user_id;
    const wallet = await Wallet.findOne({ where: { user_id } });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    return res.json({ balance: wallet.amount });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
router.post("/gift", validate_Token, async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const sender_id = req.userId;
    const { receiver_id, amount, video_id } = req.body;

    // Check if both sender and receiver exist in the database
    const senderWallet = await Wallet.findOne({ where: { user_id: sender_id }, transaction: t });
    const receiverWallet = await Wallet.findOne({ where: { user_id: receiver_id }, transaction: t });

    if (!senderWallet || !receiverWallet) {
      await t.rollback();
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    // Check if the sender has sufficient balance
    if (senderWallet.amount < amount) {
      await t.rollback();
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // Update sender and receiver wallets in a transaction
    await Promise.all([
      senderWallet.update({ amount: senderWallet.amount - amount }, { transaction: t }),
      receiverWallet.update({ amount: receiverWallet.amount + amount }, { transaction: t })
    ]);

    // Create a gift record in the database
    await Gift.create({
      sender_id,
      receiver_id,
      amount,
      video_id,
    }, { transaction: t });

    // If everything is successful, commit the transaction
    await t.commit();

    return res.json({ message: "Gift sent successfully" });
  } catch (error) {
    console.error(error);
    // If an error occurs during the transaction, rollback the changes
    await t.rollback();
    return res.status(500).json({ error: "Internal server error" });
  }
});
router.get('/gifts/:user_id', validate_Token, async (req, res) => {
  try {
    const userId = req.params.user_id;
    const gifts = await Gift.findAll({
      where: { sender_id: userId },
    });

    return res.json(gifts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Route for user registration
router.post("/user", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    // Set the user in the session
    req.session.user = newUser;

    // Return the user data in the response
    res.json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
router.post('/wallet', validate_Token, async (req, res) => {
  try {
    const amount = 10;
    const user_id = req.userId;

    // Check if the user already has a wallet
    const existingWallet = await Wallet.findOne({ where: { user_id } });
    if (existingWallet) {
      return res.status(400).json({ error: 'User already has a wallet' });
    }

    // Create a new wallet for the user
    const wallet = await Wallet.create({ user_id, amount: 10 });

    return res.status(201).json(wallet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for user login
router.post("/user/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const access_Token = sign(
      { username: user.username, id: user.id },
      "iamtheSwat1*"
    );
    const responsePayload = {
      user: user,
      access_token: access_Token,
    };
    // Set the user in the session
    req.session.user = user;
    res.json(responsePayload);
    // res.json({ user });
    // Return the user data in the response
    // res.json({access_Token});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
