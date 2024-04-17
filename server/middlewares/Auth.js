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

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication token missing' });
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export default authenticateToken;

