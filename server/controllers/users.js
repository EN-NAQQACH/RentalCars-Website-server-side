import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


const generateToken = (user) => {
  const payload = {
      id: user._id,
      email: user.email,
  };

  const options = {
      expiresIn: '24h', // Token expiration time
  };
  
  return jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET, options);
};



async function userExist(email){
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
async function google (req, res) {
  try {
    const { firstName,lastName,email,picture,googleId} = req.body;
    if (await userExist(email)) {
      return res.status(400).json({ error: "User already exists" });
    }
    const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) ;
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
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
}
async function login(req,res){
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
    res.status(200).json({ message: "Login successful", token }); // Send token in response
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
}
async function googlelogin(req,res){
  try {
    const { googleId} = req.body;
    const user = await prisma.user.findUnique({
      where: {
        googleId: googleId,
      },
    });
    if (!user) {
      //create new one
      await google (req, res);
    }else{
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}
export { createUser, google ,login, googlelogin};