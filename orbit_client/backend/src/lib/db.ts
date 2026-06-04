/**
 * 🟠 CORE | Database Client
 * 
 * Prisma ORM client singleton. Uses globalThis to prevent multiple
 * PrismaClient instances during hot reloading in development.
 * 
 * Used by: app/api/* (all backend API routes)
 * Category: Core
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db