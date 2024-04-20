// import jwt from 'jsonwebtoken';

// const authenticateToken = async (req, res, next) => {
//   try {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) {
//       return res.status(401).json({ error: 'Authentication token missing' });
//     }

//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET))
//       next();
//   } catch (error) {
//         if (err.name === 'TokenExpiredError') {
//           return res.status(403).json({ error: 'Token expired' });
//         }
//         return res.status(403).json({ error: 'Invalid token' });
//       }
//     console.error(error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

// export default authenticateToken;

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient()

const authenticateToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing' });
    }
    token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      }
    })
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export default authenticateToken;

