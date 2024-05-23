import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();
import { pusher } from '../tools/pusher.js';

async function AddMessage(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { content } = req.body;
        const sendById = decoded.id;
        const chatId = req.params.chatId;
        let chat = await prisma.chat.findUnique({
            where: {
                id: chatId,
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
                chatId: chatId,
                hour: currentDate,
            }
        });
        await prisma.chat.update({
            where: { id: chatId },
            data: { seenBy: [sendById], lastMessage: content, lastMessageHour: currentDate }
        });
        try {
            // Trigger Pusher event
           await pusher.trigger(chatId, 'new-message', message);
        } catch (e) {
            console.log(e);
        }


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
        const messageId = req.params.messageId;
        const chatId = req.params.chatId;

        // Fetch the chat and its messages
        const chat = await prisma.chat.findFirst({
            where: {
                id: chatId,
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
                id: messageId,
                userId: sendById,
            }
        });

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // Get the last message after deletion
        const updatedMessages = chat.messages.filter(m => m.id !== messageId);
        const lastMessage = updatedMessages.length > 0 ? updatedMessages[updatedMessages.length - 1] : null;

        // Update the chat's lastMessage field
        await prisma.chat.update({
            where: {
                id: chatId,
            },
            data: {
                lastMessage: lastMessage ? lastMessage.content : null,
            },
        });
        try {
            // Trigger Pusher event for message removal
           await pusher.trigger(chatId, 'message-removed', {
                messageId: messageId,
                lastMessage: lastMessage ? lastMessage.content : null
            });
        } catch (error) {
            console.log(error);
        }


        if (message) {
            return res.status(200).json({
                message: "Message deleted successfully",
                chat: chat,
                lastMessage: lastMessage ? lastMessage.content : null
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


export { AddMessage, RemoveMessage }