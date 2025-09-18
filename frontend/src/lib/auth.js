import { prisma } from './prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12)
}

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

export const authenticate = async (request) => {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'No token provided', status: 401 }
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = verifyToken(token)
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true
      }
    })
    
    if (!user) {
      return { error: 'Invalid token', status: 401 }
    }
    
    return { user }
  } catch (error) {
    return { error: 'Invalid token', status: 401 }
  }
}

export const isAdmin = (user) => {
  return user && user.role === 'ADMIN'
}