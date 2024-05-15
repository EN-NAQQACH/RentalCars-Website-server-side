import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

async function AddMessage(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { content } = req.body;
        const sendById = decoded.id;
        let chat = await prisma.chat.findUnique({
            where: {
                id: req.params.chatId,
                userIDs: {
                    hasSome: [sendById]
                }
            },
        })
        if (!chat) return res.status(404).json({ message: "Chat not found" })
        let currentDate = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const message = await prisma.message.create({
            data: {
                content,
                userId: sendById,
                chatId: req.params.chatId,
                hour: currentDate,
            }
        });
        await prisma.chat.update({
            where: { id: req.params.chatId },
            data: { seenBy: [sendById], lastMessage: content, lastMessageHour: currentDate }
        });
        res.status(200).json(message);
    } catch (error) {
        console.log(error);
    }

}
async function RemoveMessage(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const sendById = decoded.id;

        // Fetch the chat and its messages
        const chat = await prisma.chat.findFirst({
            where: {
                id: req.params.chatId,
            },
            include: {
                messages: true,
            }
        });

        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }

        // Remove the message
        const message = await prisma.message.delete({
            where: {
                id: req.params.messageId,
                userId: sendById,
            }
        });

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Get the last message after deletion
        const updatedMessages = chat.messages.filter(m => m.id !== req.params.messageId);
        const lastMessage = updatedMessages.length > 0 ? updatedMessages[updatedMessages.length - 1] : null;

        // Update the chat's lastMessage field
        await prisma.chat.update({
            where: {
                id: req.params.chatId,
            },
            data: {
                lastMessage: lastMessage ? lastMessage.content : null,
            },
        });

        if (message) {
            return res.status(200).json({ 
                message: "Message deleted successfully",
                chat: chat,
                lastMessage: lastMessage ? lastMessage : null
            });
        }
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}


export { AddMessage,RemoveMessage }