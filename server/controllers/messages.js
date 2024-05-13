import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

async function AddMessage(req, res) {
    try {
            // sendById = decoded.id;
            // const chatId = req.params.chatId;

        const { content } = req.body;
        const sendById = "66354a61ccc25ec42ad9b54c";
        let chat = await prisma.chat.findUnique({
            where: {
                id: req.params.chatId,
                userIDs: {
                    hasSome: [sendById]
                }
            },
        })
        if(!chat) return res.status(404).json({message: "Chat not found"})
            let currentDate = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const message = await prisma.message.create({
            data: {
                content,
                userId: sendById,
                chatId:req.params.chatId,
                hour:currentDate
            }
        });
        await prisma.chat.update({
            where: { id: req.params.chatId },
            data: { seenBy: [sendById], lastMessage: content,lastMessageHour:currentDate } 
        });             
        res.status(200).json(message);
    } catch (error) {
        console.log(error);
    }

}
export { AddMessage }