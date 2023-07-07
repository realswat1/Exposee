import express from 'express';
import bcrypt from 'bcrypt';
<<<<<<< HEAD
import { User } from '../models/users.js';
=======
import { User } from '../models/user.js';
>>>>>>> 8092d04 (routes)
import { Op } from 'sequelize';

const router = express.Router();

<<<<<<< HEAD

router.get ('/user', async(req,res)=> {
  
  
  const users = await User.findAll();
  console.log(users)
  res.status(200).json(users);
  
     });
  
   
// Route for user registration
router.post('/user', async (req, res) => {
=======
// Route for user registration
router.post('/users', async (req, res) => {
>>>>>>> 8092d04 (routes)
  const { username, password, email } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ username, password: hashedPassword, email });

    // Set the user in the session
    req.session.user = newUser;

    // Return the user data in the response
    res.json({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route for user login
router.post('/users/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

<<<<<<< HEAD
  

=======
>>>>>>> 8092d04 (routes)
    // Set the user in the session
    req.session.user = user;

    // Return the user data in the response
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
<<<<<<< HEAD


=======
>>>>>>> 8092d04 (routes)
});

export default router;