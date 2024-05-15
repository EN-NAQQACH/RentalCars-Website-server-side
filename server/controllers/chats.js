import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();


async function GetallChats(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.id;
        const userChats = await prisma.chat.findMany({
            where:
            {
                userIDs: {
                    hasSome: [userId]
                }
            },
        });
        for (const chat of userChats) {
            const reseivedById = chat.userIDs.find(id => id !== userId);
            const reseivedUser = await prisma.user.findUnique({
                where: { id: reseivedById },
                select: { id: true, firstName: true, lastName: true, picture: true }
            });
            chat.reseivedUser = reseivedUser;
        }
        setTimeout(() => {
            res.json(userChats);
        }, 300)
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
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const sendById = decoded.id;

        let usersids = await prisma.chat.findUnique({
            where: {
                id: req.params.chatId,
                userIDs: {
                    hasSome: [sendById]
                }
            },
        });
        let userSender = await prisma.user.findUnique({
            where: {
                id: sendById,
            },
            select: { id: true, firstName: true, lastName: true, picture: true }
        })
        const userReceiverId = usersids.userIDs.find(id => id !== sendById);
        let userReceiver = await prisma.user.findUnique({
            where: {
                id: userReceiverId,
            },
            select: { id: true, firstName: true, lastName: true, picture: true }
        });

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
                        id: true,
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
                        hour: true,
                        picture: true,
                    }
                }
            }
        });
        await prisma.chat.update({
            where: { id: req.params.chatId },
            data: { seenBy: { push: sendById } }
        });
        const response = {
            chat: chat,
            userSender: userSender,
            userReceiver: userReceiver
        };
        res.status(200).json(response);
    } catch (e) {
        if (e.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized" });
        } else {
            console.error(e);
            res.status(500).json({ error: 'Server Error' });
        }
    }
}
async function ReadChat(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const sendById = decoded.id;
        const chat = await prisma.chat.update({
            where: {
                id: req.params.chatId,
                userIDs: {
                    hasSome: [sendById]
                },
            },
            data: { seenBy: { set: [sendById] } }
        })
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
async function searchByuser(req,res){
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const userId = decoded.id;
            const searchinput = req.query.searchinput || '';
            let userChats = await prisma.chat.findMany({
                where: {
                    userIDs: {
                        hasSome: [userId]
                    }
                }
            });
            
            // Iterate through each chat to find the received user and apply search filter
            userChats = await Promise.all(userChats.map(async (chat) => {
                const reseivedById = chat.userIDs.find(id => id !== userId);
                const reseivedUser = await prisma.user.findUnique({
                    where: { id: reseivedById },
                    select: { id: true, firstName: true, lastName: true, picture: true }
                });
                
                // Apply search filter to the received user's information
                if (reseivedUser) {
                    const fullName = `${reseivedUser.firstName} ${reseivedUser.lastName}`.toLowerCase();
                    const searchPattern = searchinput.toLowerCase();
                    
                    // Check if either first name or last name matches the search query
                    if (fullName.includes(searchPattern) || reseivedUser.firstName.toLowerCase().includes(searchPattern) || reseivedUser.lastName.toLowerCase().includes(searchPattern)) {
                        chat.reseivedUser = reseivedUser;
                        return chat;
                    }
                }
                
                return null; // If the received user doesn't match the search query, return null
            }));
            
            // Filter out null values (chats where the received user didn't match the search query)
            userChats = userChats.filter(chat => chat !== null);
            setTimeout(() => {
                res.json(userChats);
            }, 500)
        } catch (error) {
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: "Unauthorized" });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Server Error' });
            }
        }
}


export { GetallChats, AddChat, GetChat,ReadChat,searchByuser }
