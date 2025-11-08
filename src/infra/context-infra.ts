import { PrismaClient } from "../generated/prisma/client.js"

const prismaClient = new PrismaClient()

export function getClient(): PrismaClient {
    return prismaClient
}