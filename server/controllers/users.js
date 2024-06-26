import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import CryptoJS from 'crypto-js'
import googleapi from 'googleapis';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
dotenv.config();

const CLIENT_ID = "875358823182-rhpg7aaflu3fepvvi6fqms6ulnkmoh06.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04OMsSVd2h3gjCgYIARAAGAQSNwF-L9IrQIZTtoJCDS5UoPixAFnJg-Rl_QFkcmWYQanFeNCU0If6owMqby801qd_SyXLEzX57o4";

const oAuth2Client = new googleapi.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, 'userphoto/');
//   },
//   filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname);
//   }
// });
// const upload = multer({ storage: storage });
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage });
async function sendMail(email, subject, message, req, res) {
  try {
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
      html: '<div><h2>Password Reset Request</h2><p>Hello ' + message.lastName + ',</p><p> Weve received a request to reset the password for the EaslyCars account associated with ' + message.email + '</p><p>Your password reset request has been received. Below is your new password:</p><p><strong>' + message.password + '</strong></p><p>If you did not request this password reset, please contact support immediately.</p><p>Thank you.</p></div> <footer><p>&copy; 2024 EaslyCars. All rights reserved.</p></footer>'
    };
    const result = await transport.sendMail(mailOptions);
    return setTimeout(() => {
      res.status(200).json({ message: "Email sent successfully" });
    }, 1000);
  } catch (error) {
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
// Encrypt function
async function encrypt(data) {
  const ciphertext = CryptoJS.AES.encrypt(data, process.env.ACCESS_TOKEN_SECRET).toString();
  return ciphertext;
}
// Decrypt function
async function decrypt(data) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, process.env.ACCESS_TOKEN_SECRET);
    if (bytes.sigBytes > 0) {
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedData;
    }
  } catch (error) {
    throw new Error('Invalid password');
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
      return setTimeout(() => {
        res.status(400).json({ error: "User already exists" });
      }, 1000)
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
    if (user) {
      return setTimeout(() => {
        res.status(201).json({ message: "User created successfully" });
      }, 1000)
    }
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

    // Find user by email
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    // If user is not found
    if (!user) {
      return setTimeout(() => {
        res.status(400).json({ error: "Invalid username or password" });
      }, 1000);
    }

    // Decrypt the stored password
    let storedPasswordDecrypted;
    try {
      storedPasswordDecrypted = await decrypt(user.password);
      console.log('Decrypted stored password:', storedPasswordDecrypted); // Debug log
    } catch (error) {
      return setTimeout(() => {
        res.status(400).json({ error: "Invalid username or password" });
      }, 1000);
    }

    // Compare decrypted password with stored decrypted password
    if (password !== storedPasswordDecrypted) {
      return setTimeout(() => {
        res.status(400).json({ error: "Invalid username or password" });
      }, 1000);
    }

    // Generate token upon successful login
    const token = generateToken(user);

    // Send successful login response
    return setTimeout(() => {
      res.status(200).json({ message: "Login successful", token, userId: user.id });
    }, 1000);

  } catch (error) {
    return setTimeout(() => {
      res.status(500).json({ error: "Error logging in" });
    }, 1000);
  }
}
async function googlelogin(req, res) {
  try {
    const { googleId } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        googleId: googleId,
      },
    });
    if (!user) {
      await google(req, res);
    } else {
      const token = generateToken(user); // Generate token upon successful login
      res.status(200).json({ message: "Login successful", token, userId: user.id });
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}
async function getUser(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    let user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        cars: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // let cars = await prisma.car.findMany({
    //   where: {
    //     userId: user.id,
    //   },
    // });
    const userinfo = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      number: user.number,
      about: user.about,
      googleId: user.googleId,
      picture: user.picture,
      reservations: user.reservations,
      zipcode: user.zipcode,
      city: user.city,
      cars: user.cars,
      address: user.address,
      cars: user.cars,
    };
    if (userinfo) {
      return setTimeout(() => {
        res.status(200).json(userinfo);
      }, 600);
    }
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
    const { firstName, lastName, email, number, about, zipcode, city, address } = req.body;

    // Check if there are uploaded files
    let picture = null;

    // Check if there are uploaded files
    if (req.files && req.files.length > 0) {
      // Upload new picture(s) to Cloudinary
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'user_photos' }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }).end(file.buffer);
        });
      });

      // Wait for all uploads to complete
      const uploadedPictures = await Promise.all(uploadPromises);
      // Use the last uploaded picture (assuming single upload)
      picture = uploadedPictures.pop();

      // Retrieve previous user picture from the database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { picture: true }
      });

      // If a previous picture exists, remove it from Cloudinary
      if (user.picture) {
        const publicId = user.picture.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // Update user data in the database
    let updatedUser 
    if (picture) {
      updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          firstName,
          lastName,
          email,
          number,
          about,
          picture,
          zipcode,
          city,
          address,
        },
      });
    }else{
      updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          firstName,
          lastName,
          email,
          number,
          about,
          zipcode,
          city,
          address,
        },
      });
    }


    // Respond with success message
    res.status(200).json({ message: 'User updated successfully' });
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
        lastName: user.lastName,
        email: email,
        password: decryptedPassword,
      };
      if (decryptedPassword) {
        console.log(decryptedPassword);
      }
      await sendMail(email, "Password Reset", message, req, res);
    } else {
      return setTimeout(() => {
        res.status(400).json({ error: "ther is no user with email given" });
      }, 1000);
    }
  } catch (error) {
    console.error("Error resetting password:", error, "password", decryptedPassword);
    res.status(500).json({ error: "Error resetting password" });
  }
}
async function getUserCar(req, res) {
  try {
    // Validate request parameters
    const userId = req.params.userid;
    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Fetch user information
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // If user not found, return 404
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch cars associated with the user
    const cars = await prisma.car.findMany({
      where: {
        userId: user.id,
      },
    });

    // Format response
    const responseData = {
      user: user,
      cars: cars,
    };

    // Send response
    res.status(200).json(responseData);
  } catch (error) {
    // Log the error for debugging
    console.error("Error in getUserCar:", error);
    // Send 500 status code for any internal error
    res.status(500).json({ error: "Error sending data" });
  }
}

async function getMyreservations(req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const { carName, sort } = req.query;

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: decoded.id,
      },
      include: {
        car: true,
      },
    });

    let filteredReservations = reservations;

    // Filter reservations by car name, year, make, or model if carName query parameter is provided
    if (carName) {
      const carNameLower = carName.toLowerCase();
      filteredReservations = reservations.filter(reservation => {
        const { year, make, model } = reservation.car;
        return (
          year.toString() === carNameLower ||
          make.toLowerCase().includes(carNameLower) ||
          model.toLowerCase().includes(carNameLower)
        );
      });
    }
    if (sort) {
      const sortKey = sort.toLowerCase();
      filteredReservations.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return sortKey === "oldest" ? dateA - dateB : dateB - dateA;
      });
    }
    return res.status(200).json(filteredReservations);

    // if (filteredReservations.length > 0) {
    //   return setTimeout(() => {
    //     res.status(200).json(filteredReservations);
    //   },1000);
    // } else {
    //   res.status(404).json({ error: "No reservations found matching the criteria" });
    // }
  } catch (error) {
    console.error("Error getting reservations:", error);
    res.status(500).json({ error: "Error getting reservations" });
  }
}
async function logout(req, res) {

}


export { createUser, google, login, googlelogin, getUser, updateUser, resetPassword, upload, getUserCar, getMyreservations };