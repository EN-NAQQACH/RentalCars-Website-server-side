import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


async function GetallChats(req, res) {
    try {
        const userId = "66354a61ccc25ec42ad9b54c"
        const userChats = await prisma.chat.findMany({
            where:
            {
                userIDs: {
                    hasSome: [userId]
                }
            },
        });
        for(const chat of userChats){
            const reseivedById = chat.userIDs.find(id => id !== userId);
            const reseivedUser = await prisma.user.findUnique({
                where: { id: reseivedById },
                select: { id:true,firstName: true,lastName: true,picture: true }
            });
            chat.reseivedUser = reseivedUser;
        }
        setTimeout(() => {
            res.json(userChats);
        },300)
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }

}
async function AddChat(req, res) {
    try {
        const sendById = "66354a61ccc25ec42ad9b54c"
        const reseivedById = "663cc2943363170feeaa1951"
        const chat = await prisma.chat.create({
            data: {
                userIDs: [sendById, reseivedById]
            },
        });
        res.json(chat);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function GetChat(req, res) {
    try {
        const sendById = "66354a61ccc25ec42ad9b54c"
        let chat = await prisma.chat.findUnique({
            where: {
                id: req.params.chatId,
                userIDs: {
                    hasSome: [sendById]
                }
            },
            include: {
                users: {
                    select: {
                        picture: true,
                        lastName: true,
                        firstName: true
                    }
                },
                messages: {
                    orderBy: {
                        time: 'asc',
                    },
                    select: {
                        id: true,
                        content: true,
                        userId: true,
                        chatId: true,
                        time: true,
                        hour: true
                    }
                }
            }
        });
        await prisma.chat.update({
            where: { id: req.params.chatId },
            data: { seenBy: { push: sendById } }
        });

        res.status(200).json(chat);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}

export { GetallChats, AddChat, GetChat }
