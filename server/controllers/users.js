import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import  CryptoJS from 'crypto-js'
import googleapi from 'googleapis';
import multer from 'multer';
dotenv.config();

const CLIENT_ID = "875358823182-rhpg7aaflu3fepvvi6fqms6ulnkmoh06.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04OMsSVd2h3gjCgYIARAAGAQSNwF-L9IrQIZTtoJCDS5UoPixAFnJg-Rl_QFkcmWYQanFeNCU0If6owMqby801qd_SyXLEzX57o4";

const oAuth2Client = new googleapi.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'userphoto/');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

async function sendMail(email, subject, message,req, res) {
  try
  {
    const accessToken = await oAuth2Client.getAccessToken();
  
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'easlycars@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    const mailOptions = {
      from: ' EaslyCars <easlycars@gmail.com>',
      to: email,
      subject: subject,
      text: 'Password Reset',
      html: '<div><h2>Password Reset Request</h2><p>Hello '+ message.lastName +',</p><p> Weve received a request to reset the password for the EaslyCars account associated with '+ message.email +'</p><p>Your password reset request has been received. Below is your new password:</p><p><strong>'+ message.password +'</strong></p><p>If you did not request this password reset, please contact support immediately.</p><p>Thank you.</p></div> <footer><p>&copy; 2024 EaslyCars. All rights reserved.</p></footer>'
    };
    const result = await transport.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  }catch (error) {
    res.status(200).json({ error: "Failed to send email" });
  }
}
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    googleId: user.googleId,
  };

  const options = {
    expiresIn: '24h',
  };

  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, options);
};
async function encrypt(data){
  const ciphertext =  CryptoJS.AES.encrypt(data, process.env.ACCESS_TOKEN_SECRET).toString();
  return ciphertext;
}
async function decrypt(data){
  try{
  const bytes = CryptoJS.AES.decrypt(data, process.env.ACCESS_TOKEN_SECRET);
  if(bytes.sigBytes >0){
    const decrypteddata = bytes.toString(CryptoJS.enc.Utf8);
    return decrypteddata
  }
}catch (error){
  throw new Error('Invalid password')
}
}
async function userExist(email) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return existingUser;
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
    const passwordencrypted = await encrypt(password);
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: passwordencrypted,
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
    res.status(201).json({ message: "User created successfully", token });
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
    res.status(200).json({ message: "Login successful", token }); // Send token in response
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
      res.status(200).json({ message: "Login successful", token });
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
    const picture = req.file && "http://localhost:5600/"+req.file.path ;
    let user;
    if(picture){
      if (decoded.id) {
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
            picture,
          },
        });
      }
    }else{
      if (decoded.id) {
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
    }
    if(user){
      res.status(200).json({ message: "User updated successfully" });
    }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
}
async function resetPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await userExist(email);
    if (user) {
      const password = user.password;
      const decryptedPassword = await decrypt(password);
      const message = {
        lastName : user.lastName,
        email: email,
        password: decryptedPassword,
      };
      await sendMail(email, "Password Reset", message,req,res);
    } else {
      return res.status(400).json({ error: "ther is no user with email given" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Error resetting password" });
  }
}

export { createUser, google, login, googlelogin, getUser, updateUser, resetPassword,upload };