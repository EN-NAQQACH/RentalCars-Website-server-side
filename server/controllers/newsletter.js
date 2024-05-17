import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


async function emailExistsInNewsletters(email) {
  try {
    const newsletters = await prisma.newsletter.findFirst({
      where: { email: email }
    });
    return newsletters;
  } catch (error) {
    throw new Error('Error checking email in newsletters:', error);
  }
}

async function addEmailToNewsletters(req, res) {
  try {
    // Extract email from request body
    const { email } = req.body;

    // Check if email exists in any newsletter
    const emailExists = await emailExistsInNewsletters(email);

    if (emailExists) {
      return res.status(400).json({ error: 'Email already exist' });
    }

    // Create a new newsletter entry with the email
    await prisma.newsletter.create({
      data: { email }
    });

    // Send success response
    return res.status(200).json({ message: 'Email added to newsletters' });
  } catch (error) {
    console.error('Error adding email to newsletters:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export { addEmailToNewsletters };
