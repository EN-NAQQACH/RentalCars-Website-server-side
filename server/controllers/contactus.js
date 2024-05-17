import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import CryptoJS from 'crypto-js';
import { google } from 'googleapis';
import multer from 'multer';
dotenv.config();

const CLIENT_ID = "875358823182-rhpg7aaflu3fepvvi6fqms6ulnkmoh06.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04OMsSVd2h3gjCgYIARAAGAQSNwF-L9IrQIZTtoJCDS5UoPixAFnJg-Rl_QFkcmWYQanFeNCU0If6owMqby801qd_SyXLEzX57o4";

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMaill(Name, Email, message, req, res) {
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
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'easlycars@gmail.com',
      replyTo: `${Name} <${Email}>`,
      to: 'easlycars@gmail.com',
      subject: 'Contact Us',
      text: 'Contact Us',
      html: `<div><h2>Contact Us</h2><p>${message}</p></div><footer><p>&copy; 2024 EaslyCars. All rights reserved.</p></footer>`,
    };

    const result = await transport.sendMail(mailOptions);
    return setTimeout(() => {
        res.status(200).json({ message: "Message sent successfully" });
    }, 1000);
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
}

async function contactus(req, res) {
  try {
    const Name = req.body.Name;
    const Email = req.body.email;
    const message = req.body.messagee;
    await sendMaill(Name, Email, message, req, res);
  } catch (error) {
    res.status(500).json({ error: "Error sending email" });
  }
}

export { contactus };
