import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

async function createUser(req,res) {
    try {
      const { firstName, lastName, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data:{
          firstName, 
          lastName,
          email,
          password: hashedPassword,
        }
      });
      res.json(user);
      console.log(`User created successfully`);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  }

  async function showmessage(req, res) {
    try {
      const message = "hi everyone"
      res.json(message);
    } catch (error) {
      console.error("Error retrieving messages:", error);
      res.status(500).json({ error: "Error retrieving messages" });
    }
  }

  export { createUser, showmessage };