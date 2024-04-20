import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    googleId: user.googleId,
  };

  const options = {
    expiresIn: '24h', // Token expiration time
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};

async function userExist(email) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking if user exists:", error);
    return false;
  }
}
async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (await userExist(email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      }
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
}
async function google(req, res) {
  try {
    const { firstName, lastName, email, picture, googleId } = req.body;
    if (await userExist(email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);
    const user = await prisma.user.create({
      data: {
        firstName: firstName,
        lastName: lastName,
        email,
        password: hashedPassword,
        picture: picture,
        googleId: googleId,
      }
    })
    const token = generateToken(user); // Generate token upon successful login
    res.status(201).json({ message: "User created successfully",token});
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }
    const token = generateToken(user); // Generate token upon successful login
    res.status(200).json({ message: "Login successful", token}); // Send token in response
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
}
async function googlelogin(req, res) {
  try {
    const { googleId } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        googleId: googleId,
      },
    });
    if (!user) {
      await google(req, res);
    } else {
      const token = generateToken(user); // Generate token upon successful login
      res.status(200).json({ message: "Login successful",token});
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}
async function getUser(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userinfo = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      number: user.number,
      about: user.about,
      googleId: user.googleId,
    };
    res.status(200).json(userinfo);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function updateUser(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { firstName, lastName, email, number, about } = req.body;
    let user;
    if (decoded.id) {
      if(decoded.googleId){
        if (!about || !number) {
          return res.status(400).json({ error: "about or number is missing" });
        }
      }
      if (!about || !number) {
        return res.status(400).json({ error: "about or number is missing" });
      }
      user = await prisma.user.update({
        where: {
          id: decoded.id,
        },
        data: {
          firstName,
          lastName,
          email,
          number,
          about,
        },
      });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User information updated successfully'});
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
}

export { createUser, google, login, googlelogin, getUser, updateUser };