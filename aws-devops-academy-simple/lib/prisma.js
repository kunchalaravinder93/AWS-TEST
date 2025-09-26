import { PrismaClient } from '@prisma/client'

const prisma = global.__prisma__ || new PrismaClient()

if (process.env.NODE_ENV === 'development') global.__prisma__ = prisma

export default prisma
